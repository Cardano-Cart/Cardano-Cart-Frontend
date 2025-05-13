"use client"
import { useState, useRef, useEffect } from "react"
import {
  Button,
  TextField,
  CircularProgress,
  Snackbar,
  Alert,
  Box,
  Typography,
  Grid,
  Paper,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText
} from "@mui/material"
import Header from "../_components/Header"

// Function to fetch subcategories
const fetchSubcategories = async token => {
  try {
    // Use the provided API endpoint
    const response = await fetch(
      "https://charming-ninnetta-knust-028ea081.koyeb.app/api/v1/products/subcategories/",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        errorData.message || `Failed to fetch subcategories: ${response.status}`
      )
    }

    const data = await response.json()
    return data // The API already returns the correct format
  } catch (error) {
    console.error("Error fetching subcategories:", error)
    return [] // Return empty array on error
  }
}

// Custom createProduct function that properly handles FormData
const customCreateProduct = async (formData, token) => {
  try {
    const response = await fetch(
      "https://charming-ninnetta-knust-028ea081.koyeb.app/api/v1/products/",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
          // Do NOT set Content-Type here - the browser will set it automatically with the boundary parameter
        },
        body: formData
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Server response:", errorText)
      try {
        const errorData = JSON.parse(errorText)
        throw new Error(
          errorData.detail || `Failed to create product: ${response.status}`
        )
      } catch (e) {
        throw new Error(
          `Failed to create product: ${response.status} - ${errorText.substring(
            0,
            100
          )}`
        )
      }
    }

    return await response.json()
  } catch (error) {
    console.error("Error in customCreateProduct:", error)
    throw error
  }
}

