import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Button,
  Box,
  Divider,
} from '@mui/material';
import { Close, Delete } from '@mui/icons-material';
import { useCart } from "react-use-cart";
import Link from 'next/link';

const CartDrawer = ({ open, onClose }) => {
  const { items, removeItem, cartTotal, emptyCart, updateItemQuantity } = useCart();

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 450, p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Your Cart</Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
        {items.length === 0 ? (
          <Typography>Your cart is empty</Typography>
        ) : (
          <>
            <List>
              {items.map((item) => (
                <ListItem key={item.id} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{ width: 50, height: 50, marginRight: 16 }} 
                    />
                    <ListItemText
                      primary={item.name}
                      secondary={`₳${item.price} each`}
                    />
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      borderRadius: '16px',
                      border: '1px solid #ccc',
                      padding: '4px',
                      marginTop: 1, 
                      minWidth: '120px',
                      justifyContent: 'space-between', 
                    }}
                  >
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1} 
                      sx={{ borderTopLeftRadius: '16px', borderBottomLeftRadius: '16px' }}
                    >
                      -
                    </Button>
                    <Typography
                      variant="body1"
                      sx={{ mx: 1, textAlign: 'center', flexGrow: 1 }} 
                    >
                      {item.quantity}
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                      sx={{ borderTopRightRadius: '16px', borderBottomRightRadius: '16px' }}
                    >
                      +
                    </Button>
                  </Box>
                  <ListItemSecondaryAction>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                      <IconButton edge="end" aria-label="delete" onClick={() => removeItem(item.id)} size="small" sx={{ mt: 1 }}>
                        <Delete />
                      </IconButton>
                      <Link href={`/checkout/${item.id}`} passHref>
                        <Button
                          variant="outlined"
                          color="primary"
                          size="small"
                          onClick={onClose}
                          sx={{ mt: 1 }}
                        >
                          Checkout
                        </Button>
                      </Link>
                    </Box>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              Total: ₳{cartTotal.toFixed(2)}
            </Typography>
            <Button variant="outlined" color="secondary" onClick={emptyCart} sx={{ mb: 2 }}>
              Clear Cart
            </Button>
            <Link href="/cart" passHref>
              <Button variant="outlined" fullWidth sx={{ mb: 2 }} onClick={onClose}>
                View Full Cart
              </Button>
            </Link>
          </>
        )}
      </Box>
    </Drawer>
  );
};

export default CartDrawer;
