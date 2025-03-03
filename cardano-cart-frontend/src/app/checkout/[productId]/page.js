'use client';

import React, { useState, useContext, useEffect } from 'react';
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
import YoroiSuccessPage from '../../_components/Yoroi-success-Page';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Header from '../../_components/Header';
import CheckoutAnimation from '../../_components/CheckoutLoading';
import { completeOrder, fetchProductSeller, verifyPayment, getAllOrders } from '../../../../utils/_products';
import { WalletContext } from '../../_components/WalletContext';
import CircularProgress from '@mui/material/CircularProgress';
import { BrowserWallet, Transaction, MeshTxBuilder } from '@meshsdk/core';

const Checkout = () => {
  const { isConnected, wallet, balance, walletName } = useContext(WalletContext);
  const [access_token, setAccessToken] = useState(null);
 
  const { productId } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { items, removeItem, updateItemQuantity } = useCart();
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [paidAmount, setPaidAmount] = useState(0)
  
  const [openDialog, setOpenDialog] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [copied, setCopied] = useState(false);
  const [order, setOrder] = useState(null);
  const [detail, setCheckDetail] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isLoading, setIsLoading] = useState(true);
  const [alertOpen, setAlertOpen] = useState(false);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');
  const [error, setError] = useState('');
  const [orderCreated, setOrderCreated] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');

  const isConfirmingPayment = searchParams.get('confirmPayment') === 'true';
  const isYoroiPayment = searchParams.get('YoroiPayment') === 'true';
  const product = items.find(item => item.id === parseInt(productId, 10));

  useEffect(() => {
    const data = localStorage.getItem('accessToken');
    setAccessToken(data);
  }, []);

  useEffect(() => {
    if (!product && !orderCreated) {
      router.push('/cart');
      return;
    }

    const getWalletAddress = async () => {
      try {
        const sellerWalletId = await fetchProductSeller(productId, access_token);
        if (sellerWalletId.length > 0) {
          setWalletAddress(sellerWalletId);
        } else {
          setWalletAddress('No Address Found');
        }
      } catch (err) {
        console.error('Failed to fetch wallet address:', err);
        setError('Failed to load wallet address. Please try again.');
      }
    };

    getWalletAddress();
  }, [product, productId, router, orderCreated, access_token]);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 2000);
  }, []);

 

  useEffect(() => {
    if (isConfirmingPayment || isYoroiPayment) {
      setOrderCreated(true);
      return;
    }
    if (product) { 
      setCheckDetail({
        date: new Date().toISOString().split('T')[0],
        product: product,
        quantity: product.quantity,
        total: product.price * product.quantity,
        status: 'Pending Payment',
        isPaid: false,
      });
    }
  }, [access_token, isConfirmingPayment, isYoroiPayment, product]);
  

  if (isLoading) {
    return <CheckoutAnimation />;
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

  const handleCreateUnpaidOrder = async () => {
    setIsCreatingOrder(true);
    const orderData = {
      product: productId,
      quantity: product.quantity,
      shipping_address: 'Ahodwo Oasis of Love street',
    };

    try {
      const orderId = await completeOrder(orderData, access_token);
      setOrderId(orderId);
      setAlertSeverity('info');
      setAlertMessage(`Order #${orderId} created! Please complete the payment soon.`);
      setOrderCreated(true);

      setAlertOpen(true);
      
 
  
      
      // Remove the item from the cart after creating the order
      removeItem(product.id);
    } catch (error) {
      console.error('Error completing order and payment:', error);
      setAlertSeverity('error');
      setAlertMessage('An error occurred: ' + (error.response ? error.response.data : error.message));
      setAlertOpen(true);
    }
    handleCloseDialog();
  };

  const handleSubmitTransaction = () => {
    const transaction = transactionId
    console.log('Transaction ID submitted:', transactionId);
   
  
    verifyPayment(orderId, transaction, access_token)
      .then( paymentResponse => {
        console.log('Payment completed successfully:', orderId);
        alert('Payment confirmed! Thank you for your purchase.');
        router.push('/orders');
      })
      .catch(error => {
        console.error('Error completing order and payment:', error);
        alert('An error occurred: ' + (error.response ? error.response.data : error.message));
      });
    handleCloseDialog();
  };

  const handleYoroiPayment = async () => {
        try {

          if (!wallet) throw new Error('Wallet not connected.');
    if (!isConnected) {
      try{
        connectedWallet = await BrowserWallet.enable('yoroi');
      setWallet(connectedWallet);
      setIsConnected(true);
      }
      catch (error) {
        console.error('Yoroi connection error:', error);
        setAlertSeverity('error');
        setAlertMessage('Yoroi connection failed: ' + error.message);
        setAlertOpen(true);
      }
    }


      

    const changeAddress = await wallet.getChangeAddress();
      const utxos = await wallet.getUtxos();
      const txBuilder = new MeshTxBuilder();

      const lovelaceAmount = (detail.total * 1000000).toString();

      const meshTxBody = {
        outputs: [
          {
            address: walletAddress,
            amount: [{ unit: "lovelace", quantity: lovelaceAmount }],
          },
        ],
        changeAddress: changeAddress,
        extraInputs: utxos,
        selectionConfig: {
          threshold: "5000000",
          strategy: "largestFirst",
        },
      };

      console.log(`Sending ${detail.total} ADA (${lovelaceAmount} Lovelace) to ${walletAddress}`);

      const unsignedTx = await txBuilder.complete(meshTxBody);
      const signedTx = await wallet.signTx(unsignedTx);
      const txHash = await wallet.submitTx(signedTx);

      if (txHash) {
        console.log(`Transaction successful: ${txHash}`);
        setTransactionId(txHash);
        setPaidAmount(detail.total)
   
        setPaymentSuccess(true)

        
        
    } else {
        throw new Error('Transaction submission failed');
    }
    
    } catch (error) {
      console.error('Yoroi payment error:', error);
      setAlertSeverity('error');
      setAlertMessage('Yoroi payment failed: ' + error.message);
      setAlertOpen(true);
    }
  };
  if (paymentSuccess) {
    return <YoroiSuccessPage amount={paidAmount} transactionId={transactionId} />
  }


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
                 
                  <img src={detail.product.image} alt={detail.product.name} style={{ width: '100%' }} /> 
              
                  </Grid>
                  <Grid item xs={9}>
                    <Typography variant="body1">{detail.product.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      ₳{detail.product.price}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Quantity: {detail.quantity}
                    </Typography>
                  </Grid>
                </Grid>
                <Typography variant="h6" sx={{ mt: 2 }}>Total: ₳{detail.total}</Typography>
                {orderCreated && (
                  <>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      sx={{ mt: 2 }}
                      onClick={handleConfirmPayment}
                    >
                      Confirm Payment
                    </Button>
                    {!isMobile && (
  <Button 
    variant="contained" 
    color="primary" 
    onClick={handleYoroiPayment}
  >
    Pay with Yoroi
  </Button>
)}

                  </>
                )}
                {!orderCreated && product && (
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            onClick={handleCreateUnpaidOrder}
            disabled={isCreatingOrder}
          >
           {isCreatingOrder ? (
      <CircularProgress size={24} color="inherit" />
    ) : (
      'Create Order'
    )}
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
          <Button onClick={() => handleSubmitTransaction()} color="primary">
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
