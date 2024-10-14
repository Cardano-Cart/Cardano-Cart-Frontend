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
} from '@mui/material';
import { ContentCopy, Check } from '@mui/icons-material';
import { useCart } from "react-use-cart";
import QRCode from "react-qr-code";
import { useParams, useRouter } from 'next/navigation';
import Header from '../../_components/Header';

import { fetchProductSeller, completeOrder } from '../../../../utils/_products'; 


const Checkout = () => {
  const access_token = localStorage.getItem('accessToken'); // Assuming you store the token in localStorage
  const [error, setError] = useState(null);
  const { productId } = useParams();
  const router = useRouter();
  const { items, removeItem, updateItemQuantity } = useCart();
  const [openDialog, setOpenDialog] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [copied, setCopied] = useState(false);


  const [walletAddress, setWalletAddress] = useState('');

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



  const total = product.price * product.quantity;
  const quantity = product.quantity;

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

  const handleSubmitTransaction = () => {
    console.log('Transaction ID submitted:', transactionId);
  
    const orderData = {
      product: productId,  // Ensure productId is correctly set
      quantity: quantity,   // Ensure quantity is correctly set
      shipping_address: 'Ahodwo Oasis of Love street', // Replace with actual shipping address
    };
  
    console.log('Order Data:', orderData);
  
    // Call the function to complete the order and verify payment
    completeOrder(orderData, transactionId, access_token)
      .then(paymentResult => {
        console.log('Payment completed successfully:', paymentResult);
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
  

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Checkout
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ display: 'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Payment
              </Typography>
              <Typography variant="body1" gutterBottom>
                Scan QR Code to make payment
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                <QRCode value={walletAddress} size={256} />
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
                  <img src={product.image} alt={product.name} style={{ width: '100%' }} /> 
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body1">{product.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    ₳{product.price}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                          Quantity: {quantity}
                   </Typography>
                </Grid>
              </Grid>
              <Typography variant="h6" sx={{ mt: 2 }}>Total: ₳{total}</Typography>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
                onClick={handleConfirmPayment}
              >
                Confirm Payment
              </Button>
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
    </>
  );
};

export default Checkout;