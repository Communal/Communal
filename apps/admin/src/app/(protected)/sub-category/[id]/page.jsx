"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Select } from "@/components/Select";
import CategoryCard from "@/components/CategoryCard";

export default function SubCategoryPage() {
  const { id } = useParams();
  const router = useRouter();

  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(id || "");
  const [subCategoriesMap, setSubCategoriesMap] = useState({});
  const [newSub, setNewSub] = useState("");
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [loadingSubCategories, setLoadingSubCategories] = useState(false);

  // Modal state for CategoryCard
  // const [modalOpen, setModalOpen] = useState(false);
  // const [subToDelete, setSubToDelete] = useState(null);

  // Fetch companies once
  useEffect(() => {
    const cached = sessionStorage.getItem("companies");
    if (cached) {
      const data = JSON.parse(cached);
      setCompanies(data);
      setLoadingCompanies(false);

      if (!selectedCompany && data.length > 0) {
        const firstId = data[0]._id;
        setSelectedCompany(firstId);
        if (!id) router.replace(`/sub-category/${firstId}`);
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

          if (!selectedCompany && data.companies.length > 0) {
            const firstId = data.companies[0]._id;
            setSelectedCompany(firstId);
            if (!id) router.replace(`/sub-category/${firstId}`);
          }
        }
      })
      .catch(err => {
        console.error("Failed to fetch companies:", err);
        setLoadingCompanies(false);
      });
  }, []);

  // Fetch subcategories when selectedCompany changes
  useEffect(() => {
    if (!selectedCompany) return;

    setLoadingSubCategories(true);

    fetch(`/api/sub-category/${selectedCompany}`)
      .then(res => res.json())
      .then(data => {
        setSubCategoriesMap(prev => ({
          ...prev,
          [selectedCompany]: data.subCategories || [],
        }));
      })
      .catch(err => {
        console.error(err);
        setSubCategoriesMap(prev => ({ ...prev, [selectedCompany]: [] }));
      })
      .finally(() => setLoadingSubCategories(false));
  }, [selectedCompany]);

  const handleCompanyChange = (newId) => {
    if (newId === selectedCompany) return;
    setSelectedCompany(newId);
    router.push(`/sub-category/${newId}`);
  };

  const handleAdd = async () => {
    if (!newSub.trim() || !selectedCompany) return;

    const res = await fetch("/api/sub-category/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newSub, company: selectedCompany }),
    });

    const added = await res.json();

    setSubCategoriesMap(prev => ({
      ...prev,
      [selectedCompany]: [...(prev[selectedCompany] || []), added],
    }));

    setNewSub("");
  };

  const handleDelete = async (subId) => {
    await fetch(`/api/sub-category/remove/${subId}`, { method: "DELETE" });
    setSubCategoriesMap(prev => ({
      ...prev,
      [selectedCompany]: (prev[selectedCompany] || []).filter(s => s._id !== subId),
    }));
  };

  const currentSubCategories = subCategoriesMap[selectedCompany] || [];

  const options = loadingCompanies
    ? [{ value: "", label: "Loading companies..." }]
    : companies.map(c => ({
      label: c.name,
      value: c._id,
      icon: c.logo ? <img src={c.logo} alt={c.name} className="w-4 h-4 rounded-full" /> : null,
    }));

  return (
    <div className="p-6">
      {/* Company dropdown */}
      <Select
        options={options}
        value={selectedCompany}
        onChange={handleCompanyChange}
        placeholder="Select Company"
        isDisabled={loadingCompanies}
      />

      {/* Add subcategory input */}
      {selectedCompany && (
        <div className="mt-4 flex gap-2">
          <input
            type="text"
            value={newSub}
            onChange={e => setNewSub(e.target.value)}
            placeholder="New Sub-category"
            className="border px-3 py-2 rounded w-full"
          />
          <button
            onClick={handleAdd}
            className="bg-orange-500 text-white px-4 py-2 rounded"
          >
            Add
          </button>
        </div>
      )}

      {/* Subcategories list using CategoryCard */}
      <div className="mt-4">
        {loadingSubCategories ? (
          <p className="text-sm text-muted-foreground mt-2">
            Loading subcategories...
          </p>
        ) : currentSubCategories.length > 0 ? (
          currentSubCategories.map(s => (
            <CategoryCard
              key={s._id}
              id={s._id}
              name={s.name}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <p className="text-sm text-muted-foreground mt-2">
            No subcategories found for this company.
          </p>
        )}
      </div>
    </div>
  );
}
