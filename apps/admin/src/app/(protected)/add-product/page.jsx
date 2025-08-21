"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Select } from "@/components/Select";
import ConfirmModal from "@/components/ConfirmModal";

export default function ProductPage() {
  const { id } = useParams();
  const router = useRouter();

  const [companies, setCompanies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(id || "");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [productsMap, setProductsMap] = useState({});
  const [newProduct, setNewProduct] = useState({ name: "", price: "", info: "" });
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // Fetch companies
  useEffect(() => {
    const cached = sessionStorage.getItem("companies");
    if (cached) {
      const data = JSON.parse(cached);
      setCompanies(data);
      setLoadingCompanies(false);
      if (!selectedCompany && data.length > 0) {
        setSelectedCompany(data[0]._id);
      }
      return;
    }

    fetch("/api/company/list")
      .then(res => res.json())
      .then(data => {
        if (data.companies) {
          setCompanies(data.companies);
          sessionStorage.setItem("companies", JSON.stringify(data.companies));
          setLoadingCompanies(false);
          if (!selectedCompany && data.companies.length > 0) setSelectedCompany(data.companies[0]._id);
        }
      })
      .catch(err => {
        console.error(err);
        setLoadingCompanies(false);
      });
  }, []);

  // Fetch categories when company changes
  useEffect(() => {
    if (!selectedCompany) return;

    setLoadingCategories(true);

    fetch(`/api/sub-category/${selectedCompany}`)
      .then(res => res.json())
      .then(data => {
        // Note: matches your GET route response structure
        setCategories(data.subCategories || []);
        if (data.subCategories.length > 0 && !selectedCategory) {
          setSelectedCategory(data.subCategories[0]._id);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoadingCategories(false));
  }, [selectedCompany]);

  // Fetch products when company or category changes
  useEffect(() => {
    if (!selectedCompany || !selectedCategory) return;
    setLoadingProducts(true);

    fetch(`/api/product/${selectedCategory}`)
      .then(res => res.json())
      .then(data => {
        setProductsMap(prev => ({ ...prev, [selectedCategory]: data.products || [] }));
      })
      .catch(err => {
        console.error(err);
        setProductsMap(prev => ({ ...prev, [selectedCategory]: [] }));
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
    if (!newProduct.name || !selectedCategory) return;

    const res = await fetch("/api/product/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newProduct, company: selectedCompany, category: selectedCategory }),
    });

    const added = await res.json();
    setProductsMap(prev => ({
      ...prev,
      [selectedCategory]: [...(prev[selectedCategory] || []), added],
    }));

    setNewProduct({ name: "", price: "", info: "" });
  };

  const confirmDelete = productId => {
    setProductToDelete(productId);
    setModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    await fetch(`/api/product/remove/${productToDelete}`, { method: "DELETE" });
    setProductsMap(prev => ({
      ...prev,
      [selectedCategory]: (prev[selectedCategory] || []).filter(p => p._id !== productToDelete),
    }));
    setModalOpen(false);
    setProductToDelete(null);
  };

  const currentProducts = productsMap[selectedCategory] || [];

  return (
    <div className="p-4">
      <div className="mb-4">
        <h1 className="text-xl font-bold mb-2">Select Category </h1>
        {/* Company dropdown */}
        <Select
          options={companies.map(c => ({
            label: c.name,
            value: c._id,
            icon: c.logo ? <img src={c.logo} alt={c.name} className="w-6 h-6 mr-2 rounded-full" /> : null,
          }))}
          value={selectedCompany}
          onChange={handleCompanyChange}
          placeholder="Select Company"
          isDisabled={loadingCompanies}
        />
      </div>

      <div>
        <h1 className="text-xl font-bold mb-2">Select Sub-Category</h1>
        {/* Category dropdown */}
        <Select
          options={categories.map(c => ({ label: c.name, value: c._id }))}
          value={selectedCategory}
          onChange={handleCategoryChange}
          placeholder="Select Category"
          isDisabled={loadingCategories || !selectedCompany}
        />

        {/* Add product form */}
        {selectedCompany && selectedCategory && (
          <div className="mt-4 flex gap-2">
            <input
              type="text"
              value={newProduct.name}
              onChange={e => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Product Name"
              className="border px-3 py-2 rounded w-1/3"
            />
            <input
              type="number"
              value={newProduct.price}
              onChange={e => setNewProduct(prev => ({ ...prev, price: e.target.value }))}
              placeholder="Price"
              className="border px-3 py-2 rounded w-1/6"
            />
            <input
              type="text"
              value={newProduct.info}
              onChange={e => setNewProduct(prev => ({ ...prev, info: e.target.value }))}
              placeholder="Info"
              className="border px-3 py-2 rounded w-1/3"
            />
            <button onClick={handleAdd} className="bg-orange-500 text-white px-4 py-2 rounded">
              Add
            </button>
          </div>
        )}
      </div>

      {/* Products list */}
      <div className="mt-4">
        {loadingProducts ? (
          <p>Loading products...</p>
        ) : currentProducts.length > 0 ? (
          currentProducts.map(p => (
            <div key={p._id} className="flex justify-between items-center bg-orange-500 text-white px-3 py-2 mb-2 rounded">
              <span>{p.name} - ₦{p.price}</span>
              <button onClick={() => confirmDelete(p._id)} className="bg-red-600 px-3 py-1 rounded">Delete</button>
            </div>
          ))
        ) : (
          <p>No products found for this category.</p>
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
