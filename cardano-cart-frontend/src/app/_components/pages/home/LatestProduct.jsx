"use client"
import { useRef, useEffect, useState } from "react"
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Divider,
  Rating,
  styled,
  IconButton,
  useTheme,
  useMediaQuery,
  Button,
  Modal,
} from "@mui/material"
import Image from "next/image"
import HeadphonesOutlinedIcon from "@mui/icons-material/HeadphonesOutlined"
import LockOutlinedIcon from "@mui/icons-material/LockOutlined"
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined"
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined"
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined"
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew"
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos"
import VisibilityIcon from "@mui/icons-material/Visibility"
import CloseIcon from "@mui/icons-material/Close"
import AddIcon from "@mui/icons-material/Add"
import RemoveIcon from "@mui/icons-material/Remove"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"
import { current_products } from "../../../data"
import { getAllProducts } from "../../../../../utils/_products"
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react"
// Import Swiper styles
import "swiper/css"
import "swiper/css/pagination"
// Import required modules
import { Pagination, Navigation, Autoplay } from "swiper/modules"
import { productRating } from '@/app/utils/productRating';

// Styled components
const ServiceCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
  marginBottom: theme.spacing(4),
}))

const CategoryCard = styled(Card)(({ theme }) => ({
  border: "1px solid #eaeaea",
  borderRadius: 4,
  boxShadow: "none",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(2),
  cursor: "pointer",
  transition: "all 0.3s ease",
  "&:hover": {
    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
  },
}))

const ProductCard = styled(Card)(({ theme }) => ({
  border: "1px solid #eaeaea",
  borderRadius: 0,
  boxShadow: "none",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  position: "relative",
  cursor: "pointer",
  transition: "all 0.3s ease",
  "&:hover": {
    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
  },
}))

const ProductImageContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  overflow: "hidden",
  "&:hover .quick-view-overlay": {
    opacity: 1,
  },
}))

const QuickViewOverlay = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.3)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  opacity: 0,
  transition: "opacity 0.3s ease",
  zIndex: 2,
}))

const DiscountBadge = styled(Box)(({ theme, discount }) => ({
  position: "absolute",
  top: 0,
  right: 0,
  backgroundColor: discount === 15 ? "#D97706" : discount === 8 ? "#D97706" : "#D97706",
  color: "white",
  padding: "4px 8px",
  fontWeight: "bold",
  fontSize: "0.875rem",
  zIndex: 3,
}))

const PriceText = styled(Typography)(({ theme }) => ({
  color: "#3f51b5",
  fontWeight: "bold",
  display: "flex",
  alignItems: "center",
}))

const StrikethroughPrice = styled(Typography)(({ theme }) => ({
  color: "#6B7280",
  textDecoration: "line-through",
  marginLeft: theme.spacing(1),
}))

const DeliveryBadge = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  fontSize: "0.75rem",
  color: "#6B7280",
}))

const FeaturedTitle = styled(Typography)(({ theme }) => ({
  fontWeight: "bold",
  marginBottom: theme.spacing(4),
  paddingBottom: theme.spacing(1),
  borderBottom: "2px solid #3f51b5",
  display: "inline-block",
}))

const NavigationArrow = styled(IconButton)(({ theme }) => ({
  color: "#3f51b5",
  backgroundColor: "rgba(255, 255, 255, 0.8)",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
  width: 36,
  height: 36,
  padding: 0,
  marginLeft: theme.spacing(1),
}))

const ColorOption = styled(Box)(({ theme, selected }) => ({
  width: 40,
  height: 40,
  border: selected ? "2px solid #3f51b5" : "1px solid #e0e0e0",
  borderRadius: 2,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  backgroundColor: "white",
  "&:hover": {
    borderColor: "#3f51b5",
  },
}))

