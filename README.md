# ⬡ SkillSphere — Full-Stack Student Growth Tracking Platform

> **Track Skills. Build Growth. Shape Futures.**

A complete full-stack web app with React frontend + Node.js/Express backend + MongoDB.

---

## 📁 Project Structure

```
skillsphere/
├── client/          ← React + Tailwind CSS frontend
├── server/          ← Node.js + Express + MongoDB backend
├── package.json     ← Root (runs both together)
└── README.md
```

---

## 🚀 Quick Setup (5 minutes)

### 1. Install all dependencies
```bash
npm install          # installs concurrently
npm run install:all  # installs client + server deps
```

### 2. Configure the backend
```bash
cd server
cp .env.example .env
```
Edit `.env`:
```env
MONGO_URI=mongodb://localhost:27017/skillsphere
JWT_SECRET=your_secret_at_least_32_characters_long
JWT_REFRESH_SECRET=another_secret_key_here
CLIENT_URL=http://localhost:3000
```

### 3. Seed the database
```bash
npm run seed
```

### 4. Run both client + server together
```bash
npm run dev
```
- **Frontend** → http://localhost:3000
- **Backend API** → http://localhost:5000
- **API Health** → http://localhost:5000/api/health

---

## 🔑 Demo Accounts (after seeding)

| Role    | Email              | Password       |
|---------|--------------------|----------------|
| Student | arjun@nit.edu      | Student@1234   |
| Student | priya@nit.edu      | Student@1234   |
| Faculty | faculty@nit.edu    | Faculty@1234   |
| Admin   | admin@nit.edu      | Admin@1234     |

---

## 🗂 Frontend Pages

| Route           | Page                     | Access          |
|-----------------|--------------------------|-----------------|
| `/`             | Landing Page             | Public          |
| `/login`        | Login                    | Public          |
| `/register`     | Register                 | Public          |
| `/dashboard`    | Student Dashboard        | Student         |
| `/profile`      | My Profile               | Student         |
| `/skills`       | Skills & Goals           | Student         |
| `/projects`     | Project Portfolio        | Student         |
| `/faculty`      | Faculty Dashboard        | Faculty + Admin |
| `/admin`        | Admin Dashboard          | Admin           |
| `/leaderboard`  | Leaderboard              | All             |
| `/opportunities`| Opportunities Feed       | All             |
| `/analytics`    | Analytics                | All             |
| `/notifications`| Notifications            | All             |
| `/settings`     | Settings                 | All             |

---

## 🧩 Tech Stack

**Frontend:**
- React 18 + React Router v6
- Tailwind CSS (dark theme)
- Framer Motion (animations)
- Recharts (analytics charts)
- Axios (API calls)
- React Hot Toast (notifications)

**Backend:**
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication (access + refresh tokens)
- bcryptjs (password hashing)
- Express Rate Limiting + Helmet (security)
- Multer (file uploads)

---

## 📡 Key API Endpoints

```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me

GET    /api/users              # Faculty/Admin only
GET    /api/users/:id
PUT    /api/users/:id

GET    /api/skills             # Own skills
POST   /api/skills
PUT    /api/skills/:id

GET    /api/goals
POST   /api/goals
PUT    /api/goals/:id

GET    /api/projects
POST   /api/projects
PUT    /api/projects/:id

GET    /api/opportunities      # With match score for students
POST   /api/opportunities      # Faculty/Admin
POST   /api/opportunities/:id/apply

GET    /api/leaderboard?type=xp|cgpa|leetcode|codeforces
GET    /api/analytics/my-stats
GET    /api/analytics/overview  # Admin/Faculty

GET    /api/notifications
PUT    /api/notifications/mark-all-read
POST   /api/notifications/broadcast  # Faculty/Admin
```

---

## ⚙️ Individual Commands

```bash
# Run server only
npm run server

# Run client only
npm run client

# Seed database
npm run seed

# Build for production
npm run build
```

---

## 🏗 Production Deployment

```bash
# Build React app
npm run build

# Serve static files from Express (add to server/index.js):
# app.use(express.static(path.join(__dirname, '../client/build')));

# Use PM2
npm install -g pm2
cd server && pm2 start index.js --name skillsphere
```

---

*Built with ❤️ — SkillSphere v1.0*
