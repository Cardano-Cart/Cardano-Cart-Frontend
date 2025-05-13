"use client"

import { useState, useContext, useEffect } from "react"
import { useMediaQuery } from "@mui/material"
import { useTheme } from "@mui/system"

import {
  IconButton,
  AppBar,
  Badge,
  Toolbar,
  Button,
  Box,
  Popover,
  Link,
  Drawer,
  List,
  ListItem,
  ListItemText,
  InputBase,
  Paper,
  Typography,
  Divider,
} from "@mui/material"
import NextLink from "next/link"
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"
import MenuIcon from "@mui/icons-material/Menu"
import AccountCircleIcon from "@mui/icons-material/AccountCircle"
import SearchIcon from "@mui/icons-material/Search"
import CloseIcon from "@mui/icons-material/Close"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"
import { motion, AnimatePresence } from "framer-motion"
import { styled } from "@mui/system"
import { useCart } from "react-use-cart"
import CartDrawer from "./CartDrawer"
import { WalletContext } from "./WalletContext"
import { UserContext } from "../../../utils/UserContext" // Adjust the path as necessary
import ConnectWallet from "../hooks/YoroiWallet"
import Image from "next/image"
import { current_products } from "../data" // Import the products from your data file
import { getAllProducts } from "../../../utils/_products"

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [cartOpen, setCartOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { totalItems } = useCart()
  const { user, loading, setUser } = useContext(UserContext)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [products, setProducts] = useState([])

  const { isConnected, walletName, balance, connectWallet, disconnectWallet } = useContext(WalletContext)

  // Initialize products
  useEffect(() => {
    // Start with current_products
    setProducts(current_products)

    // If you want to fetch additional products from API as in your Home component
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

    // Uncomment this if you want to fetch products from API
    fetchProducts()
  }, [])

  // Search functionality
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([])
      return
    }

    // Filter products based on search query
    const filteredProducts = products.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    // Limit to 5 results for the dropdown
    setSearchResults(filteredProducts.slice(0, 5))
  }, [searchQuery, products])

  // Prevent body scroll when search is open
  useEffect(() => {
    if (searchOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [searchOpen])

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleCartOpen = () => {
    setCartOpen(true)
  }

  const handleCartClose = () => {
    setCartOpen(false)
  }

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const toggleSearch = () => {
    setSearchOpen(!searchOpen)
  }

  const handleSearchReset = () => {
    setSearchQuery("")
    setSearchResults([])
    setSearchOpen(false)
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Navigate to search results page with query parameter
      window.location.href = `/shop?search=${encodeURIComponent(searchQuery.trim())}`
      // Reset search state
      handleSearchReset()
    }
  }

  const handleProductClick = (productId) => {
    // Navigate to product page
    window.location.href = `/product/${productId}`
    handleSearchReset()
  }

  const StyledBadge = styled(Badge)(({ theme }) => ({
    "& .MuiBadge-badge": {
      right: -3,
      top: 13,
      border: `2px solid blue`,
      padding: "0 4px",
    },
  }))

  const open = Boolean(anchorEl)
  const id = open ? "account-popover" : undefined

  const fadeInFromLeft = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 1,
        ease: [0.175, 0.885, 0.32, 1.275],
      },
    },
  }

  const menuItems = [
    { text: "Home", href: "/" },
    { text: "Shop", href: "/shop" },
    { text: "Orders", href: "/orders" },
    { text: "About", href: "/about" },
  ]

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md")) // Hides on screens md & larger
  if (loading) {
    return null // Or a loader, depending on your UI
  }

  return (
    <>
      {/* Dark Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              zIndex: 1090,
            }}
            onClick={handleSearchReset}
          />
        )}
      </AnimatePresence>

      {/* Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.3 }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              zIndex: 1100,
              backgroundColor: "white",
              padding: "20px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",
            }}
            onClick={(e) => e.stopPropagation()} // Prevent clicks from closing the search
          >
            <Box sx={{ width: "100%", maxWidth: "800px" }}>
              <Paper
                component="form"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  borderRadius: "50px",
                  border: "1px solid #e0e0e0",
                  boxShadow: "none",
                  padding: "2px 15px",
                  mb: searchResults.length > 0 ? 2 : 0,
                }}
                onSubmit={handleSearchSubmit}
              >
                <InputBase
                  sx={{ ml: 1, flex: 1 }}
                  placeholder="Search our store"
                  inputProps={{ "aria-label": "search our store" }}
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <IconButton type="submit" sx={{ p: "10px" }} aria-label="search">
                  <SearchIcon />
                </IconButton>
              </Paper>

              {/* Live Search Results */}
              {searchResults.length > 0 && (
                <Paper
                  sx={{
                    width: "100%",
                    borderRadius: "8px",
                    overflow: "hidden",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
                  }}
                >
                  <Box sx={{ p: 2, pb: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#666" }}>
                      PRODUCTS
                    </Typography>
                  </Box>

                  <Box>
                    {searchResults.map((product) => (
                      <Box
                        key={product.id}
                        sx={{
                          display: "flex",
                          p: 2,
                          cursor: "pointer",
                          "&:hover": { backgroundColor: "#f5f5f5" },
                        }}
                        onClick={() => handleProductClick(product.id)}
                      >
                        <Box sx={{ width: 60, height: 60, mr: 2, position: "relative" }}>
                          <Image
                            src={
                              product.images && product.images.length > 0
                                ? product.images[0].image_url
                                : "/placeholder.svg?height=60&width=60"
                            }
                            alt={product.name}
                            width={60}
                            height={60}
                            style={{ objectFit: "contain" }}
                          />
                        </Box>
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {product.name}
                          </Typography>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {product.price} ADA
                            </Typography>
                            {product.discountPrice && (
                              <Typography variant="body2" sx={{ textDecoration: "line-through", color: "#999" }}>
                                {product.discountPrice} ADA
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </Box>
                    ))}
                  </Box>

                  <Divider />

                  <Box
                    sx={{
                      p: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      cursor: "pointer",
                      "&:hover": { backgroundColor: "#f5f5f5" },
                    }}
                    onClick={handleSearchSubmit}
                  >
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      Search for "{searchQuery}"
                    </Typography>
                    <ArrowForwardIcon fontSize="small" />
                  </Box>
                </Paper>
              )}
            </Box>

            <IconButton sx={{ ml: 2 }} onClick={handleSearchReset} aria-label="close search">
              <CloseIcon />
            </IconButton>
          </motion.div>
        )}
      </AnimatePresence>

      <AppBar position="static" color="transparent" className="bg-white shadow-md">
        <Toolbar
          className="flex-row justify-between items-center "
          sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}
        >
          <motion.div className="flex items-center " initial="hidden" animate="visible" variants={fadeInFromLeft}>
            <Link
              href="/"
              sx={{ fontWeight: "bold", textDecoration: "none", alignItems: "center", fontSize: "22px" }}
              className="text-black font-bold mr-2"
            >
              Cardano Cart
            </Link>
          </motion.div>

          <motion.div className="flex items-center " variants={fadeInFromLeft} initial="hidden" animate="visible">
            <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
              {/* Menu Links */}
              {!isMobile && (
                <motion.div className="flex space-x-4" variants={fadeInFromLeft}>
                  {menuItems.map((item) => (
                    <Button key={item.text} className="text-black" component={NextLink} href={item.href}>
                      {item.text}
                    </Button>
                  ))}
                </motion.div>
              )}

              {/* Cart & Auth */}
              <motion.div className="flex items-center space-x-4" variants={fadeInFromLeft}>
                <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                  {/* Search Button */}
                  <IconButton className="text-black" onClick={toggleSearch}>
                    <SearchIcon />
                  </IconButton>

                  {/* Account Icon */}
                  <IconButton className="text-black" onClick={handleClick}>
                    <AccountCircleIcon />
                  </IconButton>

                  {/* Popover for Profile or Login/Signup */}
                  <Popover
                    id={id}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                  >
                    <Box sx={{ p: 2, display: "flex", flexDirection: "column", alignItems: "center" }}>
                      {user ? (
                        <>
                          <Link href="/profile" style={{ textDecoration: "none", width: "100%", marginBottom: "8px" }}>
                            <Button variant="outlined" color="primary" fullWidth>
                              Profile
                            </Button>
                          </Link>
                          <Link href="/">
                            <Button
                              variant="contained"
                              color="primary"
                              fullWidth
                              onClick={() => {
                                localStorage.removeItem("accessToken")
                                setUser(null) // Update context to reflect logout
                              }}
                            >
                              Logout
                            </Button>
                          </Link>
                        </>
                      ) : (
                        <>
                          <Link href="/sign-in" style={{ textDecoration: "none", width: "100%", marginBottom: "8px" }}>
                            <Button variant="outlined" color="primary" fullWidth>
                              Login
                            </Button>
                          </Link>
                          <Link href="/sign-up" style={{ textDecoration: "none", width: "100%" }}>
                            <Button variant="contained" color="primary" fullWidth>
                              Sign Up
                            </Button>
                          </Link>
                        </>
                      )}
                    </Box>
                  </Popover>
                  {!isMobile && <ConnectWallet />}

                  {/* Shopping Cart Icon */}
                  <IconButton aria-label="cart" className="text-black">
                    <StyledBadge badgeContent={totalItems} color="primary" onClick={handleCartOpen}>
                      <ShoppingCartIcon />
                    </StyledBadge>
                  </IconButton>
                </Box>
              </motion.div>

              {/* Mobile Menu */}
              <motion.div className="md:hidden" variants={fadeInFromLeft}>
                {isMobile && (
                  <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    onClick={handleMobileMenuToggle}
                    sx={{ ml: 2 }}
                  >
                    <MenuIcon className="text-black" />
                  </IconButton>
                )}
              </motion.div>
            </Box>
          </motion.div>
          <CartDrawer open={cartOpen} onClose={handleCartClose} />

          {/* Mobile Menu Drawer */}
          <Drawer anchor="right" open={mobileMenuOpen} onClose={handleMobileMenuToggle}>
            <Box
              sx={{ width: 250 }}
              role="presentation"
              onClick={handleMobileMenuToggle}
              onKeyDown={handleMobileMenuToggle}
            >
              <List>
                {menuItems.map((item) => (
                  <ListItem button key={item.text} component={Link} href={item.href}>
                    <ListItemText primary={item.text} />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Drawer>
        </Toolbar>
      </AppBar>
    </>
  )
}

export default Header

