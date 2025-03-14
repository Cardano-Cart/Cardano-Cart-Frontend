"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Header from "../../_components/Header";
import { useCart } from "react-use-cart";
import { current_products } from "../../data";
import { getAllProducts } from "../../../../utils/_products";
import {
  Container,
  Typography,
  Button,
  Alert,
  Snackbar,
  Box,
  Grid,
  Paper,
} from "@mui/material";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addItem } = useCart();
  const [alertMessage, setAlertMessage] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("/placeholder.svg");

  useEffect(() => {
    if (product?.images?.[0]?.image_url) {
      setSelectedImage(product.images[0].image_url);
    }
  }, [product]);

  const extraImages = [
    "/images/Arrival1.jpg",
    "/images/Arrival6.jpg",
    "/images/Arrival7.jpg",
    product?.images?.[0]?.image_url || "/placeholder.svg",
  ];

  useEffect(() => {
    const fetchProduct = async () => {
      if (id) {
        const access_token = localStorage.getItem("accessToken");
        if (access_token) {
          try {
            const fetchedProducts = await getAllProducts(access_token);
            const selectedProduct = fetchedProducts.find(
              (prod) => prod.id === Number.parseInt(id)
            );
            setProduct(selectedProduct || null);
          } catch (error) {
            console.error("Error fetching product:", error);
          }
        } else {
          const selectedProduct = current_products.find(
            (prod) => prod.id === Number.parseInt(id)
          );
          setProduct(selectedProduct || null);
          setSelectedImage(selectedProduct?.images[0]?.image_url || "");
        }
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) return null;

  const handleAddToCart = (product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      // image: product.images[0].image_url,
      image: selectedImage,
    });
    setAlertMessage(`${product.name} added to cart successfully!`);
    setAlertOpen(true);
  };

  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setAlertOpen(false);
  };

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Grid container spacing={4}>
            {/* Left Side: Product Image */}
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#f5f5f5",
                  borderRadius: 2,
                  height: 400,
                }}>
                <Image
                  src={selectedImage}
                  alt={product.name}
                  height={350}
                  width={350}
                  objectFit="contain"
                />
              </Box>
            </Grid>
            {/* Right Side: Product Details */}
            <Grid item xs={12} md={6}>
              <Typography
                component="h1"
                variant="h4"
                fontWeight="bold"
                gutterBottom>
                {product.name}
              </Typography>
              <Typography variant="h5" color="primary" gutterBottom>
                ₳{product.price}
              </Typography>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                gutterBottom>
                Category: {product.category}
              </Typography>
              <Typography variant="body1" paragraph>
                {product.description}
              </Typography>
              <Typography>
                {extraImages.map((img, index) => (
                  <Image
                    key={index}
                    src={img}
                    alt={`Extra ${index + 1}`}
                    height={60}
                    width={60}
                    objectFit="cover"
                    style={{
                      cursor: "pointer",
                      borderRadius: 2,
                      border:
                        selectedImage === img ? "1px solid black" : "none",
                      padding: selectedImage === img ? "2px" : "0",
                    }}
                    onClick={() => setSelectedImage(img)}
                  />
                ))}
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                sx={{ mt: 2, borderRadius: "8px", py: 1, px: 3 }}
                onClick={() => handleAddToCart(product)}>
                Add to Cart
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Container>
      <Container>
        <Box sx={{ my: { xs: 4, sm: 6, md: 8 } }}>
                    <Typography
                      variant="h4"
                      gutterBottom
                      align="center"
                      sx={{
                        mb: { xs: 2, sm: 3, md: 4 },
                        fontSize: { xs: "1.75rem", sm: "2rem", md: "2.25rem" },
                      }}
                    >
                      Featured Products
                    </Typography>
                    <Grid container spacing={2}>
                      {products.slice(0, 8).map((product) => (
                        <Grid item xs={6} sm={4} md={3} lg={2} key={product.id}>
                          <ProductCard
                            id={product.id}
                            name={product.name}
                            image={product.images[0].image_url}
                            price={product.price}
                            onAddToCart={handleAddToCart}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                 
      </Container>
      <Snackbar
        open={alertOpen}
        autoHideDuration={3000}
        onClose={handleCloseAlert}>
        <Alert
          onClose={handleCloseAlert}
          severity="success"
          sx={{ width: "100%" }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
