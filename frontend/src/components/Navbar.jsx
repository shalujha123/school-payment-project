import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // remove token
    navigate("/login"); // redirect to login
  };

  return (
    <nav className="bg-gray-800 text-white px-6 py-3 flex justify-between items-center">
      {/* Left side links */}
      <div className="flex gap-6">
        <Link to="/register" className="hover:text-blue-400">
          Register
        </Link>
        <Link to="/login" className="hover:text-blue-400">
          Login
        </Link>
        <Link to="/create-payment" className="hover:text-blue-400">
          Create Payment
        </Link>
        <Link to="/transactions" className="hover:text-blue-400">
          Transactions
        </Link>
        <Link to="/transactions/school" className="hover:text-blue-400">
          School Transactions
        </Link>
        <Link to="/transaction-status" className="hover:text-blue-400">
          Transaction Status
        </Link>
      </div>

      {/* Right side (logout button if logged in) */}
      <div>
        {localStorage.getItem("token") ? (
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-4 py-1 rounded"
          >
            Logout
          </button>
        ) : null}
      </div>
    </nav>
  );
}
