export default function handler(req, res) {
  const { account_number, order_id, new_address } = req.body || {};
  if (!account_number || !order_id || !new_address) {
    return res.status(400).json({ error: "account_number, order_id, new_address required" });
  }
  return res.status(200).json({
    success: true,
    order_id,
    new_address,
    updated_at: new Date().toISOString()
  });
}