// All products data
const allProducts = [
  {
    id: 1,
    title: "Apple 2022 Macbook Pro Laptop With M2 Chip: 13-Inch Retina D.",
    image: "/placeholder.svg?height=200&width=200",
    rating: 2,
    reviews: 5,
    price: 1494.95,
    discount: null,
  },
  {
    id: 2,
    title: "Apple 2024 Macbook Air 13-Inch Laptop With M3 Chip: 8gb Memo.",
    image: "/placeholder.svg?height=200&width=200",
    rating: 2,
    reviews: 5,
    price: 1103,
    originalPrice: 1298,
    discount: 15,
  },
  {
    id: 3,
    title: 'Dell Inspiron 15 3000 3520 Business Laptop Computer 15.6" F.',
    image: "/placeholder.svg?height=200&width=200",
    rating: 2,
    reviews: 14,
    price: 429,
    originalPrice: 467,
    discount: 8,
  },
  {
    id: 4,
    title: "Sceptre New 27-Inch Gaming Monitor 100hz 1ms Displayport Hdm.",
    image: "/placeholder.svg?height=200&width=200",
    rating: 2,
    reviews: 5,
    price: 79,
    originalPrice: 99.97,
    discount: 20,
  },
  {
    id: 5,
    title: 'Samsung Galaxy Book3 15.6" Laptop Computer - Intel Core i5',
    image: "/placeholder.svg?height=200&width=200",
    rating: 3,
    reviews: 8,
    price: 599.99,
    originalPrice: 699.99,
    discount: 14,
  },
  {
    id: 6,
    title: 'HP Pavilion 15.6" FHD Laptop - 12th Gen Intel Core i7',
    image: "/placeholder.svg?height=200&width=200",
    rating: 4,
    reviews: 12,
    price: 749.99,
    originalPrice: 899.99,
    discount: 17,
  },
  {
    id: 7,
    title: 'LG 27" UltraGear QHD IPS Gaming Monitor with HDR 10',
    image: "/placeholder.svg?height=200&width=200",
    rating: 4,
    reviews: 22,
    price: 249.99,
    originalPrice: 329.99,
    discount: 24,
  },
  {
    id: 8,
    title: 'Lenovo IdeaPad 3i 14" Laptop - Intel Core i3 - 8GB Memory',
    image: "/placeholder.svg?height=200&width=200",
    rating: 3,
    reviews: 7,
    price: 349.99,
    originalPrice: 399.99,
    discount: 12,
  },
]

