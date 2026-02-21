# straton
strategy in motion

## Environment Variables

| Variable       | Required | Description                                                                 |
|----------------|----------|-----------------------------------------------------------------------------|
| `JWT_SECRET`   | Yes      | Secret for JWT signing/verification (min 32 chars for HS256). No default in production. |
| `DATABASE_URL` | Yes*     | PostgreSQL connection string. Required when using DatabaseModule/AuditModule. |
| `PORT`         | No       | API server port (default: 3001).                                           |
