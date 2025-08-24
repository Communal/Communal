"use client";

import { useEffect, useState } from "react";

export default function CompaniesPage() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/product/company-counts");
        const data = await res.json();
        setCompanies(data);
      } catch (err) {
        console.error("Failed to load company product counts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p className="p-4">Loading company stats...</p>;
  }

  if (!companies.length) {
    return <p className="p-4">No company data available.</p>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Company Product Stats</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map((c) => (
          <div
            key={c.companyId}
            className="p-4 rounded-2xl shadow-md bg-white border hover:shadow-lg transition"
          >
            <div className="flex items-center gap-3 mb-4">
              {c.companyLogo ? (
                <img
                  src={c.companyLogo}
                  alt={c.companyName}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                  {c.companyName[0]}
                </div>
              )}
              <h2 className="text-lg font-semibold">{c.companyName}</h2>
            </div>

            <div className="flex justify-between text-sm">
              <span className="font-medium text-green-600">
                Sold: {c.sold}
              </span>
              <span className="font-medium text-red-600">
                Unsold: {c.unsold}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
