import { getClient, okCors, requireKey, ALLOWED, normalizeErr } from "./_client.js";

export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req, res) {
  try {
    okCors(res);
    if (req.method === "OPTIONS") return res.status(200).end();
    if (!requireKey(req, res)) return;

    const client = getClient();

    if (req.method === "POST") {
      try {
        let body = req.body || {};
        if (typeof body === "string") body = JSON.parse(body || "{}");
        const { symbol, side, quantity } = body;
        const sym = String(symbol || "").toUpperCase();
        const sd  = String(side || "").toUpperCase();
        const qty = Number(quantity);
        if (!ALLOWED.has(sym)) throw new Error("symbol not allowed");
        if (!["BUY", "SELL"].includes(sd)) throw new Error("bad side");
        if (!(qty > 0)) throw new Error("bad quantity");

        const resp = await client.newOrder(sym, sd, "MARKET", { quantity: qty });
        return res.status(200).json(resp.data);
      } catch (e) {
        console.error("Order POST error:", e);
        return res.status(400).json({ error: normalizeErr(e) });
      }
    }

    if (req.method === "GET") {
      try {
        const combined = [];
        for (const sym of ALLOWED) {
          // Node SDK uses allOrders(symbol, params)
          const resp = await client.allOrders(sym, { limit: 50 });
          for (const o of resp.data) {
            const ts = o.updateTime || o.time; // ms epoch
            combined.push({
              ts: ts ? new Date(ts).toISOString() : null,
              symbol: o.symbol || sym,
              side: o.side,
              status: o.status,
              order_id: o.orderId,
              price: o.price ? Number(o.price) : null,
              qty: o.origQty ? Number(o.origQty) : 0
            });
          }
        }
        combined.sort((a, b) => (b.ts || "").localeCompare(a.ts || ""));
        return res.status(200).json(combined.slice(0, 100));
      } catch (e) {
        console.error("Order GET error:", e);
        return res.status(400).json({ error: normalizeErr(e) });
      }
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (e) {
    console.error("Orders handler error:", e);
    return res.status(500).json({ error: normalizeErr(e) });
  }
}
