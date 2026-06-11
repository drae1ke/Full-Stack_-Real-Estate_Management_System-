# Real Estate Management System

This repo is organized as two apps:

- `backend`: Express + MongoDB API
- `frontend`: React client

## Local setup

1. Install dependencies for both apps:

```bash
npm run install:all
```

2. Review [`backend/.env.example`](backend/.env.example) and update your local [`backend/.env`](backend/.env) if you want to use MongoDB Atlas or Stripe.

3. Start the backend in one terminal:

```bash
npm run dev:backend
```

4. Start the frontend in a second terminal:

```bash
npm run dev:frontend
```

The frontend runs on `http://localhost:3000` and the backend defaults to `http://localhost:8080`.

If PowerShell blocks `npm` on your machine, use `npm.cmd` instead, for example `npm.cmd run install:all`.

## Environment

Backend values:

- `PORT`
- `MONGO_URI`
- `JWT_SECRET`
- `CLIENT_URL`
- `STRIPE_SECRET_KEY`
- `API_BASE_URL`
- `DARAJA_ENV`
- `DARAJA_CONSUMER_KEY`
- `DARAJA_CONSUMER_SECRET`
- `DARAJA_SHORTCODE`
- `DARAJA_PASSKEY`
- `DARAJA_CALLBACK_URL`

Frontend values:

- `REACT_APP_API_URL`

For Render M-Pesa STK Push, set the backend values with your Safaricom Daraja app credentials. `API_BASE_URL` should be the public backend URL, for example `https://full-stack-real-estate-management-system.onrender.com`. If you set `DARAJA_CALLBACK_URL` directly, use `https://full-stack-real-estate-management-system.onrender.com/rental/mpesa/callback`.

## Notes

- Checkout requires a valid Stripe secret key.
- M-Pesa STK Push requires valid Daraja credentials and a public HTTPS callback URL.
- The backend expects a running MongoDB instance unless you point `MONGO_URI` at Atlas.
- Project screenshots now live under `frontend/public/screenshots/`.

## Screenshots

![Dashboard](frontend/public/screenshots/Dashboard.png)
![Properties](frontend/public/screenshots/Properties%20Page.png)
