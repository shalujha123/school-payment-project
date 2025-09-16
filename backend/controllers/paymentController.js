import PaymentAPI from "../utils/paymentAPI.js";
import Order from "../models/Order.js";
import OrderStatus from "../models/OrderStatus.js";

// create payment controller
export const createPayment = async (req, res) => {
  const { school_id, trustee_id, student_info, gateway_name, order_amount } =
    req.body;

  if (!school_id || !order_amount) {
    return res.status(400).json({ msg: "school_id and order_amount required" });
  }

  try {
    const custom_order_id = `ORD-${school_id}-${Date.now()}`;

    const newOrder = new Order({
      school_id,
      trustee_id: trustee_id || "DUMMY_TRUSTEE",
      student_info,
      gateway_name,
      custom_order_id,
    });
    await newOrder.save();

    const { collect_id, payment_url } = await PaymentAPI.createCollectRequest(
      String(newOrder._id),
      order_amount
    );

    const statusDoc = new OrderStatus({
      collect_id,
      order_ref: newOrder._id,
      order_amount,
      status: "initiated",
      gateway: gateway_name,
    });

    await statusDoc.save();

    return res.json({ collect_id, payment_url, custom_order_id });
  } catch (err) {
    console.error("CreatePayment Error:", err.message);
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
};

// webhook handler controller
export const webhookHandler = async (req, res) => {
  const { status, order_info } = req.body;

  if (!order_info || !order_info.order_id) {
    console.warn("Webhook missing order_info.order_id", req.body);
    return res.status(400).json({ msg: "missing order id" });
  }

  try {
    const collect_id = order_info.order_id;
    const update = {
      order_amount: order_info.order_amount,
      transaction_amount: order_info.transaction_amount,
      payment_mode: order_info.payment_mode,
      payment_details: order_info.payment_details || order_info.payemnt_details,
      bank_reference: order_info.bank_reference,
      payment_message: order_info.payment_message || order_info.Payment_message,
      status: order_info.status,
      error_message: order_info.error_message,
      payment_time: order_info.payment_time
        ? new Date(order_info.payment_time)
        : undefined,
      student_info: order_info.student_info,
      gateway: order_info.gateway,
    };

    const existing = await OrderStatus.findOneAndUpdate(
      { collect_id },
      { $set: update },
      { new: true }
    );

    if (!existing) {
      await OrderStatus.create({ collect_id, ...update });
    }

    return res.status(200).json({ msg: "Webhook processed" });
  } catch (err) {
    console.error("Error processing webhook: ", err);
    return res.status(500).json({ msg: "Error processing webhook" });
  }
};
