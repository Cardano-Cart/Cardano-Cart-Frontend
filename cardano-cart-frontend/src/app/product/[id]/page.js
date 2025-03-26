"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Header from "../../_components/Header";
import Footer from "../../_components/Footer";
import { useCart } from "react-use-cart";
import { current_products } from "../../data";
import { getAllProducts } from "../../../../utils/_products";
import {
  Container,
  Typography,
  Button,
  Card,
  Alert,
  Snackbar,
  Box,
  Grid,
  useTheme,
  CardContent,
  CardMedia,
  CardActions,
  TextField,
  Paper,
  useMediaQuery,
} from "@mui/material";
Grid, Typography, Button, TextField, Box;
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useRouter } from "next/navigation";

const ProductCard = ({ id, name, image, price, onAddToCart }) => {
  const { addItem } = useCart();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const router = useRouter();

  const handleShowDetails = () => {
    if (id) {
      router.push(`/product/${id}`);
    } else {
      console.error("Product not available");
    }
  };

  const handleAddToCart = () => {
    // e.stopPropagation(); // Prevent the event from bubbling up
    addItem({ id: id, name, price, image });
    onAddToCart(`${name} added to cart successfully!`);
  };

  return (
    <Card
      onClick={handleShowDetails}
      style={{ cursor: "pointer" }}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: "10px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        transition: "transform 0.3s ease-in-out",
        "&:hover": {
          transform: "scale(1.03)",
        },
      }}>
      <CardMedia
        component="img"
        height={isMobile ? "120" : "150"}
        image={image}
        alt={name}
        sx={{ objectFit: "cover", aspectRatio: "1 / 1" }}
      />
      <CardContent sx={{ flexGrow: 1, padding: 1 }}>
        <Typography gutterBottom variant="body1" component="div" noWrap>
          {name}
        </Typography>
        <Typography variant="body2" color="primary">
          {price} ADA
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: "center", padding: 1 }}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            handleAddToCart();
          }}>
          Add to Cart
        </Button>
      </CardActions>
    </Card>
  );
};

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addItem } = useCart();
  const [alertMessage, setAlertMessage] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("/placeholder.svg");
  const [products, setProducts] = useState(current_products);

  useEffect(() => {
    if (product?.images?.[0]?.image_url) {
      setSelectedImage(product.images[0].image_url);
    }
  }, [product]);

  const extraImages = [
    product?.images?.[0]?.image_url || "/placeholder.svg",
    "/images/Arrival1.jpg",
    "/images/Arrival6.jpg",
    "/images/Arrival7.jpg",
  ];

  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (event) => {
    const value = Math.max(1, parseInt(event.target.value) || 1);
    setQuantity(value);
  };

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
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
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
                    border: selectedImage === img ? "1px solid black" : "none",
                    padding: selectedImage === img ? "2px" : "0",
                    margin: "5px",
                  }}
                  onClick={() => setSelectedImage(img)}
                />
              ))}
            </Grid>
            {/* Right Side: Product Details */}
            <Grid item xs={12} md={6}>
              <Typography
                component="h1"
                variant="h3"
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
              <Box display="flex" alignItems="center" gap={2} mt={2}>
                <TextField
                  type="number"
                  label="Quantity"
                  variant="outlined"
                  size="small"
                  value={quantity}
                  onChange={handleQuantityChange}
                  sx={{ width: "100px" }}
                  inputProps={{ min: 1 }}
                />
              </Box>
              <div>
                <Button
                  variant="contained"
                  color="secondary"
                  sx={{ mt: 2, borderRadius: "8px", py: 1, px: 3 }}
                  onClick={() => handleAddToCart({ ...product, quantity })}>
                  Add to Cart
                </Button>

                <Typography variant="h6">
                  Total: ₳{(quantity * product.price).toFixed(2)}
                </Typography>
              </div>
            </Grid>
          </Grid>
        </Paper>
      </Container>
      <Container maxWidth="xl">
        <Box sx={{ my: { xs: 4, sm: 6, md: 8 } }}>
          <Typography
            variant="h4"
            gutterBottom
            align="center"
            sx={{
              mb: { xs: 2, sm: 3, md: 4 },
              fontSize: { xs: "1.75rem", sm: "2rem", md: "2.25rem" },
            }}>
            Similar Products
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
      <Footer />
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
