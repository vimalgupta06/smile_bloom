# Smile Bloom Dental Clinic

This workspace is split into two folders:

- [frontend](frontend) for the React patient website
- [backend](backend) for the API that handles bookings, contact, login, slot checks, and medicine data

The site includes the clinic name, Dr. Ujjwal Gupta, and the contact number 7531004658. It is responsive for phone browsers after deployment.

## Frontend

```bash
cd frontend
npm install
npm run dev
```

Build the frontend with:

```bash
cd frontend
npm run build
```

If the backend is deployed separately, set `VITE_API_URL` in the frontend environment to the deployed API base URL.

## Backend

```bash
cd backend
npm install
npm start
```

The backend listens on `0.0.0.0` so it can be reached from a deployed host and from a phone browser when the frontend points to it.