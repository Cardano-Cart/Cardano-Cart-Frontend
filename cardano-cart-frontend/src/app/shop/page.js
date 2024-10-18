'use client';

import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Button, 
  TextField, 
  Slider, 
  Box,
  InputAdornment,
  Paper,
  useMediaQuery,
  useTheme,
  Alert,
  Snackbar
} from '@mui/material';
import { useCart } from "react-use-cart";
import Header from '../_components/Header';
import { current_products } from '../data';
import { Search } from '@mui/icons-material';
import ShopAnimation from '../_components/ShopLoading';
import { getAllProducts } from '../../../utils/_products';

const Shop = () => {
  const { addItem, items } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const theme = useTheme();
  const [products, setProducts] = useState(current_products);
  const [filteredProducts, setFilteredProducts] = useState(products);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const [alertOpen, setAlertOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState('');

  const getItemQuantity = (productId) => {
    const item = items.find(item => item.id === productId);
    return item ? item.quantity : 0;
  };

  
  // fetch products from the backend



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

 

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 2000);
    setMounted(true);
    const filtered = products.filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      product.price >= priceRange[0] &&
      product.price <= priceRange[1]
    );
    setFilteredProducts(filtered);
  }, [searchTerm, priceRange, products]);
  if (isLoading) {
    return <ShopAnimation />;
  }
  
  if (!mounted) {
    return null;
  }

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  const handleAddToCart = (product) => {
    addItem({id: product.id, name: product.name, price: product.price, image: product.images[0].image_url});
    setAlertMessage(`${product.name} added to cart successfully!`);
    setAlertOpen(true);
  };

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlertOpen(false);
  };

  return (
    <>
      <Header/>
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          All Products
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3} sx={{ mb: 2 }}>
            <Paper elevation={3} sx={{ p: 2, position: { md: 'sticky' }, top: 20 }}>
              <Typography variant="h6" gutterBottom>
                Filter Products
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />
              <Typography gutterBottom>Price Range</Typography>
              <Slider
                value={priceRange}
                onChange={handlePriceChange}
                valueLabelDisplay="auto"
                min={0}
                max={1000}
                sx={{ width: '100%' }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>₳{priceRange[0]}</Typography>
                <Typography>₳{priceRange[1]}</Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={9}>
            <Grid container spacing={2}>
              {filteredProducts.map((product) => (
                <Grid item xs={6} sm={4} md={3} key={product.id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardMedia
                      component="img"
                      height={isMobile ? '100' : isTablet ? '120' : '140'}
                      image={product.images[0].image_url}
                      alt={product.name}
                      sx={{
                        objectFit: 'cover',
                        height: {
                          xs: '140px', // Mobile devices
                          sm: '160px', // Tablets
                          md: '180px', // Laptops/Desktops
                        },
                      }}
                    />
                    <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', p: 1 }}>
                      <Box>
                        <Typography variant={isMobile ? "body2" : "subtitle1"} component="div" noWrap>
                          {product.name}
                        </Typography>
                        <Typography variant={isMobile ? "caption" : "body2"} color="text.secondary">
                          ₳{product.price}
                        </Typography>
                      </Box>
                      <Button
                        variant="contained"
                        color="primary"
                        size={isMobile ? "small" : "medium"}
                        onClick={() => handleAddToCart(product)}
                        sx={{ mt: 1 }}
                      >
                        Add To Cart
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>
      <Snackbar open={alertOpen} autoHideDuration={3000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity="success" sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Shop;