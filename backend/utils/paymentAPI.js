const createCollectRequest = async (orderId, amount) => {
  // Dummy collect_id & payment_url
  const collect_id = "COLLECT_" + orderId;
  const payment_url = `https://dummy-payment-gateway.com/pay/${orderId}`;

  return { collect_id, payment_url };
};

export default { createCollectRequest };
