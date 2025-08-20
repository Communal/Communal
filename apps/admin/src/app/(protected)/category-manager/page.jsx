'use client';

import PlatformItem from "@/components/PlatformItem";
import { useState, useEffect } from "react";
import {Input} from "@/components/Input";
import Button from "@/components/Button";

const CategoryManager = () => {
  const [companies, setCompanies] = useState([]);
  const [name, setName] = useState("");
  const [logo, setLogo] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch companies from backend
  const fetchCompanies = async () => {
    try {
      const res = await fetch("/api/admin/company/list");
      const data = await res.json();
      setCompanies(data.companies || []);
    } catch (err) {
      console.error("Error fetching companies:", err);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  // Add new company
  const handleAddCompany = async () => {
    if (!name) {
      setMessage("Name is required");
      return;
    }

    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/company/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, logo }),
      });
      const data = await res.json();

      if (res.ok) {
        setMessage("Company added successfully");
        setName("");
        setLogo("");
        fetchCompanies();
      } else {
        setMessage(data.error || "Failed to add company");
      }
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete company
  const handleDeleteCompany = async (id) => {
    setMessage("");
    try {
      const res = await fetch(`/api/admin/company/remove?id=${id}`, { method: "DELETE" });
      const data = await res.json();

      if (res.ok) {
        setMessage("Company deleted");
        setCompanies((prev) => prev.filter((c) => c._id !== id));
      } else {
        setMessage(data.error || "Failed to delete company");
      }
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Category Manager</h1>

      {/* Add Company Form */}
      <div className="flex flex-col gap-3 mb-6">
        <Input
          placeholder="Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          placeholder="Logo URL"
          value={logo}
          onChange={(e) => setLogo(e.target.value)}
        />
        <Button onClick={handleAddCompany} disabled={loading}>
          {loading ? "Adding..." : "Add Category"}
        </Button>
        {message && <p className="text-sm text-red-600">{message}</p>}
      </div>

      {/* Company List */}
      <div className="gap-6">
        {companies.map((company) => (
          <PlatformItem
            key={company._id}
            id={company._id}
            name={company.name}
            logo={company.logo || "/icons/default-image.png"}
            onDelete={handleDeleteCompany}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryManager;
