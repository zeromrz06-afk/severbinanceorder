# Binance Serverless (Vercel + Testnet)

Stateless API & dashboard for Binance **Testnet**.

## Endpoints
- `GET /api/balances`
- `GET /api/orders`
- `POST /api/orders` → body: `{ "symbol":"BTCUSDT", "side":"BUY", "quantity": "0.001" }`
- Page: `/dashboard`

## Env (Vercel → Settings → Environment Variables)
- `BINANCE_KEY`, `BINANCE_SECRET`
- `API_KEY` (optional; must be sent via `X-API-KEY` header)

## Regions
Adjust in `vercel.json`. Start with:
`["sin1","hkg1","fra1"]`. If 451 persists, try `"arn1","iad1","gru1"` etc.

## Dev
```bash
npm i
vercel dev
```

## Test

```bash
curl -H "X-API-KEY: $API_KEY" https://<app>.vercel.app/api/balances
curl -H "X-API-KEY: $API_KEY" https://<app>.vercel.app/api/orders
curl -X POST -H "Content-Type: application/json" -H "X-API-KEY: $API_KEY" \
  -d '{"symbol":"BTCUSDT","side":"BUY","quantity":"0.001"}' \
  https://<app>.vercel.app/api/orders
```

## Notes

* Uses Testnet: `https://testnet.binance.vision`
* For Binance.US, change client base to `https://api.binance.us` and adjust symbols.
* Respect rate limits; refresh interval on dashboard is 5s by default.
