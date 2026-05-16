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

Frontend values:

- `REACT_APP_API_URL`

## Notes

- Checkout requires a valid Stripe secret key.
- The backend expects a running MongoDB instance unless you point `MONGO_URI` at Atlas.
- Project screenshots now live under `frontend/public/screenshots/`.

## Screenshots

![Dashboard](frontend/public/screenshots/Dashboard.png)
![Properties](frontend/public/screenshots/Properties%20Page.png)
