# VRIKSHAM - The Future of Green Infrastructure

Modern full-stack green infrastructure platform for managed gardening services, plant maintenance, subscriptions, admin operations, and future AI/IoT modules.

## Tech Stack

- Frontend: React, Tailwind CSS, Framer Motion, React Router, Axios, React Icons
- Backend: Node.js, Express.js, MongoDB, Mongoose
- Auth: JWT, bcrypt password hashing, role-based access control
- Media: Cloudinary upload-ready service layer

## Project Structure

```txt
Vriksham/
  frontend/   React SaaS website and dashboards
  backend/    Express API, MongoDB schemas, auth, admin modules
```

## Quick Start

1. Install dependencies:

```bash
cd backend && npm install
cd ../frontend && npm install
```

2. Configure environment files:

```bash
copy backend\.env.example backend\.env
copy frontend\.env.example frontend\.env
```

3. Start both apps:

```bash
cd backend && npm run dev
cd frontend && npm run dev
```

Frontend runs on `http://localhost:5173`. Backend runs on `http://localhost:5000`.

Seed demo data:

```bash
cd backend
npm run seed
```

Demo accounts:

- Admin: `admin@vriksham.com` / `password123`
- User: `user@vriksham.com` / `password123`

## Core API

- `POST /api/signup`
- `POST /api/login`
- `POST /api/request`
- `GET /api/requests`
- `PUT /api/assign-request/:id`
- `PUT /api/update-status/:id`
- `GET /api/profile`
- `PUT /api/profile`
- `GET /api/admin/analytics`
- `POST /api/upload`
- `POST /api/ai/:module`
- `GET /api/plants`
- `POST /api/orders`
- `GET /api/orders`
- `PUT /api/orders/:id/status`

## Deployment Guide

See `DEPLOYMENT.md` for production environment variables, hosting options, and launch notes.

## AI-Ready Architecture

The backend includes `AIReport` schema support and `/api/ai/*` placeholder routes for:

- Plant disease detection
- Plant recommendation
- Garden design generation
- Smart plant care assistant
- Subscription prediction
- Weather-based alerts
- Green space analytics
- IoT + AI sensor integrations
