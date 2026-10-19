const ORDER_STATUS = {
  "12345": "shipped",
  "67890": "processing",
  "11111": "delivered",
  "22222": "delivered",
  "33333": "delivered",
  "44444": "processing",
  "55555": "cancelled"
};

export default function handler(req, res) {
  const { account_number, order_id, new_address } = { ...(req.query || {}), ...(req.body || {}) };
  if (!account_number || !order_id || !new_address) {
    return res.status(200).json({ success: false, reason: "missing_fields", order_id: String(order_id || "") });
  }
  const status = ORDER_STATUS[String(order_id)];
  if (!status) {
    return res.status(200).json({ success: false, reason: "not_found", order_id: String(order_id) });
  }
  if (status !== "processing") {
    return res.status(200).json({ success: false, reason: "already_" + status, order_id: String(order_id) });
  }
  return res.status(200).json({
    success: true,
    reason: "",
    order_id: String(order_id),
    new_address,
    updated_at: new Date().toISOString()
  });
}