export default function CreateProduct() {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: 0,
    category_name: "",
    subcategory: {
      id: 0,
      name: "",
      category: {
        id: 0,
        name: ""
      }
    },
    sku: "",
    specifications: JSON.stringify({}),
    
    images: null // This will be populated by the server with Cloudinary URLs
  })

  // Separate state for file handling
  const [productImage, setProductImage] = useState(null)
  const [imagePreview, setImagePreview] = useState("")
  const [isUploadingImage, setIsUploadingImage] = useState(false)

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const fileInputRef = useRef(null)
  const [subcategories, setSubcategories] = useState([])
  const [isLoadingSubcategories, setIsLoadingSubcategories] = useState(false)
  const [subcategoryError, setSubcategoryError] = useState("")

  // Fetch subcategories on component mount
  useEffect(() => {
    const getSubcategories = async () => {
      setIsLoadingSubcategories(true)
      setSubcategoryError("")

      try {
        const token = localStorage.getItem("accessToken")
        if (!token) {
          setSubcategoryError("Authentication required to load subcategories")
          return
        }

        const data = await fetchSubcategories(token)
        setSubcategories(data)
      } catch (err) {
        console.error("Error loading subcategories:", err)
        setSubcategoryError("Failed to load subcategories")
      } finally {
        setIsLoadingSubcategories(false)
      }
    }

    getSubcategories()
  }, [])

  // Clean up image preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview)
      }
    }
  }, [imagePreview])

  const handleInputChange = event => {
    const { name, value } = event.target

    if (name.includes(".")) {
      // Handle nested properties
      const [parent, child] = name.split(".")
      setProduct(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }))
    } else if (name === "category_name") {
      // Handle both category_name and subcategory.category.name
      setProduct(prev => ({
        ...prev,
        category_name: value,
        subcategory: {
          ...prev.subcategory,
          category: {
            ...prev.subcategory.category,
            name: value
          }
        }
      }))
    } else {
      // Handle regular fields
      setProduct(prev => ({
        ...prev,
        [name]:
          name === "price" || name === "stock" || name === "seller"
            ? Number(value)
            : value
      }))
    }
  }

  // Handle subcategory selection
  const handleSubcategoryChange = event => {
    const subcategoryId = event.target.value
    const selectedSubcategory = subcategories.find(
      sub => sub.id === subcategoryId
    )

    if (selectedSubcategory) {
      setProduct(prev => ({
        ...prev,
        category_name: selectedSubcategory.category.name,
        subcategory: {
          id: selectedSubcategory.id,
          name: selectedSubcategory.name,
          category: {
            id: selectedSubcategory.category.id,
            name: selectedSubcategory.category.name
          }
        }
      }))
    }
  }

  const handleFileChange = event => {
    const file = event.target.files[0]

    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size exceeds 5MB limit")
        return
      }

      // Validate file type
      if (!file.type.match("image.*")) {
        setError("Please select an image file")
        return
      }

      // Revoke previous preview URL to avoid memory leaks
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview)
      }

      // Store the file object
      setProductImage(file)

      // Create a preview URL
      const previewUrl = URL.createObjectURL(file)
      setImagePreview(previewUrl)
    } else {
      setProductImage(null)
      setImagePreview("")
    }
  }

  const handleSubmit = async event => {
    event.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const access_token = localStorage.getItem("accessToken")
      if (!access_token)
        throw new Error("No access token found. Please log in.")

      // Create FormData for multipart/form-data submission
      const formData = new FormData()

      // Add product data fields individually
      formData.append("name", product.name)
      formData.append("description", product.description)
      formData.append("price", Number.parseFloat(product.price).toFixed(1))
      formData.append("stock", product.stock.toString())
      formData.append("category_name", product.category_name)
      formData.append("subcategory_id", product.subcategory.id.toString())
      formData.append("sku", product.sku)
      formData.append("specifications", product.specifications)
     

      // Append the image file if it exists
      if (productImage) {
        formData.append("images", productImage)
        setIsUploadingImage(true)
      }

      // Use our custom function that properly handles FormData
      const createdProduct = await customCreateProduct(formData, access_token)
      console.log("Product created:", createdProduct)
      setSuccess(true)

      // Reset form
      setProduct({
        name: "",
        description: "",
        price: "",
        stock: 0,
        category_name: "",
        subcategory: {
          id: 0,
          name: "",
          category: {
            id: 0,
            name: ""
          }
        },
        sku: "",
        specifications: JSON.stringify({}),
        seller: 0,
        images: []
      })

      // Reset image state
      setProductImage(null)
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview)
        setImagePreview("")
      }
      setIsUploadingImage(false)
    } catch (err) {
      console.error("Error creating product:", err)
      setError(err.message || "Failed to create product")
      setIsUploadingImage(false)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Header />
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ maxWidth: 800, mx: "auto", p: 4 }}
      >
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom>
            Create Product
          </Typography>

          <Box
            sx={{
              border: "2px dashed #ccc",
              borderRadius: 2,
              textAlign: "center",
              py: 4,
              mb: 4,
              position: "relative"
            }}
          >
            <input
              type="file"
              name="images"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
              id="file-upload"
              ref={fileInputRef}
            />
            <label htmlFor="file-upload">
              <Typography variant="body2">Max 5 MB, PNG, JPEG</Typography>
              <Button
                variant="contained"
                sx={{ mt: 1 }}
                onClick={() => fileInputRef.current.click()}
              >
                Browse File
              </Button>
            </label>
            {productImage && (
              <Box sx={{ mt: 2 }}>
                <Typography>{productImage.name}</Typography>
                {imagePreview && (
                  <Box
                    component="img"
                    src={imagePreview}
                    alt="Preview"
                    sx={{
                      mt: 2,
                      maxHeight: 150,
                      maxWidth: "100%"
                    }}
                  />
                )}
                <Typography
                  variant="caption"
                  display="block"
                  sx={{ mt: 1, color: "text.secondary" }}
                >
                  Image will be uploaded to Cloudinary when you submit the form
                </Typography>
              </Box>
            )}
          </Box>

          <Typography variant="h6" gutterBottom>
            Basic Information
          </Typography>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Product Name"
                name="name"
                value={product.name}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="SKU"
                name="sku"
                value={product.sku}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Price (ADA)"
                type="number"
                name="price"
                value={product.price}
                onChange={handleInputChange}
                inputProps={{ min: 0, step: 0.1 }}
                required
                helperText="Price will be formatted as '4.' format"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Stock"
                type="number"
                name="stock"
                value={product.stock}
                onChange={handleInputChange}
                inputProps={{ min: 0 }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                name="description"
                value={product.description}
                onChange={handleInputChange}
                required
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />
          <Typography variant="h6" gutterBottom>
            Category Information
          </Typography>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Category Name"
                name="category_name"
                value={product.category_name}
                onChange={handleInputChange}
                required
                disabled={product.subcategory.id !== 0}
                helperText={
                  product.subcategory.id !== 0
                    ? "Auto-filled from subcategory selection"
                    : ""
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!subcategoryError}>
                <InputLabel id="subcategory-select-label">
                  Subcategory
                </InputLabel>
                <Select
                  labelId="subcategory-select-label"
                  id="subcategory-select"
                  value={product.subcategory.id || ""}
                  label="Subcategory"
                  onChange={handleSubcategoryChange}
                  disabled={isLoadingSubcategories}
                  required
                >
                  {isLoadingSubcategories ? (
                    <MenuItem value="" disabled>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <CircularProgress size={20} sx={{ mr: 1 }} />
                        Loading subcategories...
                      </Box>
                    </MenuItem>
                  ) : subcategories.length === 0 ? (
                    <MenuItem value="" disabled>
                      No subcategories available
                    </MenuItem>
                  ) : (
                    subcategories.map(subcategory => (
                      <MenuItem key={subcategory.id} value={subcategory.id}>
                        {subcategory.name} ({subcategory.category.name})
                      </MenuItem>
                    ))
                  )}
                </Select>
                {subcategoryError && (
                  <FormHelperText>{subcategoryError}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            
          </Grid>

          <Divider sx={{ my: 3 }} />
          <Typography variant="h6" gutterBottom>
            Product Specifications
          </Typography>

          <Box sx={{ mb: 3 }}>
            {/* Specifications as key-value pairs */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2
              }}
            >
              <Typography variant="subtitle1">
                Specifications (Properties & Values)
              </Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={() => {
                  const currentSpecs = product.specifications
                    ? JSON.parse(product.specifications)
                    : {}
                  const updatedSpecs = { ...currentSpecs, "": "" }
                  setProduct(prev => ({
                    ...prev,
                    specifications: JSON.stringify(updatedSpecs)
                  }))
                }}
              >
                Add Specification
              </Button>
            </Box>

            {Object.entries(
              product.specifications ? JSON.parse(product.specifications) : {}
            ).map(([key, value], index) => (
              <Grid container spacing={2} key={index} sx={{ mb: 1 }}>
                <Grid item xs={5}>
                  <TextField
                    fullWidth
                    label="Property"
                    value={key}
                    onChange={e => {
                      const currentSpecs = product.specifications
                        ? JSON.parse(product.specifications)
                        : {}
                      const entries = Object.entries(currentSpecs)
                      // Update the key at this index
                      entries[index] = [e.target.value, entries[index][1]]
                      // Rebuild object from entries
                      const updatedSpecs = Object.fromEntries(entries)
                      setProduct(prev => ({
                        ...prev,
                        specifications: JSON.stringify(updatedSpecs)
                      }))
                    }}
                    placeholder="e.g., Color, Size, Material"
                  />
                </Grid>
                <Grid item xs={5}>
                  <TextField
                    fullWidth
                    label="Value"
                    value={value}
                    onChange={e => {
                      const currentSpecs = product.specifications
                        ? JSON.parse(product.specifications)
                        : {}
                      const entries = Object.entries(currentSpecs)
                      // Update the value at this index
                      entries[index] = [entries[index][0], e.target.value]
                      // Rebuild object from entries
                      const updatedSpecs = Object.fromEntries(entries)
                      setProduct(prev => ({
                        ...prev,
                        specifications: JSON.stringify(updatedSpecs)
                      }))
                    }}
                    placeholder="e.g., Red, XL, Cotton"
                  />
                </Grid>
                <Grid
                  item
                  xs={2}
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <Button
                    color="error"
                    onClick={() => {
                      const currentSpecs = product.specifications
                        ? JSON.parse(product.specifications)
                        : {}
                      const entries = Object.entries(currentSpecs)
                      // Remove this entry
                      entries.splice(index, 1)
                      // Rebuild object from remaining entries
                      const updatedSpecs = Object.fromEntries(entries)
                      setProduct(prev => ({
                        ...prev,
                        specifications: JSON.stringify(updatedSpecs)
                      }))
                    }}
                  >
                    Remove
                  </Button>
                </Grid>
              </Grid>
            ))}

            {(!product.specifications ||
              Object.keys(JSON.parse(product.specifications)).length === 0) && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 1, mb: 2 }}
              >
                No specifications added yet. Click "Add Specification" to begin.
              </Typography>
            )}
          </Box>

          <Box textAlign="center" mt={3}>
            <Button
              type="submit"
              variant="contained"
              disabled={isLoading}
              size="large"
              startIcon={
                isUploadingImage && (
                  <CircularProgress size={20} color="inherit" />
                )
              }
            >
              {isLoading
                ? isUploadingImage
                  ? "Uploading Image & Creating Product..."
                  : "Creating Product..."
                : "Create Product"}
            </Button>
          </Box>
        </Paper>
      </Box>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError("")}
      >
        <Alert severity="error" onClose={() => setError("")}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => setSuccess(false)}
      >
        <Alert severity="success" onClose={() => setSuccess(false)}>
          Product created successfully!
        </Alert>
      </Snackbar>
    </>
  )
}
