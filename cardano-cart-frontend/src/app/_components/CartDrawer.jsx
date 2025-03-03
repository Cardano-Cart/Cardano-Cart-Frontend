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
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Close, Delete } from '@mui/icons-material';
import { useCart } from "react-use-cart";
import Link from 'next/link';

const CartDrawer = ({ open, onClose }) => {
  const { items, removeItem, cartTotal, emptyCart, updateItemQuantity } = useCart();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Drawer 
      anchor="right" 
      open={open} 
      onClose={onClose}
      PaperProps={{
        sx: {
          width: isMobile ? '100%' : 350,
        },
      }}
    >
      <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
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
            <List sx={{ flexGrow: 1, overflowY: 'auto' }}>
              {items.map((item) => (
                <ListItem key={item.id} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{ width: 50, height: 50, marginRight: 16, objectFit: 'cover' }} 
                    />
                    <ListItemText
                      primary={item.name}
                      secondary={`₳${item.price} each`}
                      primaryTypographyProps={{ variant: 'body2' }}
                      secondaryTypographyProps={{ variant: 'caption' }}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', mt: 1 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        borderRadius: '16px',
                        border: '1px solid #ccc',
                        padding: '4px',
                        minWidth: '100px',
                      }}
                    >
                      <Button
                        variant="text"
                        size="small"
                        onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1} 
                      >
                        -
                      </Button>
                      <Typography variant="body2" sx={{ mx: 1, textAlign: 'center', flexGrow: 1 }}>
                        {item.quantity}
                      </Typography>
                      <Button
                        variant="text"
                        size="small"
                        onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </Button>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <IconButton edge="end" aria-label="delete" onClick={() => removeItem(item.id)} size="small">
                        <Delete />
                      </IconButton>
                      <Link href={`/checkout/${item.id}`} passHref>
                        <Button
                          variant="outlined"
                          color="primary"
                          size="small"
                          onClick={onClose}
                          sx={{ ml: 1 }}
                        >
                          Checkout
                        </Button>
                      </Link>
                    </Box>
                  </Box>
                </ListItem>
              ))}
            </List>
            <Box sx={{ mt: 'auto' }}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                Total: ₳{cartTotal.toFixed(2)}
              </Typography>
              <Button variant="outlined" color="secondary" onClick={emptyCart} sx={{ mb: 2, width: '100%' }}>
                Clear Cart
              </Button>
              <Link href="/cart" passHref style={{ width: '100%' }}>
                <Button variant="contained" fullWidth onClick={onClose}>
                  View Full Cart
                </Button>
              </Link>
            </Box>
          </>
        )}
      </Box>
    </Drawer>
  );
};

export default CartDrawer;