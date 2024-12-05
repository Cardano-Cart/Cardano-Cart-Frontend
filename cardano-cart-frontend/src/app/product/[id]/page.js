"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Header from "../../_components/Header";
import Button from "@mui/material/Button";
import { current_products } from "../../data";
import { useCart } from "react-use-cart";
// import handleAddToCart from "../../hooks/handleAddToCart";

export default function ProductPage() {
  const { id } = useParams(); // Get the dynamic route ID
  const [product, setProduct] = useState(null);
  const { addItem } = useCart();

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
          // Fallback to local data if no access token
          const selectedProduct = current_products.find(
            (prod) => prod.id === parseInt(id)
          );
          setProduct(selectedProduct || null);
        }
      }
    };

    fetchProduct();
  }, [id]);

  // Display a loading state if product data is not available
  if (!product) return <p>Loading product...</p>;
  const handleAddToCart = () => {
    // e.stopPropagation(); // Prevent the event from bubbling up
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0].image_url,
    });
    onAddToCart(`${product.name} added to cart successfully!`);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center p-8 rounded-lg shadow-md">
        <div className="bg-white shadow-lg rounded-lg p-6 max-w-4xl flex flex-col lg:flex-row gap-8">
          {/* Product Image */}
          <div className="flex-shrink-0">
            <Image
              src={product.images[0].image_url}
              alt={product.name}
              width={400}
              height={400}
              className="object-cover rounded-lg"
            />
          </div>

          {/* Product Details */}
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
                onClick={handleAddToCart}
                variant="contained"
                color="primary"
                className="mt-2 px-4 py-2 text-white rounded"
              >
                Add to Cart
              </Button>
              <Button
                variant="contained"
                color="primary"
                className="mt-2 px-4 py-2 text-white rounded"
              >
                Buy Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
