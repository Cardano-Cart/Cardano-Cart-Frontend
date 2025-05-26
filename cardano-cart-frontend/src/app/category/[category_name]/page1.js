"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation" // ✅ Next.js App Router
import ProductGrid from "@/app/_components/ProductGrid"
import { allProducts } from "@/app/productdata/product"
import {getAllProducts} from "../../../../utils/_products"

const CategoryPage = () => {
  const params = useParams()
  const category_name = params.category_name
  
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)

 useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetchedProducts = await getAllProducts()

        // Sort by most recent
        const filteredProducts = fetchedProducts.filter(
        product =>
          product.category_name.toLowerCase() === category_name?.toLowerCase()
      )        
      console.log("Fetched Products:", filteredProducts)

        setProducts(filteredProducts)
        console.log(filteredProducts)
      } catch (error) {
        console.error("Error fetching products:", error)
      }
    }

    fetchProducts()
  }, [category_name])
  // Initialize with all products

 

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row gap-6 mt-8">
        <div className="flex-grow">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <>
              <div className="mb-6 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">
                  {products.length} Products Found
                </h2>
              </div>
              <ProductGrid products={products} />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default CategoryPage
