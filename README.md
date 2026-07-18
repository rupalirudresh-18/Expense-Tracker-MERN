# Expense Tracker (MERN Stack)

A full-stack expense tracker with JWT authentication, categories, and
dashboard analytics — built with MongoDB, Express, React, and Node.

## Features
- **Auth**: Register/login with JWT, passwords hashed with bcrypt
- **Categories**: Custom categories with color tags, per user
- **Expenses**: Add/edit/delete expenses, filter by category, paginated list
- **Dashboard**: Monthly total spend, pie chart + bar chart breakdown by category (Recharts)

## Project structure
```
expense-tracker/
├── server/          # Express + MongoDB API
│   ├── config/db.js
│   ├── models/       (User, Category, Expense)
│   ├── controllers/
│   ├── routes/
│   ├── middleware/authMiddleware.js
│   └── server.js
└── client/          # React frontend
    └── src/
        ├── api/axios.js
        ├── context/AuthContext.js
        ├── components/ (Navbar, ExpenseForm, ExpenseList, ProtectedRoute)
        └── pages/ (Login, Register, Dashboard, Expenses, Categories)
```

## Setup

### 1. Backend
```bash
cd server
npm install
cp .env.example .env   # fill in MONGO_URI (MongoDB Atlas free tier works) and JWT_SECRET
npm run dev             # starts on http://localhost:5000
```

### 2. Frontend
Merge the `client/src` files here into your existing React app, then install
the extra packages it needs:
```bash
cd client
npm install axios react-router-dom recharts
cp .env.example .env
npm start               # starts on http://localhost:3000
```

## API overview

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/register | Create account |
| POST | /api/auth/login | Log in, returns JWT |
| GET | /api/auth/me | Current user (protected) |
| GET/POST | /api/categories | List / create categories (protected) |
| PUT/DELETE | /api/categories/:id | Update / delete category |
| GET/POST | /api/expenses | List (with filters) / create expense |
| PUT/DELETE | /api/expenses/:id | Update / delete expense |
| GET | /api/expenses/summary?month=YYYY-MM | Category breakdown for charts |

All routes except register/login require `Authorization: Bearer <token>`.

## Notes for placement interviews
Things worth highlighting when you talk about this project:
- **Data isolation per user**: every query is scoped to `req.user._id`, so
  one user can never see another's data — good to mention when asked about
  security.
- **Aggregation pipeline**: the `/summary` endpoint uses MongoDB's
  `$lookup`/`$group` aggregation instead of pulling all expenses and
  summing in JS — shows you can push work to the database layer.
- **JWT + bcrypt**: standard, interview-friendly auth flow you can explain
  end-to-end (hash on register, compare on login, verify middleware on
  protected routes).
- Good next additions if you want to go further: recurring expenses, CSV
  export, budget limits per category with alerts, refresh tokens.
