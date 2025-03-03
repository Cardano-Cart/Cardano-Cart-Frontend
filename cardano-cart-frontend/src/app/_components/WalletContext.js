"use client"

import { createContext, useState, useEffect } from "react"
import { BrowserWallet } from "@meshsdk/core"

export const WalletContext = createContext()

export const WalletProvider = ({ children }) => {
  const [walletName, setWalletName] = useState("")
  const [wallet, setWallet] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [balance, setBalance] = useState(null)

  useEffect(() => {
    const loadWallet = async () => {
      const savedWalletName = localStorage.getItem("walletName")
      const savedBalance = localStorage.getItem("balance")
      const savedIsConnected = localStorage.getItem("isConnected") === "true"

      if (savedIsConnected && savedWalletName) {
        try {
          const walletInstance = await BrowserWallet.enable("yoroi")
          if (walletInstance) {
            setWalletName(savedWalletName)
            setWallet(walletInstance)
            setIsConnected(true)
            setBalance(savedBalance)
          } else {
            setIsConnected(false)
          }
        } catch (error) {
          console.error("Error loading wallet:", error)
          setIsConnected(false)
        }
      }
    }

    loadWallet()
  }, [])

  const connectWallet = async () => {
    try {
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
        setBalance(ada.toFixed(2))

        localStorage.setItem("walletName", "Yoroi")
        localStorage.setItem("balance", ada.toFixed(2))
        localStorage.setItem("isConnected", "true")
      }
    } catch (error) {
      console.error("Error connecting to wallet:", error)
      window.open("https://chromewebstore.google.com/detail/yoroi/ffnbelfdoeiohenkjibnmadjiehjhajb?pli=1", "_blank")
    }
  }

  const disconnectWallet = () => {
    setWalletName("")
    setWallet(null)
    setIsConnected(false)
    setBalance(null)

    localStorage.removeItem("walletName")
    localStorage.removeItem("balance")
    localStorage.removeItem("isConnected")
  }

  return (
    <WalletContext.Provider
      value={{
        walletName,
        wallet,
        isConnected,
        balance,
        connectWallet,
        disconnectWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}
