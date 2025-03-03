// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#000679', 
    },
    secondary: {
      main: '#000062',
    },
    text: {
      primary: '#333333', 
      secondary: '#757575', 
    },
    error: {
      main: '#f44336', 
    },
    unpaid:{
      main: '#6a6c6d'
    },
    
  },
  typography: {
    fontFamily: 'Poppins, Arial, sans-serif', 
  },
});

export default theme;
