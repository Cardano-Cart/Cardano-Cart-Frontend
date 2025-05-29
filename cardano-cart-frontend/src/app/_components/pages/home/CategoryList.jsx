"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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
  Button,
} from "@mui/material"
import CategoryIcon from "@mui/icons-material/Category"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import CachedIcon from "@mui/icons-material/Cached"

// Mock data to show immediately - first 10 categories only
const mockCategories = [
  {
    id: 1,
    name: "Electronics",
    hasSubmenu: true,
    subcategories: [
      ["Laptops", "Desktops", "Monitors", "Computer Accessories"],
      ["TVs", "Audio", "Gaming", "Wearables"],
    ],
    promoTitle: "ELECTRONICS",
    promoDiscount: "30%",
    promoAction: "SHOP NOW!",
  },
  {
    id: 2,
    name: "Phones & Tablets",
    hasSubmenu: true,
    subcategories: [
      ["Mobile Phones", "Tablets"],
      ["Smart Watches & Trackers", "Phone Accessories"],
    ],
    promoTitle: "PHONES & TABLETS",
    promoDiscount: "25%",
    promoAction: "SHOP NOW!",
  },
  {
    id: 3,
    name: "Fashion",
    hasSubmenu: true,
    subcategories: [
      ["Men's Clothing", "Women's Clothing", "Kids' Clothing"],
      ["Watches", "Jewelry", "Bags"],
    ],
    promoTitle: "FASHION",
    promoDiscount: "50%",
    promoAction: "SHOP NOW!",
  },
  {
    id: 4,
    name: "Health & Beauty",
    hasSubmenu: true,
    subcategories: [
      ["Skincare", "Vitamins & Supplements"],
      ["Bath & Body", "Fragrances"],
    ],
    promoTitle: "HEALTH & BEAUTY",
    promoDiscount: "40%",
    promoAction: "SHOP NOW!",
  },
  {
    id: 5,
    name: "Home & Kitchen",
    hasSubmenu: true,
    subcategories: [
      ["Furniture", "Bedding", "Bath"],
      ["Kitchen Appliances", "Cookware", "Dining"],
    ],
    promoTitle: "HOME ESSENTIALS",
    promoDiscount: "35%",
    promoAction: "SHOP NOW!",
  },
  {
    id: 6,
    name: "Sport & Outdoors",
    hasSubmenu: true,
    subcategories: [
      ["Exercise Equipment", "Team Sports"],
      ["Outdoor Recreation", "Camping"],
    ],
    promoTitle: "SPORTS GEAR",
    promoDiscount: "25%",
    promoAction: "SHOP NOW!",
  },
  {
    id: 7,
    name: "Groceries",
    hasSubmenu: true,
    subcategories: [
      ["Fresh Produce", "Dairy & Eggs"],
      ["Pantry Staples", "Beverages"],
    ],
    promoTitle: "GROCERIES",
    promoDiscount: "20%",
    promoAction: "SHOP NOW!",
  },
  {
    id: 8,
    name: "Baby Products",
    hasSubmenu: true,
    subcategories: [
      ["Baby Care", "Feeding"],
      ["Toys", "Clothing"],
    ],
    promoTitle: "BABY PRODUCTS",
    promoDiscount: "30%",
    promoAction: "SHOP NOW!",
  },
  {
    id: 9,
    name: "Books & Media",
    hasSubmenu: true,
    subcategories: [
      ["Books", "E-books"],
      ["Movies", "Music"],
    ],
    promoTitle: "BOOKS & MEDIA",
    promoDiscount: "40%",
    promoAction: "SHOP NOW!",
  },
  {
    id: 10,
    name: "Automotive",
    hasSubmenu: true,
    subcategories: [
      ["Car Parts", "Tools"],
      ["Accessories", "Maintenance"],
    ],
    promoTitle: "AUTOMOTIVE",
    promoDiscount: "15%",
    promoAction: "SHOP NOW!",
  },
]

