import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Transactions from "./pages/Transactions";
import SchoolTransactions from "./pages/SchoolTransactions";
import TransactionStatus from "./pages/TransactionStatus";
import Navbar from "./components/Navbar";
import CreatePayment from "./pages/CreatePayment";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/transactions/school" element={<SchoolTransactions />} />
        <Route path="/transaction-status" element={<TransactionStatus />} />
        <Route path="/create-payment" element={<CreatePayment />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
