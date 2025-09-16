import express from "express";
import {
  getTransactions,
  getTransactionsBySchool,
  getTransactionStatus,
} from "../controllers/transactionController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/transactions", auth, getTransactions);
router.get("/transactions/school/:schoolId", auth, getTransactionsBySchool);
router.get("/transaction-status/:custom_order_id", auth, getTransactionStatus);

export default router;
