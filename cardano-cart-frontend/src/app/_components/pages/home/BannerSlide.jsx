"use client"
import { Box, Button, Typography } from "@mui/material"
import Image from "next/image"
import { useEffect, useState } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination, Autoplay } from "swiper/modules"

// Import Swiper styles
import "swiper/css"
import "swiper/css/pagination"

const slides = [
  {
    id: 1,
    title: "Virtual Reality Experience",
    subtitle: "Explore new worlds with cutting-edge VR technology for an unparalleled experience.",
    image: "/images/VR.jpg",
  },
  {
    id: 2,
    title: "Timeless Elegance",
    subtitle: "Elevate your style with our premium collection of classic watches.",
    image: "/images/banner-watch.jpg"
  },
  {
    id: 3,
    title: "Step Into Comfort",
    subtitle: "Experience the perfect blend of style and performance with our latest sneakers.",
    image: "/images/banner-airforce.jpg"
  },
  {
    id: 4,
    title: "Chic & Bold Fashion",
    subtitle: "Elevate your style with the latest trends in fashion essentials.",
    image: "/images/fashion3.jpg"
  },
  {
    id: 5,
    title: "Cozy Home Vibes",
    subtitle: "Transform your space with plush pillows and elegant home decor.",
    image: "/images/pillow.jpg"
  },
  {
    id: 6,
    title: "Power Meets Performance",
    subtitle: "Unleash ultimate gaming power with Alienware's elite machines.",
    image: "/images/alienware.jpg"
  },
  {
    id: 7,
    title: "Next-Gen Gaming",
    subtitle: "Dive into immersive gaming experiences with the PS5's powerful performance.",
    image: "/images/ps5.jpg"
  }  

]

export default function HeroSlider() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <Box sx={{ borderRadius: 3, overflow: "hidden", height: "100%" }}>
      <Swiper
        modules={[Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000 }}
        style={{ height: "100%" }}
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <Box
              sx={{
                height: "100%",
                minHeight: 500,
                display: "flex",
                alignItems: "center",
                px: { xs: 4, md: 8 },
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Full-size background image */}
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  zIndex: 0,
                }}
              >
                <Image
                  src={slide.image !== "" ? slide.image : "/placeholder.svg?height=1080&width=1920"}
                  alt={slide.title}
                  fill
                  priority
                  style={{
                    objectFit: "cover",
                    objectPosition: "center",
                  }}
                />
                {/* Dark overlay to ensure text readability */}
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    background: "linear-gradient(90deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0) 100%)",
                    zIndex: 1,
                  }}
                />
              </Box>

              {/* Content */}
              <Box
                sx={{
                  maxWidth: { xs: "100%", md: "50%" },
                  zIndex: 2,
                  position: "relative",
                }}
              >
                <Typography
                  variant="h2"
                  component="h2"
                  sx={{
                    color: "white",
                    fontWeight: 700,
                    mr: 5,
                    mb: 2,
                    fontSize: { xs: "2rem", sm: "3rem", md: "3.5rem" },
                    textShadow: "0px 2px 4px rgba(0,0,0,0.5)",
                  }}
                >
                  {slide.title}
                </Typography>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: "rgba(255, 255, 255, 0.9)",
                    mb: 4,
                    fontSize: { xs: "1rem", md: "1.2rem" },
                    textShadow: "0px 1px 2px rgba(0,0,0,0.5)",
                  }}
                >
                  {slide.subtitle}
                </Typography>
                <Button
                  variant="contained"
                  color="inherit"
                  sx={{
                    backgroundColor: "white",
                    color: "#333",
                    fontWeight: 600,
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                    },
                    px: 3,
                    py: 1,
                  }}
                >
                  Shop Now
                </Button>
              </Box>
            </Box>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  )
}