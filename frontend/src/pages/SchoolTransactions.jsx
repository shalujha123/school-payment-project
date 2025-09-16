import React, { useState } from "react";
import API from "../api";

export default function SchoolTransactions() {
  const [schoolId, setSchoolId] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");

  const fetchSchoolTransactions = async () => {
    try {
      setError("");
      const res = await API.get(`/transactions/school/${schoolId}`);
      setTransactions(res.data.results || []);
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to fetch transactions");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Transactions by School</h1>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter School ID"
          value={schoolId}
          onChange={(e) => setSchoolId(e.target.value)}
          className="border p-2 rounded w-80"
        />
        <button
          onClick={fetchSchoolTransactions}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Fetch
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {transactions.length > 0 ? (
        <table className="table-auto w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2">Collect ID</th>
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
                <td className="px-4 py-2">{tx.gateway}</td>
                <td className="px-4 py-2">{tx.order_amount}</td>
                <td className="px-4 py-2">{tx.transaction_amount}</td>
                <td className="px-4 py-2">{tx.status}</td>
                <td className="px-4 py-2">{tx.custom_order_id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No transactions found</p>
      )}
    </div>
  );
}
