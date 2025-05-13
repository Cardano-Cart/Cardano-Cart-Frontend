import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Fade, Grow, Slide, Zoom, useMediaQuery, useTheme } from '@mui/material';

const ProductShowcase = () => {
  const [loaded, setLoaded] = useState(false);
  const theme = useTheme();
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Trigger animations after component mounts
  useEffect(() => {
    setLoaded(true);
    const updateTime = () => {
      const now = new Date();
      
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
      setCurrentDate(now.toLocaleDateString(undefined, options));
      setCurrentTime(`${hours}:${minutes}:${seconds}`);
    };
    updateTime(); // Initialize immediately
    const timer = setInterval(updateTime, 1000);

    return () => clearInterval(timer);
  }, []);

  const hoverZoomStyle = {
    transition: 'transform 0.3s ease-in-out',
    '&:hover': {
      transform: 'scale(1.01)',
      zIndex: 1, // Ensure zoomed box appears above others
      boxShadow: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)'
    }
  };

  return (
    <Box sx={{ 
      display: 'grid', 
      gap: '36px', 
      padding: '8px',
      paddingLeft: '16px',
      width: '100%', 
      // Responsive grid layout - changes to 1 column on mobile
      gridTemplateColumns: {
        xs: '1fr',           // 1 column on extra small screens
        sm: '1fr',           // 1 column on small screens
        md: '1fr 1fr 1fr',   // 3 columns on medium and larger screens
      },
      gridAutoRows: 'minmax(300px, auto)',
      height: '100%'
    }}>
      {/* Smart Mini Fan */}
      <Box 
        sx={{ 
          // Responsive grid positioning
          gridColumn: {
            xs: '1 / 2',     // Full width on mobile
            md: '1 / 2'      // Original position on desktop
          },
          gridRow: {
            xs: '1 / 2',     // Single row on mobile
            md: '1 / 3'      // Original position on desktop
          },
          bgcolor: '#1e1e1e', 
          color: 'white', 
          borderRadius: 2,
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          position: 'relative',
          backgroundImage: `url(/images/watch1.jpg)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          ...hoverZoomStyle
        }}
      >
        <Slide direction="down" in={loaded} timeout={800}>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
          Stay Ahead of Time with Sleek Smart Precision
          </Typography>
        </Slide>
        <Typography variant="h6" sx={{ mb: 2, letterSpacing: '2px' }}>
        {currentTime}
      </Typography>
      <Typography variant="body1" sx={{ mb: 2, opacity: 0.8 }}>
        {currentDate}
      </Typography>
        <Zoom in={loaded} style={{ transitionDelay: loaded ? '500ms' : '0ms' }}>
          <Button 
            variant="contained" 
            sx={{ 
              bgcolor: 'white', 
              color: 'black',
              '&:hover': { bgcolor: '#e0e0e0' },
              position: 'absolute',
              top: '40%'
            }}
          >
            Buy Now
          </Button>
        </Zoom>
      </Box>

      {/* Merch */}
      <Box 
        sx={{ 
          // Responsive grid positioning
          gridColumn: {
            xs: '1 / 2',     // Full width on mobile
            md: '2 / 4'      // Original position on desktop
          },
          gridRow: {
            xs: '2 / 3',     // Second row on mobile
            md: '1 / 2'      // Original position on desktop
          },
          bgcolor: '#1a237e', 
          color: 'white', 
          borderRadius: 2,
          p: 3,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-end',
          alignItems: 'center',
          backgroundImage: `url(/images/ProjectCatalyst1.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          ...hoverZoomStyle
        }}
      >
        <Box sx={{ 
          textAlign: { xs: 'center', md: 'right' }, 
          maxWidth: { xs: '100%', md: '45%' },
          width: { xs: '100%', md: 'auto' }
        }}>
          <Fade in={loaded} timeout={1000}>
            <Typography variant="subtitle1" sx={{ color: 'gold' }}>
            PROJECT CATALYST MERCH
            </Typography>
          </Fade>
          <Fade 
            in={loaded} 
            timeout={1200}
            style={{ transitionDelay: loaded ? '200ms' : '0ms' }}
          >
            <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold' }}>
            Wear the Vision, Support Innovation
            </Typography>
          </Fade>
          <Fade 
            in={loaded} 
            timeout={1400}
            style={{ transitionDelay: loaded ? '400ms' : '0ms' }}
          >
            <Button 
              variant="outlined" 
              sx={{ 
                mt: 2, 
                borderColor: 'white', 
                color: 'white',
                '&:hover': { borderColor: '#e0e0e0', bgcolor: 'rgba(255,255,255,0.1)' } 
              }}
            >
              Buy Now
            </Button>
          </Fade>
        </Box>
      </Box>
      
      {/* CC Camera */}
      <Box 
        sx={{ 
          // Responsive grid positioning
          gridColumn: {
            xs: '1 / 2',     // Full width on mobile
            md: '2 / 3'      // Original position on desktop
          },
          gridRow: {
            xs: '3 / 4',     // Third row on mobile
            md: '2 / 3'      // Original position on desktop
          },
          bgcolor: '#1e1e1e', 
          color: 'white', 
          borderRadius: 2,
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundImage: `url(/images/Headset.jpg)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          ...hoverZoomStyle
        }}
      >
        <Grow 
          in={loaded} 
          timeout={800}
          style={{ transformOrigin: 'center right' }}
        >
          <Typography variant="subtitle1" sx={{ 
            color: 'white', 
            alignSelf: { xs: 'center', md: 'flex-end' }
          }}>
            NEW ARRIVALS
          </Typography>
        </Grow>
        <Grow 
          in={loaded} 
          timeout={1000}
          style={{ transitionDelay: loaded ? '200ms' : '0ms' }}
        >
          <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
            CC Camera
          </Typography>
        </Grow>
        <Zoom 
          in={loaded} 
          timeout={1200}
          style={{ transitionDelay: loaded ? '400ms' : '0ms' }}
        >
          <Button 
            variant="contained" 
            sx={{ 
              bgcolor: 'white', 
              color: 'black',
              '&:hover': { bgcolor: '#e0e0e0' },
              position: 'absolute',
              bottom: '20%',
              left: '50%',
              transform: 'translateX(-50%)'
            }}
          >
            Buy Now
          </Button>
        </Zoom>
      </Box>

      {/* New Camera Collections */}
      <Box 
        sx={{ 
          // Responsive grid positioning
          gridColumn: {
            xs: '1 / 2',     // Full width on mobile
            md: '3 / 4'      // Original position on desktop
          },
          gridRow: {
            xs: '4 / 5',     // Fourth row on mobile
            md: '2 / 3'      // Original position on desktop
          },
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          color: 'white', 
          borderRadius: 2,
          p: 3,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          backgroundImage: `url(/images/VR1.jpg)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          ...hoverZoomStyle
        }}
      >
        <Box sx={{ 
          maxWidth: { xs: '100%', md: '60%' },
          width: { xs: '100%', md: 'auto' },
          textAlign: { xs: 'center', md: 'left' }
        }}>
          <Slide direction="right" in={loaded} timeout={800}>
            <Typography variant="subtitle1">
              START FROM $899
            </Typography>
          </Slide>
          <Slide 
            direction="right" 
            in={loaded} 
            timeout={1000}
            style={{ transitionDelay: loaded ? '200ms' : '0ms' }}
          >
            <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
              New Camera collections
            </Typography>
          </Slide>
          <Slide 
            direction="right" 
            in={loaded} 
            timeout={1200}
            style={{ transitionDelay: loaded ? '400ms' : '0ms' }}
          >
            <Button 
              variant="outlined" 
              sx={{ 
                mt: 2, 
                borderColor: 'white', 
                color: 'white',
                '&:hover': { borderColor: '#e0e0e0', bgcolor: 'rgba(255,255,255,0.1)' } 
              }}
            >
              Buy Now
            </Button>
          </Slide>
        </Box>
      </Box>
    </Box>
  );
};

export default ProductShowcase;