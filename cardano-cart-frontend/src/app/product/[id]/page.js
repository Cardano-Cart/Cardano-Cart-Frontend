"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Header from "../../_components/Header";
import Button from "@mui/material/Button";
import { current_products } from "../../data";
import { useCart } from "react-use-cart";
// import { getAllProducts } from "../.././utils/_products";
import {
  Container,
  Typography,
  Box,
  Grid,
  TextField,
  Alert,
  Snackbar,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addItem } = useCart();
  const [alertMessage, setAlertMessage] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (id) {
        const access_token = localStorage.getItem("accessToken");
        if (access_token) {
          try {
            const fetchedProducts = await getAllProducts(access_token); // Replace this with your API call
            const selectedProduct = fetchedProducts.find(
              (prod) => prod.id === parseInt(id) // Ensure id matches data type
            );
            setProduct(selectedProduct || null);
          } catch (error) {
            console.error("Error fetching product:", error);
          }
        } else {
          const selectedProduct = current_products.find(
            (prod) => prod.id === parseInt(id)
          );
          setProduct(selectedProduct || null);
        }
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) return;
  const handleAddToCart = (product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0].image_url,
    });
    setAlertMessage(`${product.name} added to cart successfully!`);
    setAlertOpen(true);
  };

  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setAlertOpen(false);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center p-8 rounded-lg shadow-md">
        <div className="bg-white shadow-lg rounded-lg p-6 max-w-4xl flex flex-col lg:flex-row gap-8">
          <div className="flex-shrink-0">
            <Image
              src={product.images[0].image_url}
              alt={product.name}
              width={400}
              height={400}
              className="object-cover rounded-lg"
            />
          </div>

          <div className="flex-grow">
            <h1 className="text-2xl font-bold text-gray-800">{product.name}</h1>
            <div className="mt-1">
              <p className="text-xl font-semibold text-gray-800">
                Price: {product.price} ADA
              </p>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Category: {product.category}
            </p>
            <p className="text-lg text-gray-700 mt-4">{product.description}</p>

            {/* Add to Cart and Buy Now Buttons */}
            <div className="mt-8 flex gap-4">
              <Button
                onClick={() => handleAddToCart(product)}
                variant="contained"
                color="primary"
                className="mt-2 px-4 py-2 text-white rounded"
              >
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </div>
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
  );
}