const CACHE_KEY = "categories_cache"
const CACHE_EXPIRY_KEY = "categories_cache_expiry"
const CACHE_DURATION = 30 * 60 * 1000 // 30 minutes in milliseconds

export default function ApiSidebar() {
  const router = useRouter()
  const [categories, setCategories] = useState(mockCategories)
  const [isLoadingFresh, setIsLoadingFresh] = useState(false)
  const [isUsingCache, setIsUsingCache] = useState(false)
  const [isUsingMockData, setIsUsingMockData] = useState(true)
  const [error, setError] = useState(null)
  const [anchorEl, setAnchorEl] = useState(null)
  const [openCategory, setOpenCategory] = useState(null)

  // Check if cache is valid
  const isCacheValid = () => {
    const cacheExpiry = localStorage.getItem(CACHE_EXPIRY_KEY)
    if (!cacheExpiry) return false
    return new Date().getTime() < Number.parseInt(cacheExpiry)
  }

  // Get cached data
  const getCachedData = () => {
    try {
      const cached = localStorage.getItem(CACHE_KEY)
      return cached ? JSON.parse(cached) : null
    } catch (error) {
      console.error("Error reading cache:", error)
      return null
    }
  }

  // Save data to cache
  const setCachedData = (data) => {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(data))
      localStorage.setItem(CACHE_EXPIRY_KEY, (new Date().getTime() + CACHE_DURATION).toString())
    } catch (error) {
      console.error("Error saving to cache:", error)
    }
  }

  // Process API data to match component structure - limit to first 10 categories
  const processApiData = (data) => {
    const categoryMap = new Map()

    data.forEach((item) => {
      const categoryId = item.category.id
      const categoryName = item.category.name

      if (!categoryMap.has(categoryId)) {
        categoryMap.set(categoryId, {
          id: categoryId,
          name: categoryName,
          hasSubmenu: true,
          subcategories: [[], []],
          promoTitle: categoryName.toUpperCase(),
          promoDiscount: "30%",
          promoAction: "SHOP NOW!",
        })
      }

      const category = categoryMap.get(categoryId)

      // Distribute subcategories across two columns
      const columnIndex = category.subcategories[0].length <= category.subcategories[1].length ? 0 : 1
      category.subcategories[columnIndex].push(item.name)
    })

    // Convert to array, sort by ID, and limit to first 10 categories
    const allCategories = Array.from(categoryMap.values()).sort((a, b) => a.id - b.id)
    return allCategories.slice(0, 10)
  }

  // Fetch fresh data from API
  const fetchFreshData = async () => {
    try {
      setIsLoadingFresh(true)
      setError(null)

      const response = await fetch("https://charming-ninnetta-knust-028ea081.koyeb.app/api/v1/products/subcategories/")

      if (!response.ok) {
        throw new Error("Failed to fetch categories")
      }

      const data = await response.json()
      const processedCategories = processApiData(data)

      // Update state with fresh data
      setCategories(processedCategories)
      setIsUsingMockData(false)
      setIsUsingCache(false)

      // Cache the fresh data
      setCachedData(processedCategories)
    } catch (err) {
      setError(err.message || "An error occurred")
      console.error("Error fetching fresh data:", err)
    } finally {
      setIsLoadingFresh(false)
    }
  }

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      // First, check if we have valid cached data
      if (isCacheValid()) {
        const cachedData = getCachedData()
        if (cachedData) {
          setCategories(cachedData)
          setIsUsingCache(true)
          setIsUsingMockData(false)
        }
      }

      // Always fetch fresh data in the background
      await fetchFreshData()
    }

    loadData()
  }, [])

  // Navigation functions
  const navigateToCategory = (categoryName) => {
    const encodedCategory = encodeURIComponent(categoryName)
    router.push(`/category/${encodedCategory}`)
    handlePopoverClose()
  }

  const navigateToSubcategory = (subcategoryName) => {
    const encodedSubcategory = encodeURIComponent(subcategoryName)
    router.push(`/subcategory/${encodedSubcategory}`)
    handlePopoverClose()
  }

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

  const handleRefresh = () => {
    fetchFreshData()
  }

  const handleCategoryClick = (category) => {
    if (category.hasSubmenu) {
      // If category has submenu, don't navigate immediately
      return
    }
    navigateToCategory(category.name)
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
      {/* Categories Header with status indicators */}
      <Box
        sx={{
          bgcolor: "primary.main",
          color: "white",
          p: 1.5,
          borderRadius: 1,
          mb: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <CategoryIcon fontSize="small" />
          <Typography variant="subtitle1" fontWeight="medium">
            CATEGORIES
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {isLoadingFresh && (
            <CachedIcon
              fontSize="small"
              sx={{
                animation: "spin 1s linear infinite",
                "@keyframes spin": {
                  "0%": { transform: "rotate(0deg)" },
                  "100%": { transform: "rotate(360deg)" },
                },
              }}
            />
          )}
          <Button
            size="small"
            onClick={handleRefresh}
            sx={{
              color: "white",
              minWidth: "auto",
              p: 0.5,
              "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
            }}
            disabled={isLoadingFresh}
          >
            <CachedIcon fontSize="small" />
          </Button>
        </Box>
      </Box>

      <List sx={{ p: 0 }}>
        {categories.map((category, index) => (
          <ListItem
            key={category.id}
            disablePadding
            sx={{
              borderBottom: index < categories.length - 1 ? "1px solid rgba(0, 0, 0, 0.06)" : "none",
              py: 0.5,
            }}
            onMouseEnter={(e) => handlePopoverOpen(e, index)}
            onMouseLeave={handlePopoverClose}
          >
            <ListItemButton sx={{ borderRadius: 1 }} onClick={() => handleCategoryClick(category)}>
              <ListItemText
                primary={
                  <Typography
                    variant="body1"
                    color={openCategory === index ? "primary.main" : "text.secondary"}
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
                      offset: [0, 0],
                    },
                  },
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
                    gap: 2,
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
                      mb: 1,
                      cursor: "pointer",
                      "&:hover": {
                        bgcolor: "primary.dark",
                      },
                    }}
                    onClick={() => navigateToCategory(category.name)}
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
                                  cursor: "pointer",
                                  "&:hover": {
                                    color: "primary.main",
                                    backgroundColor: "rgba(25, 118, 210, 0.04)",
                                  },
                                }}
                                onClick={() => navigateToSubcategory(subcat)}
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
                          backgroundImage: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
                          borderRadius: 1,
                          display: "flex",
                          height: "200px",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                          p: 2,
                          position: "relative",
                          cursor: "pointer",
                          "&::before": {
                            content: '""',
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: "rgba(0,0,0,0.1)",
                            borderRadius: 1,
                          },
                          "&:hover::before": {
                            backgroundColor: "rgba(0,0,0,0.2)",
                          },
                        }}
                        onClick={() => navigateToCategory(category.name)}
                      >
                        <Typography
                          variant="h6"
                          sx={{
                            color: "white",
                            textAlign: "center",
                            fontWeight: "bold",
                            position: "relative",
                            zIndex: 1,
                          }}
                        >
                          {category.promoTitle}
                        </Typography>

                        <Typography
                          variant="h3"
                          sx={{
                            color: "white",
                            textAlign: "center",
                            fontWeight: "bold",
                            mb: 2,
                            position: "relative",
                            zIndex: 1,
                          }}
                        >
                          {category.promoDiscount} OFF
                        </Typography>
                        <Button
                          variant="contained"
                          color="secondary"
                          sx={{
                            position: "relative",
                            zIndex: 1,
                            bgcolor: "white",
                            color: "primary.main",
                            "&:hover": {
                              bgcolor: "grey.100",
                            },
                          }}
                          onClick={(e) => {
                            e.stopPropagation()
                            navigateToCategory(category.name)
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
