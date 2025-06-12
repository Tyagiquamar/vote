"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { useTheme } from "next-themes"
import { Home, Vote, Target, Menu, X, Sun, Moon, Wallet, Settings, User, LogOut, TestTube, Zap } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface NavbarProps {
  isConnected: boolean
  walletAddress: string
  isDemoMode: boolean
  onConnectWallet: () => void
  onDisconnectWallet: () => void
  onToggleDemoMode: (enabled: boolean) => void
}

export function Navbar({
  isConnected,
  walletAddress,
  isDemoMode,
  onConnectWallet,
  onDisconnectWallet,
  onToggleDemoMode,
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
  }, [])

  const navigation = [
    { name: "Home", href: "/", icon: Home },
    { name: "DAO Voting", href: "/dao", icon: Vote },
    { name: "Crowdfunding", href: "/crowdfunding", icon: Target },
  ]

  const isActive = (href: string) => pathname === href

  if (!mounted) return null

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50"
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="p-2 bg-gradient-to-br from-primary to-primary/80 rounded-xl shadow-lg"
            >
              <Zap className="h-6 w-6 text-primary-foreground" />
            </motion.div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                Web3 dApp Suite
              </h1>
              <p className="text-xs text-muted-foreground">Decentralized Platform</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-2">
              {navigation.map((item) => (
                <Link key={item.name} href={item.href}>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative">
                    <Button
                      variant={isActive(item.href) ? "default" : "ghost"}
                      size="sm"
                      className={`flex items-center gap-2 transition-all duration-300 ${
                        isActive(item.href) ? "bg-primary text-primary-foreground shadow-lg" : "hover:bg-muted"
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.name}
                    </Button>
                    {isActive(item.href) && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
                        initial={false}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </motion.div>
                </Link>
              ))}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
              {/* Demo Mode Toggle */}
              <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-lg">
                <TestTube className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Demo</span>
                <Switch
                  checked={isDemoMode}
                  onCheckedChange={onToggleDemoMode}
                  className="data-[state=checked]:bg-primary"
                />
                {isDemoMode && (
                  <Badge variant="secondary" className="text-xs">
                    DEMO
                  </Badge>
                )}
              </div>

              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2"
              >
                <motion.div
                  initial={false}
                  animate={{ rotate: theme === "dark" ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </motion.div>
              </Button>

              {/* Wallet Connection */}
              {!isConnected ? (
                <Button
                  onClick={onConnectWallet}
                  className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                >
                  <Wallet className="mr-2 h-4 w-4" />
                  {isDemoMode ? "Demo Wallet" : "Connect Wallet"}
                </Button>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Wallet Connected
                      {isDemoMode && <Badge variant="secondary">DEMO</Badge>}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={onDisconnectWallet}
                      className="flex items-center gap-2 text-destructive focus:text-destructive"
                    >
                      <LogOut className="h-4 w-4" />
                      Disconnect
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="sm" className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
            <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </motion.div>
          </Button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden border-t border-border/50 py-4"
            >
              <div className="space-y-4">
                {navigation.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Link href={item.href} onClick={() => setIsOpen(false)}>
                      <Button
                        variant={isActive(item.href) ? "default" : "ghost"}
                        className="w-full justify-start gap-3"
                      >
                        <item.icon className="h-4 w-4" />
                        {item.name}
                      </Button>
                    </Link>
                  </motion.div>
                ))}

                <div className="pt-4 border-t border-border/50 space-y-4">
                  {/* Demo Mode Toggle */}
                  <div className="flex items-center justify-between px-3">
                    <div className="flex items-center gap-2">
                      <TestTube className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Demo Mode</span>
                    </div>
                    <Switch
                      checked={isDemoMode}
                      onCheckedChange={onToggleDemoMode}
                      className="data-[state=checked]:bg-primary"
                    />
                  </div>

                  {/* Theme Toggle */}
                  <div className="flex items-center justify-between px-3">
                    <div className="flex items-center gap-2">
                      {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                      <span className="text-sm font-medium">{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                      Switch
                    </Button>
                  </div>

                  {/* Wallet Connection */}
                  {!isConnected ? (
                    <Button
                      onClick={() => {
                        onConnectWallet()
                        setIsOpen(false)
                      }}
                      className="w-full bg-gradient-to-r from-primary to-primary/80"
                    >
                      <Wallet className="mr-2 h-4 w-4" />
                      {isDemoMode ? "Demo Wallet" : "Connect Wallet"}
                    </Button>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-sm font-medium">
                          {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                        </span>
                        {isDemoMode && <Badge variant="secondary">DEMO</Badge>}
                      </div>
                      <Button
                        onClick={() => {
                          onDisconnectWallet()
                          setIsOpen(false)
                        }}
                        variant="outline"
                        className="w-full text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Disconnect
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}