export default function Home() {
  const swiperRef = useRef(null)
  const [products, setProducts] = useState(current_products)
  const [quickViewProduct, setQuickViewProduct] = useState(null)
  const [quickViewOpen, setQuickViewOpen] = useState(false)
  const [selectedColor, setSelectedColor] = useState("Black")
  const [quantity, setQuantity] = useState(1)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  useEffect(() => {
  const fetchProducts = async () => {

     
        try {
          const fetchedProducts = await getAllProducts()

          // Sort by most recent
          const sortedProducts = fetchedProducts.sort((a, b) =>
            new Date(b.created_at) - new Date(a.created_at)
          )

          setProducts(sortedProducts)
          console.log(sortedProducts)
        } catch (error) {
          console.error("Error fetching products:", error)
        }
      
    
  }

  fetchProducts()
}, [])


  const handlePrev = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slidePrev()
    }
  }

  const handleNext = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideNext()
    }
  }

  const handleQuickView = (e, product) => {
    e.stopPropagation() // Prevent navigation to product page
    setQuickViewProduct(product)
    setQuickViewOpen(true)
    setQuantity(1)
    setSelectedColor("Black")
  }

  const handleCloseQuickView = () => {
    setQuickViewOpen(false)
    setQuickViewProduct(null)
  }

  const handleIncreaseQuantity = () => {
    setQuantity((prev) => prev + 1)
  }

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1)
    }
  }

  const handleColorSelect = (color) => {
    setSelectedColor(color)
  }

  const calculateDiscountPercentage = (price, originalPrice) => {
    if (!originalPrice || !price) return null
    return Math.round(((originalPrice - price) / originalPrice) * 100)
  }

  useEffect(() => {
  const fetchAllProductsWithRatings = async () => {
    try {
      const products = await getAllProducts();

      const productsWithRatings = await Promise.all(
        products.map(async (product) => {
          const { averageRating } = await productRating(product.id);
          return { ...product, averageRating };
        })
      );

      setProducts(productsWithRatings); // or setFiltered(), etc.
    } catch (error) {
      console.error("Error fetching products with ratings:", error);
    }
  };

  fetchAllProductsWithRatings();
}, []);


  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Similar Product */}
      <Box sx={{ my: 6 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
          <FeaturedTitle variant="h5" component="h2">
            Latest Products
          </FeaturedTitle>

          <Box sx={{ display: "flex" }}>
            <NavigationArrow onClick={handlePrev}>
              <ArrowBackIosNewIcon sx={{ fontSize: 16 }} />
            </NavigationArrow>
            <NavigationArrow onClick={handleNext}>
              <ArrowForwardIosIcon sx={{ fontSize: 16 }} />
            </NavigationArrow>
          </Box>
        </Box>

        <Box sx={{ position: "relative" }}>
          <Swiper
            ref={swiperRef}
            slidesPerView={1}
            spaceBetween={30}
            pagination={{
              clickable: true,
              el: ".custom-pagination",
              bulletClass: "custom-bullet",
              bulletActiveClass: "custom-bullet-active",
            }}
            navigation={{
              prevEl: ".swiper-button-prev",
              nextEl: ".swiper-button-next",
            }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 30,
              },
            }}
            modules={[Pagination, Navigation, Autoplay]}
            className="products-swiper"
            grabCursor={true}
            style={{ padding: "10px 0 40px" }}
          >
            {products.slice(0, 8).map((product) => (
              <SwiperSlide key={product.id}>
                <ProductCard onClick={() => (window.location.href = `/product/${product.id}`)}>
                  {product.discount && (
                    <DiscountBadge discount={product.discount}>- {product.discount} %</DiscountBadge>
                  )}
                  <ProductImageContainer>
                    <Box sx={{ p: 3, display: "flex", justifyContent: "center" }}>
                      <Image
                        src={product.images[0]?.image_url || "/placeholder.svg"}
                        alt={product.name}
                        width={150}
                        height={isMobile ? 110 : 120}
                        style={{ objectFit: "contain", aspectRatio: "1 / 1" }}
                      />
                    </Box>
                    {/* Quick View Overlay */}
                    <QuickViewOverlay className="quick-view-overlay">
                      <Button
                        variant="contained"
                        size="small"
                        sx={{
                          backgroundColor: "white",
                          color: "#3f51b5",
                          "&:hover": {
                            backgroundColor: "#f5f5f5",
                          },
                          boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                        }}
                        onClick={(e) => handleQuickView(e, product)}
                        startIcon={<VisibilityIcon />}
                      >
                        Quick View
                      </Button>
                    </QuickViewOverlay>
                  </ProductImageContainer>
                  <CardContent sx={{ p: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      {/* <Rating value={product.averageRating} readOnly size="small" precision={0.1}/>
                       */}
                       {product.averageRating > 0 && (
                        <Rating value={product.averageRating} readOnly size="small" precision={0.1} />
                        )}
                      {/* <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                        ({product.reviews})
                      </Typography> */}
                    </Box>
                    <Typography variant="body2" sx={{ mb: 2, height: 40, overflow: "hidden" }}>
                      {product.name}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <PriceText variant="h6" component="div">
                        ₳{product.price}
                      </PriceText>
                      {product.originalPrice && (
                        <StrikethroughPrice variant="body2">${product.originalPrice}</StrikethroughPrice>
                      )}
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                      <DeliveryBadge>
                        <LocalShippingOutlinedIcon fontSize="small" sx={{ mr: 0.5 }} />
                        Fast Delivery
                      </DeliveryBadge>
                      <DeliveryBadge>
                        <WorkspacePremiumOutlinedIcon fontSize="small" sx={{ mr: 0.5, color: "#D97706" }} />
                        Best Price
                      </DeliveryBadge>
                    </Box>
                  </CardContent>
                </ProductCard>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom pagination container */}
          <Box
            className="custom-pagination"
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: 2,
            }}
          />
        </Box>
      </Box>

      {/* Quick View Modal */}
      <Modal
        open={quickViewOpen}
        onClose={handleCloseQuickView}
        aria-labelledby="quick-view-modal"
        aria-describedby="quick-view-product-details"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            position: "relative",
            bgcolor: "background.paper",
            width: { xs: "95%", sm: "90%", md: "80%" },
            maxWidth: "1000px",
            maxHeight: "90vh",
            overflow: "auto",
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            outline: "none",
          }}
        >
          {quickViewProduct && (
            <>
              {/* Left side - Product Image */}
              <Box
                sx={{
                  width: { xs: "100%", md: "50%" },
                  p: 4,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  bgcolor: "#f5f5f5",
                }}
              >
                <Image
                  src={quickViewProduct.images[0].image_url || "/placeholder.svg"}
                  alt={quickViewProduct.name}
                  width={400}
                  height={400}
                  style={{ objectFit: "contain", maxWidth: "100%", height: "auto" }}
                />
              </Box>

              {/* Right side - Product Details */}
              <Box
                sx={{
                  width: { xs: "100%", md: "50%" },
                  p: 4,
                  position: "relative",
                }}
              >
                {/* Close button */}
                <IconButton
                  aria-label="close"
                  onClick={handleCloseQuickView}
                  sx={{
                    position: "absolute",
                    right: 8,
                    top: 8,
                    color: "text.secondary",
                  }}
                >
                  <CloseIcon />
                </IconButton>

                {/* Product Title */}
                <Typography variant="h4" component="h2" sx={{ mb: 2, fontWeight: "bold" }}>
                  {quickViewProduct.name}
                </Typography>

                {/* Price */}
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Typography variant="h5" component="span" sx={{ fontWeight: "bold" }}>
                  ₳ {quickViewProduct.price}
                  </Typography>

                  {quickViewProduct.originalPrice && (
                    <>
                      <Typography
                        variant="h6"
                        component="span"
                        sx={{ textDecoration: "line-through", color: "text.secondary", ml: 2 }}
                      >
                        Tk {quickViewProduct.originalPrice}
                      </Typography>

                      <Box
                        sx={{
                          bgcolor: "#000",
                          color: "#fff",
                          px: 1,
                          py: 0.5,
                          ml: 2,
                          borderRadius: "4px",
                          fontSize: "0.875rem",
                          fontWeight: "bold",
                        }}
                      >
                        -{calculateDiscountPercentage(quickViewProduct.price, quickViewProduct.originalPrice)}%
                      </Box>
                    </>
                  )}
                </Box>

                {/* Color Options */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: "bold" }}>
                    Color: {selectedColor}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <ColorOption selected={selectedColor === "Black"} onClick={() => handleColorSelect("Black")}>
                      <Typography variant="body2">Black</Typography>
                    </ColorOption>
                    <ColorOption selected={selectedColor === "Green"} onClick={() => handleColorSelect("Green")}>
                      <Typography variant="body2">Green</Typography>
                    </ColorOption>
                  </Box>
                </Box>

                {/* Quantity Selector */}
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <IconButton
                    onClick={handleDecreaseQuantity}
                    disabled={quantity <= 1}
                    sx={{ border: "1px solid #e0e0e0" }}
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>

                  <Typography
                    variant="body1"
                    sx={{
                      width: 40,
                      textAlign: "center",
                      mx: 1,
                    }}
                  >
                    {quantity}
                  </Typography>

                  <IconButton onClick={handleIncreaseQuantity} sx={{ border: "1px solid #e0e0e0" }}>
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Box>

                {/* Action Buttons */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      bgcolor: "#000",
                      color: "#fff",
                      py: 1.5,
                      "&:hover": {
                        bgcolor: "#333",
                      },
                    }}
                  >
                    Add To Cart
                  </Button>

                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      bgcolor: "#000",
                      color: "#fff",
                      py: 1.5,
                      "&:hover": {
                        bgcolor: "#333",
                      },
                    }}
                  >
                    Buy It Now
                  </Button>
                </Box>

                {/* View Full Details Link */}
                <Box sx={{ mt: 3 }}>
                  <Button
                    variant="text"
                    endIcon={<ArrowForwardIcon />}
                    onClick={() => (window.location.href = `/product/${quickViewProduct.id}`)}
                    sx={{ color: "#000", p: 0, textTransform: "none" }}
                  >
                    View full details
                  </Button>
                </Box>
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </Container>
  )
}

