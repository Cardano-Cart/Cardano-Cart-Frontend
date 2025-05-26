"use client"
import { useState } from "react"
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  Paper,
  Popper,
  Grid,
  Button
} from "@mui/material"
import CategoryIcon from "@mui/icons-material/Category"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"

// Define categories with subcategories
const categories = [
  {
    name: "Electronics",
    hasSubmenu: true,
    subcategories: [
      ["Laptops", "Desktops", "Monitors", "Computer Accessories", "Cameras"],
      ["TVs", "Audio", "Gaming", "Wearables", "Smart Home"]
    ],
    promoTitle: "ELECTRONICS",
    promoDiscount: "30%",
    promoAction: "SHOP NOW!"
  },
  { name: "Phones & Tablets", hasSubmenu: false },
  {
    name: "Fashion",
    hasSubmenu: true,
    subcategories: [
      ["Men's Clothing", "Women's Clothing", "Kids' Clothing", "Shoes"],
      ["Watches", "Jewelry", "Bags", "Accessories"]
    ],
    promoTitle: "FASHION",
    promoDiscount: "50%",
    promoAction: "SHOP NOW!"
  },
  { name: "Health & Beauty", hasSubmenu: false },
  {
    name: "Home & Kitchen",
    hasSubmenu: true,
    subcategories: [
      ["Furniture", "Bedding", "Bath", "Kitchen Appliances"],
      ["Cookware", "Dining", "Storage", "Decor"]
    ],
    promoTitle: "HOME ESSENTIALS",
    promoDiscount: "40%",
    promoAction: "SHOP NOW!"
  },
  { name: "Groceries", hasSubmenu: false },
  {
    name: "Sports & Outdoors",
    hasSubmenu: true,
    subcategories: [
      ["Exercise Equipment", "Team Sports", "Outdoor Recreation", "Camping"],
      ["Fishing", "Cycling", "Water Sports", "Hiking"]
    ],
    promoTitle: "SPORTS GEAR",
    promoDiscount: "25%",
    promoAction: "SHOP NOW!"
  },
  { name: "Baby Products", hasSubmenu: false }
]

export default function Sidebar() {
  const [anchorEl, setAnchorEl] = useState(null)
  const [openCategory, setOpenCategory] = useState(null)

  const handlePopoverOpen = (event, index) => {
    if (categories[index].hasSubmenu) {
      setAnchorEl(event.currentTarget)
      setOpenCategory(index)
    }
  }

  const handlePopoverClose = () => {
    setAnchorEl(null)
    setOpenCategory(null)
  }

  return (
    <Paper
      elevation={1}
      sx={{
        bgcolor: "background.paper",
        borderRadius: 2,
        p: 2,
        height: "90%",
        position: "relative",
        zIndex: 1,
        display: { xs: "none", md: "block" },
      }}
      
    >
      {/* Categories Header with blue background and white text */}
      <Box
        sx={{
          bgcolor: "primary.main",
          color: "white",
          p: 1.5,
          borderRadius: 1,
          mb: 2,
          display: "flex",
          alignItems: "center",
          gap: 1
        }}
      >
        <CategoryIcon fontSize="small" />
        <Typography variant="subtitle1" fontWeight="medium">
          CATEGORIES
        </Typography>
      </Box>

      <List sx={{ p: 0 }}>
        {categories.map((category, index) => (
          <ListItem
            key={index}
            disablePadding
            sx={{
              borderBottom:
                index < categories.length - 1
                  ? "1px solid rgba(0, 0, 0, 0.06)"
                  : "none",
              py: 0.5
            }}
            onMouseEnter={e => handlePopoverOpen(e, index)}
            onMouseLeave={handlePopoverClose}
          >
            <ListItemButton sx={{ borderRadius: 1 }}>
              <ListItemText
                primary={
                  <Typography
                    variant="body1"
                    color={
                      openCategory === index ? "primary.main" : "text.secondary"
                    }
                    sx={{ fontWeight: 500 }}
                  >
                    {category.name}
                  </Typography>
                }
              />
              {category.hasSubmenu && <ChevronRightIcon color="action" />}
            </ListItemButton>

            {/* Submenu Popper */}
            {category.hasSubmenu && (
              <Popper
                open={openCategory === index}
                anchorEl={anchorEl}
                placement="right-start"
                sx={{ zIndex: 1200 }}
                modifiers={[
                  {
                    name: "offset",
                    options: {
                      offset: [0, 0]
                    }
                  }
                ]}
              >
                <Paper
                  elevation={3}
                  sx={{
                    width: 800,
                    p: 3,
                    borderRadius: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2
                  }}
                  onMouseEnter={() => setOpenCategory(index)}
                  onMouseLeave={handlePopoverClose}
                >
                  {/* Submenu Header */}
                  <Box
                    sx={{
                      bgcolor: "primary.main",
                      color: "white",
                      p: 2,
                      borderRadius: 1,
                      mb: 1
                    }}
                  >
                    <Typography variant="h6">{category.name}</Typography>
                  </Box>

                  {/* Submenu Content */}
                  <Box sx={{ display: "flex", gap: 4 }}>
                    {/* Left side - Subcategories */}
                    <Box sx={{ flex: 2 }}>
                      <Grid container spacing={2}>
                        {category.subcategories?.map((column, colIndex) => (
                          <Grid item xs={6} key={colIndex}>
                            {column.map((subcat, subcatIndex) => (
                              <Typography
                                key={subcatIndex}
                                variant="body1"
                                sx={{
                                  py: 1.5,
                                  borderBottom: "1px solid rgba(0,0,0,0.06)",
                                  color: "text.secondary",
                                  "&:hover": {
                                    color: "primary.main",
                                    cursor: "pointer"
                                  }
                                }}
                              >
                                {subcat}
                              </Typography>
                            ))}
                          </Grid>
                        ))}
                      </Grid>
                    </Box>

                    {/* Right side - Promo Banner */}
                    {category.promoTitle && (
                      <Box
                        sx={{
                          flex: 1,
                          backgroundImage:
                            "url(/images/electronic.jpg)",
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          borderRadius: 1,
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                          p: 2,
                          position: "relative",
                          "&::before": {
                            content: '""',
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: "rgba(0,0,0,0.4)",
                            borderRadius: 1
                          }
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{
                            color: "white",
                            textAlign: "center",
                            fontWeight: "bold",
                            position: "relative",
                            zIndex: 1
                          }}
                        >
                          {category.promoTitle}
                        </Typography>
                        <Typography
                          variant="h2"
                          sx={{
                            color: "white",
                            textAlign: "center",
                            fontWeight: "bold",
                            position: "relative",
                            zIndex: 1
                          }}
                        >
                          {category.promoDiscount}
                        </Typography>
                        <Typography
                          variant="h3"
                          sx={{
                            color: "white",
                            textAlign: "center",
                            fontWeight: "bold",
                            mb: 2,
                            position: "relative",
                            zIndex: 1
                          }}
                        >
                          OFF
                        </Typography>
                        <Button
                          variant="contained"
                          sx={{
                            position: "relative",
                            zIndex: 1
                          }}
                        >
                          {category.promoAction || "SHOP NOW!"}
                        </Button>
                      </Box>
                    )}
                  </Box>
                </Paper>
              </Popper>
            )}
          </ListItem>
        ))}
      </List>
    </Paper>
  )
}
