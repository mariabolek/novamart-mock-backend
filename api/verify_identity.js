const IDENTITIES = {
  "10000001": { postcode: "94107", customer_name: "Jordan Rivera" },
  "10000002": { postcode: "10001", customer_name: "Sam Patel" }
};

export default function handler(req, res) {
  const { account_number, postcode } = { ...(req.query || {}), ...(req.body || {}) };
  const record = IDENTITIES[String(account_number)];
  if (!record || record.postcode !== String(postcode)) {
    // Same fields as on success, so the agent's variable assignments never hit a missing field
    return res.status(200).json({ success: false, customer_name: "", account_number: "" });
  }
  return res.status(200).json({
    success: true,
    customer_name: record.customer_name,
    account_number: String(account_number)
  });
}
