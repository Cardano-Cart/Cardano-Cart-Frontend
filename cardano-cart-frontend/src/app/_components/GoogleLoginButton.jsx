import React, { useEffect, useRef } from "react"

const GoogleLoginButton = ({ onSuccess, onError }) => {
  const buttonRef = useRef(null)

  useEffect(() => {
    // Load the Google Identity Services script
    const script = document.createElement("script")
    script.src = "https://accounts.google.com/gsi/client"
    script.async = true
    script.defer = true
    document.head.appendChild(script)

    script.onload = () => {
      initializeGoogleSignIn()
    }

    return () => {
      document.head.removeChild(script)
    }
  }, [])

  const initializeGoogleSignIn = () => {
    if (window.google && buttonRef.current) {
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse
      })

      window.google.accounts.id.renderButton(buttonRef.current, {
        type: "standard",
        theme: "outline",
        size: "large",
        text: "continue_with",
        width: buttonRef.current.offsetWidth
      })
    }
  }

  const handleCredentialResponse = async response => {
    try {
      console.log("Google credential response:", response.credential)

      const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_DOMAIN

      const apiResponse = await fetch(`${BASE_URL}/api/v1/social/google/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ credential: response.credential })
      })

      const data = await apiResponse.json()
      console.log("Google login response:", data)

      if (apiResponse.ok) {
        onSuccess?.(data)
      } else {
        throw new Error("Google login failed")
      }
    } catch (error) {
      console.error("Google login error:", error)
      onError?.(error)
    }
  }

  return <div ref={buttonRef} className="w-full h-10"></div>
}

export default GoogleLoginButton
