"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CssVarsProvider, extendTheme, useColorScheme } from "@mui/joy/styles"
import GlobalStyles from "@mui/joy/GlobalStyles"
import CssBaseline from "@mui/joy/CssBaseline"
import Box from "@mui/joy/Box"
import Button from "@mui/joy/Button"
import Checkbox from "@mui/joy/Checkbox"
import FormControl from "@mui/joy/FormControl"
import FormLabel from "@mui/joy/FormLabel"
import IconButton from "@mui/joy/IconButton"
import Link from "@mui/joy/Link"
import Input from "@mui/joy/Input"
import Typography from "@mui/joy/Typography"
import Stack from "@mui/joy/Stack"
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded"
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded"
import dynamic from "next/dynamic"

const SignUpAnimation = dynamic(() => import("../_components/SignUpAnimation"))

const BASE_URL = "https://charming-ninnetta-knust-028ea081.koyeb.app/api/v1"
//const BASE_URL = 'http://127.0.0.1:8000/api/v1';

function ColorSchemeToggle(props) {
  const { onClick, ...other } = props
  const { mode, setMode } = useColorScheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  return (
    <IconButton
      aria-label="toggle light/dark mode"
      size="sm"
      variant="outlined"
      disabled={!mounted}
      onClick={(event) => {
        setMode(mode === "light" ? "dark" : "light")
        onClick?.(event)
      }}
      {...other}
    >
      {mode === "light" ? <DarkModeRoundedIcon /> : <LightModeRoundedIcon />}
    </IconButton>
  )
}

const customTheme = extendTheme({ defaultColorScheme: "dark" })

