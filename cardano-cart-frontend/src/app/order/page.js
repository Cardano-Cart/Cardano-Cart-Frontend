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
} from '@mui/material';
import Image from 'next/image';
import { styled } from '@mui/material/styles';
import Header from '../_components/Header';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
}));

const StatusChip = styled(Chip)(({ theme, status }) => ({
  backgroundColor: 
    status === 'Delivered' ? theme.palette.success.main :
    status === 'Processing' ? theme.palette.warning.main :
    status === 'Shipped' ? theme.palette.info.main :
    theme.palette.grey[500],
  color: theme.palette.common.white,
}));

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const storedOrders = localStorage.getItem('orders');
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders));
    }
  }, []);

  const handleOpenDetails = (order) => {
    setSelectedOrder(order);
  };

  const handleCloseDetails = () => {
    setSelectedOrder(null);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Header />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Your Orders
        </Typography>
        {orders.length === 0 ? (
          <Typography variant="body1">You have no orders yet.</Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="orders table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Order ID</StyledTableCell>
                  <StyledTableCell align="right">Date</StyledTableCell>
                  <StyledTableCell align="right">Total</StyledTableCell>
                  <StyledTableCell align="center">Status</StyledTableCell>
                  <StyledTableCell align="center">Actions</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell component="th" scope="row">
                      {order.id}
                    </TableCell>
                    <TableCell align="right">{order.date}</TableCell>
                    <TableCell align="right">₳{order.total.toFixed(2)}</TableCell>
                    <TableCell align="center">
                      <StatusChip label={order.status} status={order.status} />
                    </TableCell>
                    <TableCell align="center">
                      <Button variant="outlined" onClick={() => handleOpenDetails(order)}>
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>

      <Dialog open={Boolean(selectedOrder)} onClose={handleCloseDetails} maxWidth="md" fullWidth>
        <DialogTitle>Order Details - #{selectedOrder?.id}</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1" gutterBottom>
            Date: {selectedOrder?.date}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Status: <StatusChip label={selectedOrder?.status} status={selectedOrder?.status} />
          </Typography>
          <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
            Items:
          </Typography>
          <List>
            <ListItem disablePadding>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={3}>
                  <Image
                    src={selectedOrder?.product.image || '/placeholder.svg'}
                    alt={selectedOrder?.product.name}
                    width={80}
                    height={80}
                    layout="responsive"
                  />
                </Grid>
                <Grid item xs={9}>
                  <ListItemText
                    primary={selectedOrder?.product.name}
                    secondary={`Quantity: ${selectedOrder?.quantity} - Price: ₳${selectedOrder?.product.price.toFixed(2)}`}
                  />
                </Grid>
              </Grid>
            </ListItem>
          </List>
          <Typography variant="h6" sx={{ mt: 2 }}>
            Total: ₳{selectedOrder?.total.toFixed(2)}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetails}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OrderPage;