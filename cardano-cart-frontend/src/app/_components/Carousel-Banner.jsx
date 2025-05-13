"use client"
import Carousel from "react-material-ui-carousel"
import { Paper } from "@mui/material"

const CarouselBanner = () => {
  const bannerImages = [
    "/images/banner-1.png",
    "/images/banner-2.jpg",
    "/placeholder.svg?height=500&width=1200",
  ]

  return (
    <Carousel
      autoPlay
      animation="slide"
      indicators
      navButtonsAlwaysVisible
      interval={5000}
      sx={{
        width: "100%",
      }}
    >
      {bannerImages.map((image, index) => (
        <Paper
          key={index}
          elevation={0}
          sx={{
            height: { xs: "150px", sm: "200px", md: "470px" },
            borderRadius: 0,
            backgroundColor: "transparent",
          }}
        >
          <img
            src={image || "/placeholder.svg"}
            alt={`Slide ${index + 1}`}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "fill",
            }}
          />
        </Paper>
      ))}
    </Carousel>
  )
}

export default CarouselBanner

