import { ORDERS } from "../lib/orders.js";

const DAY = 24 * 60 * 60 * 1000;
const WARRANTY_DAYS = { "electronics": 365, "home goods": 90 };

function no(reason, extra = {}) {
  return { eligible: false, reason, ...extra };
}

export default function handler(req, res) {
  const { order_id, item_name, item_opened, is_faulty } = req.body || {};
  if (!order_id || !item_name) {
    return res.status(400).json({ error: "order_id and item_name required" });
  }
  const opened = item_opened === true || item_opened === "true";
  const faulty = is_faulty === true || is_faulty === "true";

  const order = ORDERS[String(order_id)];
  if (!order) return res.status(200).json(no("order_not_found"));
  if (order.status !== "delivered") {
    return res.status(200).json(no("not_delivered_yet", { status: order.status }));
  }

  const item = order.items.find(i => i.name.toLowerCase().includes(String(item_name).toLowerCase()));
  if (!item) {
    return res.status(200).json(no("item_not_in_order", { items_in_order: order.items.map(i => i.name) }));
  }

  const days = Math.floor((Date.now() - new Date(order.delivered_date).getTime()) / DAY);

  // Faulty items are exchanged under warranty
  if (faulty) {
    if (days > WARRANTY_DAYS[item.category]) return res.status(200).json(no("warranty_expired"));
    return res.status(200).json({
      eligible: true,
      return_id: `RMA-${order.order_id}-${Date.now().toString().slice(-4)}`,
      item: item.name,
      return_type: "exchange",
      return_shipping_fee: 0
    });
  }

  if (days > 30) return res.status(200).json(no("outside_30_day_window", { days_since_delivery: days }));
  if (item.category === "electronics" && opened) return res.status(200).json(no("opened_electronics_not_returnable"));

  return res.status(200).json({
    eligible: true,
    return_id: `RMA-${order.order_id}-${Date.now().toString().slice(-4)}`,
    item: item.name,
    return_type: "refund",
    return_shipping_fee: 6.95,
    refund_amount: +(item.price - 6.95).toFixed(2)
  });
}
