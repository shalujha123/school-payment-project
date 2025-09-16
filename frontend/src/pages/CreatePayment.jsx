import React, { useState } from "react";
import API from "../api";

export default function CreatePayment() {
  const [form, setForm] = useState({
    school_id: "",
    student_info: { name: "", id: "", email: "" },
    order_amount: "",
    gateway_name: "DummyGateway",
  });

  const [error, setError] = useState("");
  const [paymentUrl, setPaymentUrl] = useState("");
  const [customOrderId, setCustomOrderId] = useState(""); // ✅ new state

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["name", "id", "email"].includes(name)) {
      setForm({
        ...form,
        student_info: { ...form.student_info, [name]: value },
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setPaymentUrl("");
    setCustomOrderId("");

    try {
      const res = await API.post("/create-payment", form);
      const { payment_url, custom_order_id } = res.data; // ✅ get custom_order_id
      if (payment_url) {
        setPaymentUrl(payment_url);
      }
      if (custom_order_id) {
        setCustomOrderId(custom_order_id);
      }
    } catch (err) {
      setError(err.response?.data?.msg || "Payment creation failed");
    }
  };

  return (
    <div className="p-6 flex flex-col items-center">
      <h1 className="text-xl font-bold mb-4">Create Payment</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded p-6 w-96"
      >
        {error && <p className="text-red-500 mb-2">{error}</p>}

        <input
          type="text"
          name="school_id"
          placeholder="School ID"
          value={form.school_id}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-3"
          required
        />

        <input
          type="text"
          name="name"
          placeholder="Student Name"
          value={form.student_info.name}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-3"
          required
        />

        <input
          type="text"
          name="id"
          placeholder="Student ID"
          value={form.student_info.id}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-3"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Student Email"
          value={form.student_info.email}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-3"
          required
        />

        <input
          type="number"
          name="order_amount"
          placeholder="Order Amount"
          value={form.order_amount}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-3"
          required
        />

        <input
          type="text"
          name="gateway_name"
          placeholder="Gateway Name"
          value={form.gateway_name}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-3"
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Create Payment
        </button>
      </form>

      {(paymentUrl || customOrderId) && (
        <div className="mt-4 p-4 bg-gray-100 rounded w-full max-w-md">
          {paymentUrl && (
            <p>
              <span className="font-bold">Payment URL:</span>{" "}
              <a
                href={paymentUrl}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline"
              >
                {paymentUrl}
              </a>
            </p>
          )}
          {customOrderId && (
            <p className="mt-2">
              <span className="font-bold">Custom Order ID:</span>{" "}
              <span className="text-purple-600">{customOrderId}</span>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
