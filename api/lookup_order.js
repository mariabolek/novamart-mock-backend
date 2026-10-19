import { ORDERS } from "../lib/orders.js";
 
export default function handler(req, res) {
  const { order_id } = req.body || {};
  if (!order_id) return res.status(400).json({ error: "order_id required" });
  const order = ORDERS[String(order_id)];
  if (!order) return res.status(200).json({ status: "not_found", order_id });
  return res.status(200).json(order);
}
 
