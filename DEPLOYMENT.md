# Vriksham Deployment Guide

## Backend

Recommended hosts: Render, Railway, Fly.io, AWS Elastic Beanstalk, or a Dockerized VPS.

Environment variables:

```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/vriksham
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d
CLIENT_URL=https://your-frontend-domain.com
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

Commands:

```bash
npm install
npm start
```

## Frontend

Recommended hosts: Vercel, Netlify, Cloudflare Pages, or Render Static Sites.

Environment variables:

```env
VITE_API_URL=https://your-backend-domain.com/api
```

Commands:

```bash
npm install
npm run build
```

Publish the `dist` folder.

## MongoDB Atlas

Create a cluster, add a database user, allow the backend host IP address, and place the connection string in `MONGO_URI`.

## Cloudinary

Create a Cloudinary account and add credentials to the backend. The app uploads service request images through `POST /api/upload` and stores returned URLs on service requests.

## Production Notes

- Rotate `JWT_SECRET` before launch.
- Seed the first admin account manually or temporarily create one through signup with role `admin`.
- Add stricter admin creation rules before public launch.
- Connect AI endpoints to model services behind `/api/ai/:module`.
- Add payment provider integration before enabling real revenue reporting.
