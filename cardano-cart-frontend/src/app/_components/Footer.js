import React from "react";
import { Box, Button, Container, Grid, Typography } from "@mui/material";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#000679",
        color: "white",
        py: { xs: 3, sm: 4, md: 6 },
      }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" gutterBottom>
              Cardano Cart
            </Typography>
            <Typography variant="body2">
              Revolutionizing e-commerce with Cardano blockchain technology.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap" }}>
              {["Home", "Shop", "About Us", "Contact"].map((link) => (
                <Button key={link} color="inherit" sx={{ mr: 2, mb: 1 }}>
                  {link}
                </Button>
              ))}
            </Box>
          </Grid>
        </Grid>
        <Box mt={3}>
          <Typography variant="body2" align="center">
            © {new Date().getFullYear()} Cardano Cart. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
