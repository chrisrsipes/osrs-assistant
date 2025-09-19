# OSRS Skilling Assistant

A basic React webapp demonstrating tab functionality with two tabs: "Hello World" and "Coming Soon".

## Features

- Modern React 18 with functional components and hooks
- Tab navigation between two pages
- Responsive design with beautiful UI
- Vite for fast development and building

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start both frontend and backend servers:
```bash
npm run dev:full
```

3. Or start them separately:
```bash
# Backend only (port 3001)
npm run dev:backend

# Frontend only (port 3000)
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start frontend development server (Vite)
- `npm run dev:backend` - Start backend development server (Express with nodemon)
- `npm run dev:full` - Start both frontend and backend concurrently
- `npm run build` - Build frontend for production
- `npm run preview` - Preview production build
- `npm start` - Start backend server in production mode

### API Endpoints

The backend provides the following REST API endpoints:

- `GET /api/health` - Health check
- `GET /api/seeds` - Get all seeds
- `GET /api/seeds/:id` - Get seed by ID
- `POST /api/seeds` - Create new seed
- `PUT /api/seeds/:id` - Update seed by ID
- `PATCH /api/seeds/:id` - Partial update seed by ID
- `DELETE /api/seeds/:id` - Delete seed by ID
- `POST /api/seeds/reset` - Reset to initial data (development only)

## Project Structure

```
src/
├── components/
│   ├── HelloWorld.jsx    # Hello World tab component
│   └── ComingSoon.jsx    # Coming Soon tab component
├── App.jsx              # Main app component with tab logic
├── App.css              # Styles for the application
└── main.jsx             # React app entry point
```

## Technologies Used

- React 18
- Vite
- CSS3 with modern features (gradients, backdrop-filter, animations)
