'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { Container, Typography, Button, Box, Grid, TextField, Link } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import Header from './_components/Header';
import theme from './_components/theme';
import { motion } from 'framer-motion';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { useCart } from "react-use-cart";
import { current_products } from './data';

import { getAllProducts } from '../../utils/_products';

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

const WithStyles = ({ id, name, image, price }) => {
  const { addItem } = useCart();

  return (
    <Box
      sx={{
        padding: 1,
        textAlign: 'center',
        backgroundColor: '#f9f9f9',
        borderRadius: '10px',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        height: '400px',
        margin: 2,
        position: 'relative',
      }}
    >
      <img
        src={image}
        alt={name}
        style={{
          width: '250px',
          height: '250px',
          marginBottom: '15px',
          borderRadius: '8px',
          objectFit: 'cover',
        }}
      />
      <Typography variant="subtitle1" component="div" wrap="true">
        {name}
      </Typography>
      
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: 3,
        }}
      >
        <Box 
          sx={{ 
            position: 'relative', 
            bottom: 10, 
            left: 10 
          }}
        >
          <Typography variant="body1" color="text.secondary">
          ₳{price}
          </Typography>
        </Box>
        <Box 
          sx={{ 
            position: 'relative', 
            bottom: 10, 
            right: 10 
          }}
        >
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => addItem({ id, name, price, image })}
          >
            Add to Cart
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

const PrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <ArrowBackIos
      className={className}
      style={{ ...style, display: "block", color: "#000679", left: "-30px" }}
      onClick={onClick}
    />
  );
};

const NextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <ArrowForwardIos
      className={className}
      style={{ ...style, display: "block", color: "#000679", right: "-30px" }}
      onClick={onClick}
    />
  );
};

const Home = () => {

  const [products, setProducts] = useState(current_products);

  useEffect(() => {
    const fetchProducts = async () => {
      if (typeof window !== 'undefined') {
        const access_token = localStorage.getItem('accessToken');
        console.log(access_token); // should log access_token correctly
        if (access_token) {
          try {
            
            const fetchedProducts = await getAllProducts(access_token);
            setProducts(fetchedProducts);
          } catch (error) {
            console.error('Error fetching products:', error);
          }
        }
      }
    };
  
    fetchProducts();
  }, []);
  


  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        <Header />
        <Container maxWidth="xl" sx={{ marginTop: 10 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              margin: 5,
              marginTop: 0,
              gap: { xs: 5, md: 20 },
              flexDirection: { xs: 'column', md: 'row' },
              textAlign: { xs: 'center', md: 'left' },
            }}
          >
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInEffect}
              style={{ flex: 1 }}
            >
              <Typography variant="h3" component="h1" gutterBottom>
                <Box
                  component="span"
                  sx={{ color: '#000679', fontWeight: 'bold', fontSize: '90px' }}
                >
                  Cardano
                </Box>
                <Box
                  component="span"
                  sx={{
                    color: 'black',
                    fontWeight: 'bold',
                    fontSize: '90px',
                    marginLeft: '10px',
                  }}
                >
                  Cart
                </Box>
              </Typography>
              <Typography variant="h6" color="textSecondary" paragraph>
                Shop with ease using Cardano for fast, secure payments. Enjoy a
                smooth shopping experience with low fees and exclusive deals.
              </Typography>
              <Button variant="contained" color="primary" size="large">
                Shop Now
              </Button>
            </motion.div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInEffect}
              style={{ flex: 1, textAlign: 'right' }}
            >
              <Box
                sx={{
                  textAlign: { xs: 'center', md: 'right' },
                  marginTop: { xs: 4, md: 0 },
                }}
              >
                <img
                  src="/images/Cardano Cart.png"
                  alt="Cardano Cart"
                  style={{
                    maxWidth: '100%',
                    height: 'auto',
                    width: { xs: '80%', md: '60%' },
                  }}
                />
              </Box>
            </motion.div>
          </Box>

          <Box sx={{ my: 8 }}>
            <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
              New Arrivals
            </Typography>
            <Box sx={{ position: 'relative', padding: '0 30px' }}>
              <Slider {...settings}>
                {products.map((product) => (
                  <WithStyles
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    image={product.images[0]?.image_url}
                    price={product.price}
                  />
                ))}
              </Slider>
            </Box>
          </Box>

          <Box sx={{ my: 8 }}>
            <Typography variant="h4" gutterBottom align="center">
              Featured Products
            </Typography>
            <Grid container spacing={4}>
              {products.slice(0, 4).map((product) => (
                <Grid item xs={12} sm={6} md={3} key={product.id}>
                  <WithStyles
                    id={product.id}
                    name={product.name}
                    image={product.images[0]?.image_url}
                    price={product.price}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>

          <Box sx={{ my: 8 }}>
            <Typography variant="h4" gutterBottom align="center">
              About Cardano Cart
            </Typography>
            <Typography variant="body1" paragraph align="center">
              Cardano Cart is revolutionizing e-commerce by leveraging the power of Cardano blockchain. 
              We offer a secure, fast, and cost-effective shopping experience for our customers.
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Button variant="outlined" color="primary">
                Learn More
              </Button>
            </Box>
          </Box>

          <Box sx={{ my: 8, backgroundColor: '#f5f5f5', py: 4, borderRadius: 2 }}>
            <Typography variant="h5" gutterBottom align="center">
              Subscribe to Our Newsletter
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <TextField
                variant="outlined"
                placeholder="Enter your email"
                size="small"
                sx={{ mr: 1, backgroundColor: 'white' }}
              />
              <Button variant="contained" color="primary">
                Subscribe
              </Button>
            </Box>
          </Box>
        </Container>

        <Box component="footer" sx={{ backgroundColor: '#000679', color: 'white', py: 6 }}>
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
                <Typography variant="body2">
                <Link href="/" variant="body2"sx={{ color: 'white',textDecoration: 'none', 
                       '&:hover': {
                  textDecoration: 'none', 
                 }}} >
                  <Button color="inherit">Home</Button></Link>
                </Typography>
                <Typography variant="body2">
                <Link href="/shop" variant="body2"sx={{ color: 'white',textDecoration: 'none', 
                       '&:hover': {
                  textDecoration: 'none', 
                 }}} >
                  <Button color="inherit">Shop</Button></Link>
                </Typography>
                <Typography variant="body2">
                <Link href="/cart" variant="body2"sx={{ color: 'white',textDecoration: 'none', 
                       '&:hover': {
                  textDecoration: 'none', 
                 }}} >
                  <Button color="inherit">Cart</Button></Link>
                </Typography>
                
              </Grid>
            </Grid>
            <Box mt={5}>
              <Typography variant="body2" align="center">
                © {new Date().getFullYear()} Cardano Cart. All rights reserved.
              </Typography>
            </Box>
          </Container>
        </Box>
      </ThemeProvider>
    </>
  );
};

export default Home;