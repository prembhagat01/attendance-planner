# Bunkwise - Attendance Planner (MERN)

Helps students see attendance shortages early. For each subject it shows the current %,
how many classes can be skipped safely, how many must be attended to recover,
and a what-if simulator.

## Features
- Students: subjects, present/absent, safe-skip and recovery calculators, what-if simulator
- Teachers: dashboard of every student below the required %, with search
- Daily 8 AM email alerts (node-cron + nodemailer). Without EMAIL_USER/EMAIL_PASS they print in the backend terminal

## Run locally
1. Install and start MongoDB (or use a MongoDB Atlas link).
2. Backend:
   cd backend
   cp .env.example .env     (then edit the values)
   npm install
   npm run dev
3. Frontend (new terminal):
   cd frontend
   npm install
   npm run dev
4. Open http://localhost:5173

## Maths used
- Percent = attended / total x 100
- Safe skips x: floor(attended x 100 / required - total)
- Classes to attend y: ceil((required x total - 100 x attended) / (100 - required))