export default function JoySignInSideTemplate() {
  const router = useRouter()

  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [address, setAddress] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isLoading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleEmailSignUp = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError("")

    // Validate form fields
    if (!username || !email || !password || !firstName || !lastName || !address || !phoneNumber) {
      setError("All fields are required")
      setLoading(false)
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address")
      setLoading(false)
      return
    }

    const formData = new FormData()
    formData.append("email", email)
    formData.append("username", username)
    formData.append("password", password)
    formData.append("address", address)
    formData.append("phone_number", phoneNumber)
    formData.append("first_name", firstName)
    formData.append("last_name", lastName)

    try {
      const response = await fetch(`${BASE_URL}/users/register/`, {
        method: "POST",
        body: formData,
        headers: {
          // Don't set Content-Type when using FormData, browser will set it automatically with boundary
        },
      })

      const data = await response.json()

      if (response.ok) {
        alert("Sign up successful! Please sign in to continue.")
        router.push("/sign-in")
      } else {
        // Handle API error responses
        if (data && typeof data === "object") {
          // Extract error messages from response
          const errorMessages = Object.entries(data)
            .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(", ") : value}`)
            .join("\n")
          setError(errorMessages || "Registration failed. Please try again.")
        } else {
          setError(`Registration failed: ${response.status} ${response.statusText}`)
        }
        console.error("Error response:", data)
      }
    } catch (error) {
      console.error("Error during sign up:", error)
      setError("Network error. Please check your connection and try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <CssVarsProvider theme={customTheme} disableTransitionOnChange>
      <CssBaseline />
      <GlobalStyles
        styles={{
          ":root": {
            "--Form-maxWidth": "800px",
            "--Transition-duration": "0.4s",
          },
        }}
      />
      {isLoading && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            zIndex: 9999,
          }}
        >
          <SignUpAnimation />
          <Typography
            sx={{
              color: "white",
              fontSize: "24px",
              fontWeight: "bold",
            }}
          >
            Loading...
          </Typography>
        </Box>
      )}
      <Box
        sx={(theme) => ({
          width: { xs: "100%", md: "50vw" },
          transition: "width var(--Transition-duration)",
          transitionDelay: "calc(var(--Transition-duration) + 0.1s)",
          position: "relative",
          zIndex: 1,
          display: "flex",
          justifyContent: "flex-end",
          backdropFilter: "blur(12px)",
          backgroundColor: "rgba(255 255 255 / 0.2)",
          [theme.getColorSchemeSelector("dark")]: {
            backgroundColor: "rgba(19 19 24 / 1)",
          },
        })}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100dvh",
            width: "100%",
            px: 2,
          }}
        >
          <Box component="header" sx={{ py: 3, display: "flex", justifyContent: "space-between" }}>
            <Box sx={{ gap: 2, display: "flex", alignItems: "center" }}>
              <IconButton variant="soft" color="primary" size="sm">
                <img src="/images/Cart Logo.png" alt="Cardano Cart Logo" style={{ width: "80px", height: "80px" }} />
              </IconButton>
              <Typography level="title-lg" style={{ fontSize: "30px" }}>
                Cardano Cart
              </Typography>
            </Box>
            <Box sx={{ transform: "scale(0.8)" }}>
              <ColorSchemeToggle />
            </Box>
          </Box>
          <Box
            component="main"
            sx={{
              my: "auto",
              py: 2,
              pb: 5,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              width: 400,
              maxWidth: "100%",
              mx: "auto",
              borderRadius: "sm",
              "& form": {
                display: "flex",
                flexDirection: "column",
                gap: 2,
              },
              [`& .MuiFormLabel-asterisk`]: {
                visibility: "hidden",
              },
            }}
          >
            <Stack sx={{ gap: 4, mb: 2 }}>
              <Stack sx={{ gap: 1 }}>
                <Typography component="h1" level="h2">
                  Sign Up
                </Typography>
                <Typography level="body-sm">
                  Already have an account?{" "}
                  <Link href="/sign-in" level="title-sm">
                    Sign In!
                  </Link>
                </Typography>
              </Stack>
            </Stack>

            {error && (
              <Box
                sx={{
                  p: 2,
                  borderRadius: "sm",
                  bgcolor: "danger.softBg",
                  color: "danger.solidColor",
                }}
              >
                <Typography level="body-sm">{error}</Typography>
              </Box>
            )}

            <Stack sx={{ gap: 4, mt: 2 }}>
              <form onSubmit={handleEmailSignUp}>
                <FormControl required>
                  <FormLabel>Username</FormLabel>
                  <Input type="text" name="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                </FormControl>
                <FormControl required>
                  <FormLabel>First Name</FormLabel>
                  <Input
                    type="text"
                    name="first_name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </FormControl>
                <FormControl required>
                  <FormLabel>Last Name</FormLabel>
                  <Input type="text" name="last_name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </FormControl>
                <FormControl required>
                  <FormLabel>Address</FormLabel>
                  <Input type="text" name="address" value={address} onChange={(e) => setAddress(e.target.value)} />
                </FormControl>
                <FormControl required>
                  <FormLabel>Phone Number</FormLabel>
                  <Input
                    type="tel"
                    name="phone_number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </FormControl>
                <FormControl required>
                  <FormLabel>Email</FormLabel>
                  <Input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </FormControl>
                <FormControl required>
                  <FormLabel>Password</FormLabel>
                  <Input
                    type="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </FormControl>
                <Stack sx={{ gap: 4, mt: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Checkbox size="sm" label="Remember me" name="persistent" />
                  </Box>
                  <Button type="submit" fullWidth>
                    Sign up
                  </Button>
                </Stack>
              </form>
            </Stack>
          </Box>
          <Box component="footer" sx={{ py: 3 }}>
            <Typography level="body-xs" sx={{ textAlign: "center" }}>
              © Cardano Cart {new Date().getFullYear()}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box
        sx={(theme) => ({
          height: "100%",
          position: "fixed",
          right: 0,
          top: 0,
          bottom: 0,
          left: { xs: "100vw", md: "50vw" },
          transition: "background-image var(--Transition-duration), left var(--Transition-duration) !important",
          transitionDelay: "calc(var(--Transition-duration) + 0.1s)",
          backgroundColor: "background.level1",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundImage: "url(/images/image2.png)",
          [theme.getColorSchemeSelector("dark")]: {
            backgroundImage: "url(/images/image1.png)",
          },
        })}
      />
    </CssVarsProvider>
  )
}
