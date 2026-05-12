# VRIKSHAM - Smart Green Infrastructure Platform

Vriksham is a modern full-stack web platform for professional gardening services, plant care, green infrastructure management, plant shopping, and AI-powered plant assistance.

The platform is designed for homes, offices, balconies, commercial spaces, and corporate green infrastructure programs.

## Features

- Modern responsive startup-style website
- Service request flow for gardening and plant maintenance
- Plant and flower shopping experience
- Checkout flow with order confirmation
- User dashboard for requests, orders, reminders, and AI scan history
- Admin dashboard with analytics and management tables
- AI plant disease detection demo
- AI plant recommendation demo
- AI garden design generator demo
- Business page for AMC plans, subscriptions, and corporate green solutions
- Dark mode support
- Smooth animations and premium UI

## AI Features

Vriksham includes three AI-ready modules:

- **AI Plant Disease Detection**: upload a plant image, scan symptoms, and receive disease result, confidence score, treatment suggestions, and prevention tips.
- **AI Plant Recommendation System**: recommend plants based on sunlight, indoor/outdoor use, budget, climate, room size, and maintenance level.
- **AI Garden Design Generator**: generate garden or balcony layout ideas with plant placement, decor suggestions, and space optimization.

## Tech Stack

**Frontend**

- React.js
- Tailwind CSS
- Framer Motion
- React Router
- Axios
- React Icons

**Backend**

- Node.js
- Express.js
- MongoDB
- Mongoose

**Media and Data**

- Cloudinary-ready image upload structure
- Local demo data seed script
- AI report storage structure

## How To Start

Install backend dependencies:

```bash
cd backend
npm install
```

Install frontend dependencies:

```bash
cd frontend
npm install
```

Start backend:

```bash
cd backend
npm run dev
```

Start frontend:

```bash
cd frontend
npm run dev
```

Open the website:

```txt
http://localhost:5173
```

## Demo Data

To populate the website with sample content:

```bash
cd backend
npm run seed
```

## Project Structure

```txt
Vriksham/
  backend/    Node.js, Express and MongoDB server
  frontend/   React, Tailwind, pages, dashboards and UI
```
