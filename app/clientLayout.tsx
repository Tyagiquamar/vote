"use client"

import type React from "react"
import { useState, useEffect, createContext, useContext } from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useToast } from "@/hooks/use-toast"

const inter = Inter({ subsets: ["latin"] })

interface WalletContextType {
  isConnected: boolean
  walletAddress: string
  isDemoMode: boolean
  ethBalance: number
  tokenBalance: number
  hasMetaMask: boolean
  connectWallet: () => Promise<void>
  connectDemoWallet: () => void
  disconnectWallet: () => void
  toggleDemoMode: (enabled: boolean) => void
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export const useWallet = () => {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error("useWallet must be used within WalletProvider")
  }
  return context
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isConnected, setIsConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [ethBalance, setEthBalance] = useState(0)
  const [tokenBalance, setTokenBalance] = useState(0)
  const [hasMetaMask, setHasMetaMask] = useState(false)
  const { toast } = useToast()

  // Check for MetaMask availability and load saved state
  useEffect(() => {
    // Check if MetaMask is available
    const checkMetaMask = () => {
      if (typeof window !== "undefined") {
        const hasMetaMaskInstalled = typeof window.ethereum !== "undefined" && window.ethereum.isMetaMask
        setHasMetaMask(hasMetaMaskInstalled)

        if (!hasMetaMaskInstalled) {
          // If no MetaMask, default to demo mode
          setIsDemoMode(true)
        }
      }
    }

    checkMetaMask()

    // Load saved state from localStorage
    const savedDemoMode = localStorage.getItem("demoMode")
    const savedConnection = localStorage.getItem("walletConnected")
    const savedAddress = localStorage.getItem("walletAddress")
    const savedWalletType = localStorage.getItem("walletType")

    if (savedDemoMode !== null) {
      setIsDemoMode(JSON.parse(savedDemoMode))
    }

    if (savedConnection === "true" && savedAddress) {
      setIsConnected(true)
      setWalletAddress(savedAddress)
      setEthBalance(5.75)
      setTokenBalance(15000)

      // Set demo mode based on saved wallet type
      if (savedWalletType === "demo") {
        setIsDemoMode(true)
      }
    }
  }, [])

  const connectWallet = async () => {
    if (!hasMetaMask) {
      toast({
        title: "MetaMask Not Found",
        description: "Please install MetaMask or use demo mode to continue",
        variant: "destructive",
      })
      return
    }

    try {
      // Real MetaMask wallet connection
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      })

      if (accounts.length > 0) {
        setIsConnected(true)
        setWalletAddress(accounts[0])
        setEthBalance(5.75)
        setTokenBalance(15000)
        setIsDemoMode(false)
        localStorage.setItem("walletConnected", "true")
        localStorage.setItem("walletAddress", accounts[0])
        localStorage.setItem("walletType", "metamask")
        localStorage.setItem("demoMode", "false")

        toast({
          title: "MetaMask Connected",
          description: "Successfully connected to your MetaMask wallet",
        })
      }
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect to MetaMask. Please try again.",
        variant: "destructive",
      })
    }
  }

  const connectDemoWallet = () => {
    // Demo wallet connection
    const demoAddress = "0x1234567890123456789012345678901234567890"
    setIsConnected(true)
    setWalletAddress(demoAddress)
    setEthBalance(5.75)
    setTokenBalance(15000)
    setIsDemoMode(true)
    localStorage.setItem("walletConnected", "true")
    localStorage.setItem("walletAddress", demoAddress)
    localStorage.setItem("walletType", "demo")
    localStorage.setItem("demoMode", "true")

    toast({
      title: "Demo Wallet Connected",
      description: "You're now using demo mode with mock data",
    })
  }

  const disconnectWallet = () => {
    setIsConnected(false)
    setWalletAddress("")
    setEthBalance(0)
    setTokenBalance(0)
    localStorage.removeItem("walletConnected")
    localStorage.removeItem("walletAddress")
    localStorage.removeItem("walletType")

    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    })
  }

  const toggleDemoMode = (enabled: boolean) => {
    setIsDemoMode(enabled)
    localStorage.setItem("demoMode", JSON.stringify(enabled))

    // Disconnect wallet when switching modes
    if (isConnected) {
      disconnectWallet()
    }

    toast({
      title: enabled ? "Demo Mode Enabled" : "Demo Mode Disabled",
      description: enabled
        ? "You can now use demo wallet without MetaMask"
        : hasMetaMask
          ? "You can now connect to MetaMask"
          : "MetaMask is required for real wallet connection",
    })
  }

  const walletContextValue: WalletContextType = {
    isConnected,
    walletAddress,
    isDemoMode,
    ethBalance,
    tokenBalance,
    hasMetaMask,
    connectWallet,
    connectDemoWallet,
    disconnectWallet,
    toggleDemoMode,
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <WalletContext.Provider value={walletContextValue}>
            <div className="min-h-screen flex flex-col">
              <Navbar
                isConnected={isConnected}
                walletAddress={walletAddress}
                isDemoMode={isDemoMode}
                hasMetaMask={hasMetaMask}
                onConnectWallet={connectWallet}
                onConnectDemoWallet={connectDemoWallet}
                onDisconnectWallet={disconnectWallet}
                onToggleDemoMode={toggleDemoMode}
              />
              <main className="flex-1 pt-20">{children}</main>
              <Footer />
            </div>
            <Toaster />
          </WalletContext.Provider>
        </ThemeProvider>
      </body>
    </html>
  )
}
