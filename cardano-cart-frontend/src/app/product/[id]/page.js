"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Header from "../../_components/Header";

import CustomerReviews from "../../_components/CustomerReviews";
import { useCart } from "react-use-cart";
import { current_products } from "../../data";
import { getAllProducts } from "../../../../utils/_products";
import {
  Container,
  Typography,
  Button,
  Card,
  Alert,
  Tab,
  Tabs,
  Snackbar,
  Box,
  Grid,
  useTheme,
  CardContent,
  CardMedia,
  CardActions,
  TextField,
  useMediaQuery,
} from "@mui/material";
Grid, Typography, Button, TextField, Box;
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useRouter } from "next/navigation";

import Feature from "@/app/_components/pages/singleproduct/SimilarProduct";

const ProductCard = ({ id, name, image, price, onAddToCart }) => {
  const { addItem } = useCart();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);

  const handleShowDetails = () => {
    if (id) {
      router.push(`/product/${id}`);
    } else {
      console.error("Product not available");
    }
  };

  const handleAddToCart = () => {
    // e.stopPropagation(); // Prevent the event from bubbling up
    addItem({ id: id, name, price, image, quantity });
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
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [accessToken, setAccessToken] = useState("");
  const [userId, setUserId] = useState(0);
  const [value, setValue] = useState(0);

  const handleChange = (_event, newValue) => {
    setValue(newValue);
  };

  const handleMouseMove = (e) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setHoverPosition({ x, y });
  };

  useEffect(() => {
    if (product?.images?.[0]?.image_url) {
      setSelectedImage(product.images[0]?.image_url);
    }
  }, [product]);

  const extraImages = [
    product?.images?.[0]?.image_url || "/placeholder.svg",
    "/images/Arrival1.jpg",
    "/images/Arrival6.jpg",
    "/images/Arrival7.jpg",
  ];

  const handleQuantityChange = (event) => {
    const value = Math.max(1, Number.parseInt(event.target.value) || 1);
    setQuantity(value);
  };

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md")); // md = 900px and above

  useEffect(() => {
    // Get access token from localStorage
    const token = localStorage.getItem("accessToken");
    if (token) {
      setAccessToken(token);

      // Get user ID from localStorage or decode from JWT if available
      const storedUserId = localStorage.getItem("userId");
      if (storedUserId) {
        setUserId(Number.parseInt(storedUserId, 10));
      } else {
        // If using JWT, you could decode the token to get the user ID
        // This is a simplified example - in a real app, you might use a JWT library
        try {
          // Example of decoding a JWT token (simplified)
          const tokenParts = token.split(".");
          if (tokenParts.length === 3) {
            const payload = JSON.parse(atob(tokenParts[1]));
            if (payload.user_id) {
              setUserId(payload.user_id);
              localStorage.setItem("userId", payload.user_id.toString());
            }
          }
        } catch (error) {
          console.error("Error decoding token:", error);
        }
      }
    }

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
      image: product.images[0].image_url,
      quantity: quantity,
      // image: selectedImage,
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

      <Container sx={{ mt: 4, mb: 4 }} maxWidth="lg">
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
                marginTop: 5,
                height: 410,
                position: "relative",
                cursor: "crosshair",
              }}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}>
              <Image
                src={selectedImage || "/placeholder.svg"}
                // Remove after
                onError={(e) => (e.target.src = "")}
                alt={product.name}
                height={400}
                width={400}
                objectFit="contain"
              />
              {isHovering && (
                <Box
                  sx={{
                    position: "absolute",
                    top: `${hoverPosition.y - 12.5}%`,
                    left: `${hoverPosition.x - 12.5}%`,
                    width: "25%",
                    height: "25%",
                    border: "2px solid #2196f3",
                    backgroundColor: "rgba(33, 150, 243, 0.1)",
                    pointerEvents: "none",
                    borderRadius: "2px",
                  }}
                />
              )}
            </Box>

            {/* Extra Images */}
            <Box display="flex" justifyContent="center" alignItems="center">
              {extraImages.map((img, index) => (
                <Image
                  key={index}
                  src={img || "/placeholder.svg"}
                  // Remove after
                  onError={(e) => (e.target.src = "")}
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
            </Box>
          </Grid>

          {/* Right Side: Product Details & Zoomed Image */}
          <Grid item xs={12} md={6}>
            {/* Zoomed Image on Hover */}
            {isHovering && isDesktop && (
              <Box
                sx={{
                  position: "absolute",
                  top: "30%",
                  right: "5%",
                  transform: "translateY(-50%)",
                  width: 500,
                  height: 500,
                  marginTop: 5,
                  overflow: "hidden",
                  borderRadius: 2,
                  border: "2px solid #ddd",
                  backgroundColor: "#fff",
                  boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
                  zIndex: 1500,
                }}>
                <Image
                  src={selectedImage || "/placeholder.svg"}
                  alt="Zoomed"
                  // Zoomed-in size
                  width={1200}
                  height={1200}
                  style={{
                    position: "absolute",
                    top: `${-(hoverPosition.y - 12.5) * 4}%`,
                    left: `${-(hoverPosition.x - 12.5) * 4}%`,
                    transformOrigin: "top left",
                    transform: "scale(4)",
                  }}
                />
              </Box>
            )}

            <Typography
              component="h4"
              variant="h4"
              fontWeight="bold"
              gutterBottom>
              {product.name.split(",")[0]}
            </Typography>
            <Typography variant="h5" color="primary" gutterBottom>
              ₳{product.price}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              Category: {product.category_name}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              Description
            </Typography>
            <Box
              sx={{
                maxHeight: "150px",
                overflow: "auto",
                "&::-webkit-scrollbar": {
                  width: "4px",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "#888",
                  borderRadius: "8px",
                },
                "&::-webkit-scrollbar-thumb:hover": {
                  backgroundColor: "#555",
                },
              }}>
              <Typography
                variant="body1"
                sx={{ textAlign: "justify", paddingRight: "8px" }}
                paragraph>
                {product.description}
              </Typography>
            </Box>

            {/* Quantity & Add to Cart */}
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

            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mt="auto"
              pb={2}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Total
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  ₳{(quantity * product.price).toFixed(2)}
                </Typography>
              </Box>

              <Button
                variant="contained"
                color="secondary"
                sx={{ borderRadius: "8px", py: 1, px: 3 }}
                onClick={() => handleAddToCart({ ...product, quantity })}>
                Add to Cart
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
      <Box sx={{ width: "100%", maxWidth: "1024px", mx: "auto", p: 2 }}>
        <Tabs
          value={value}
          onChange={handleChange}
          sx={{ bgcolor: "grey.100", borderRadius: 1 }}>
          <Tab label="Descriptions" />
          <Tab label="Specifications" />
        </Tabs>

        {value === 0 && (
          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="body1" color="text.secondary">
                {product.description}
              </Typography>
            </CardContent>
          </Card>
        )}

        {product.specifications && value == 1 && (
          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Technical Specifications
              </Typography>
              <Box component="ul" sx={{ pl: 3, color: "text.secondary" }}>
                {Object.entries(product.specifications).map(([key, value]) => (
                  <li key={key}>
                    <strong>
                      {key
                        .replace(/_/g, " ")
                        .replace(/^./, (str) => str.toUpperCase())}
                      :{" "}
                    </strong>{" "}
                    {value}
                  </li>
                ))}
              </Box>
            </CardContent>
          </Card>
        )}
      </Box>

      <Container
        maxWidth="xl"
        onClick={() => console.log(product.category_name)}>
        <Box sx={{ my: { xs: 4, sm: 6, md: 8 } }}>
          {/* New */}
          <Feature category={product.category_name} />
        </Box>
      </Container>
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Typography
          variant="h4"
          gutterBottom
          align="center"
          sx={{
            mb: { xs: 2, sm: 3, md: 4 },
            fontSize: { xs: "1.75rem", sm: "2rem", md: "2.25rem" },
          }}>
          Customer Reviews
        </Typography>
        <CustomerReviews
          productId={id}
          accessToken={accessToken}
          userId={userId}
        />
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
