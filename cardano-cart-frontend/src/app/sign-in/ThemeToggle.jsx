"use client"
import { useState, useEffect } from "react"
import { useColorScheme } from "@mui/joy/styles"
import IconButton from "@mui/joy/IconButton"
import dynamic from "next/dynamic"

const DarkModeRoundedIcon = dynamic(() =>
  import("@mui/icons-material/DarkModeRounded")
)
const LightModeRoundedIcon = dynamic(() =>
  import("@mui/icons-material/LightModeRounded")
)

export default function ColorSchemeToggle({ onClick, ...other }) {
  const { mode, setMode } = useColorScheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  return (
    <IconButton
      aria-label="toggle light/dark mode"
      size="sm"
      variant="outlined"
      disabled={!mounted}
      onClick={event => {
        setMode(mode === "light" ? "dark" : "light")
        onClick?.(event)
      }}
      {...other}
    >
      {mode === "light" ? <DarkModeRoundedIcon /> : <LightModeRoundedIcon />}
    </IconButton>
  )
}
