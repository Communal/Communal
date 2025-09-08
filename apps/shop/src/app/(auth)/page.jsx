"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRightIcon, LibraryBig } from "lucide-react";

export default function Home() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if we already cached companies
    const cached = sessionStorage.getItem("companies-list");
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setCompanies(parsed);
        setLoading(false);
        return;
      } catch (err) {
        console.warn("Failed to parse cached companies:", err);
        sessionStorage.removeItem("companies-list");
      }
    }

    // Fetch from API
    fetch("/api/company/list")
      .then(res => res.json())
      .then(data => {
        if (data?.companies) {
          setCompanies(data.companies);
          sessionStorage.setItem("companies-list", JSON.stringify(data.companies));
        }
      })
      .catch(err => console.error("Failed to fetch companies:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="flex-1 flex flex-col items-center px-2 py-6">
      <div className="w-full max-w-2xl rounded-xl overflow-hidden bg-background-2 shadow-md mb-8">
        <div className="flex items-center gap-2 px-4 py-2 mb-1">
          <LibraryBig className="size-6" />
          <span className="text-lg font-semibold text-foreground">
            Select Catgory
          </span>
        </div>

        {loading ? (
          <p className="px-4 py-3">Loading categories...</p>
        ) : companies.length > 0 ? (
          companies.map(c => (
            <Link
              key={c._id}
              href={`/category/${c._id}`}
              className="flex items-center justify-between gap-2 bg-foreground text-background transition p-3 border border-neutral-200 shadow-sm"
            >
              <div className="flex items-center gap-2">
                {c.logo ? (
                  <Image
                    width={100}
                    height={100}
                    src={c.logo}
                    alt={c.name}
                    className="size-8 border border-neutral-400 rounded-full"
                  />
                ) : (
                  <div className="size-8 border border-neutral-400 rounded-full bg-gray-200" />
                )}
                <span>{c.name}</span>
              </div>
              <ChevronRightIcon className="size-5 text-background" />
            </Link>
          ))
        ) : (
          <p className="px-4 py-3">No categories found.</p>
        )}
      </div>
    </main>
  );
}
