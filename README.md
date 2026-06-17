# TakeABreakUNO

A web application to encourage taking breaks from screen time.

## Team

- Tristan Kuhnel
- Danie Cunningham
- Michael Cea-Garcia
- Cassia Nebel

## About

TakeABreakUNO begins tracking activity as soon as the user opens the application. Several menus allow the user to configure how often challenge intervals occur, the difficulty of challenges, and the types of challenges they want to receive. Challenges range from finding an object, taking a shower, solving a puzzle, going somewhere, or watching something. The goal is to promote positive behaviors like going outside, completing chores, and taking better care of yourself away from the computer.

The application includes a timer tracking how long the user has been active since opening the program, and a counter recording how many challenges have been completed.

## Tech Stack

- **Frontend:** React + Vite
- **Backend:** Express + Node.js
- **Database:** PostgreSQL
- **Deployment:** Vercel

## Getting Started

### 1. Install Node.js

Install a recent version from https://nodejs.org/ if you don't have it already.

### 2. Clone the repo

```bash
git clone https://github.com/SilverSins3006/TakeABreakUNO.git
cd TakeABreakUNO
```

### 3. Install dependencies

```bash
npm install
cd client && npm install && cd ..
cd server && npm install && cd ..
```

### 4. Start the development servers

```bash
npm run dev
```

Frontend runs at `http://localhost:5173`
Backend runs at `http://localhost:3000`

## Common Commands

Run these from the project root.

- `npm run dev` — start both frontend and backend
- `npm run client` — start frontend only
- `npm run server` — start backend only
- `cd client && npm run build` — build frontend for production
- `cd client && npm run preview` — preview the production build
