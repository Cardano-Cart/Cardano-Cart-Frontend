"use client"

import { CssVarsProvider, extendTheme } from "@mui/joy/styles"
import CssBaseline from "@mui/joy/CssBaseline"
import { useState } from "react"
import GlobalStyles from "@mui/joy/GlobalStyles"

const theme = extendTheme({
  defaultColorScheme: "dark"
})

export default function ThemeProvider({ children }) {
  const [mode, setMode] = useState("light")

  return (
    <CssVarsProvider
      theme={theme}
      defaultMode={mode}
      modeStorageKey="app-theme"
    >
      <CssBaseline />
      <GlobalStyles
        styles={{
          ":root": {
            "--Form-maxWidth": "800px",
            "--Transition-duration": "0.4s"
          }
        }}
      />
      {children}
    </CssVarsProvider>
  )
}
