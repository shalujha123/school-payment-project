import mongoose from "mongoose";

const OrderStatusSchema = new mongoose.Schema(
  {
    collect_id: {
      type: String,
      required: true,
      index: true,
    },
    order_ref: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      index: true,
      required: true,
    },
    order_amount: { type: Number, required: true },
    transaction_amount: Number,
    payment_mode: String,
    payment_details: String,
    bank_reference: String,
    payment_message: String,
    status: { type: String, default: "initiated", index: true },
    error_message: String,
    payment_time: Date,
    student_info: {
      name: String,
      id: String,
      email: String,
    },
  },
  { timestamps: true }
);

const OrderStatus = mongoose.model("OrderStatus", OrderStatusSchema);

export default OrderStatus;
