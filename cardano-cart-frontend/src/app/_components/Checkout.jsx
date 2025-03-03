import React, { useState } from 'react';
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
} from '@mui/material';
import { Delete, Add, Remove } from '@mui/icons-material';

import { useCart } from './CardContext';
import QRCode from "react-qr-code";

import { verifyPayment } from '../../../utils/_products';

const Checkout = () => {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const [openDialog, setOpenDialog] = useState(false);
  const [transactionId, setTransactionId] = useState('');

  const [order, setOrder] = useState(null);

  const walletAddress = 'addr1v9w8x44wkuqujvv3mxfshqtvk7ymwfm8luxv04q7z8373g52ujk0';

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingFee = 2;
  const total = subtotal + shippingFee;

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    alert('Address copied to clipboard!');
  };

  const handleConfirmPayment = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setTransactionId('');
  };

  // verify payment here
  const handleSubmitTransaction = () => {
    console.log('Transaction ID submitted:', transactionId);
    const orderId = order?.id;
    console.log(orderId)
  
    // Call the function to complete the order and verify payment
    verifyPayment(orderId, transactionId, access_token)
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
      
      <Container>
        <Typography variant="h4" gutterBottom style={{ marginTop: '2rem' }}>
          Checkout
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Paper style={{ padding: '1rem' }}>
              <Typography variant="h6" gutterBottom>
                Payment
              </Typography>
              <Typography variant="body1" gutterBottom>
                Scan QR Code to make payment
              </Typography>
              <QRCode value={walletAddress} size={256} />
              <Typography variant="body2" style={{ marginTop: '1rem' }}>
                {walletAddress}
                <IconButton onClick={handleCopyAddress} size="small">
                  <img src="/placeholder.svg?height=24&width=24&text=Copy" alt="Copy" />
                </IconButton>
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper style={{ padding: '1rem' }}>
              <Typography variant="h6" gutterBottom>
                Your Order
              </Typography>
              {cart.map((item) => (
                <Grid container spacing={2} key={item.id} style={{ marginBottom: '1rem' }}>
                  <Grid item xs={2}>
                    <img src={item.image} alt={item.name} style={{ width: '100%' }} />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body1">{item.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.price} ADA
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <IconButton size="small" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                      <Remove />
                    </IconButton>
                    <Typography display="inline">{item.quantity}</Typography>
                    <IconButton size="small" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                      <Add />
                    </IconButton>
                  </Grid>
                  <Grid item xs={1}>
                    <IconButton onClick={() => removeFromCart(item.id)}>
                      <Delete />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}
              <Typography variant="body1">Subtotal: {subtotal} ADA</Typography>
              <Typography variant="body1">Shipping Fee: {shippingFee} ADA</Typography>
              <Typography variant="h6">Total: {total} ADA</Typography>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                style={{ marginTop: '1rem' }}
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