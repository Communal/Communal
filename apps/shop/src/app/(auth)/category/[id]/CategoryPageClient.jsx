"use client";

import { useState, useEffect } from "react";
import BackHome from "@/components/Home";
import { Select } from "@/components/Select";
import ProductCard from "@/components/Product";

export default function CategoryPageClient({ companyId }) {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loadingProducts, setLoadingProducts] = useState(false);

  // Load categories (no cache)
  useEffect(() => {
    if (!companyId) return;

    fetch(`/api/category/${companyId}/categories`)
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
      })
      .catch((err) => console.error("Error fetching categories:", err));
  }, [companyId]);

  // Load products when a category is chosen (no cache)
  useEffect(() => {
    if (!selectedCategory || selectedCategory === "none") return;

    setLoadingProducts(true);
    fetch(`/api/category/${selectedCategory}/products`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((err) => console.error("Error fetching products:", err))
      .finally(() => setLoadingProducts(false));
  }, [selectedCategory]);

  const options = [
    { value: "none", label: "Select a category" }, // default option
    ...categories.map((cat) => ({
      value: cat._id,
      label: cat.name,
    })),
  ];

  return (
    <main className="w-full flex flex-col gap-3">
      <BackHome />

      <Select
        value={selectedCategory}
        onChange={(val) => setSelectedCategory(val)}
        placeholder="Select a category"
        options={options}
        className="pt-4"
      />

      {categories.length === 0 ? (
        <p className="mt-6 text-center">No categories available.</p>
      ) : (
        selectedCategory !== "none" &&
        selectedCategory !== "" && (
          <div className="flex flex-col items-center mt-6">
            {loadingProducts ? (
              <p>Loading products...</p>
            ) : products.length > 0 ? (
              products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <p>No products found for this category.</p>
            )}
          </div>
        )
      )}
    </main>
  );
}
