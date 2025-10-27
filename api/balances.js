import { getClient, okCors, requireKey, normalizeErr } from "./_client.js";

export default async function handler(req, res) {
  okCors(res);
  if (req.method === "OPTIONS") return res.status(200).end();
  if (!requireKey(req, res)) return;

  try {
    const client = getClient();
    const { data } = await client.account();
    const out = [];
    for (const b of data.balances) {
      const free = parseFloat(b.free), locked = parseFloat(b.locked);
      if (free > 0 || locked > 0) out.push({ asset: b.asset, free, locked });
    }
    out.sort((a, b) => (a.asset === "USDT" ? -1 : a.asset.localeCompare(b.asset)));
    res.json(out);
  } catch (e) {
    res.status(400).json({ error: normalizeErr(e) });
  }
}
