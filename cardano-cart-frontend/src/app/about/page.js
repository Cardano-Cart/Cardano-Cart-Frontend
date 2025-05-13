'use client';

import React, { useState, useRef,useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Button,
  useTheme,
  useMediaQuery,
  Fade,
  Grow,
  IconButton,
  Dialog,
  DialogContent,
} from '@mui/material';
import { ShoppingCart, Wallet, Lock, Speed, PlayArrowOutlined, Close } from '@mui/icons-material';
import Header from '../_components/Header';

import createGlobe from "cobe";

import { useSpring } from 'react-spring';


const AboutPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const videoRef = useRef(null);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  function Cobe() {
    const canvasRef = useRef();
    const pointerInteracting = useRef(null);
    const pointerInteractionMovement = useRef(0);
    const [{ r }, api] = useSpring(() => ({
      r: 0,
      config: {
        mass: 1,
        tension: 280,
        friction: 40,
        precision: 0.001,
      },
    }));
    useEffect(() => {
      let phi = 0;
      let width = 0;
      const onResize = () => canvasRef.current && (width = canvasRef.current.offsetWidth)
      window.addEventListener('resize', onResize)
      onResize()
      const globe = createGlobe(canvasRef.current, {
        devicePixelRatio: 2,
        width: width * 2,
        height: width * 2,
        phi: 0,
        theta: 0.3,
        dark: 0,
        diffuse: 3,
        mapSamples: 50000,
        mapBrightness: 6,
        baseColor: [1, 1, 1.1],
        markerColor: [0, 0, 0.5],
        glowColor: [1, 1, 1],
        markers: [
          // longitude latitude
          { location: [37.7595, -122.4367], size: 0.03 },
          { location: [40.7128, -74.006], size: 0.1 }
        ],
        onRender: (state) => {
          // This prevents rotation while dragging
          if (!pointerInteracting.current) {
            // Called on every animation frame.
            // `state` will be an empty object, return updated params.
            phi += 0.005
          } 
          state.phi = phi + r.get()
          state.width = width * 2
          state.height = width * 2
        }
      })
      setTimeout(() => canvasRef.current.style.opacity = '1')
      return () => { 
        globe.destroy();
        window.removeEventListener('resize', onResize);
      }
    }, [])
    return <div style={{
      width: '100%',
      maxWidth: 600,
      aspectRatio: 1,
      margin: 'auto',
      position: 'relative',
    }}>
      <canvas
        ref={canvasRef}
        onPointerDown={(e) => {
          pointerInteracting.current =
            e.clientX - pointerInteractionMovement.current;
          canvasRef.current.style.cursor = 'grabbing';
        }}
        onPointerUp={() => {
          pointerInteracting.current = null;
          canvasRef.current.style.cursor = 'grab';
        }}
        onPointerOut={() => {
          pointerInteracting.current = null;
          canvasRef.current.style.cursor = 'grab';
        }}
        onMouseMove={(e) => {
          if (pointerInteracting.current !== null) {
            const delta = e.clientX - pointerInteracting.current;
            pointerInteractionMovement.current = delta;
            api.start({
              r: delta / 200,
            });
          }
        }}
        onTouchMove={(e) => {
          if (pointerInteracting.current !== null && e.touches[0]) {
            const delta = e.touches[0].clientX - pointerInteracting.current;
            pointerInteractionMovement.current = delta;
            api.start({
              r: delta / 100,
            });
          }
        }}
        style={{
          width: '100%',
          height: '100%',
          cursor: 'grab',
          contain: 'layout paint size',
          opacity: 0,
          transition: 'opacity 1s ease',
        }}
      />
    </div>
  }

  const handleVideoClick = () => {
    setIsVideoOpen(true);
  };

  const handleCloseVideo = () => {
    setIsVideoOpen(false);
  };

  return (
    <Box sx={{ flexGrow: 1}}>
      <Header/>
      <Container maxWidth="lg">
        <Fade in={true} timeout={1000}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.primary.main, fontSize: '2.5rem', letterSpacing: '-0.5px', my:4 }}>
              About Cardano Cart
            </Typography>
            <Typography variant="h5" color="text.secondary" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.6 }}>
              Revolutionizing E-commerce with Blockchain Technology
            </Typography>
          </Box>
        </Fade>

        <Grow in={true} timeout={1500}>
          <Paper sx={{ p: 4, borderRadius: 2, overflow: 'hidden', mb: 6 }}>
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    position: 'relative',
                    height: 0,
                    paddingTop: '56.25%', // 16:9 aspect ratio
                    borderRadius: 2,
                    overflow: 'hidden',
                    cursor: 'pointer',
                  }}
                  onClick={handleVideoClick}
                >
                  <video
                    ref={videoRef}
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  >
                    <source src="/video/Cardano Cart.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  <IconButton
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      backgroundColor: 'rgba(255, 255, 255, 0.7)',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      },
                    }}
                  >
                    <PlayArrowOutlined fontSize="large" />
                  </IconButton>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h3" component="h2" gutterBottom sx={{ fontSize: '2rem' }}>
                  Our Mission
                </Typography>
                <Typography variant="body1" paragraph sx={{ fontSize: '0.9rem' }}>
                  At Cardano Cart, we are on a mission to transform the e-commerce landscape by leveraging the power of blockchain technology. We believe in creating a secure, transparent, and efficient shopping experience for our customers while empowering merchants with cutting-edge tools.
                </Typography>
                <Typography variant="body1" paragraph sx={{ fontSize: '0.9rem' }}>
                  By utilizing the Cardano blockchain, we offer unparalleled security, faster transactions, and comaparatively lower fees compared to traditional payment methods.
                </Typography>
                <Button variant="outlined" color="primary" size="large" href="/shop" sx={{ mt: 2, fontSize: '0.9rem', borderRadius: '8px' }}>
                  Learn More
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grow>
        <Cobe/>

        <Typography variant="h4" align="center" gutterBottom sx={{ mb: 4, color: theme.palette.primary.main, fontWeight: 'bold', fontSize: '1.8rem' }}>
          Why Choose Cardano Cart?
        </Typography>

        <Grid container spacing={4}>
          {[
            {
              icon: <ShoppingCart fontSize="large" />,
              title: 'Seamless Shopping',
              description: 'Enjoy a smooth and intuitive shopping experience with our user-friendly interface.',
            },
            {
              icon: <Wallet fontSize="large" />,
              title: 'Cardano Integration',
              description: 'Harness the power of ADA for fast, secure, and cost-effective transactions.',
            },
            {
              icon: <Lock fontSize="large" />,
              title: 'Enhanced Security',
              description: 'Benefit from the robust security features of blockchain technology.',
            },
            {
              icon: <Speed fontSize="large" />,
              title: 'Lightning-Fast',
              description: 'Experience quick transaction confirmations and speedy order processing.',
            },
          ].map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Grow in={true} timeout={1500 + index * 500}>
                <Paper
                  sx={{
                    p: 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    borderRadius: '16px',
                    border: '1px solid rgba(0, 0, 0, 0.12)',
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                    },
                  }}
                >
                  <Box sx={{ mb: 2, color: theme.palette.primary.main }}>{feature.icon}</Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                    {feature.description}
                  </Typography>
                </Paper>
              </Grow>
            </Grid>
          ))}
        </Grid>

        <Fade in={true} timeout={2500}>
          <Box sx={{ mt: 8, textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom sx={{ color: theme.palette.primary.main, fontWeight: 'bold', fontSize: '1.8rem' }}>
              Ready to Experience the Future of E-commerce?
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              href="/shop"
              sx={{
                mt: 2,
                px: 4,
                py: 1.5,
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: 'bold',
                transition: 'background-color 0.3s ease-in-out',
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark,
                },
              }}
            >
              Start Shopping Now
            </Button>
          </Box>
        </Fade>
      </Container>

      <Dialog
        open={isVideoOpen}
        onClose={handleCloseVideo}
        maxWidth="md"
        fullWidth
        TransitionProps={{
          timeout: 500,
        }}
        PaperProps={{
          style: {
            backgroundColor: 'transparent',
            boxShadow: 'none',
            overflow: 'hidden',
          },
        }}
      >
        <DialogContent
          sx={{
            p: 0,
            position: 'relative',
            overflow: 'hidden',
            '&:before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              transition: 'opacity 0.5s ease',
              opacity: isVideoOpen ? 1 : 0,
            },
          }}
        >
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              height: 0,
              paddingTop: '56.25%',
              overflow: 'hidden',
              transition: 'transform 0.5s ease',
              transform: isVideoOpen ? 'scale(1)' : 'scale(0.5)',
            }}
          >
            <IconButton
              onClick={handleCloseVideo}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: 'white',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                zIndex: 1,
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                },
              }}
            >
              <Close />
            </IconButton>
            <video
              autoPlay
              controls
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            >
              <source src="/video/Cardano Cart.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default AboutPage;