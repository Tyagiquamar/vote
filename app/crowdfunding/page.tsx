"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Wallet,
  Target,
  Plus,
  Clock,
  DollarSign,
  Users,
  TrendingUp,
  Zap,
  Shield,
  CheckCircle,
  Award,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useWallet } from "../clientLayout"

interface Campaign {
  id: number
  title: string
  description: string
  creator: string
  targetAmount: number
  currentAmount: number
  contributors: number
  endTime: Date
  status: "active" | "successful" | "failed" | "expired"
  category: string
  hasContributed: boolean
  contributionAmount: number
  imageUrl: string
  tags: string[]
}

interface Contribution {
  campaignId: number
  amount: number
  timestamp: Date
  txHash: string
  campaignTitle: string
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
}

export default function CrowdfundingPage() {
  const { isConnected, walletAddress, ethBalance, connectWallet } = useWallet()
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [contributions, setContributions] = useState<Contribution[]>([])
  const [newCampaign, setNewCampaign] = useState({
    title: "",
    description: "",
    targetAmount: "",
    duration: "30",
    category: "technology",
  })
  const [contributionAmount, setContributionAmount] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedCampaign, setSelectedCampaign] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [filter, setFilter] = useState("all")
  const { toast } = useToast()

  // Enhanced mock data initialization
  useEffect(() => {
    const mockCampaigns: Campaign[] = [
      {
        id: 1,
        title: "Revolutionary DeFi Trading Platform",
        description:
          "Building the next generation of decentralized trading with advanced AI algorithms, cross-chain compatibility, and institutional-grade security features. Our platform will reduce trading fees by 80% while providing superior liquidity.",
        creator: "0x1234...5678",
        targetAmount: 50,
        currentAmount: 32.5,
        contributors: 127,
        endTime: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        status: "active",
        category: "technology",
        hasContributed: false,
        contributionAmount: 0,
        imageUrl: "/placeholder.svg?height=200&width=400",
        tags: ["DeFi", "AI", "Trading", "Cross-chain"],
      },
      {
        id: 2,
        title: "Sustainable NFT Marketplace",
        description:
          "An eco-friendly NFT platform powered by renewable energy and carbon-neutral blockchain technology. We're partnering with environmental organizations to offset 200% of our carbon footprint.",
        creator: "0x9876...4321",
        targetAmount: 25,
        currentAmount: 28.7,
        contributors: 89,
        endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        status: "successful",
        category: "environment",
        hasContributed: true,
        contributionAmount: 2.5,
        imageUrl: "/placeholder.svg?height=200&width=400",
        tags: ["NFT", "Sustainable", "Green Tech", "Carbon Neutral"],
      },
      {
        id: 3,
        title: "Decentralized Social Media Protocol",
        description:
          "Creating a censorship-resistant social media platform where users own their data and content. Built on IPFS with token-based governance and creator monetization tools.",
        creator: "0x5555...7777",
        targetAmount: 75,
        currentAmount: 45.2,
        contributors: 203,
        endTime: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
        status: "active",
        category: "social",
        hasContributed: false,
        contributionAmount: 0,
        imageUrl: "/placeholder.svg?height=200&width=400",
        tags: ["Social Media", "Decentralized", "IPFS", "Creator Economy"],
      },
      {
        id: 4,
        title: "Web3 Gaming Infrastructure",
        description:
          "Building scalable infrastructure for blockchain-based gaming with instant transactions, low fees, and seamless asset interoperability across multiple game worlds.",
        creator: "0x3333...9999",
        targetAmount: 40,
        currentAmount: 15.3,
        contributors: 67,
        endTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        status: "failed",
        category: "gaming",
        hasContributed: false,
        contributionAmount: 0,
        imageUrl: "/placeholder.svg?height=200&width=400",
        tags: ["Gaming", "Infrastructure", "Interoperability", "Low Fees"],
      },
      {
        id: 5,
        title: "Decentralized Cloud Storage Network",
        description:
          "A distributed storage network that's 90% cheaper than traditional cloud providers while offering better security and privacy through encryption and decentralization.",
        creator: "0x7777...1111",
        targetAmount: 60,
        currentAmount: 42.8,
        contributors: 156,
        endTime: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
        status: "active",
        category: "technology",
        hasContributed: false,
        contributionAmount: 0,
        imageUrl: "/placeholder.svg?height=200&width=400",
        tags: ["Storage", "Privacy", "Decentralized", "Cost-Effective"],
      },
      {
        id: 6,
        title: "Green Energy Blockchain Mining",
        description:
          "Revolutionary mining operation powered 100% by renewable energy sources. Our solar and wind-powered mining farms will reduce the carbon footprint of blockchain networks by 95%.",
        creator: "0x8888...2222",
        targetAmount: 100,
        currentAmount: 78.3,
        contributors: 234,
        endTime: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
        status: "active",
        category: "environment",
        hasContributed: false,
        contributionAmount: 0,
        imageUrl: "/placeholder.svg?height=200&width=400",
        tags: ["Mining", "Renewable Energy", "Sustainable", "Carbon Neutral"],
      },
    ]
    setCampaigns(mockCampaigns)

    const mockContributions: Contribution[] = [
      {
        campaignId: 2,
        amount: 2.5,
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        txHash: "0xabc123...def456",
        campaignTitle: "Sustainable NFT Marketplace",
      },
    ]
    setContributions(mockContributions)
  }, [])

  const createCampaign = async () => {
    if (!newCampaign.title || !newCampaign.description || !newCampaign.targetAmount) {
      toast({
        title: "Invalid Campaign",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const targetAmount = Number.parseFloat(newCampaign.targetAmount)
    if (targetAmount <= 0) {
      toast({
        title: "Invalid Target Amount",
        description: "Target amount must be greater than 0",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Simulate campaign creation delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const campaign: Campaign = {
        id: campaigns.length + 1,
        title: newCampaign.title,
        description: newCampaign.description,
        creator: walletAddress,
        targetAmount: targetAmount,
        currentAmount: 0,
        contributors: 0,
        endTime: new Date(Date.now() + Number.parseInt(newCampaign.duration) * 24 * 60 * 60 * 1000),
        status: "active",
        category: newCampaign.category,
        hasContributed: false,
        contributionAmount: 0,
        imageUrl: "/placeholder.svg?height=200&width=400",
        tags: ["New", "Innovative"],
      }

      setCampaigns([campaign, ...campaigns])
      setNewCampaign({
        title: "",
        description: "",
        targetAmount: "",
        duration: "30",
        category: "technology",
      })
      setIsCreateDialogOpen(false)

      toast({
        title: "Campaign Created Successfully",
        description: "Your crowdfunding campaign is now live and accepting contributions",
      })
    } catch (error) {
      toast({
        title: "Creation Failed",
        description: "Failed to create campaign. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const contribute = async (campaignId: number) => {
    const amount = Number.parseFloat(contributionAmount)
    if (!amount || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid contribution amount",
        variant: "destructive",
      })
      return
    }

    if (amount > ethBalance) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough ETH for this contribution",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Simulate contribution delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setCampaigns(
        campaigns.map((campaign) => {
          if (campaign.id === campaignId) {
            const newCurrentAmount = campaign.currentAmount + amount
            const newStatus = newCurrentAmount >= campaign.targetAmount ? "successful" : campaign.status
            return {
              ...campaign,
              currentAmount: newCurrentAmount,
              contributors: campaign.hasContributed ? campaign.contributors : campaign.contributors + 1,
              hasContributed: true,
              contributionAmount: campaign.contributionAmount + amount,
              status: newStatus,
            }
          }
          return campaign
        }),
      )

      const campaign = campaigns.find((c) => c.id === campaignId)
      const newContribution: Contribution = {
        campaignId,
        amount,
        timestamp: new Date(),
        txHash: `0x${Math.random().toString(16).substr(2, 8)}...${Math.random().toString(16).substr(2, 6)}`,
        campaignTitle: campaign?.title || "Unknown Campaign",
      }
      setContributions([newContribution, ...contributions])

      setContributionAmount("")
      setSelectedCampaign(null)

      toast({
        title: "Contribution Successful",
        description: `Successfully contributed ${amount} ETH to the campaign`,
      })
    } catch (error) {
      toast({
        title: "Contribution Failed",
        description: "Failed to process contribution. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-blue-500"
      case "successful":
        return "bg-green-500"
      case "failed":
        return "bg-red-500"
      case "expired":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "technology":
        return "bg-purple-500"
      case "environment":
        return "bg-green-500"
      case "social":
        return "bg-blue-500"
      case "gaming":
        return "bg-orange-500"
      default:
        return "bg-gray-500"
    }
  }

  const getTimeRemaining = (endTime: Date) => {
    const now = new Date()
    const diff = endTime.getTime() - now.getTime()
    if (diff <= 0) return "Expired"

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

    if (days > 0) return `${days} days left`
    return `${hours} hours left`
  }

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100)
  }

  const filteredCampaigns = campaigns.filter((campaign) => {
    if (filter === "all") return true
    if (filter === "active") return campaign.status === "active"
    if (filter === "successful") return campaign.status === "successful"
    if (filter === "my-campaigns") return campaign.creator === walletAddress
    return campaign.category === filter
  })

  const totalRaised = campaigns.reduce((sum, campaign) => sum + campaign.currentAmount, 0)
  const activeCampaigns = campaigns.filter((c) => c.status === "active")
  const successfulCampaigns = campaigns.filter((c) => c.status === "successful")

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background">
      <div className="container mx-auto px-4 py-8">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Target className="h-4 w-4" />
            Decentralized Crowdfunding
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
            Crowdfunding Platform
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Decentralized fundraising with smart contract escrow, transparent funding, and community-driven success
          </p>
        </motion.div>

        {/* Platform Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <Card className="border-2 hover:border-primary/50 transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
              <div className="text-2xl font-bold mb-1">{totalRaised.toFixed(1)} ETH</div>
              <div className="text-sm text-muted-foreground">Total Raised</div>
            </CardContent>
          </Card>
          <Card className="border-2 hover:border-primary/50 transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <Target className="h-8 w-8 text-blue-500" />
              </div>
              <div className="text-2xl font-bold mb-1">{activeCampaigns.length}</div>
              <div className="text-sm text-muted-foreground">Active Campaigns</div>
            </CardContent>
          </Card>
          <Card className="border-2 hover:border-primary/50 transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <Award className="h-8 w-8 text-yellow-500" />
              </div>
              <div className="text-2xl font-bold mb-1">{successfulCampaigns.length}</div>
              <div className="text-sm text-muted-foreground">Successful</div>
            </CardContent>
          </Card>
          <Card className="border-2 hover:border-primary/50 transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-8 w-8 text-purple-500" />
              </div>
              <div className="text-2xl font-bold mb-1">{campaigns.reduce((sum, c) => sum + c.contributors, 0)}</div>
              <div className="text-sm text-muted-foreground">Total Backers</div>
            </CardContent>
          </Card>
        </motion.div>

        {!isConnected ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="border-2 hover:border-primary/50 transition-all duration-300 text-center py-16">
              <CardContent>
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                  }}
                >
                  <Wallet className="h-20 w-20 text-primary mx-auto mb-6" />
                </motion.div>
                <h2 className="text-3xl font-semibold mb-4">Connect Your Wallet</h2>
                <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
                  Connect your wallet to create campaigns, contribute to projects, and track your investments
                </p>
                <Button
                  onClick={connectWallet}
                  size="lg"
                  disabled={isLoading}
                  className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-lg px-8 py-6"
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      className="mr-2"
                    >
                      <Zap className="h-5 w-5" />
                    </motion.div>
                  ) : (
                    <Wallet className="mr-2 h-5 w-5" />
                  )}
                  {isLoading ? "Connecting..." : "Connect Wallet"}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            <Tabs defaultValue="campaigns" className="space-y-8">
              <TabsList className="bg-muted border border-border/50 p-1">
                <TabsTrigger
                  value="campaigns"
                  className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
                >
                  All Campaigns ({filteredCampaigns.length})
                </TabsTrigger>
                <TabsTrigger
                  value="my-contributions"
                  className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
                >
                  My Contributions ({contributions.length})
                </TabsTrigger>
                <TabsTrigger value="create" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">
                  Create Campaign
                </TabsTrigger>
              </TabsList>

              <TabsContent value="campaigns" className="space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h2 className="text-3xl font-semibold mb-2">Discover Campaigns</h2>
                    <p className="text-muted-foreground">{filteredCampaigns.length} campaigns available for funding</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={filter === "all" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilter("all")}
                    >
                      All ({campaigns.length})
                    </Button>
                    <Button
                      variant={filter === "active" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilter("active")}
                    >
                      Active ({activeCampaigns.length})
                    </Button>
                    <Button
                      variant={filter === "successful" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilter("successful")}
                    >
                      Successful ({successfulCampaigns.length})
                    </Button>
                    <Button
                      variant={filter === "technology" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilter("technology")}
                    >
                      Technology
                    </Button>
                    <Button
                      variant={filter === "environment" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilter("environment")}
                    >
                      Environment
                    </Button>
                    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
                          <Plus className="mr-2 h-4 w-4" />
                          New Campaign
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle className="text-2xl">Launch Your Campaign</DialogTitle>
                          <DialogDescription className="text-lg">
                            Create a crowdfunding campaign with smart contract escrow protection
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-6">
                          <div>
                            <Label htmlFor="title" className="text-base font-medium">
                              Campaign Title
                            </Label>
                            <Input
                              id="title"
                              value={newCampaign.title}
                              onChange={(e) => setNewCampaign({ ...newCampaign, title: e.target.value })}
                              className="mt-2"
                              placeholder="Enter a compelling campaign title"
                            />
                          </div>
                          <div>
                            <Label htmlFor="description" className="text-base font-medium">
                              Project Description
                            </Label>
                            <Textarea
                              id="description"
                              value={newCampaign.description}
                              onChange={(e) => setNewCampaign({ ...newCampaign, description: e.target.value })}
                              className="mt-2"
                              placeholder="Describe your project, goals, and how the funds will be used"
                              rows={6}
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <Label htmlFor="target" className="text-base font-medium">
                                Target Amount (ETH)
                              </Label>
                              <Input
                                id="target"
                                type="number"
                                step="0.1"
                                value={newCampaign.targetAmount}
                                onChange={(e) => setNewCampaign({ ...newCampaign, targetAmount: e.target.value })}
                                className="mt-2"
                                placeholder="0.0"
                              />
                            </div>
                            <div>
                              <Label htmlFor="duration" className="text-base font-medium">
                                Duration (Days)
                              </Label>
                              <Input
                                id="duration"
                                type="number"
                                value={newCampaign.duration}
                                onChange={(e) => setNewCampaign({ ...newCampaign, duration: e.target.value })}
                                className="mt-2"
                              />
                            </div>
                            <div>
                              <Label htmlFor="category" className="text-base font-medium">
                                Category
                              </Label>
                              <select
                                id="category"
                                value={newCampaign.category}
                                onChange={(e) => setNewCampaign({ ...newCampaign, category: e.target.value })}
                                className="w-full mt-2 p-3 bg-background border border-border rounded-md"
                              >
                                <option value="technology">Technology</option>
                                <option value="environment">Environment</option>
                                <option value="social">Social</option>
                                <option value="gaming">Gaming</option>
                              </select>
                            </div>
                          </div>
                          <div className="bg-muted/50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <Shield className="h-5 w-5 text-green-500" />
                              <span className="font-medium">Smart Contract Protection</span>
                            </div>
                            <ul className="text-sm text-muted-foreground space-y-1">
                              <li>• Funds held in escrow until target is reached</li>
                              <li>• Automatic refunds if campaign fails</li>
                              <li>• Transparent fund tracking on-chain</li>
                              <li>• Creator receives funds only upon success</li>
                            </ul>
                          </div>
                          <Button
                            onClick={createCampaign}
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 py-6 text-lg"
                          >
                            {isLoading ? (
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                                className="mr-2"
                              >
                                <Zap className="h-5 w-5" />
                              </motion.div>
                            ) : null}
                            {isLoading ? "Creating Campaign..." : "Launch Campaign"}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                {filteredCampaigns.length === 0 ? (
                  <Card className="border-2 text-center py-16">
                    <CardContent>
                      <Target className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">No Campaigns Found</h3>
                      <p className="text-muted-foreground mb-6">
                        No campaigns match your current filter. Try adjusting your filters or create a new campaign.
                      </p>
                      <Button onClick={() => setFilter("all")}>Show All Campaigns</Button>
                    </CardContent>
                  </Card>
                ) : (
                  <AnimatePresence>
                    <motion.div variants={containerVariants} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {filteredCampaigns.map((campaign, index) => (
                        <motion.div
                          key={campaign.id}
                          variants={itemVariants}
                          layout
                          whileHover={{ y: -5 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Card className="h-full border-2 hover:border-primary/50 transition-all duration-500 hover:shadow-xl overflow-hidden">
                            <div className="relative">
                              <img
                                src={campaign.imageUrl || "/placeholder.svg"}
                                alt={campaign.title}
                                className="w-full h-48 object-cover"
                              />
                              <div className="absolute top-4 left-4 flex gap-2">
                                <Badge className={`${getStatusColor(campaign.status)} text-white`}>
                                  {campaign.status.toUpperCase()}
                                </Badge>
                                <Badge className={`${getCategoryColor(campaign.category)} text-white`}>
                                  {campaign.category}
                                </Badge>
                              </div>
                              {campaign.status === "successful" && (
                                <div className="absolute top-4 right-4">
                                  <div className="bg-green-500 text-white p-2 rounded-full">
                                    <CheckCircle className="h-5 w-5" />
                                  </div>
                                </div>
                              )}
                            </div>

                            <CardHeader className="pb-4">
                              <CardTitle className="text-xl line-clamp-2">{campaign.title}</CardTitle>
                              <CardDescription className="line-clamp-3 text-base">
                                {campaign.description}
                              </CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-4">
                              <div className="flex flex-wrap gap-1">
                                {campaign.tags.slice(0, 3).map((tag, tagIndex) => (
                                  <Badge key={tagIndex} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>

                              <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                  <span className="text-2xl font-bold">{campaign.currentAmount.toFixed(2)} ETH</span>
                                  <span className="text-muted-foreground">of {campaign.targetAmount} ETH</span>
                                </div>
                                <Progress
                                  value={getProgressPercentage(campaign.currentAmount, campaign.targetAmount)}
                                  className="h-3"
                                />
                                <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <Users className="h-4 w-4" />
                                    <span>{campaign.contributors}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <TrendingUp className="h-4 w-4" />
                                    <span>
                                      {getProgressPercentage(campaign.currentAmount, campaign.targetAmount).toFixed(0)}%
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    <span className="text-xs">{getTimeRemaining(campaign.endTime)}</span>
                                  </div>
                                </div>
                              </div>

                              {campaign.status === "active" && (
                                <div className="space-y-3">
                                  <div className="flex gap-2">
                                    <Input
                                      type="number"
                                      step="0.01"
                                      placeholder="Amount in ETH"
                                      value={selectedCampaign === campaign.id ? contributionAmount : ""}
                                      onChange={(e) => {
                                        setContributionAmount(e.target.value)
                                        setSelectedCampaign(campaign.id)
                                      }}
                                      className="flex-1"
                                    />
                                    <Button
                                      onClick={() => contribute(campaign.id)}
                                      disabled={!contributionAmount || selectedCampaign !== campaign.id || isLoading}
                                      className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 whitespace-nowrap"
                                    >
                                      {isLoading && selectedCampaign === campaign.id ? (
                                        <motion.div
                                          animate={{ rotate: 360 }}
                                          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                                        >
                                          <Zap className="h-4 w-4" />
                                        </motion.div>
                                      ) : (
                                        "Fund"
                                      )}
                                    </Button>
                                  </div>
                                </div>
                              )}

                              {campaign.hasContributed && (
                                <div className="text-center py-2">
                                  <Badge variant="outline" className="text-green-500 border-green-500 px-3 py-1">
                                    ✓ You contributed {campaign.contributionAmount.toFixed(3)} ETH
                                  </Badge>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </motion.div>
                  </AnimatePresence>
                )}
              </TabsContent>

              <TabsContent value="my-contributions" className="space-y-8">
                <div>
                  <h2 className="text-3xl font-semibold mb-2">My Contributions</h2>
                  <p className="text-muted-foreground">Track your investments and campaign performance</p>
                </div>

                {/* Contribution Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="border-2 hover:border-primary/50 transition-all duration-300">
                    <CardContent className="p-6 text-center">
                      <div className="flex items-center justify-center mb-2">
                        <DollarSign className="h-8 w-8 text-green-500" />
                      </div>
                      <div className="text-2xl font-bold mb-1">
                        {contributions.reduce((sum, c) => sum + c.amount, 0).toFixed(3)} ETH
                      </div>
                      <div className="text-sm text-muted-foreground">Total Contributed</div>
                    </CardContent>
                  </Card>
                  <Card className="border-2 hover:border-primary/50 transition-all duration-300">
                    <CardContent className="p-6 text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Target className="h-8 w-8 text-blue-500" />
                      </div>
                      <div className="text-2xl font-bold mb-1">{contributions.length}</div>
                      <div className="text-sm text-muted-foreground">Campaigns Backed</div>
                    </CardContent>
                  </Card>
                  <Card className="border-2 hover:border-primary/50 transition-all duration-300">
                    <CardContent className="p-6 text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Award className="h-8 w-8 text-yellow-500" />
                      </div>
                      <div className="text-2xl font-bold mb-1">
                        {
                          contributions.filter((c) => {
                            const campaign = campaigns.find((camp) => camp.id === c.campaignId)
                            return campaign?.status === "successful"
                          }).length
                        }
                      </div>
                      <div className="text-sm text-muted-foreground">Successful Backs</div>
                    </CardContent>
                  </Card>
                </div>

                <motion.div variants={containerVariants} className="grid gap-6">
                  {contributions.map((contribution, index) => {
                    const campaign = campaigns.find((c) => c.id === contribution.campaignId)
                    return (
                      <motion.div
                        key={index}
                        variants={itemVariants}
                        whileHover={{ y: -3 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Card className="border-2 hover:border-primary/30 transition-all duration-300">
                          <CardHeader>
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <CardTitle className="text-xl">{contribution.campaignTitle}</CardTitle>
                                  {campaign && (
                                    <Badge className={`${getStatusColor(campaign.status)} text-white`}>
                                      {campaign.status.toUpperCase()}
                                    </Badge>
                                  )}
                                </div>
                                <CardDescription className="flex items-center gap-4">
                                  <span>Contributed {contribution.amount} ETH</span>
                                  <span>•</span>
                                  <span>{contribution.timestamp.toLocaleDateString()}</span>
                                </CardDescription>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-muted-foreground">Transaction: {contribution.txHash}</span>
                              {campaign && (
                                <span className="font-medium">
                                  Campaign Progress:{" "}
                                  {getProgressPercentage(campaign.currentAmount, campaign.targetAmount).toFixed(1)}%
                                </span>
                              )}
                            </div>
                            {campaign && (
                              <div className="mt-3">
                                <Progress
                                  value={getProgressPercentage(campaign.currentAmount, campaign.targetAmount)}
                                  className="h-2"
                                />
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    )
                  })}
                  {contributions.length === 0 && (
                    <Card className="border-2 hover:border-primary/30 transition-all duration-300 text-center py-16">
                      <CardContent>
                        <Target className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">No Contributions Yet</h3>
                        <p className="text-muted-foreground mb-6">
                          Start contributing to campaigns to see your investment history here
                        </p>
                        <Button onClick={() => document.querySelector('[value="campaigns"]')?.click()}>
                          Explore Campaigns
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </motion.div>
              </TabsContent>

              <TabsContent value="create" className="space-y-8">
                <div>
                  <h2 className="text-3xl font-semibold mb-2">Launch Your Campaign</h2>
                  <p className="text-muted-foreground">
                    Create a crowdfunding campaign with smart contract escrow protection
                  </p>
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <Card className="border-2 hover:border-primary/50 transition-all duration-300">
                    <CardHeader>
                      <CardTitle className="text-2xl">Campaign Details</CardTitle>
                      <CardDescription className="text-lg">
                        Provide comprehensive information about your project and funding goals
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <Label htmlFor="create-title" className="text-base font-medium">
                          Campaign Title
                        </Label>
                        <Input
                          id="create-title"
                          value={newCampaign.title}
                          onChange={(e) => setNewCampaign({ ...newCampaign, title: e.target.value })}
                          className="mt-2"
                          placeholder="Enter a compelling campaign title"
                        />
                      </div>
                      <div>
                        <Label htmlFor="create-description" className="text-base font-medium">
                          Project Description
                        </Label>
                        <Textarea
                          id="create-description"
                          value={newCampaign.description}
                          onChange={(e) => setNewCampaign({ ...newCampaign, description: e.target.value })}
                          className="mt-2"
                          placeholder="Describe your project, goals, and how the funds will be used"
                          rows={6}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="create-target" className="text-base font-medium">
                            Target Amount (ETH)
                          </Label>
                          <Input
                            id="create-target"
                            type="number"
                            step="0.1"
                            value={newCampaign.targetAmount}
                            onChange={(e) => setNewCampaign({ ...newCampaign, targetAmount: e.target.value })}
                            className="mt-2"
                            placeholder="0.0"
                          />
                        </div>
                        <div>
                          <Label htmlFor="create-duration" className="text-base font-medium">
                            Duration (Days)
                          </Label>
                          <Input
                            id="create-duration"
                            type="number"
                            value={newCampaign.duration}
                            onChange={(e) => setNewCampaign({ ...newCampaign, duration: e.target.value })}
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label htmlFor="create-category" className="text-base font-medium">
                            Category
                          </Label>
                          <select
                            id="create-category"
                            value={newCampaign.category}
                            onChange={(e) => setNewCampaign({ ...newCampaign, category: e.target.value })}
                            className="w-full mt-2 p-3 bg-background border border-border rounded-md"
                          >
                            <option value="technology">Technology</option>
                            <option value="environment">Environment</option>
                            <option value="social">Social</option>
                            <option value="gaming">Gaming</option>
                          </select>
                        </div>
                      </div>
                      <div className="bg-muted/50 p-6 rounded-lg">
                        <div className="flex items-center gap-2 mb-4">
                          <Shield className="h-6 w-6 text-green-500" />
                          <span className="font-semibold text-lg">Smart Contract Protection</span>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <ul className="text-sm space-y-2">
                            <li className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              Funds held in escrow until target reached
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              Automatic refunds if campaign fails
                            </li>
                          </ul>
                          <ul className="text-sm space-y-2">
                            <li className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              Transparent fund tracking on-chain
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              Creator receives funds only upon success
                            </li>
                          </ul>
                        </div>
                      </div>
                      <Button
                        onClick={createCampaign}
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 py-6 text-lg"
                      >
                        {isLoading ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                            className="mr-2"
                          >
                            <Zap className="h-5 w-5" />
                          </motion.div>
                        ) : null}
                        {isLoading ? "Creating Campaign..." : "Launch Campaign"}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
            </Tabs>
          </motion.div>
        )}
      </div>
    </div>
  )
}
