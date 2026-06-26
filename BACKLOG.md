# Project Task Tracker & Backlog

This file tracks our upcoming course deliverables, agile story point estimations, and team card assignments.

---

### Code Milestone 1 — Due June 18 (Completed)
*Objective: Build the core foundation of our app, get our servers running, and show the baseline user interface.*

| Trello Card Title | What It Means In Plain English | Assignee | Points | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Deploy React Frontend to Vercel** | Get our blank React website live on the web at https://take-a-break-uno.vercel.app | Tristan | 3 | **Done** |
| **Deploy backend server setup** | Set up the backend node server code so it can talk to the internet | Danie / Tristan | 3 | **Done** |
| **Create database on Neon** | Sign up for Neon PostgreSQL and spin up our project cloud database | Tristan | 3 | **Done** |
| **Build baseline session timer** | Write the initial timer logic that starts counting seconds when a user hits start | Tristan | 5 | **Done** |
| **Put timer controls on screen** | Place the timer display (in seconds) along with Start, Pause, and Restart buttons | Cassia | 3 | **Done** |
| **Design look, feel, and colors** | Code the layout look, add light/dark modes, and style our theme colors | Danie | 3 | **Done** |

---

### Code Milestone 2 — Due July 2 (Current Focus)
*Objective: Connect our screens to our live backend database so settings save and random challenges appear.*

| Trello Card Title | What It Means In Plain English | Assignee | Points | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Clean up timer file structure** | Refactor the timer code out of one giant file and turn it into clean components | Danie | 5 | **Done** |
| **Organize project workspace files** | Standardize where folders sit so frontend and backend don't get tangled | Danie | 3 | **Done** |
| **Create basic backend URLs** | Set up empty target placeholder routes in Express (like `/api/settings`) | Danie | 3 | **Done** |
| **Build Settings screen layout** | Code the `pages/settings.js` dropdown menus for time, difficulty, and type | Danie | 5 | **Done** |
| **Link backend to database pool** | Write the code that safely bridges our Express server to our live Neon cloud database | Danie | 5 | **Done** |
**Fix Vercel page refresh 404 error** | Create a `vercel.json` file to make sure refreshing a route loads the app safely | Danie | 3 | Done |
| **Build database tables on Neon** | Write SQL commands to build the `challenges` and `settings` tables in our database | Tristan | 5 | To Do |
| **Add baseline challenge data** | Insert our initial list of break challenges directly into our database table rows | Tristan | 3 | To Do |
| **Code the 'Save Settings' backend API** | Write code so that when someone saves preferences, it updates the database | Open | 5 | To Do |
| **Code the 'Get Random Challenge' API** | Write a database search query that picks one random row from our challenge list | Danie | 5 | To Do |
| **Connect front end to challenge data** | Make our website text box actually fetch and display a live random challenge from the API | Open | 5 | To Do |
| **Make completion counter functional** | Write logic to track and add +1 to the user's score box when a challenge is finished | Open | 3 | To Do |
| **Set up on-screen popup alerts** | Make an emergency backup browser popup appear when a break interval hits zero | Open | 5 | To Do |

---

### Code Milestone 3 — Due July 16
*Objective: Make sure the app keeps data safe when a browser refreshes and write automated tests.*

| Trello Card Title | What It Means In Plain English | Assignee | Points | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Keep settings saved on page refresh** | Code the app to pull user preferences from the database the moment they log back in | Open | 5 | To Do |
| **Keep timer ticking on page refresh** | Use LocalStorage so refreshing the web page doesn't reset your timer to zero | Open | 5 | To Do |
| **Set up testing playground** | Install Jest or our chosen testing tools into our project root directory | Open | 3 | To Do |
| **Write code tests for the Timer logic** | Write script simulations to confirm the timer countdown handles pauses perfectly | Open | 5 | To Do |
| **Write code tests for Random Challenges** | Write script simulations to confirm the randomizer doesn't crash or break | Open | 5 | To Do |
| **Test front-to-back link** | Run an integration script ensuring the website can send requests smoothly to our server | Open | 5 | To Do |
| **Fix Milestone 2 bugs** | Review grader feedback from Milestone 2 and patch up any errors found | Open | 3 | To Do |

---

### Code Milestone 4 — Due July 31
*Objective: Polishing code comments, creating auto-generated documentation, and submitting final papers.*

| Trello Card Title | What It Means In Plain English | Assignee | Points | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Add code notes and clean files** | Write clear inline comments explaining how our functions work for grading clarity | All Team | 2 | To Do |
| **Auto-generate JSDoc code site** | Run a tool that reads our code comments and instantly spins up a documentation site | Open | 3 | To Do |
| **Finalize Requirements & Design papers** | Finalize our official class project planning documents inside our `/docs` folder | Open | 5 | To Do |
| **Compile Testing Results report** | Write up a summary sheet showing all our tests passed and what our test coverage is | Open | 5 | To Do |
| **Push final code updates to Vercel** | Push our clean production code to Vercel and make sure the live domain works 100% | Tristan | 3 | To Do |
| **Final check and team submission** | Run through the app together one final time and submit our project links to canvas | All Team | 2 | To Do |

---

### Future Features & Stretch Goals
*Optional fun features to work on ONLY after the core requirements above are completely done.*

| Trello Card Title | What It Means In Plain English | Assignee | Points | Status |
| :--- | :--- | :--- | :--- | :--- |
| ***[Stretch Goal]*** **Weighted Challenge Algorithm** | Change the randomizer so harder challenges or physical tasks appear less often | Open | 8 | To Do |
| ***[Stretch Goal]*** **Prevent repeating challenges** | Build memory logic so the app doesn't give you the exact same challenge twice in a row | Open | 5 | To Do |
| ***[Stretch Goal]*** **Desktop Browser Notifications** | Make standard system notifications slide into your desktop screen (like text messages) | Open | 5 | To Do |
| ***[Stretch Goal]*** **User Streaks Dashboard** | Build a UI section showing daily streaks (e.g., "You took breaks 5 days in a row!") | Open | 8 | To Do |
| ***[Stretch Goal]*** **Badges and Leveling system** | Add experience points (XP) and printable award badges when users complete tasks | Open | 8 | To Do |
| ***[Stretch Goal]*** **Add NEAT Challenge content** | Write customized physical health data cards centered around minor constant movements | Open | 3 | To Do |
| ***[Stretch Goal]*** **Add Skip/Snooze popup buttons** | Give users choices to delay a challenge for 5 minutes if they are stuck in the middle of a task | Open | 5 | To Do |
