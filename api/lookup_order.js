const CUSTOMERS = {
  "10000001": { customer_name: "Jordan Rivera", postcode: "94107" },
  "10000002": { customer_name: "Sam Patel", postcode: "10001" }
};

const ORDERS = {
  // Jordan Rivera (10000001)
  "12345": {
    order_id: "12345", account: "10000001", status: "shipped",
    items: [{ name: "Nova Headphones X1", category: "electronics", qty: 1, price: 149.00 }],
    expected_delivery_date: "2026-05-22",
    shipping_address: "742 Evergreen Terrace, San Francisco, CA 94107"
  },
  "11111": {
    order_id: "11111", account: "10000001", status: "delivered",
    items: [{ name: "Nova Earbuds Lite", category: "electronics", qty: 1, price: 59.00 }],
    delivered_date: "2026-10-12",
    shipping_address: "742 Evergreen Terrace, San Francisco, CA 94107"
  },
  "33333": {
    order_id: "33333", account: "10000001", status: "delivered",
    items: [
      { name: "Nova Coffee Maker Pro", category: "home goods", qty: 1, price: 129.00 },
      { name: "Nova LED Desk Lamp", category: "home goods", qty: 1, price: 39.00 }
    ],
    delivered_date: "2026-10-05",
    shipping_address: "742 Evergreen Terrace, San Francisco, CA 94107"
  },
  "22222": {
    order_id: "22222", account: "10000001", status: "delivered",
    items: [{ name: "Nova Tablet 10", category: "electronics", qty: 1, price: 299.00 }],
    delivered_date: "2026-08-01",
    shipping_address: "742 Evergreen Terrace, San Francisco, CA 94107"
  },
  "55555": {
    order_id: "55555", account: "10000001", status: "cancelled",
    items: [{ name: "Nova Robot Vacuum R5", category: "home goods", qty: 1, price: 249.00 }],
    shipping_address: "742 Evergreen Terrace, San Francisco, CA 94107"
  },
  // Sam Patel (10000002)
  "67890": {
    order_id: "67890", account: "10000002", status: "processing",
    items: [{ name: "Nova Smart Speaker Mini", category: "electronics", qty: 2, price: 79.00 }],
    expected_delivery_date: "2026-10-25",
    shipping_address: "350 Fifth Avenue, Apt 12B, New York, NY 10001"
  },
  "44444": {
    order_id: "44444", account: "10000002", status: "processing",
    items: [{ name: "Nova Smartwatch S2", category: "electronics", qty: 1, price: 199.00 }],
    expected_delivery_date: "2026-10-27",
    shipping_address: "350 Fifth Avenue, Apt 12B, New York, NY 10001"
  }
};

// Read params from the JSON body or the query string
function params(req) {
  return { ...(req.query || {}), ...(req.body || {}) };
}

// Orders of another account look the same as orders that do not exist
function findOrder(order_id, account_number) {
  const order = ORDERS[String(order_id || "").replace(/\D/g, "")];
  if (!order) return null;
  if (account_number && order.account !== String(account_number)) return null;
  return order;
}

export default function handler(req, res) {
  const { order_id, account_number } = params(req);
  const order = findOrder(order_id, account_number);
  if (!order) return res.status(200).json({ status: "not_found", order_id: String(order_id || "") });
  const { account, ...publicOrder } = order;
  return res.status(200).json({
    ...publicOrder,
    address_can_be_changed: order.status === "processing"
  });
}
