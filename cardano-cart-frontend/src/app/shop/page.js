"use client"

import { useState, useEffect } from "react"
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  TextField,
  Box,
  Paper,
  Alert,
  Snackbar,
  List,
  ListItem,
  Checkbox,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Slider,
  useMediaQuery,
  useTheme,
  MenuItem,
  Select,
  Divider,
  FormControl,
  Pagination,
  PaginationItem
} from "@mui/material"
import { ExpandMore } from "@mui/icons-material"
import dynamic from "next/dynamic"
import Header from "../_components/Header"
import { current_products } from "../data"
import { getAllProducts } from "../../../utils/_products"

const ShopAnimation = dynamic(() => import("../_components/ShopLoading"), {
  ssr: false
})

const ShopPage = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [priceRange, setPriceRange] = useState([0, 2000])
  const [products, setProducts] = useState(current_products)
  const [filteredProducts, setFilteredProducts] = useState(products)
  const [displayedProducts, setDisplayedProducts] = useState([])
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"))
  const [alertOpen, setAlertOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [alertMessage, setAlertMessage] = useState("")
  const [sortBy, setSortBy] = useState("alphabetical")

  // Pagination
  const [page, setPage] = useState(1)
  const productsPerPage = 12
  const [totalPages, setTotalPages] = useState(1)

  // Filter states
  const [availabilityFilters, setAvailabilityFilters] = useState({
    inStock: false,
    outOfStock: false
  })

  const [categories, setCategories] = useState([])
  const [categoryFilters, setCategoryFilters] = useState({})

  const [sizeFilters, setSizeFilters] = useState({
    small: false,
    medium: false,
    standard: false,
    9: false,
    '24"': false,
    "47mm": false
  })

  const [colorFilters, setColorFilters] = useState({
    red: false,
    brown: false,
    beige: false,
    black: false,
    white: false,
    blue: false
  })

  useEffect(() => {
    const fetchProducts = async () => {
      if (typeof window !== "undefined") {
        const access_token = localStorage.getItem("accessToken")
        if (access_token) {
          try {
            const fetchedProducts = await getAllProducts(access_token)
            setProducts(fetchedProducts)
          } catch (error) {
            console.error("Error fetching products:", error)
          }
        }
      }
    }

    fetchProducts()
  }, [])

  useEffect(() => {
    if (products && products.length > 0) {
      // Extract unique categories from products
      const uniqueCategories = [
        ...new Set(
          products.map(product => product.category_name).filter(Boolean)
        )
      ]
      setCategories(uniqueCategories)

      // Initialize category filters object with all categories set to false
      const initialCategoryFilters = {}
      uniqueCategories.forEach(category => {
        initialCategoryFilters[category] = false
      })
      setCategoryFilters(initialCategoryFilters)
    }
  }, [products])

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 2000)
    setMounted(true)

    let filtered = [...products]

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply price range filter
    filtered = filtered.filter(
      product =>
        product.price >= priceRange[0] && product.price <= priceRange[1]
    )

    // Apply availability filters
    if (availabilityFilters.inStock && !availabilityFilters.outOfStock) {
      filtered = filtered.filter(product => product.stock_quantity > 0)
    } else if (!availabilityFilters.inStock && availabilityFilters.outOfStock) {
      filtered = filtered.filter(product => product.stock_quantity <= 0)
    }

    // Apply category filters
    const selectedCategories = Object.keys(categoryFilters).filter(
      key => categoryFilters[key]
    )
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(product => {
        return selectedCategories.includes(product.category_name)
      })
    }

    // Apply size filters
    const selectedSizes = Object.keys(sizeFilters).filter(
      key => sizeFilters[key]
    )
    if (selectedSizes.length > 0) {
      filtered = filtered.filter(product => {
        const size = product.size ? product.size.toLowerCase() : ""
        return selectedSizes.some(s => size.includes(s.toLowerCase()))
      })
    }

    // Apply color filters
    const selectedColors = Object.keys(colorFilters).filter(
      key => colorFilters[key]
    )
    if (selectedColors.length > 0) {
      filtered = filtered.filter(product => {
        const color = product.color ? product.color.toLowerCase() : ""
        return selectedColors.some(c => color.includes(c.toLowerCase()))
      })
    }

    // Apply sorting
    switch (sortBy) {
      case "alphabetical":
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "alphabetical-reverse":
        filtered.sort((a, b) => b.name.localeCompare(a.name))
        break
      case "price-low":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filtered.sort((a, b) => b.price - a.price)
        break
      default:
        break
    }

    setFilteredProducts(filtered)
    setTotalPages(Math.ceil(filtered.length / productsPerPage))
    setPage(1) // Reset to first page when filters change
  }, [
    searchTerm,
    priceRange,
    sortBy,
    products,
    availabilityFilters,
    categoryFilters,
    sizeFilters,
    colorFilters
  ])

  // Update displayed products when page or filtered products change
  useEffect(() => {
    const startIndex = (page - 1) * productsPerPage
    const endIndex = startIndex + productsPerPage
    setDisplayedProducts(filteredProducts.slice(startIndex, endIndex))
  }, [page, filteredProducts, productsPerPage])

  if (isLoading) {
    return <ShopAnimation />
  }

  if (!mounted) {
    return null
  }

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue)
  }

  const handleAddToCart = product => {
    // In a real app, this would add to cart state or context
    setAlertMessage(`${product.name} added to cart successfully!`)
    setAlertOpen(true)
  }

  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return
    }
    setAlertOpen(false)
  }

  const handleAvailabilityChange = filter => {
    setAvailabilityFilters({
      ...availabilityFilters,
      [filter]: !availabilityFilters[filter]
    })
  }

  const handleCategoryChange = filter => {
    setCategoryFilters({
      ...categoryFilters,
      [filter]: !categoryFilters[filter]
    })
  }

  const handleSizeChange = filter => {
    setSizeFilters({
      ...sizeFilters,
      [filter]: !sizeFilters[filter]
    })
  }

  const handleColorChange = filter => {
    setColorFilters({
      ...colorFilters,
      [filter]: !colorFilters[filter]
    })
  }

  const handlePageChange = (event, value) => {
    setPage(value)
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleSearch = e => {
    setSearchTerm(e.target.value)
  }

  return (
    <>
      <Header />
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4, minHeight: "auto" }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontWeight: "bold", mb: 3 }}
        >
          Products
        </Typography>

        {/* Search Bar */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search products..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={handleSearch}
            sx={{ maxWidth: 400 }}
          />
        </Box>

        {/* Sort and View Options */}
        <Paper
          elevation={1}
          sx={{
            p: 2,
            mb: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "none"
          }}
        >
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button variant="outlined" size="small">
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                <Box
                  sx={{ width: 16, height: 2, bgcolor: "text.secondary" }}
                ></Box>
                <Box
                  sx={{ width: 16, height: 2, bgcolor: "text.secondary" }}
                ></Box>
              </Box>
            </Button>
            <Button variant="outlined" size="small">
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                <Box sx={{ display: "flex", gap: 0.5 }}>
                  <Box
                    sx={{ width: 6, height: 2, bgcolor: "text.secondary" }}
                  ></Box>
                  <Box
                    sx={{ width: 6, height: 2, bgcolor: "text.secondary" }}
                  ></Box>
                  <Box
                    sx={{ width: 6, height: 2, bgcolor: "text.secondary" }}
                  ></Box>
                </Box>
                <Box sx={{ display: "flex", gap: 0.5 }}>
                  <Box
                    sx={{ width: 6, height: 2, bgcolor: "text.secondary" }}
                  ></Box>
                  <Box
                    sx={{ width: 6, height: 2, bgcolor: "text.secondary" }}
                  ></Box>
                  <Box
                    sx={{ width: 6, height: 2, bgcolor: "text.secondary" }}
                  ></Box>
                </Box>
              </Box>
            </Button>
            <Button variant="contained" size="small" color="primary">
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                <Box sx={{ display: "flex", gap: 0.5 }}>
                  <Box sx={{ width: 4, height: 2, bgcolor: "white" }}></Box>
                  <Box sx={{ width: 4, height: 2, bgcolor: "white" }}></Box>
                  <Box sx={{ width: 4, height: 2, bgcolor: "white" }}></Box>
                  <Box sx={{ width: 4, height: 2, bgcolor: "white" }}></Box>
                </Box>
                <Box sx={{ display: "flex", gap: 0.5 }}>
                  <Box sx={{ width: 4, height: 2, bgcolor: "white" }}></Box>
                  <Box sx={{ width: 4, height: 2, bgcolor: "white" }}></Box>
                  <Box sx={{ width: 4, height: 2, bgcolor: "white" }}></Box>
                  <Box sx={{ width: 4, height: 2, bgcolor: "white" }}></Box>
                </Box>
              </Box>
            </Button>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography variant="body2" sx={{ mr: 1 }}>
                Sort by:
              </Typography>
              <FormControl size="small" sx={{ minWidth: 180 }}>
                <Select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  displayEmpty
                >
                  <MenuItem value="alphabetical">Alphabetically, A-Z</MenuItem>
                  <MenuItem value="alphabetical-reverse">
                    Alphabetically, Z-A
                  </MenuItem>
                  <MenuItem value="price-low">Price, low to high</MenuItem>
                  <MenuItem value="price-high">Price, high to low</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Typography variant="body2">
              {filteredProducts.length} products
            </Typography>
          </Box>
        </Paper>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={3} sx={{ minHeight: "auto" }}>
          {/* Sidebar with filters */}
          <Grid item xs={12} md={3}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              {/* Availability Filter */}
              <Accordion defaultExpanded sx={{ boxShadow: "none" }}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="subtitle1" fontWeight="medium">
                    Availability
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List disablePadding>
                    <ListItem disablePadding>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={availabilityFilters.inStock}
                            onChange={() => handleAvailabilityChange("inStock")}
                            size="small"
                          />
                        }
                        label={
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              width: "100%"
                            }}
                          >
                            <Typography variant="body2">In stock</Typography>
                            <Typography variant="body2" color="text.secondary">
                              (14)
                            </Typography>
                          </Box>
                        }
                        sx={{ width: "100%" }}
                      />
                    </ListItem>
                    <ListItem disablePadding>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={availabilityFilters.outOfStock}
                            onChange={() =>
                              handleAvailabilityChange("outOfStock")
                            }
                            size="small"
                          />
                        }
                        label={
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              width: "100%"
                            }}
                          >
                            <Typography variant="body2">
                              Out of stock
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              (7)
                            </Typography>
                          </Box>
                        }
                        sx={{ width: "100%" }}
                      />
                    </ListItem>
                  </List>
                </AccordionDetails>
              </Accordion>
              <Divider sx={{ mb: 2 }} />
              {/* Categories Filter (renamed from Brand) */}
              <Accordion defaultExpanded sx={{ boxShadow: "none" }}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="subtitle1" fontWeight="medium">
                    Categories
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List disablePadding>
                    {categories.length > 0 ? (
                      categories.map(category => {
                        // Count products in this category
                        const categoryCount = products.filter(
                          product => product.category_name === category
                        ).length

                        return (
                          <ListItem disablePadding key={category}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={categoryFilters[category] || false}
                                  onChange={() =>
                                    handleCategoryChange(category)
                                  }
                                  size="small"
                                />
                              }
                              label={
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    width: "100%"
                                  }}
                                >
                                  <Typography variant="body2">
                                    {category}
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    ({categoryCount})
                                  </Typography>
                                </Box>
                              }
                              sx={{ width: "100%" }}
                            />
                          </ListItem>
                        )
                      })
                    ) : (
                      <ListItem>
                        <Typography variant="body2" color="text.secondary">
                          No categories available
                        </Typography>
                      </ListItem>
                    )}
                  </List>
                </AccordionDetails>
              </Accordion>
              <Divider sx={{ mb: 2 }} />
              
              
              <Divider sx={{ mb: 2 }} />
              {/* Price Filter */}
              <Accordion defaultExpanded sx={{ boxShadow: "none" }}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="subtitle1" fontWeight="medium">
                    Price
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ px: 2 }}>
                    <Slider
                      value={priceRange}
                      onChange={handlePriceChange}
                      valueLabelDisplay="auto"
                      min={0}
                      max={2000}
                      sx={{ mt: 2 }}
                    />
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mt: 2
                      }}
                    >
                      <TextField
                        label="Min"
                        type="number"
                        size="small"
                        value={priceRange[0]}
                        onChange={e => {
                          const value = Number.parseInt(e.target.value)
                          if (
                            !isNaN(value) &&
                            value >= 0 &&
                            value < priceRange[1]
                          ) {
                            setPriceRange([value, priceRange[1]])
                          }
                        }}
                        InputProps={{
                          startAdornment: (
                            <Typography variant="body2">₳</Typography>
                          )
                        }}
                        sx={{ width: "45%" }}
                      />
                      <TextField
                        label="Max"
                        type="number"
                        size="small"
                        value={priceRange[1]}
                        onChange={e => {
                          const value = Number.parseInt(e.target.value)
                          if (!isNaN(value) && value > priceRange[0]) {
                            setPriceRange([priceRange[0], value])
                          }
                        }}
                        InputProps={{
                          startAdornment: (
                            <Typography variant="body2">₳</Typography>
                          )
                        }}
                        sx={{ width: "45%" }}
                      />
                    </Box>
                  </Box>
                </AccordionDetails>
              </Accordion>
              <Divider sx={{ mb: 2 }} />
              {/* Latest Products */}
              <Box sx={{ mt: 2 }}>
                <Typography
                  variant="subtitle1"
                  fontWeight="medium"
                  sx={{ mb: 2 }}
                >
                  Latest Products
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {products.slice(0, 4).map(product => (
                    <Box key={product.id} sx={{ display: "flex", gap: 2 }}>
                      <CardMedia
                        component="img"
                        sx={{
                          width: 64,
                          height: 64,
                          objectFit: "contain",
                          bgcolor: "grey.100",
                          borderRadius: 1
                        }}
                        image={product.images[0]?.image_url}
                        alt={product.name}
                      />
                      <Box>
                        <Typography variant="body2" fontWeight="medium" noWrap>
                          {product.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {product.category || "Electronics"}
                        </Typography>
                        <Typography
                          variant="body2"
                          fontWeight="medium"
                          sx={{ mt: 0.5 }}
                        >
                          ₳{product.price}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
                <Button
                  color="primary"
                  sx={{
                    mt: 2,
                    textTransform: "none",
                    justifyContent: "flex-start",
                    p: 0
                  }}
                >
                  View all new arrivals
                </Button>
              </Box>
            </Box>
          </Grid>

          {/* Product Grid */}
          <Grid item xs={12} md={9}>
            <Grid container spacing={2}>
              {displayedProducts.map(product => (
                <Grid item xs={6} sm={4} md={3} key={product.id}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      borderRadius: 1
                    }}
                  >
                    <Box sx={{ position: "relative" }}>
                      {product.sale && (
                        <Chip
                          label="SALE"
                          size="small"
                          sx={{
                            position: "absolute",
                            top: 8,
                            left: 8,
                            bgcolor: "grey.700",
                            color: "white",
                            fontSize: "0.7rem",
                            height: 24
                          }}
                        />
                      )}
                      <CardMedia
                        component="img"
                        height={isMobile ? "100" : isTablet ? "120" : "140"}
                        image={product.images[0]?.image_url}
                        alt={product.name}
                        sx={{
                          objectFit: "contain",
                          bgcolor: "grey.100",
                          height: {
                            xs: "140px",
                            sm: "160px",
                            md: "180px"
                          },
                          p: 2
                        }}
                      />
                      {product.countdown && (
                        <Box
                          sx={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            bgcolor: "primary.main",
                            color: "white",
                            display: "flex",
                            justifyContent: "space-around",
                            p: 0.5
                          }}
                        >
                          <Box sx={{ textAlign: "center" }}>
                            <Typography
                              variant="caption"
                              sx={{ fontSize: "0.75rem" }}
                            >
                              274
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{ fontSize: "0.6rem", display: "block" }}
                            >
                              Days
                            </Typography>
                          </Box>
                          <Box sx={{ textAlign: "center" }}>
                            <Typography
                              variant="caption"
                              sx={{ fontSize: "0.75rem" }}
                            >
                              7
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{ fontSize: "0.6rem", display: "block" }}
                            >
                              Hrs
                            </Typography>
                          </Box>
                          <Box sx={{ textAlign: "center" }}>
                            <Typography
                              variant="caption"
                              sx={{ fontSize: "0.75rem" }}
                            >
                              58
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{ fontSize: "0.6rem", display: "block" }}
                            >
                              Min
                            </Typography>
                          </Box>
                        </Box>
                      )}
                    </Box>
                    <CardContent
                      sx={{
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                        p: 2
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        {product.category_name || "Electronics"}
                      </Typography>
                      <Typography
                        variant={isMobile ? "body2" : "subtitle2"}
                        component="div"
                        noWrap
                        sx={{ mb: 0.5 }}
                      >
                        {product.name}
                      </Typography>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Typography variant={isMobile ? "caption" : "body2"}>
                          ₳{product.price}
                        </Typography>
                        {product.originalPrice && (
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ textDecoration: "line-through" }}
                          >
                            ₳{product.originalPrice}
                          </Typography>
                        )}
                      </Box>
                      <Button
                        variant="contained"
                        color="primary"
                        size={isMobile ? "small" : "medium"}
                        onClick={() => handleAddToCart(product)}
                        sx={{ mt: "auto", alignSelf: "stretch" }}
                      >
                        Add To Cart
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Pagination - Updated to use MUI Pagination component */}
            <Box
              sx={{ display: "flex", justifyContent: "center", mt: 4, mb: 2 }}
            >
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                renderItem={item => (
                  <PaginationItem
                    component={Button}
                    {...item}
                    sx={{
                      minWidth: 32,
                      height: 32,
                      p: 0,
                      ...(item.selected
                        ? {
                            bgcolor: "primary.main",
                            color: "white",
                            "&:hover": {
                              bgcolor: "primary.dark"
                            }
                          }
                        : {})
                    }}
                  />
                )}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
      <Snackbar
        open={alertOpen}
        autoHideDuration={3000}
        onClose={handleCloseAlert}
      >
        <Alert
          onClose={handleCloseAlert}
          severity="success"
          sx={{ width: "100%" }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </>
  )
}

export default ShopPage
