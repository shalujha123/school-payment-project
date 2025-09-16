import mongoose from "mongoose";
import Order from "../models/Order.js";
import OrderStatus from "../models/OrderStatus.js";

// GET /transactions
export const getTransactions = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page || 1));
    const limit = Math.max(1, parseInt(req.query.limit || 10));
    const skip = (page - 1) * limit;
    const order = req.query.order === "asc" ? 1 : -1;
    const sortField = req.query.sort || "payment_time";

    // filters
    const match = {};
    if (req.query.status) match["order_statuses.status"] = req.query.status;
    if (req.query.school_id) {
      try {
        match["school_id"] = mongoose.Types.ObjectId(req.query.school_id);
      } catch {
        return res.status(400).json({ msg: "invalid school_id" });
      }
    }

    if (req.query.from || req.query.to) {
      match["order_statuses.payment_time"] = {};
      if (req.query.from) match["order_statuses.payment_time"].$gte = new Date(req.query.from);
      if (req.query.to) match["order_statuses.payment_time"].$lte = new Date(req.query.to);
    }

    const pipeline = [
      {
        $lookup: {
          from: "orderstatuses",
          localField: "_id",
          foreignField: "order_ref",
          as: "order_statuses",
        },
      },
      { $unwind: "$order_statuses" },
      { $match: match },
      {
        $project: {
          collect_id: "$order_statuses.collect_id",
          school_id: "$school_id",
          gateway: "$order_statuses.gateway",
          order_amount: "$order_statuses.order_amount",
          transaction_amount: "$order_statuses.transaction_amount",
          status: "$order_statuses.status",
          custom_order_id: "$custom_order_id",
          payment_time: "$order_statuses.payment_time",
        },
      },
      { $sort: { [sortField]: order } },
      { $skip: skip },
      { $limit: limit },
    ];

    const results = await Order.aggregate(pipeline);
    return res.json({ page, limit, results });
  } catch (err) {
    console.error("getTransactions err:", err);
    return res.status(500).json({ msg: "Server error" });
  }
};

// GET /transactions/school/:schoolId
export const getTransactionsBySchool = async (req, res) => {
  try {
    const { schoolId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(schoolId))
      return res.status(400).json({ msg: "invalid schoolId" });

    const pipeline = [
      { $match: { school_id: schoolId } },
      {
        $lookup: {
          from: "orderstatuses",
          localField: "_id",
          foreignField: "order_ref",
          as: "order_statuses",
        },
      },
      { $unwind: "$order_statuses" },
      {
        $project: {
          collect_id: "$order_statuses.collect_id",
          gateway: "$order_statuses.gateway",
          order_amount: "$order_statuses.order_amount",
          transaction_amount: "$order_statuses.transaction_amount",
          status: "$order_statuses.status",
          custom_order_id: "$custom_order_id",
          payment_time: "$order_statuses.payment_time",
        },
      },
    ];

    const results = await Order.aggregate(pipeline);
    return res.json({ results });
  } catch (err) {
    console.error("getTransactionsBySchool err:", err);
    return res.status(500).json({ msg: "Server error" });
  }
};

// GET /transaction-status/:custom_order_id
export const getTransactionStatus = async (req, res) => {
  try {
    const { custom_order_id } = req.params;
    const order = await Order.findOne({ custom_order_id });
    if (!order) return res.status(404).json({ msg: "order not found" });

    const status = await OrderStatus.findOne({ order_ref: order._id }).sort({
      payment_time: -1,
    });

    return res.json({ custom_order_id, status });
  } catch (err) {
    console.error("getTransactionStatus err:", err);
    return res.status(500).json({ msg: "Server error" });
  }
};
