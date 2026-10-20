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

const DAY = 24 * 60 * 60 * 1000;
const WARRANTY_DAYS = { "electronics": 365, "home goods": 90 };
const FEE = 6.95;

function addDays(date, days) {
  return new Date(new Date(date).getTime() + days * DAY).toISOString().slice(0, 10);
}

function no(reason, explanation, next_step, extra = {}) {
  return { eligible: false, reason, explanation, next_step, ...extra };
}

function evaluate({ order_id, item_name, item_opened, is_faulty, preferred_resolution, account_number }) {
  const opened = item_opened === true || item_opened === "true";
  const faulty = is_faulty === true || is_faulty === "true";

  const order = findOrder(order_id, account_number);
  if (!order) {
    return (no("order_not_found", "We could not find this order on the verified account.", "Check the order number."));
  }
  if (order.status !== "delivered") {
    return (no("not_delivered_yet",
      `The order is ${order.status}, so it cannot be returned yet.`,
      order.status === "cancelled" ? "A cancelled order is not charged, so there is nothing to return." : "Once it is delivered, it can be returned within 30 days of delivery.",
      { status: order.status }));
  }

  const item = order.items.find(i => i.name.toLowerCase().includes(String(item_name || "").toLowerCase().replace(/^nova /, "")));
  if (!item) {
    return (no("item_not_in_order", "That item is not in this order.", "Choose one of the items in the order.", { items_in_order: order.items.map(i => i.name) }));
  }

  const days = Math.floor((Date.now() - new Date(order.delivered_date).getTime()) / DAY);
  const returnDeadline = addDays(order.delivered_date, 30);
  const warrantyEnd = addDays(order.delivered_date, WARRANTY_DAYS[item.category]);
  const rma = `RMA-${order.order_id}-${Date.now().toString().slice(-4)}`;

  // Faulty items: refund or replacement within 30 days, replacement under warranty after that
  if (faulty) {
    const wantsExchange = String(preferred_resolution || "").toLowerCase().startsWith("exch") || String(preferred_resolution || "").toLowerCase().startsWith("repl");
    if (days <= 30) {
      if (wantsExchange) {
        return ({
          eligible: true,
          return_id: rma,
          item: item.name,
          return_type: "exchange",
          return_shipping_fee: 0,
          next_step: `A prepaid return label will be emailed. Send the faulty item back by ${returnDeadline} and a replacement ships as soon as it arrives.`
        });
      }
      return ({
        eligible: true,
        return_id: rma,
        item: item.name,
        return_type: "refund",
        item_price: item.price,
        return_shipping_fee: 0,
        refund_amount: item.price,
        refund_method: "original payment method",
        refund_timeline: "5 to 7 business days after NovaMart receives the item",
        return_deadline: returnDeadline,
        next_step: `A prepaid return label will be emailed. Send the item back by ${returnDeadline}. Return shipping is free because the item is faulty.`
      });
    }
    if (days > WARRANTY_DAYS[item.category]) {
      return (no("warranty_expired", `The warranty ended on ${warrantyEnd}.`, "Our phone support team can look at repair options.", { warranty_end: warrantyEnd }));
    }
    return ({
      eligible: true,
      return_id: rma,
      item: item.name,
      return_type: "exchange",
      return_shipping_fee: 0,
      warranty_end: warrantyEnd,
      note: "The 30-day refund window has ended, so a faulty item is replaced under warranty instead of refunded.",
      next_step: "A prepaid return label will be emailed. Send the faulty item back and a replacement ships as soon as it arrives."
    });
  }

  if (days > 30) {
    return (no("outside_30_day_window",
      `It was delivered ${days} days ago and the 30-day return window ended on ${returnDeadline}.`,
      `If it becomes faulty, it is covered by warranty until ${warrantyEnd}.`,
      { days_since_delivery: days, return_deadline: returnDeadline, warranty_end: warrantyEnd }));
  }
  if (item.category === "electronics" && opened) {
    return (no("opened_electronics_not_returnable",
      "Opened electronics cannot be returned for a refund.",
      `If it is faulty, it can be refunded or replaced until ${returnDeadline}, and replaced under warranty until ${warrantyEnd}.`,
      { warranty_end: warrantyEnd }));
  }

  return ({
    eligible: true,
    return_id: rma,
    item: item.name,
    return_type: "refund",
    item_price: item.price,
    return_shipping_fee: FEE,
    refund_amount: +(item.price - FEE).toFixed(2),
    refund_method: "original payment method",
    refund_timeline: "5 to 7 business days after NovaMart receives the item",
    return_deadline: returnDeadline,
    next_step: `A return label will be emailed. Send the item back by ${returnDeadline}.`
  });
}

// submit=false only checks the return and quotes the outcome; submit=true creates it
export default function handler(req, res) {
  const p = params(req);
  const submit = p.submit === true || p.submit === "true";
  const result = evaluate(p);
  if (result.eligible && !submit) {
    const { return_id, ...quote } = result;
    return res.status(200).json({ ...quote, submitted: false, next_action: "Tell the caller this outcome and ask if they want to go ahead. Then call create_return again with submit true." });
  }
  return res.status(200).json(result.eligible ? { ...result, submitted: true } : result);
}
