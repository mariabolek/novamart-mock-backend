const IDENTITIES = {
  "10000001": { postcode: "94107", customer_name: "Jordan Rivera" },
  "10000002": { postcode: "10001", customer_name: "Sam Patel" }
};

export default function handler(req, res) {
  const { account_number, postcode } = req.body || {};
  const record = IDENTITIES[account_number];
  if (!record || record.postcode !== postcode) {
    return res.status(200).json({ success: false });
  }
  return res.status(200).json({
    success: true,
    customer_name: record.customer_name,
    account_number
  });
}
