export const ORDERS = {
  "12345": {
    order_id: "12345",
    status: "shipped",
    items: [{ name: "Nova Headphones X1", category: "electronics", qty: 1, price: 149.00 }],
    expected_delivery_date: "2026-05-22",
    shipping_address: "742 Evergreen Terrace, Springfield",
    fulfillment_center: "FC-WEST-03"
  },
  "67890": {
    order_id: "67890",
    status: "processing",
    items: [{ name: "Nova Smart Speaker Mini", category: "electronics", qty: 2, price: 79.00 }],
    expected_delivery_date: "2026-05-25",
    shipping_address: "1600 Pennsylvania Ave NW, Washington DC",
    fulfillment_center: "FC-EAST-01"
  },
  "11111": {
    order_id: "11111",
    status: "delivered",
    items: [{ name: "Nova Earbuds Lite", category: "electronics", qty: 1, price: 59.00 }],
    delivered_date: "2026-10-12",
    shipping_address: "742 Evergreen Terrace, Springfield",
    fulfillment_center: "FC-WEST-03"
  },
  "22222": {
    order_id: "22222",
    status: "delivered",
    items: [{ name: "Nova Tablet 10", category: "electronics", qty: 1, price: 299.00 }],
    delivered_date: "2026-08-01",
    shipping_address: "742 Evergreen Terrace, Springfield",
    fulfillment_center: "FC-WEST-03"
  },
  "33333": {
    order_id: "33333",
    status: "delivered",
    items: [
      { name: "Nova Coffee Maker Pro", category: "home goods", qty: 1, price: 129.00 },
      { name: "Nova LED Desk Lamp", category: "home goods", qty: 1, price: 39.00 }
    ],
    delivered_date: "2026-10-05",
    shipping_address: "742 Evergreen Terrace, Springfield",
    fulfillment_center: "FC-WEST-03"
  },
  "44444": {
    order_id: "44444",
    status: "processing",
    items: [{ name: "Nova Smartwatch S2", category: "electronics", qty: 1, price: 199.00 }],
    expected_delivery_date: "2026-10-27",
    shipping_address: "742 Evergreen Terrace, Springfield",
    fulfillment_center: "FC-WEST-03"
  },
  "55555": {
    order_id: "55555",
    status: "cancelled",
    items: [{ name: "Nova Robot Vacuum R5", category: "home goods", qty: 1, price: 249.00 }],
    shipping_address: "742 Evergreen Terrace, Springfield",
    fulfillment_center: "FC-WEST-03"
  }
};
