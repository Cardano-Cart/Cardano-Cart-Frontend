'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Button,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  useMediaQuery,
  useTheme,
  Alert,
  Snackbar
} from '@mui/material';
import { ContentCopy, Check } from '@mui/icons-material';
import { useCart } from "react-use-cart";
import QRCode from "react-qr-code";
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Header from '../../_components/Header';
import CheckoutAnimation from '@/app/_components/CheckoutLoading';
import { completeOrder, fetchProductSeller, verifyPayment } from '../../../../utils/_products';


const Checkout = () => {
  const access_token = localStorage.getItem('accessToken'); // Assuming you store the token in localStorage


  const { productId } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { items, removeItem, updateItemQuantity } = useCart();
  const [openDialog, setOpenDialog] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [copied, setCopied] = useState(false);
  const [order, setOrder] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isLoading, setIsLoading] = useState(true);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');
  const [error, setError] = useState('');

  const [orderCreated, setOrderCreated] = useState(false);

  const [walletAddress, setWalletAddress] = useState('');

  const isConfirmingPayment = searchParams.get('confirmPayment') === 'true';
  const product = items.find(item => item.id === parseInt(productId, 10));

  useEffect(() => {
    if (!product) {
      router.push('/cart');
      return;
    }

    // Fetch the seller's wallet address
    const getWalletAddress = async () => {
      try {
        const sellerWalletId = await fetchProductSeller(productId, access_token);  // Fetch the wallet ID
        if (sellerWalletId.length > 0){
          setWalletAddress(sellerWalletId);
        }else{
          setWalletAddress('No Address Found')
        }
          // Update the wallet address in state
      } catch (err) {
        console.error('Failed to fetch wallet address:', err);
        setError('Failed to load wallet address. Please try again.');  // Handle error
      }
    };

    getWalletAddress();
  }, [product, productId, router, access_token]);

  if (!product) {
    return null;
  }

  useEffect(() => {
    if (isConfirmingPayment) {
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      const existingOrder = orders.find(o => o.id === productId);
      if (existingOrder) {
        setOrder(existingOrder);
      } else {
        router.push('/order');
      }
    } else {
      const product = items.find(item => item.id === parseInt(productId, 10));
      if (product) {
        setOrder({
          id: Date.now().toString(),
          date: new Date().toISOString().split('T')[0],
          product: product,
          quantity: product.quantity,
          total: product.price * product.quantity,
          status: 'Pending Payment',
          isPaid: false,
        });
      } 
    }
  }, [productId, items, router, isConfirmingPayment]);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 2000);
  }, []);

  if (isLoading) {
    return <CheckoutAnimation />;
  }

  if (!order) {
    return null;
  }

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirmPayment = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setTransactionId('');
  };


  const handleCreateUnpaidOrder = () => {
    const orderData = {
      product: productId,  // Ensure productId is correctly set
      quantity: product.quantity,   // Ensure quantity is correctly set
      shipping_address: 'Ahodwo Oasis of Love street', // Replace with actual shipping address
    };
  
    //console.log('Order Data:', orderData);

    // Call the function to complete the order and verify payment
    completeOrder(orderData, access_token)
      .then(paymentResult => {
        //console.log('Payment completed successfully:', paymentResult);
        // Handle success, e.g., show a success message, redirect, etc.
        setOrderCreated(true);
        setAlertSeverity('info');
        setAlertMessage('Order created! Please complete the payment soon.');
        setAlertOpen(true);
      })
      .catch(error => {
        console.error('Error completing order and payment:', error);
        // Handle error, e.g., show an error message, etc.
        alert('An error occurred: ' + (error.response ? error.response.data : error.message));
      });
      handleCloseDialog();
      removeItem(productId); // Use productId here, not product.id
    
  };


  const handleSubmitTransaction = () => {
    //console.log('Transaction ID submitted:', transactionId);
    const orderId = order?.id;
  
    // Call the function to complete the order and verify payment
    verifyPayment(orderId, transactionId, access_token)
      .then(paymentResult => {
        //console.log('Payment completed successfully:', paymentResult);
        // Handle success, e.g., show a success message, redirect, etc.
  
        alert('Payment confirmed! Thank you for your purchase.');
        router.push('/orders');
      })
      .catch(error => {
        console.error('Error completing order and payment:', error);
        // Handle error, e.g., show an error message, etc.
        alert('An error occurred: ' + (error.response ? error.response.data : error.message));
      });
      handleCloseDialog();
      removeItem(productId); // Use productId here, not product.id
  };

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlertOpen(false);
    

  };

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          {isConfirmingPayment ? 'Confirm Payment' : 'Checkout'}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ display: 'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Payment
              </Typography>
              <Typography variant="body1" gutterBottom>
                Scan QR Code to make payment
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                <QRCode value={walletAddress} size={isMobile ? 200 : 256} />
              </Box>
              <Typography variant="body2" sx={{ mt: 2, wordBreak: 'break-all' }}>
              {`${walletAddress.slice(0, 14)}...${walletAddress.slice(-10)}`}

                <IconButton onClick={handleCopyAddress} size="small">
                  {copied ? <Check color="success" /> : <ContentCopy />}
                </IconButton>
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Your Order
              </Typography>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={3}>
                  <img src={order.product.image} alt={order.product.name} style={{ width: '100%' }} /> 
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body1">{order.product.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    ₳{order.product.price}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Quantity: {order.quantity}
                  </Typography>
                </Grid>
              </Grid>
              <Typography variant="h6" sx={{ mt: 2 }}>Total: ₳{order.total}</Typography>
              {orderCreated && <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
                onClick={handleConfirmPayment}
              >
                Confirm Payment
              </Button>}
              {!isConfirmingPayment && !orderCreated && (
                <Button
                  variant="outlined"
                  color="secondary"
                  fullWidth
                  sx={{ mt: 2 }}
                  onClick={handleCreateUnpaidOrder}
                >
                  Create Order
                </Button>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Enter Transaction ID</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Transaction ID"
            type="text"
            fullWidth
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmitTransaction} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={alertOpen} autoHideDuration={6000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity={alertSeverity} sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Checkout;