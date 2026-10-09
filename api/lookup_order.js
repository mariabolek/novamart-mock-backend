const ORDERS = {
  "12345": {
    order_id: "12345",
    status: "shipped",
    items: [{ name: "Nova Headphones X1", qty: 1, price: 149.00 }],
    expected_delivery_date: "2026-05-22",
    shipping_address: "742 Evergreen Terrace, Springfield",
    fulfillment_center: "FC-WEST-03"
  },
  "67890": {
    order_id: "67890",
    status: "processing",
    items: [{ name: "Nova Smart Speaker Mini", qty: 2, price: 79.00 }],
    expected_delivery_date: "2026-05-25",
    shipping_address: "1600 Pennsylvania Ave NW, Washington DC",
    fulfillment_center: "FC-EAST-01"
  }
};

export default function handler(req, res) {
  const { order_id } = req.body || {};
  if (!order_id) return res.status(400).json({ error: "order_id required" });
  const order = ORDERS[order_id];
  if (!order) return res.status(200).json({ status: "not_found", order_id });
  return res.status(200).json(order);
}
