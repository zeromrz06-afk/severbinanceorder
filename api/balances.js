const { getClient, okCors, requireKey, normalizeErr } = require("./_client.js");

module.exports = async function handler(req, res) {
  try {
    okCors(res);
    if (req.method === "OPTIONS") return res.status(200).end();
    if (!requireKey(req, res)) return;

    const client = getClient();
    const { data } = await client.account();
    const out = [];
    for (const b of data.balances) {
      const free = parseFloat(b.free), locked = parseFloat(b.locked);
      if (free > 0 || locked > 0) out.push({ asset: b.asset, free, locked });
    }
    out.sort((a, b) => (a.asset === "USDT" ? -1 : a.asset.localeCompare(b.asset)));
    return res.status(200).json(out);
  } catch (e) {
    console.error("Balances error:", e);
    return res.status(400).json({ error: normalizeErr(e) });
  }
};
