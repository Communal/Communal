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

  // Load categories with sessionStorage cache
  useEffect(() => {
    if (!companyId) return;

    const cached = sessionStorage.getItem(`categories-${companyId}`);
    if (cached) {
      setCategories(JSON.parse(cached));
    } else {
      fetch(`/api/category/${companyId}/categories`)
        .then((res) => res.json())
        .then((data) => {
          setCategories(data);
          sessionStorage.setItem(
            `categories-${companyId}`,
            JSON.stringify(data)
          );
        })
        .catch((err) => console.error("Error fetching categories:", err));
    }
  }, [companyId]);

  // Load products when a category is chosen
  useEffect(() => {
    if (!selectedCategory || selectedCategory === "none") return;

    const cacheKey = `products-${selectedCategory}`;
    const cached = sessionStorage.getItem(cacheKey);

    if (cached) {
      setProducts(JSON.parse(cached));
      return;
    }

    setLoadingProducts(true);
    fetch(`/api/category/${selectedCategory}/products`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        sessionStorage.setItem(cacheKey, JSON.stringify(data));
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
        // label="Category"
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
