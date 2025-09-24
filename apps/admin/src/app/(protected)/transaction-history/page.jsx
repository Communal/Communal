"use client";

import { useEffect, useState } from "react";

export default function AdminTransactionsPage() {
  const [data, setData] = useState({
    totalAmount: 0,
    transactions: [],
    pagination: { page: 1, pages: 1 },
  });

  const fetchData = async (page = 1) => {
    try {
      const res = await fetch(`/api/transactions?page=${page}&limit=20`);
      if (!res.ok) throw new Error("Failed to fetch transactions");
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Admin Transactions</h1>

      {/* Total */}
      <div className="p-4 rounded-xl shadow-md bg-white">
        <p className="text-lg font-semibold text-gray-700">
          Total Credited Amount:
        </p>
        <p className="text-2xl font-bold text-green-600">
          ₦{data.totalAmount.toLocaleString()}
        </p>
      </div>

      {/* Table */}
      <div className="p-4 rounded-xl shadow-md bg-white overflow-x-auto">
        <h2 className="text-lg font-semibold mb-4">Successful Transactions</h2>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="text-left border-b">
              <th className="p-2">User</th>
              <th className="p-2">Email</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {data.transactions.map((tx) => (
              <tr key={tx.id} className="border-b hover:bg-gray-50">
                <td className="p-2">{tx.user.name}</td>
                <td className="p-2 break-words">{tx.user.email}</td>
                <td className="p-2 font-medium text-green-600">
                  ₦{tx.amount.toLocaleString()}
                </td>
                <td className="p-2">
                  {new Date(tx.date).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div className="flex justify-center space-x-4 mt-4">
          <button
            disabled={data.pagination.page === 1}
            onClick={() => fetchData(data.pagination.page - 1)}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="px-4 py-2">
            Page {data.pagination.page} of {data.pagination.pages}
          </span>
          <button
            disabled={data.pagination.page === data.pagination.pages}
            onClick={() => fetchData(data.pagination.page + 1)}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
