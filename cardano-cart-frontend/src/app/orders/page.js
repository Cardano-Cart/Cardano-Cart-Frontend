'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Grid,
  useMediaQuery,
  useTheme,
  TextField
} from '@mui/material';
import Image from 'next/image';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/navigation';
import Header from '../_components/Header';
import OrderAnimation from '../_components/OrderLoading';
import { getAllOrders, verifyPayment } from '../../../utils/_products';
import { formatDate } from '../../../utils/_dateformat';


const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
  padding: theme.spacing(1),
}));

const StatusChip = styled(Chip)(({ theme, status }) => ({
  backgroundColor: 
    status === 'Delivered' ? theme.palette.success.main :
    status === 'Processing' ? theme.palette.warning.main :
    status === 'Shipped' ? theme.palette.info.main :
    status === 'Pending Payment' ? theme.palette.error.main :
    theme.palette.grey[500],
  color: theme.palette.common.white,
}));

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [openDialog, setOpenDialog] = useState(false);
  const [transactionId, setTransactionId] = useState('');



  const access_token = localStorage.getItem('accessToken'); // Assuming you're storing accessToken in localStorage

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const fetchedOrders = await getAllOrders(access_token);
        console.log(fetchedOrders)
        setOrders(fetchedOrders);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      }
    };

    fetchOrders();
  }, [access_token]);

  useEffect(() => {
    
    setTimeout(() => setIsLoading(false), 2000);
    setMounted(true);
  }, []);

  if (isLoading) {
    return <OrderAnimation />;
  }


  const handleOpenDetails = (order) => {
    setSelectedOrder(order);
  };

  const handleCloseDetails = () => {
    setSelectedOrder(null);
  };

  const handleConfirmPayment = () => {
    setOpenDialog(true);
  };

  const handleSubmitTransaction = () => {
    console.log('Transaction ID submitted:', transactionId);
    const orderId = selectedOrder?.id;
  
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
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setTransactionId('');
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Header />
      <Container maxWidth="lg" sx={{ mt: 4, px: { xs: 1, sm: 2, md: 3 } }}>
        <Typography variant="h4" gutterBottom>
          Your Orders
        </Typography>
        {orders.length === 0 ? (
          <Typography variant="body1">You have no orders yet.</Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table size="small" aria-label="orders table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>ID</StyledTableCell>
                  <StyledTableCell align="right">Total</StyledTableCell>
                  <StyledTableCell align="center">Status</StyledTableCell>
                  <StyledTableCell align="center">Actions</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order?.id}>
                    <TableCell component="th" scope="row" sx={{ padding: 1 }}>
                      {order?.id}...
                    </TableCell>

                    <TableCell align="right" sx={{ padding: 1 }}>₳{order?.total_amount}</TableCell>
                    <TableCell align="center" sx={{ padding: 1 }}>
                      <StatusChip 
                        label={order?.status} 
                        status={order?.status} 
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center" sx={{ padding: 1 }}>
                      <Button 
                        variant="outlined" 
                        onClick={() => handleOpenDetails(order)} 
                        size="small"
                      >
                        View
                      </Button>
                    </TableCell>

                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>

      <Dialog open={Boolean(selectedOrder)} onClose={handleCloseDetails} maxWidth="sm" fullWidth>
        <DialogTitle>Order Details - #{selectedOrder?.id}</DialogTitle>
        <DialogContent>

          <Typography variant="subtitle2" gutterBottom>
            Date: {formatDate(selectedOrder?.created_at)}
          </Typography>
          <Typography variant="subtitle2" gutterBottom>
            Status: <StatusChip label={selectedOrder?.status} status={selectedOrder?.status} size="small" />
          </Typography>
          <Typography variant="subtitle2" gutterBottom>
            Payment: 
            <Chip 
              label = {selectedOrder?.status == 'pending' ? "Unpaid" : "Paid"} 
              color={selectedOrder?.status == 'pending' ? "error" : "success"} 
              size="small"
              sx={{ ml: 1 }}
            />
          </Typography>
          <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
            Items:
          </Typography>
          <List disablePadding>
            <ListItem disablePadding>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={3}>
                  <Image
                    src={selectedOrder?.product.images[0].image_url || '/placeholder.svg'}
                    alt={selectedOrder?.product.name}
                    width={60}
                    height={60}
                    layout="responsive"
                  />
                </Grid>
                <Grid item xs={9}>
                  <ListItemText
                    primary={selectedOrder?.product.name}
                    secondary={`Qty: ${selectedOrder?.total_amount/selectedOrder?.product.price} - Price: ₳${selectedOrder?.product.price}`}
                  />
                </Grid>
              </Grid>
            </ListItem>
          </List>
          <Typography variant="h6" sx={{ mt: 2 }}>
            Total: ₳{selectedOrder?.total_amount}
          </Typography>
          {selectedOrder?.status === 'pending' && (
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
              onClick={() => handleConfirmPayment()}
            >
              Confirm Payment
            </Button>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetails}>Close</Button>
        </DialogActions>
      </Dialog>
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
    </Box>
  );
};

export default OrderPage;