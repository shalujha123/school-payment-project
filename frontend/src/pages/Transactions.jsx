import React, { useEffect, useState } from "react";
import API from "../api";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(5); // rows per page
  const [loading, setLoading] = useState(false);

  const fetchTransactions = async (pageNum) => {
    setLoading(true);
    try {
      const res = await API.get(
        `/transactions?page=${pageNum}&limit=${limit}&sort=payment_time&order=desc`
      );
      setTransactions(res.data.results);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTransactions(page);
  }, [page]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Transactions Overview</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="table-auto w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2">Collect ID</th>
              <th className="px-4 py-2">School ID</th>
              <th className="px-4 py-2">Gateway</th>
              <th className="px-4 py-2">Order Amount</th>
              <th className="px-4 py-2">Transaction Amount</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Custom Order ID</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.collect_id} className="border-t text-center">
                <td className="px-4 py-2">{tx.collect_id}</td>
                <td className="px-4 py-2">{tx.school_id}</td>
                <td className="px-4 py-2">{tx.gateway}</td>
                <td className="px-4 py-2">{tx.order_amount}</td>
                <td className="px-4 py-2">{tx.transaction_amount}</td>
                <td
                  className={`px-4 py-2 font-semibold ${
                    tx.status === "success"
                      ? "text-green-600"
                      : tx.status === "failed"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  {tx.status}
                </td>
                <td className="px-4 py-2">{tx.custom_order_id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Pagination */}
      <div className="flex justify-between mt-4">
        <button
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span>Page {page}</span>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          className="px-4 py-2 bg-gray-300 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}
