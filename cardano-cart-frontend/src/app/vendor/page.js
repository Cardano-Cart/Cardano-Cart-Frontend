"use client";
import { useState } from "react";
import Button from "@mui/material/Button";
import Header from "../_components/Header";

export default function CreateProduct() {
  const [purchaseType, setPurchaseType] = useState("Fixed Price");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const [category, setCategory] = useState("");

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  return (
    <>
      <Header />
      <form className="container mx-auto p-6">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Create Item</h2>
          <div className="border-dashed border-2 border-gray-300 rounded-lg p-6 text-center mb-6">
            <input
              type="file"
              accept="image/*,audio/*,video/*"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer p-4 rounded-lg"
            >
              <p>Max *** MB, PNG, JPEG</p>
              <Button
                variant="contained"
                color="primary"
                className="mt-2 px-4 py-2  text-white rounded"
              >
                Browse File
              </Button>
            </label>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Purchase Type</h3>
            <div className="flex space-x-4">
              {["Fixed Price", "Promotion"].map((type) => (
                <Button
                  key={type}
                  onClick={() => setPurchaseType(type)}
                  className="flex-1 px-4 py-2 rounded-lg mt-2"
                  variant="contained"
                  color={purchaseType === type ? "primary" : "default"}
                >
                  {type}
                </Button>
              ))}
            </div>
            <p className="text-gray-500 mt-2">
              {purchaseType === "Fixed Price"
                ? "Set fixed price for people to buy your product instantly"
                : "Allow promotion to porduct"}
            </p>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Main Details</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-600 mb-1">Product Name</label>
                <input
                  type="text"
                  id="productName"
                  placeholder="Abstract 3D Design"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Price(ADA)</label>
                <input
                  type="number"
                  id="productPrice"
                  placeholder="2.55"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Quantity</label>
                <input
                  type="number"
                  id="productQuantity"
                  placeholder="20"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                />
              </div>
              <div>
                <div className="mb-6">
                  <label className="block text-gray-600 mb-1 ">Category</label>
                  <select
                    value={category}
                    onChange={handleCategoryChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                  >
                    <option value="">Select Category</option>
                    <option value="Option 1">Option 1</option>
                    <option value="Option 2">Option 2</option>
                    <option value="Option 3">Option 3</option>
                    <option value="Option 4">Option 4</option>
                    <option value="Others">Others</option>
                  </select>
                </div>

                {category === "Others" && (
                  <div className="mb-6">
                    <label className="block text-gray-600 mb-1">
                      Specify Category
                    </label>
                    <input
                      type="text"
                      placeholder="Enter category"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                    />
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Description</label>
              <textarea
                placeholder="Provide a detailed description of the item."
                className="w-full px-3 py-2 border rounded-lg resize-none focus:outline-none"
                rows="4"
              ></textarea>
            </div>
          </div>
          <div className="text-center">
            <Button
              variant="contained"
              color="primary"
              className="px-6 py-3  text-white rounded-lg"
            >
              Create Product
            </Button>
          </div>
        </div>
      </form>
    </>
  );
}
