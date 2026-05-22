# Trrip — AI-Powered Travel Itinerary Generator

> AI-powered travel itinerary planner built with the MERN stack and Google Gemini API.

Upload travel documents such as flight tickets, hotel bookings, and transport confirmations to automatically generate a beautifully structured, day-by-day travel itinerary powered by AI.

---

## Live Demo

Frontend: https://your-frontend.vercel.app  
Backend API: https://your-backend.onrender.com

---

## Key Features

- Secure JWT-based authentication
- Drag-and-drop upload for travel PDFs and images
- AI-powered extraction of booking details
- Smart itinerary generation using Google Gemini
- Day-by-day interactive travel timeline
- Persistent itinerary history dashboard
- Public shareable itinerary pages
- Responsive modern UI built with React

---

## Product Highlights

- Converts raw travel bookings into structured travel experiences
- Combines transportation, accommodation, and activity planning into a unified itinerary
- Designed with a clean SaaS-inspired user experience
- Shareable itinerary pages accessible without authentication

---

## Screenshots

### Shared Itinerary

![Shared Itinerary](./screenshots/shared-itinerary.png)

### Timeline View

![Timeline](./screenshots/timeline.png)

### Dashboard

![Dashboard](./screenshots/dashboard.png)

---

## Tech Stack

| Layer      | Technology                      |
| ---------- | ------------------------------- |
| Frontend   | React 18 + Vite + CSS Modules   |
| Backend    | Node.js + Express.js            |
| Database   | MongoDB + Mongoose              |
| Auth       | JWT + bcryptjs                  |
| AI         | Google Gemini API               |
| Uploads    | Multer                          |
| Deployment | Vercel + Render + MongoDB Atlas |

---

## Project Structure

```txt
trrip/
├── backend/
│   ├── config/          # MongoDB connection
│   ├── controllers/     # Auth, itinerary, share controllers
│   ├── middleware/      # JWT auth & Multer upload middleware
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── utils/           # Gemini AI services
│   ├── uploads/         # Uploaded files (gitignored)
│   └── server.js
│
├── frontend/
│   └── src/
│       ├── api/         # Axios API layer
│       ├── components/  # Reusable UI components
│       ├── context/     # Authentication context
│       ├── pages/       # Route pages
│       └── styles/      # Global styles
│
└── README.md
```
