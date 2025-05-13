"use client"
import { Box, Container, Grid, useMediaQuery, useTheme } from "@mui/material"
import Sidebar from "./CategoryList"
import HeroSlider from "./BannerSlide"

export default function Banner() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={3} lg={2.5}>
          <Sidebar />
        </Grid>
        <Grid item xs={12} md={9} lg={9.5}>
          <Box sx={{ height: isMobile ? "auto" : "600px" }}>
            <HeroSlider />
          </Box>
        </Grid>
      </Grid>
    </Container>
  )
}

