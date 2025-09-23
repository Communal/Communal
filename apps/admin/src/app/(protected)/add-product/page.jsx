"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Select } from "@/components/Select";
import ConfirmModal from "@/components/ConfirmModal";

/**
 * ProductPage
 * - Fetches companies (cached in sessionStorage)
 * - Fetches categories for selected company
 * - Fetches unsold products for selected category using API (expects { products, count })
 * - Shows the unsold products count before the list
 */

export default function ProductPage() {
  const { id } = useParams();
  const router = useRouter();

  const [companies, setCompanies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(id || "");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [productsMap, setProductsMap] = useState({});
  const [productsCountMap, setProductsCountMap] = useState({});
  const [newProduct, setNewProduct] = useState({ name: "", price: "", info: "" });

  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // Modal state for delete
  const [modalOpen, setModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // Fetch companies (cached)
  useEffect(() => {
    const cached = sessionStorage.getItem("companies");
    if (cached) {
      try {
        const data = JSON.parse(cached);
        setCompanies(data);
        setLoadingCompanies(false);
        if (!selectedCompany && data.length > 0) {
          setSelectedCompany(data[0]._id);
        }
        return;
      } catch (e) {
        console.warn("Failed to parse cached companies, refetching", e);
        sessionStorage.removeItem("companies");
      }
    }

    fetch("/api/company/list")
      .then(res => res.json())
      .then(data => {
        if (data.companies) {
          setCompanies(data.companies);
          sessionStorage.setItem("companies", JSON.stringify(data.companies));
          if (!selectedCompany && data.companies.length > 0) {
            // If route provided an id, keep it; otherwise default to first company
            setSelectedCompany(prev => prev || data.companies[0]._id);
          }
        }
      })
      .catch(err => {
        console.error("Failed fetching companies:", err);
      })
      .finally(() => setLoadingCompanies(false));
  }, []);

  // Fetch categories when company changes
  useEffect(() => {
    if (!selectedCompany) {
      setCategories([]);
      setSelectedCategory("");
      return;
    }

    setLoadingCategories(true);
    fetch(`/api/sub-category/${selectedCompany}`)
      .then(res => res.json())
      .then(data => {
        // route returns { subCategories: [...] }
        const subs = data.subCategories || [];
        setCategories(subs);
        if (subs.length > 0 && !selectedCategory) {
          setSelectedCategory(subs[0]._id);
        } else if (subs.length === 0) {
          setSelectedCategory("");
        }
      })
      .catch(err => {
        console.error("Failed fetching sub-categories:", err);
        setCategories([]);
        setSelectedCategory("");
      })
      .finally(() => setLoadingCategories(false));
  }, [selectedCompany]);

  // Fetch products when category changes
  useEffect(() => {
    if (!selectedCompany || !selectedCategory) return;

    setLoadingProducts(true);

    fetch(`/api/product/${selectedCategory}`)
      .then(res => res.json())
      .then(data => {
        const products = data.products || [];
        const count = typeof data.count === "number" ? data.count : products.length;
        setProductsMap(prev => ({ ...prev, [selectedCategory]: products }));
        setProductsCountMap(prev => ({ ...prev, [selectedCategory]: count }));
      })
      .catch(err => {
        console.error("Failed fetching products for category:", err);
        setProductsMap(prev => ({ ...prev, [selectedCategory]: [] }));
        setProductsCountMap(prev => ({ ...prev, [selectedCategory]: 0 }));
      })
      .finally(() => setLoadingProducts(false));
  }, [selectedCompany, selectedCategory]);

  const handleCompanyChange = newId => {
    setSelectedCompany(newId);
    setSelectedCategory("");
  };

  const handleCategoryChange = newId => {
    setSelectedCategory(newId);
  };

  const handleAdd = async () => {
    if (!selectedCategory || !selectedCompany || !newProduct.price) return;

    try {
      const res = await fetch("/api/product/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          price: newProduct.price,
          info: newProduct.info,
          data: newProduct.data,
          company: selectedCompany,
          category: selectedCategory,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || "Failed to add product");
      }

      const added = await res.json();

      setProductsMap(prev => ({
        ...prev,
        [selectedCategory]: [...(prev[selectedCategory] || []), added],
      }));

      setProductsCountMap(prev => ({
        ...prev,
        [selectedCategory]: (prev[selectedCategory] || 0) + 1,
      }));

      setNewProduct({ price: "", info: "", data: "" });
    } catch (err) {
      console.error("Add product error:", err);
    }
  };

  const confirmDelete = productId => {
    setProductToDelete(productId);
    setModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;

    try {
      const res = await fetch(`/api/product/remove/${productToDelete}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || "Failed to delete product");
      }

      // Remove from local map
      setProductsMap(prev => ({
        ...prev,
        [selectedCategory]: (prev[selectedCategory] || []).filter(p => p._id !== productToDelete),
      }));

      // decrement count
      setProductsCountMap(prev => ({
        ...prev,
        [selectedCategory]: Math.max(0, (prev[selectedCategory] || 1) - 1),
      }));
    } catch (err) {
      console.error("Delete product error:", err);
      // Optionally show toast / UI feedback
    } finally {
      setModalOpen(false);
      setProductToDelete(null);
    }
  };

  const currentProducts = productsMap[selectedCategory] || [];
  const currentCount = productsCountMap[selectedCategory] ?? currentProducts.length;

  return (
    <div className="p-4">
      <div className="mb-4">
        <h1 className="text-xl font-bold mb-2">Select Category</h1>

        <Select
          options={companies.map(c => ({
            label: c.name,
            value: c._id,
            // the Select component might expect icon nodes; if it doesn't handle <img>, remove the icon field
            icon: c.logo ? <img src={c.logo} alt={c.name} className="w-6 h-6 mr-2 rounded-full" /> : null,
          }))}
          value={selectedCompany}
          onChange={handleCompanyChange}
          placeholder="Select Company"
          isDisabled={loadingCompanies}
        />
      </div>

      <div className="mb-6">
        <h1 className="text-xl font-bold mb-2">Select Sub-Category</h1>

        <Select
          options={categories.map(c => ({ label: c.name, value: c._id }))}
          value={selectedCategory}
          onChange={handleCategoryChange}
          placeholder="Select Category"
          isDisabled={loadingCategories || !selectedCompany}
        />

        {/* Add product form */}
        {selectedCompany && selectedCategory && (
          <div className="mt-4 flex flex-col gap-3 max-w-lg">
            <input
              type="number"
              value={newProduct.price}
              onChange={e => setNewProduct(prev => ({ ...prev, price: e.target.value }))}
              placeholder="Price"
              className="border px-3 py-2 rounded"
            />
            <input
              type="text"
              value={newProduct.info}
              onChange={e => setNewProduct(prev => ({ ...prev, info: e.target.value }))}
              placeholder="Info"
              className="border px-3 py-2 rounded"
            />
            <textarea
              value={newProduct.data}
              onChange={e => setNewProduct(prev => ({ ...prev, data: e.target.value }))}
              placeholder="Data"
              className="border px-3 py-2 rounded h-32 resize-y"
            />
            <button
              onClick={handleAdd}
              className="bg-orange-500 text-white px-4 py-2 rounded self-start"
            >
              Add Product
            </button>
          </div>
        )}
      </div>

      {/* Products list */}
      {/* Products list */}
      <div className="mt-4">
        {loadingProducts ? (
          <p>Loading products...</p>
        ) : (
          <>
            <p className="mb-2 font-medium">
              Found {currentCount} unsold product{currentCount === 1 ? "" : "s"} for this category.
            </p>

            {currentProducts.length > 0 ? (
              currentProducts.map(p => (
                <div
                  key={p._id}
                  className="flex justify-between items-start bg-orange-500 text-white px-3 py-2 mb-2 rounded"
                >
                  <div>
                    <span className="font-semibold">
                      {p.name} - ${p.price}
                      {p.company?.name ? (
                        <span className="text-sm opacity-80"> · {p.company.name}</span>
                      ) : null}
                    </span>
                    {/* show data if available */}
                    {p.data ? (
                      <p className="text-sm mt-1 opacity-90 whitespace-pre-line">
                        {p.data}
                      </p>
                    ) : null}
                  </div>

                  <button
                    onClick={() => confirmDelete(p._id)}
                    className="bg-red-600 px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              ))
            ) : (
              <p>No products found for this category.</p>
            )}
          </>
        )}
      </div>


      <ConfirmModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Product"
        message="Are you sure you want to delete this product?"
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
}
