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
  connectWallet: () => Promise<void>
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
  const [isDemoMode, setIsDemoMode] = useState(true)
  const [ethBalance, setEthBalance] = useState(0)
  const [tokenBalance, setTokenBalance] = useState(0)
  const { toast } = useToast()

  // Load saved state from localStorage
  useEffect(() => {
    const savedDemoMode = localStorage.getItem("demoMode")
    const savedConnection = localStorage.getItem("walletConnected")
    const savedAddress = localStorage.getItem("walletAddress")

    if (savedDemoMode !== null) {
      setIsDemoMode(JSON.parse(savedDemoMode))
    }
    if (savedConnection === "true" && savedAddress) {
      setIsConnected(true)
      setWalletAddress(savedAddress)
      setEthBalance(5.75)
      setTokenBalance(15000)
    }
  }, [])

  const connectWallet = async () => {
    try {
      if (isDemoMode) {
        // Demo mode connection
        const demoAddress = "0x1234567890123456789012345678901234567890"
        setIsConnected(true)
        setWalletAddress(demoAddress)
        setEthBalance(5.75)
        setTokenBalance(15000)
        localStorage.setItem("walletConnected", "true")
        localStorage.setItem("walletAddress", demoAddress)
        toast({
          title: "Demo Wallet Connected",
          description: "You're now using demo mode with mock data",
        })
      } else {
        // Real wallet connection
        if (typeof window !== "undefined" && window.ethereum) {
          const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          })
          if (accounts.length > 0) {
            setIsConnected(true)
            setWalletAddress(accounts[0])
            setEthBalance(5.75)
            setTokenBalance(15000)
            localStorage.setItem("walletConnected", "true")
            localStorage.setItem("walletAddress", accounts[0])
            toast({
              title: "Wallet Connected",
              description: "Successfully connected to your wallet",
            })
          }
        } else {
          toast({
            title: "Wallet Not Found",
            description: "Please install MetaMask or another Web3 wallet",
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      })
    }
  }

  const disconnectWallet = () => {
    setIsConnected(false)
    setWalletAddress("")
    setEthBalance(0)
    setTokenBalance(0)
    localStorage.removeItem("walletConnected")
    localStorage.removeItem("walletAddress")
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
      description: enabled ? "You're now using demo mode with mock data" : "You can now connect to real wallets",
    })
  }

  const walletContextValue: WalletContextType = {
    isConnected,
    walletAddress,
    isDemoMode,
    ethBalance,
    tokenBalance,
    connectWallet,
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
                onConnectWallet={connectWallet}
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
