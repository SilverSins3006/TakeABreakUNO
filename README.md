# TakeABreakUNO

A web application to encourage taking breaks from screen time.

## 🗺️ Navigation

- [Team](#team)
- [About](#about)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Common Commands](#common-commands)
- [Project Management & Backlog](#-project-management)
- [Release Notes](#release-notes)

---

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
- `doxygen Doxyfile` - generate documentation which can then be viewed at /docs/html/index.html

## Release Notes

### Code Milestone 1

Currently working:

- React + Vite frontend is set up and running.
- Express + Node.js backend server is set up and running.
- The project can be run locally with `npm run dev`.
- The frontend runs at `http://localhost:5173`.
- The backend runs at `http://localhost:3000`.
- Initial TakeABreakUNO active page UI has been created.
- The UI includes a timer display area, Pause button, Menu button, and Logout button.
- Light and dark mode styling has been added.
- TakeABreakUNO logo and UNO course footer have been added.
- Theme colors were updated to match the current logo/design.
- PostgreSQL database setup is connected through Neon using environment variables.
- The project is connected to GitHub and can be updated using `git pull`.

Still in progress:

- Some buttons and UI elements may still be placeholder features.
- Timer and challenge functionality may need additional integration.
- More database routes, challenge logic, and user settings will be added in future milestones.

### Code Milestone 2

What is Complete:

- Database is set up.
- The challenge table has been seeded.
- Project architecture is set up.
- Vercel and Neon SQL tables are created and connected.
- API routes were created to query the database for challenges.
- Main page design is complete.
- Setting user interface is complete.
- Setting page design is complete.
- Login setup has been started.
- Baseline functionality is set up.
- Since Milestone 1, the codebase has been reorganized for better modularity.

What Needs to be Done:

- Connect the remaining pieces to achieve full functionality.
- Create a status/state system so when timer runs out, a random challenge is retrieved from the Neon challenge table.
- Test for bugs
- Complete login status handling.
- Add difficulty selection functionality.
- Make database calls from the frontend.

### Code Milestone 3

Currently working:

- Users must be logged in to access the Dashboard, Settings, and Insights pages.
- User accounts are connected to the Neon database after login.
- A Reset button has been added to the timer.
- The page changes to break time when the timer reaches zero.
- A random challenge is displayed when break time begins.
- Users can select more than one challenge category.
- Basic automated tests have been added for the timer.
- Logout, page loading, and deployment issues have been fixed.

Still in progress:

- User settings are not saved after refreshing or logging back in.
- Selecting difficulty and categories does not yet change which challenge appears.
- The challenge completion counter and XP rewards are not yet functional.
- The Insights page still needs to be completed.
- Additional testing and bug fixes are still needed.