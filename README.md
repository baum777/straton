# straton
strategy in motion

## Environment Variables

| Variable     | Required | Description                                      |
|-------------|----------|--------------------------------------------------|
| `JWT_SECRET`| Yes      | Secret for JWT signing/verification (min 32 chars for HS256). Set via env; no default in production. |
| `PORT`      | No       | API server port (default: 3001).                 |
