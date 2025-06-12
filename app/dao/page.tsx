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
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  Users,
  TrendingUp,
  Vote,
  Zap,
  Shield,
  AlertCircle,
  TestTube,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useWallet } from "../clientLayout"

interface Proposal {
  id: number
  title: string
  description: string
  creator: string
  votesFor: number
  votesAgainst: number
  totalVotes: number
  endTime: Date
  status: "active" | "passed" | "failed" | "expired"
  hasVoted: boolean
  category: string
  quorum: number
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

export default function DAOPage() {
  const { isConnected, walletAddress, tokenBalance, hasMetaMask, connectWallet, connectDemoWallet } = useWallet()
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [newProposal, setNewProposal] = useState({
    title: "",
    description: "",
    category: "governance",
  })
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [votingPower, setVotingPower] = useState(0)
  const { toast } = useToast()

  // Enhanced mock data initialization
  useEffect(() => {
    const mockProposals: Proposal[] = [
      {
        id: 1,
        title: "Increase Treasury Allocation for Development",
        description:
          "Proposal to allocate 500,000 tokens from treasury for platform development, security audits, and infrastructure improvements. This will enable faster feature development and enhanced security measures.",
        creator: "0x1234...5678",
        votesFor: 1250000,
        votesAgainst: 350000,
        totalVotes: 1600000,
        endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        status: "active",
        hasVoted: false,
        category: "treasury",
        quorum: 1000000,
      },
      {
        id: 2,
        title: "Implement Staking Rewards Program",
        description:
          "Launch a comprehensive staking program offering 12% APY for token holders who lock their tokens for 6 months. This will increase token utility and reduce circulating supply.",
        creator: "0x9876...4321",
        votesFor: 2100000,
        votesAgainst: 450000,
        totalVotes: 2550000,
        endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        status: "active",
        hasVoted: false,
        category: "tokenomics",
        quorum: 1500000,
      },
      {
        id: 3,
        title: "Strategic Partnership with DeFi Protocol",
        description:
          "Form a strategic partnership with leading DeFi protocol for enhanced liquidity provision and cross-protocol integrations. This will expand our ecosystem reach.",
        creator: "0x5555...7777",
        votesFor: 1800000,
        votesAgainst: 1200000,
        totalVotes: 3000000,
        endTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        status: "passed",
        hasVoted: true,
        category: "partnerships",
        quorum: 2000000,
      },
      {
        id: 4,
        title: "Upgrade Smart Contract Architecture",
        description:
          "Implement new smart contract architecture with improved gas efficiency and enhanced security features. This upgrade will reduce transaction costs by 40%.",
        creator: "0x7777...3333",
        votesFor: 950000,
        votesAgainst: 1800000,
        totalVotes: 2750000,
        endTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        status: "failed",
        hasVoted: false,
        category: "technical",
        quorum: 1800000,
      },
      {
        id: 5,
        title: "Community Grant Program Launch",
        description:
          "Establish a community grant program with 100,000 tokens allocated for ecosystem development projects. This will incentivize community contributions and innovation.",
        creator: "0x2222...8888",
        votesFor: 800000,
        votesAgainst: 200000,
        totalVotes: 1000000,
        endTime: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        status: "active",
        hasVoted: false,
        category: "governance",
        quorum: 800000,
      },
    ]
    setProposals(mockProposals)
    setVotingPower(tokenBalance * 0.8) // 80% of token balance as voting power
  }, [tokenBalance])

  const createProposal = async () => {
    if (!newProposal.title || !newProposal.description) {
      toast({
        title: "Invalid Proposal",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    if (tokenBalance < 1000) {
      toast({
        title: "Insufficient Tokens",
        description: "You need at least 1,000 tokens to create a proposal",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Simulate proposal creation delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const proposal: Proposal = {
        id: proposals.length + 1,
        title: newProposal.title,
        description: newProposal.description,
        creator: walletAddress,
        votesFor: 0,
        votesAgainst: 0,
        totalVotes: 0,
        endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        status: "active",
        hasVoted: false,
        category: newProposal.category,
        quorum: 1000000,
      }

      setProposals([proposal, ...proposals])
      setNewProposal({ title: "", description: "", category: "governance" })
      setIsCreateDialogOpen(false)

      toast({
        title: "Proposal Created Successfully",
        description: "Your proposal is now live for community voting",
      })
    } catch (error) {
      toast({
        title: "Creation Failed",
        description: "Failed to create proposal. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const vote = async (proposalId: number, support: boolean) => {
    if (tokenBalance < 100) {
      toast({
        title: "Insufficient Tokens",
        description: "You need at least 100 tokens to vote",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Simulate voting delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setProposals(
        proposals.map((proposal) => {
          if (proposal.id === proposalId && !proposal.hasVoted) {
            const voteWeight = Math.min(votingPower, 10000) // Cap vote weight
            return {
              ...proposal,
              votesFor: support ? proposal.votesFor + voteWeight : proposal.votesFor,
              votesAgainst: !support ? proposal.votesAgainst + voteWeight : proposal.votesAgainst,
              totalVotes: proposal.totalVotes + voteWeight,
              hasVoted: true,
            }
          }
          return proposal
        }),
      )

      toast({
        title: "Vote Submitted Successfully",
        description: `Your ${support ? "YES" : "NO"} vote has been recorded on-chain`,
      })
    } catch (error) {
      toast({
        title: "Voting Failed",
        description: "Failed to submit vote. Please try again.",
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
      case "passed":
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
      case "governance":
        return "bg-purple-500"
      case "treasury":
        return "bg-yellow-500"
      case "tokenomics":
        return "bg-blue-500"
      case "partnerships":
        return "bg-green-500"
      case "technical":
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

    if (days > 0) return `${days}d ${hours}h remaining`
    return `${hours}h remaining`
  }

  const getQuorumProgress = (totalVotes: number, quorum: number) => {
    return Math.min((totalVotes / quorum) * 100, 100)
  }

  const activeProposals = proposals.filter((p) => p.status === "active")
  const completedProposals = proposals.filter((p) => p.status !== "active")

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
            <Vote className="h-4 w-4" />
            Decentralized Governance
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
            DAO Governance
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Participate in decentralized decision-making and shape the future of our platform
          </p>
        </motion.div>

        {/* Stats Cards */}
        {isConnected && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          >
            <Card className="border-2 hover:border-primary/50 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Wallet className="h-8 w-8 text-primary" />
                </div>
                <div className="text-2xl font-bold mb-1">{tokenBalance.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">GOV Tokens</div>
              </CardContent>
            </Card>
            <Card className="border-2 hover:border-primary/50 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Zap className="h-8 w-8 text-yellow-500" />
                </div>
                <div className="text-2xl font-bold mb-1">{votingPower.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Voting Power</div>
              </CardContent>
            </Card>
            <Card className="border-2 hover:border-primary/50 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Vote className="h-8 w-8 text-blue-500" />
                </div>
                <div className="text-2xl font-bold mb-1">{proposals.filter((p) => p.hasVoted).length}</div>
                <div className="text-sm text-muted-foreground">Votes Cast</div>
              </CardContent>
            </Card>
            <Card className="border-2 hover:border-primary/50 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Shield className="h-8 w-8 text-green-500" />
                </div>
                <div className="text-2xl font-bold mb-1">
                  {proposals.filter((p) => p.creator === walletAddress).length}
                </div>
                <div className="text-sm text-muted-foreground">Proposals Created</div>
              </CardContent>
            </Card>
          </motion.div>
        )}

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
                  Connect your wallet to participate in DAO governance and help shape the future of our platform
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {hasMetaMask && (
                    <Button
                      onClick={connectWallet}
                      size="lg"
                      disabled={isLoading}
                      className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-lg px-8 py-6"
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
                      {isLoading ? "Connecting..." : "Connect MetaMask"}
                    </Button>
                  )}
                  <Button
                    onClick={connectDemoWallet}
                    size="lg"
                    variant={hasMetaMask ? "outline" : "default"}
                    className={`text-lg px-8 py-6 ${!hasMetaMask ? "bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70" : ""}`}
                  >
                    <TestTube className="mr-2 h-5 w-5" />
                    Try Demo Wallet
                  </Button>
                </div>
                {!hasMetaMask && (
                  <p className="text-sm text-muted-foreground mt-4">
                    MetaMask not detected. You can still try the demo version!
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            <Tabs defaultValue="proposals" className="space-y-8">
              <TabsList className="bg-muted border border-border/50 p-1">
                <TabsTrigger
                  value="proposals"
                  className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
                >
                  Active Proposals ({activeProposals.length})
                </TabsTrigger>
                <TabsTrigger
                  value="history"
                  className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
                >
                  Voting History ({completedProposals.length})
                </TabsTrigger>
                <TabsTrigger value="create" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">
                  Create Proposal
                </TabsTrigger>
              </TabsList>

              <TabsContent value="proposals" className="space-y-8">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-3xl font-semibold mb-2">Active Proposals</h2>
                    <p className="text-muted-foreground">
                      {activeProposals.length} active proposals awaiting your vote
                    </p>
                  </div>
                  <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
                        <Plus className="mr-2 h-4 w-4" />
                        New Proposal
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle className="text-2xl">Create New Proposal</DialogTitle>
                        <DialogDescription className="text-lg">
                          Submit a new proposal for community voting and governance
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-6">
                        <div>
                          <Label htmlFor="title" className="text-base font-medium">
                            Proposal Title
                          </Label>
                          <Input
                            id="title"
                            value={newProposal.title}
                            onChange={(e) => setNewProposal({ ...newProposal, title: e.target.value })}
                            className="mt-2"
                            placeholder="Enter a clear, descriptive title"
                          />
                        </div>
                        <div>
                          <Label htmlFor="category" className="text-base font-medium">
                            Category
                          </Label>
                          <select
                            id="category"
                            value={newProposal.category}
                            onChange={(e) => setNewProposal({ ...newProposal, category: e.target.value })}
                            className="w-full mt-2 p-3 bg-background border border-border rounded-md"
                          >
                            <option value="governance">Governance</option>
                            <option value="treasury">Treasury</option>
                            <option value="tokenomics">Tokenomics</option>
                            <option value="partnerships">Partnerships</option>
                            <option value="technical">Technical</option>
                          </select>
                        </div>
                        <div>
                          <Label htmlFor="description" className="text-base font-medium">
                            Detailed Description
                          </Label>
                          <Textarea
                            id="description"
                            value={newProposal.description}
                            onChange={(e) => setNewProposal({ ...newProposal, description: e.target.value })}
                            className="mt-2"
                            placeholder="Provide comprehensive details about your proposal, including rationale, implementation plan, and expected outcomes"
                            rows={6}
                          />
                        </div>
                        <div className="bg-muted/50 p-4 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertCircle className="h-5 w-5 text-yellow-500" />
                            <span className="font-medium">Requirements</span>
                          </div>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• Minimum 1,000 GOV tokens required</li>
                            <li>• Proposal will be active for 7 days</li>
                            <li>• Quorum of 1M votes needed to pass</li>
                          </ul>
                        </div>
                        <Button
                          onClick={createProposal}
                          disabled={tokenBalance < 1000 || isLoading}
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
                          {isLoading
                            ? "Creating Proposal..."
                            : tokenBalance < 1000
                              ? "Insufficient Tokens (Need 1,000 GOV)"
                              : "Submit Proposal"}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {activeProposals.length === 0 ? (
                  <Card className="border-2 text-center py-16">
                    <CardContent>
                      <Vote className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">No Active Proposals</h3>
                      <p className="text-muted-foreground mb-6">
                        There are currently no active proposals. Be the first to create one!
                      </p>
                      <Button onClick={() => setIsCreateDialogOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Proposal
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <AnimatePresence>
                    <motion.div variants={containerVariants} className="grid gap-8">
                      {activeProposals.map((proposal, index) => (
                        <motion.div
                          key={proposal.id}
                          variants={itemVariants}
                          layout
                          whileHover={{ y: -5 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Card className="border-2 hover:border-primary/50 transition-all duration-500 hover:shadow-xl">
                            <CardHeader className="pb-4">
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-3">
                                    <CardTitle className="text-2xl">{proposal.title}</CardTitle>
                                    <Badge className={`${getCategoryColor(proposal.category)} text-white`}>
                                      {proposal.category}
                                    </Badge>
                                  </div>
                                  <CardDescription className="text-base leading-relaxed">
                                    {proposal.description}
                                  </CardDescription>
                                </div>
                                <Badge className={`${getStatusColor(proposal.status)} text-white text-sm px-3 py-1`}>
                                  {proposal.status.toUpperCase()}
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <Users className="h-4 w-4" />
                                  <span>{proposal.totalVotes.toLocaleString()} votes</span>
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <Clock className="h-4 w-4" />
                                  <span>{getTimeRemaining(proposal.endTime)}</span>
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <TrendingUp className="h-4 w-4" />
                                  <span>
                                    {proposal.totalVotes > 0
                                      ? ((proposal.votesFor / proposal.totalVotes) * 100).toFixed(1)
                                      : 0}
                                    % approval
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <Shield className="h-4 w-4" />
                                  <span>
                                    {getQuorumProgress(proposal.totalVotes, proposal.quorum).toFixed(1)}% quorum
                                  </span>
                                </div>
                              </div>

                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <div className="flex justify-between text-sm font-medium">
                                    <span className="text-green-500">For: {proposal.votesFor.toLocaleString()}</span>
                                    <span className="text-red-500">
                                      Against: {proposal.votesAgainst.toLocaleString()}
                                    </span>
                                  </div>
                                  <Progress
                                    value={
                                      proposal.totalVotes > 0 ? (proposal.votesFor / proposal.totalVotes) * 100 : 0
                                    }
                                    className="h-3"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Quorum Progress</span>
                                    <span className="font-medium">
                                      {proposal.totalVotes.toLocaleString()} / {proposal.quorum.toLocaleString()}
                                    </span>
                                  </div>
                                  <Progress
                                    value={getQuorumProgress(proposal.totalVotes, proposal.quorum)}
                                    className="h-2"
                                  />
                                </div>
                              </div>

                              {!proposal.hasVoted ? (
                                <div className="flex gap-3">
                                  <Button
                                    onClick={() => vote(proposal.id, true)}
                                    disabled={isLoading}
                                    className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 py-6"
                                  >
                                    {isLoading ? (
                                      <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                                        className="mr-2"
                                      >
                                        <Zap className="h-4 w-4" />
                                      </motion.div>
                                    ) : (
                                      <CheckCircle className="mr-2 h-5 w-5" />
                                    )}
                                    Vote Yes
                                  </Button>
                                  <Button
                                    onClick={() => vote(proposal.id, false)}
                                    disabled={isLoading}
                                    variant="outline"
                                    className="flex-1 border-red-500 text-red-500 hover:bg-red-500 hover:text-white py-6"
                                  >
                                    {isLoading ? (
                                      <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                                        className="mr-2"
                                      >
                                        <Zap className="h-4 w-4" />
                                      </motion.div>
                                    ) : (
                                      <XCircle className="mr-2 h-5 w-5" />
                                    )}
                                    Vote No
                                  </Button>
                                </div>
                              ) : (
                                <div className="text-center py-4">
                                  <Badge variant="outline" className="text-primary border-primary px-4 py-2">
                                    ✓ You have voted on this proposal
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

              <TabsContent value="history" className="space-y-8">
                <div>
                  <h2 className="text-3xl font-semibold mb-2">Voting History</h2>
                  <p className="text-muted-foreground">View completed proposals and their outcomes</p>
                </div>
                <motion.div variants={containerVariants} className="grid gap-6">
                  {completedProposals.map((proposal, index) => (
                    <motion.div
                      key={proposal.id}
                      variants={itemVariants}
                      whileHover={{ y: -3 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="border-2 hover:border-primary/30 transition-all duration-300">
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <CardTitle className="text-xl">{proposal.title}</CardTitle>
                                <Badge className={`${getCategoryColor(proposal.category)} text-white`}>
                                  {proposal.category}
                                </Badge>
                              </div>
                              <CardDescription>{proposal.description}</CardDescription>
                            </div>
                            <Badge className={`${getStatusColor(proposal.status)} text-white`}>
                              {proposal.status.toUpperCase()}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground">
                              <span>Total Votes: {proposal.totalVotes.toLocaleString()}</span>
                              <span>
                                Approval:{" "}
                                {proposal.totalVotes > 0
                                  ? ((proposal.votesFor / proposal.totalVotes) * 100).toFixed(1)
                                  : 0}
                                %
                              </span>
                              <span>Quorum: {getQuorumProgress(proposal.totalVotes, proposal.quorum).toFixed(1)}%</span>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-green-500">For: {proposal.votesFor.toLocaleString()}</span>
                                <span className="text-red-500">Against: {proposal.votesAgainst.toLocaleString()}</span>
                              </div>
                              <Progress
                                value={proposal.totalVotes > 0 ? (proposal.votesFor / proposal.totalVotes) * 100 : 0}
                                className="h-2"
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              </TabsContent>

              <TabsContent value="create" className="space-y-8">
                <div>
                  <h2 className="text-3xl font-semibold mb-2">Create New Proposal</h2>
                  <p className="text-muted-foreground">
                    Submit a proposal for community voting. Requires minimum 1,000 GOV tokens.
                  </p>
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <Card className="border-2 hover:border-primary/50 transition-all duration-300">
                    <CardHeader>
                      <CardTitle className="text-2xl">Proposal Details</CardTitle>
                      <CardDescription className="text-lg">
                        Provide comprehensive information about your governance proposal
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <Label htmlFor="create-title" className="text-base font-medium">
                          Proposal Title
                        </Label>
                        <Input
                          id="create-title"
                          value={newProposal.title}
                          onChange={(e) => setNewProposal({ ...newProposal, title: e.target.value })}
                          className="mt-2"
                          placeholder="Enter a clear, descriptive title"
                        />
                      </div>
                      <div>
                        <Label htmlFor="create-category" className="text-base font-medium">
                          Category
                        </Label>
                        <select
                          id="create-category"
                          value={newProposal.category}
                          onChange={(e) => setNewProposal({ ...newProposal, category: e.target.value })}
                          className="w-full mt-2 p-3 bg-background border border-border rounded-md"
                        >
                          <option value="governance">Governance</option>
                          <option value="treasury">Treasury</option>
                          <option value="tokenomics">Tokenomics</option>
                          <option value="partnerships">Partnerships</option>
                          <option value="technical">Technical</option>
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="create-description" className="text-base font-medium">
                          Detailed Description
                        </Label>
                        <Textarea
                          id="create-description"
                          value={newProposal.description}
                          onChange={(e) => setNewProposal({ ...newProposal, description: e.target.value })}
                          className="mt-2"
                          placeholder="Provide comprehensive details about your proposal, including rationale, implementation plan, and expected outcomes"
                          rows={6}
                        />
                      </div>
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertCircle className="h-5 w-5 text-yellow-500" />
                          <span className="font-medium">Requirements</span>
                        </div>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Minimum 1,000 GOV tokens required</li>
                          <li>• Proposal will be active for 7 days</li>
                          <li>• Quorum of 1M votes needed to pass</li>
                        </ul>
                      </div>
                      <Button
                        onClick={createProposal}
                        disabled={tokenBalance < 1000 || isLoading}
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
                        {isLoading
                          ? "Creating Proposal..."
                          : tokenBalance < 1000
                            ? "Insufficient Tokens (Need 1,000 GOV)"
                            : "Submit Proposal"}
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
