````md
# ⬡ SkillSphere — Full-Stack Student Growth Tracking Platform

> **Track Skills. Build Growth. Shape Futures.**

A complete full-stack web app with React frontend + Node.js/Express backend + MongoDB Atlas.

---

# 📁 Project Structure

```bash
skillsphere/
├── client/          ← React + Tailwind CSS frontend
├── server/          ← Node.js + Express + MongoDB backend
├── package.json     ← Root (runs both together)
└── README.md
````

---

# ✨ Features

* JWT Authentication
* Email OTP Verification System
* Role-based Access Control (Student / Faculty / Admin)
* Student Skill Tracking
* Coding Profile Analytics
* XP & Leaderboard System
* Opportunities & Notifications
* Protected Routes
* MongoDB Atlas Cloud Database
* Responsive Dark UI
* Faculty & Admin Dashboards

---

# 🚀 Quick Setup (5 minutes)

## 1. Install all dependencies

```bash
npm install
npm run install:all
```

---

## 2. Configure the backend

```bash
cd server
cp .env.example .env
```

Edit `.env`:

```env
MONGO_URI=your_mongodb_atlas_connection_string

JWT_SECRET=your_secret_at_least_32_characters_long

JWT_REFRESH_SECRET=another_secret_key_here

CLIENT_URL=http://localhost:3000

EMAIL_USER=your_gmail@gmail.com

EMAIL_PASS=your_gmail_app_password
```

---

## 3. Seed the database

```bash
npm run seed
```

---

## 4. Run both frontend + backend

```bash
npm run dev
```

### URLs

* Frontend → [http://localhost:3000](http://localhost:3000)
* Backend API → [http://localhost:5000](http://localhost:5000)
* API Health → [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

# 🔑 Demo Accounts (after seeding)

| Role    | Email                                         | Password     |
| ------- | --------------------------------------------- | ------------ |
| Student | [arjun@jec.ac.in](mailto:arjun@jec.ac.in)     | Student@1234 |
| Student | [priya@jec.ac.in](mailto:priya@jec.ac.in)     | Student@1234 |
| Faculty | [faculty@jec.ac.in](mailto:faculty@jec.ac.in) | Faculty@1234 |
| Admin   | [admin@jec.ac.in](mailto:admin@jec.ac.in)     | Admin@1234   |

---

# 🗂 Frontend Pages

| Route            | Page               | Access          |
| ---------------- | ------------------ | --------------- |
| `/`              | Landing Page       | Public          |
| `/login`         | Login              | Public          |
| `/register`      | Register           | Public          |
| `/verify-otp`    | OTP Verification   | Public          |
| `/dashboard`     | Student Dashboard  | Student         |
| `/profile`       | My Profile         | Student         |
| `/skills`        | Skills & Goals     | Student         |
| `/projects`      | Project Portfolio  | Student         |
| `/faculty`       | Faculty Dashboard  | Faculty + Admin |
| `/admin`         | Admin Dashboard    | Admin           |
| `/leaderboard`   | Leaderboard        | All             |
| `/opportunities` | Opportunities Feed | All             |
| `/analytics`     | Analytics          | All             |
| `/notifications` | Notifications      | All             |
| `/settings`      | Settings           | All             |

---

# 🧩 Tech Stack

## Frontend

* React 18
* React Router v6
* Tailwind CSS
* Framer Motion
* Recharts
* Axios
* React Hot Toast

---

## Backend

* Node.js
* Express.js
* MongoDB Atlas + Mongoose
* JWT Authentication
* Email OTP Verification
* bcryptjs Password Hashing
* Express Rate Limiting
* Helmet Security
* Multer File Uploads

---

# 📡 Key API Endpoints

```bash
POST   /api/auth/register
POST   /api/auth/verify-otp
POST   /api/auth/login
POST   /api/auth/refresh
GET    /api/auth/me

GET    /api/users
GET    /api/users/:id
PUT    /api/users/:id

GET    /api/skills
POST   /api/skills
PUT    /api/skills/:id

GET    /api/goals
POST   /api/goals
PUT    /api/goals/:id

GET    /api/projects
POST   /api/projects
PUT    /api/projects/:id

GET    /api/opportunities
POST   /api/opportunities
POST   /api/opportunities/:id/apply

GET    /api/leaderboard?type=xp|cgpa|leetcode|codeforces

GET    /api/analytics/my-stats
GET    /api/analytics/overview

GET    /api/notifications
PUT    /api/notifications/mark-all-read
POST   /api/notifications/broadcast
```

---

# ⚙️ Individual Commands

## Run server only

```bash
npm run server
```

## Run client only

```bash
npm run client
```

## Seed database

```bash
npm run seed
```

## Build for production

```bash
npm run build
```

---

# 🏗 Production Deployment

## Build React App

```bash
npm run build
```

---

## Serve Static Files from Express

Add inside:

```bash
server/index.js
```

```js
app.use(express.static(path.join(__dirname, '../client/build')));
```

---

## Run with PM2

```bash
npm install -g pm2

cd server

pm2 start index.js --name skillsphere
```

---

# 🔒 Authentication Flow

```txt
Register
   ↓
OTP sent to email
   ↓
Email Verification
   ↓
Login
   ↓
Dashboard Access
```

---

# 🏫 Built for Jorhat Engineering College (JEC)

SkillSphere is designed as a centralized student growth and skill tracking platform for JEC students, faculty members, and administrators.

---

# ❤️ Built with Passion — SkillSphere v1.0

```
```
