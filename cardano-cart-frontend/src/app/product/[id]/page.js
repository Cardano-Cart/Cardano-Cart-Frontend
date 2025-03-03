"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Header from "../../_components/Header"
import { useCart } from "react-use-cart"
import { current_products } from "../../data"
import { getAllProducts } from "../../../../utils/_products"
import {
  Container,
  Typography,
  Button,
  Alert,
  Snackbar,
  Card,
  CardContent,
  CardMedia,
  CardActions,
} from "@mui/material"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

export default function ProductPage() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const { addItem } = useCart()
  const [alertMessage, setAlertMessage] = useState("")
  const [alertOpen, setAlertOpen] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      if (id) {
        const access_token = localStorage.getItem("accessToken")
        if (access_token) {
          try {
            const fetchedProducts = await getAllProducts(access_token)
            const selectedProduct = fetchedProducts.find((prod) => prod.id === Number.parseInt(id))
            setProduct(selectedProduct || null)
          } catch (error) {
            console.error("Error fetching product:", error)
          }
        } else {
          const selectedProduct = current_products.find((prod) => prod.id === Number.parseInt(id))
          setProduct(selectedProduct || null)
        }
      }
    }

    fetchProduct()
  }, [id])

  if (!product) return null

  const handleAddToCart = (product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0].image_url,
    })
    setAlertMessage(`${product.name} added to cart successfully!`)
    setAlertOpen(true)
  }

  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return
    }
    setAlertOpen(false)
  }

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Card sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, boxShadow: 3 }}>
          <CardMedia
            component="div"
            sx={{
              width: { xs: "100%", md: 400 },
              height: { xs: 300, md: 400 },
              flexShrink: 0,
            }}
          >
            <Image
              src={product.images[0].image_url || "/placeholder.svg"}
              alt={product.name}
              height={300}
              width={300}
              objectFit="cover"
              sx={{ mt: 40 }}
            />
          </CardMedia>
          <CardContent sx={{ flex: "1 0 auto", display: "flex", flexDirection: "column" }}>
            <Typography component="h1" variant="h4" gutterBottom>
              {product.name}
            </Typography>
            <Typography variant="h5" color="text.secondary" gutterBottom>
              Price: {product.price} ADA
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              Category: {product.category}
            </Typography>
            <Typography variant="body1" paragraph>
              {product.description}
            </Typography>
            <CardActions sx={{ mt: "auto" }}>
              <Button variant="contained" color="primary" onClick={() => handleAddToCart(product)}>
                Add to Cart
              </Button>
            </CardActions>
          </CardContent>
        </Card>
      </Container>
      <Snackbar open={alertOpen} autoHideDuration={3000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity="success" sx={{ width: "100%" }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </>
  )
}

