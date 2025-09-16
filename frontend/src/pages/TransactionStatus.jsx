import React, { useState } from "react";
import API from "../api";

export default function TransactionStatus() {
  const [orderId, setOrderId] = useState("");
  const [status, setStatus] = useState(null);
  const [error, setError] = useState("");

  const fetchStatus = async () => {
    try {
      setError("");
      setStatus(null);
      const res = await API.get(`/transaction-status/${orderId}`);
      setStatus(res.data);
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to fetch status");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Check Transaction Status</h1>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter Custom Order ID"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          className="border p-2 rounded w-80"
        />
        <button
          onClick={fetchStatus}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Check
        </button>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {status && (
        <div className="bg-white shadow p-4 rounded border w-96">
          <h2 className="font-bold mb-2">Transaction Info</h2>
          <p>
            <strong>Custom Order ID:</strong> {status.custom_order_id}
          </p>
          <p>
            <strong>Status:</strong> {status.status?.status || status.status}
          </p>
          <p>
            <strong>Amount:</strong>{" "}
            {status.status?.transaction_amount || status.status?.order_amount}
          </p>
          <p>
            <strong>Payment Time:</strong> {status.status?.payment_time}
          </p>
        </div>
      )}
    </div>
  );
}
