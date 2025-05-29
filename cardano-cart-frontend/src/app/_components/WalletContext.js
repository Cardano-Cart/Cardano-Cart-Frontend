"use client"

import { createContext, useState, useEffect } from "react"
import { BrowserWallet } from "@meshsdk/core"

export const WalletContext = createContext()

export const WalletProvider = ({ children }) => {
  const [walletName, setWalletName] = useState("")
  const [wallet, setWallet] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [balance, setBalance] = useState(null)
  const [walletAvailable, setWalletAvailable] = useState(false)

  useEffect(() => {
    const checkWalletInBackground = () => {
      const savedWalletName = localStorage.getItem("walletName")
      const savedBalance = localStorage.getItem("balance")
      const savedIsConnected = localStorage.getItem("isConnected") === "true"

      // Check if Yoroi extension is installed without connecting
      if (typeof window !== "undefined") {
        const isYoroiAvailable = !!(window.cardano && window.cardano.yoroi)
        setWalletAvailable(isYoroiAvailable)

        // Only restore saved state if wallet was previously connected AND extension is still available
        if (savedIsConnected && savedWalletName && isYoroiAvailable) {
          setWalletName(savedWalletName)
          setBalance(savedBalance)
          // Don't set isConnected to true yet - user needs to manually reconnect
          // This just restores the UI state without actually connecting
        } else if (!isYoroiAvailable && savedIsConnected) {
          // Clear saved state if wallet extension is no longer available
          clearWalletState()
        }
      }
    }

    // Check immediately and then periodically
    checkWalletInBackground()

    // Optional: Check periodically if wallet becomes available
    const interval = setInterval(checkWalletInBackground, 5000)

    return () => clearInterval(interval)
  }, [])

  const clearWalletState = () => {
    setWalletName("")
    setWallet(null)
    setIsConnected(false)
    setBalance(null)
    localStorage.removeItem("walletName")
    localStorage.removeItem("balance")
    localStorage.removeItem("isConnected")
  }

  const connectWallet = async () => {
    try {
      // Check if Yoroi is available
      if (typeof window !== "undefined" && !window.cardano?.yoroi) {
        window.open("https://chromewebstore.google.com/detail/yoroi/ffnbelfdoeiohenkjibnmadjiehjhajb?pli=1", "_blank")
        return
      }

      // Only enable wallet when user explicitly clicks connect
      const walletInstance = await BrowserWallet.enable("yoroi")

      if (!walletInstance) {
        window.open("https://chromewebstore.google.com/detail/yoroi/ffnbelfdoeiohenkjibnmadjiehjhajb?pli=1", "_blank")
        return
      }

      const walletBalance = await walletInstance.getBalance()

      setWalletName("Yoroi")
      setWallet(walletInstance)
      setIsConnected(true)

      if (walletBalance && walletBalance.length > 0) {
        const lovelace = walletBalance[0].quantity
        const ada = Number.parseInt(lovelace) / 1000000
        const adaBalance = ada.toFixed(2)
        setBalance(adaBalance)

        localStorage.setItem("walletName", "Yoroi")
        localStorage.setItem("balance", adaBalance)
        localStorage.setItem("isConnected", "true")
      }
    } catch (error) {
      console.error("Error connecting to wallet:", error)
      if (error.message?.includes("not found") || error.message?.includes("not available")) {
        window.open("https://chromewebstore.google.com/detail/yoroi/ffnbelfdoeiohenkjibnmadjiehjhajb?pli=1", "_blank")
      }
    }
  }

  const disconnectWallet = () => {
    clearWalletState()
    setWalletAvailable(!!(window.cardano && window.cardano.yoroi))
  }

  return (
    <WalletContext.Provider
      value={{
        walletName,
        wallet,
        isConnected,
        balance,
        walletAvailable,
        connectWallet,
        disconnectWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}
