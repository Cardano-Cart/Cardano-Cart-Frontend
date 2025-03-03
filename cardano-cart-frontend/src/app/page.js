"use client";

import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  TextField,
  Alert,
  Snackbar,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import Header from "./_components/Header";
import theme from "./_components/theme";
import { color, motion } from "framer-motion";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { useCart } from "react-use-cart";
import { current_products } from "./data";
import Carousel from "./_components/Features";
import { getAllProducts } from "../../utils/_products";
// import { useRouter } from "next/compat/router";
import { useRouter } from "next/navigation";

const fadeInEffect = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1.2,
      ease: [0.42, 0, 0.58, 1],
    },
  },
};

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
      }}
    >
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
          }}
        >
          Add to Cart
        </Button>
      </CardActions>
    </Card>
  );
};

const PrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <ArrowBackIos
      className={className}
      style={{ ...style, display: "block", color: "#000679", left: "-25px" }}
      onClick={onClick}
    />
  );
};

const NextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <ArrowForwardIos
      className={className}
      style={{ ...style, display: "block", color: "#000679", right: "-25px" }}
      onClick={onClick}
    />
  );
};

const Home = () => {
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  // fetch products from the backend
  const [products, setProducts] = useState(current_products);

  useEffect(() => {
    const fetchProducts = async () => {
      if (typeof window !== "undefined") {
        const access_token = localStorage.getItem("accessToken");
        //console.log(access_token); // should log access_token correctly
        if (access_token) {
          try {
            const fetchedProducts = await getAllProducts(access_token);
            setProducts(fetchedProducts);
            //console.log(fetchedProducts)
          } catch (error) {
            console.error("Error fetching products:", error);
          }
        }
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (message) => {
    setAlertMessage(message);
    setAlertOpen(true);
  };

  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setAlertOpen(false);
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: isMobile ? 2 : isTablet ? 3 : 5,
    slidesToScroll: 1,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        <Header />
        <Container maxWidth="xl" sx={{ mt: { xs: 0, sm: 0, md: 0 } }}>
         
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: { xs: 2, sm: 3, md: 4 },
              flexDirection: { xs: "column", md: "row" },
              textAlign: { xs: "center", md: "left" },
            }}
          >
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInEffect}
              style={{ flex: 1 }}
            >
              <Typography
                variant="h3"
                component="h1"
                gutterBottom
                sx={{ fontSize: { xs: "2.5rem", sm: "3rem", md: "3.5rem" } }}
              >
                <Box
                  component="span"
                  sx={{ color: "#000679", fontWeight: "bold" }}
                >
                  Cardano
                </Box>
                <Box
                  component="span"
                  sx={{
                    color: "black",
                    fontWeight: "bold",
                    marginLeft: "10px",
                  }}
                >
                  Cart
                </Box>
              </Typography>
              <Typography variant="body1" color="textSecondary" paragraph>
                Shop with ease using Cardano for fast, secure payments. Enjoy a
                smooth shopping experience with low fees and exclusive deals.
              </Typography>
              <Button variant="contained" color="primary" size="large" sx={{ textDecoration: 'none' }}>
                <a href="/shop" style={{ color: 'white', textDecoration: 'none'}}>Shop Now</a>
              </Button>
            </motion.div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInEffect}
              style={{ flex: 1, textAlign: "right" }}
            >
              <Box
                sx={{
                  textAlign: { xs: "center", md: "right" },
                  marginTop: { xs: 2, md: 0 },
                }}
              >
                <img
                  src="/images/Cardano Cart.png"
                  alt="Cardano Cart"
                  style={{
                    maxWidth: "100%",
                    height: "auto",
                    width: { xs: "80%", sm: "70%", md: "60%" },
                  }}
                />
              </Box>
            </motion.div>
          </Box>
      
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
              New Arrivals
            </Typography>
            <Box sx={{ position: "relative", padding: "0 25px" }}>
              <Slider {...settings}>
                {products.map((product) => (
                  <Box key={product.id} sx={{ padding: "0 5px" }}>
                    <ProductCard
                      id={product.id}
                      name={product.name}
                      image={product.images[0].image_url}
                      price={product.price}
                      onAddToCart={handleAddToCart}
                    />
                  </Box>
                ))}
              </Slider>
            </Box>
          </Box>
          
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
         
          <Box sx={{ my: { xs: 4, sm: 6, md: 8 } }}>
            <Typography
              variant="h4"
              gutterBottom
              align="center"
              sx={{ fontSize: { xs: "1.75rem", sm: "2rem", md: "2.25rem" } }}
            >
              About Cardano Cart
            </Typography>
            <Typography variant="body1" paragraph align="center">
              Cardano Cart is revolutionizing e-commerce by leveraging the power
              of Cardano blockchain. We offer a secure, fast, and cost-effective
              shopping experience for our customers.
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <Button variant="outlined" color="primary">
                Learn More
              </Button>
            </Box>
          </Box>
          

          <Box
            sx={{
              my: { xs: 4, sm: 6, md: 8 },
              backgroundColor: "#f5f5f5",
              py: { xs: 2, sm: 3, md: 4 },
              borderRadius: 2,
            }}
          >
            <Typography
              variant="h5"
              gutterBottom
              align="center"
              sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem", md: "1.75rem" } }}
            >
              Subscribe to Our Newsletter
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mt: 2,
                flexDirection: { xs: "column", sm: "row" },
                alignItems: "center",
              }}
            >
              <TextField
                variant="outlined"
                placeholder="Enter your email"
                size="small"
                sx={{
                  mr: { xs: 0, sm: 1 },
                  mb: { xs: 1, sm: 0 },
                  backgroundColor: "white",
                  width: { xs: "100%", sm: "auto" },
                }}
              />
              <Button
                variant="contained"
                color="primary"
                sx={{ width: { xs: "100%", sm: "auto" } }}
              >
                Subscribe
              </Button>
            </Box>
          </Box>
        </Container>

        <Box
          component="footer"
          sx={{
            backgroundColor: "#000679",
            color: "white",
            py: { xs: 3, sm: 4, md: 6 },
          }}
        >
          <Container maxWidth="lg">
            <Grid container spacing={4}>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6" gutterBottom>
                  Cardano Cart
                </Typography>
                <Typography variant="body2">
                  Revolutionizing e-commerce with Cardano blockchain technology.
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6" gutterBottom>
                  Quick Links
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                  {["Home", "Shop", "About Us", "Contact"].map((link) => (
                    <Button key={link} color="inherit" sx={{ mr: 2, mb: 1 }}>
                      {link}
                    </Button>
                  ))}
                </Box>
              </Grid>
            </Grid>
            <Box mt={3}>
              <Typography variant="body2" align="center">
                © {new Date().getFullYear()} Cardano Cart. All rights reserved.
              </Typography>
            </Box>
          </Container>
        </Box>
      </ThemeProvider>
      <Snackbar
        open={alertOpen}
        autoHideDuration={3000}
        onClose={handleCloseAlert}
      >
        <Alert
          onClose={handleCloseAlert}
          severity="success"
          sx={{ width: "100%" }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Home;