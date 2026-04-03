# 💰 Finance Data Processing & Access Control System

A **production-ready** Node.js/Express backend for financial data management with Role-Based Access Control (RBAC), JWT authentication, MongoDB aggregations for dashboard analytics, Swagger API documentation, rate limiting, and structured logging.

---

## 📁 Folder Structure

```
zorvyn/
├── server.js                     # Entry point — boots server + DB
├── .env                          # Environment variables
├── .env.example                  # Example env (commit this)
├── .gitignore
├── package.json
├── logs/                         # Winston log files (auto-created)
└── src/
    ├── app.js                    # Express app setup
    ├── config/
    │   ├── db.js                 # MongoDB connection
    │   └── swagger.js            # Swagger/OpenAPI config
    ├── models/
    │   ├── User.js               # User schema (bcrypt, roles)
    │   └── FinancialRecord.js    # Record schema (soft delete)
    ├── middleware/
    │   ├── auth.js               # JWT verification
    │   ├── rbac.js               # Role-based access control
    │   ├── errorHandler.js       # Global error handler
    │   ├── rateLimiter.js        # API + Auth rate limiting
    │   └── logger.js             # Morgan → Winston request logs
    ├── controllers/
    │   ├── auth.controller.js
    │   ├── record.controller.js
    │   └── dashboard.controller.js
    ├── services/
    │   ├── auth.service.js       # Auth business logic
    │   ├── record.service.js     # Record CRUD + filters
    │   └── dashboard.service.js  # MongoDB aggregation pipelines
    ├── routes/
    │   ├── index.js              # Route aggregator + health check
    │   ├── auth.routes.js        # /api/v1/auth/*
    │   ├── record.routes.js      # /api/v1/records/*
    │   └── dashboard.routes.js   # /api/v1/dashboard/*
    ├── validators/
    │   ├── auth.validator.js     # Joi schemas for auth
    │   └── record.validator.js   # Joi schemas for records
    └── utils/
        ├── jwt.util.js           # Token generation/verification
        ├── response.util.js      # Standardized response helpers
        ├── pagination.util.js    # Pagination builders
        ├── logger.util.js        # Winston logger instance
        └── seeder.js             # DB seed script
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 16
- MongoDB (local or Atlas)

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Copy and configure environment variables
cp .env.example .env
# Edit .env and set MONGO_URI, JWT_SECRET

# 3. (Optional) Seed the database with sample data
npm run seed

# 4. Start development server
npm run dev
```

Server runs at: **http://localhost:5000**
Swagger Docs: **http://localhost:5000/api-docs**

---

## 📡 API Endpoints

### Authentication — `/api/v1/auth`

| Method | Endpoint                      | Access  | Description          |
|--------|-------------------------------|---------|----------------------|
| POST   | `/auth/register`              | Public  | Register new user    |
| POST   | `/auth/login`                 | Public  | Login, get JWT       |
| GET    | `/auth/me`                    | All     | Current user profile |
| GET    | `/auth/users`                 | Admin   | List all users       |
| PATCH  | `/auth/users/:id/role`        | Admin   | Assign role          |
| PATCH  | `/auth/users/:id/activate`    | Admin   | Activate user        |
| PATCH  | `/auth/users/:id/deactivate`  | Admin   | Deactivate user      |

### Financial Records — `/api/v1/records`

| Method | Endpoint        | Access          | Description                        |
|--------|-----------------|-----------------|------------------------------------|
| GET    | `/records`      | Viewer+         | List records (filter/search/page)  |
| GET    | `/records/:id`  | Viewer+         | Get single record                  |
| POST   | `/records`      | Analyst+        | Create record                      |
| PUT    | `/records/:id`  | Analyst+        | Update record                      |
| DELETE | `/records/:id`  | Admin           | Soft delete record                 |

### Dashboard — `/api/v1/dashboard`

| Method | Endpoint                    | Access   | Description                  |
|--------|-----------------------------|----------|------------------------------|
| GET    | `/dashboard/summary`        | Analyst+ | Income, expenses, net balance|
| GET    | `/dashboard/categories`     | Analyst+ | Category-wise breakdown      |
| GET    | `/dashboard/trends`         | Analyst+ | Monthly income vs expenses   |
| GET    | `/dashboard/recent`         | Viewer+  | Recent transactions          |
| GET    | `/dashboard/top-categories` | Analyst+ | Top spending categories      |

---

## 🔐 Role-Based Access Control (RBAC)

| Permission         | Viewer | Analyst | Admin |
|--------------------|--------|---------|-------|
| Read records       | ✅     | ✅      | ✅    |
| View recent txns   | ✅     | ✅      | ✅    |
| Create records     | ❌     | ✅      | ✅    |
| Update records     | ❌     | ✅      | ✅    |
| Delete records     | ❌     | ❌      | ✅    |
| View analytics     | ❌     | ✅      | ✅    |
| Manage users       | ❌     | ❌      | ✅    |

---

## 📦 Example Request / Response

### Register

```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepass123",
  "role": "analyst"
}
```

```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "64abc...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "analyst",
      "isActive": true
    }
  }
}
```

### Get Records (with filters)

```http
GET /api/v1/records?type=expense&category=Food&page=1&limit=5&sortBy=date&sortOrder=desc
Authorization: Bearer <token>
```

```json
{
  "success": true,
  "message": "Records retrieved successfully",
  "data": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalRecords": 14,
    "recordsPerPage": 5,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### Dashboard Summary

```http
GET /api/v1/dashboard/summary
Authorization: Bearer <analyst-token>
```

```json
{
  "success": true,
  "message": "Dashboard summary retrieved",
  "data": {
    "totalIncome": 45000.00,
    "totalExpenses": 28500.75,
    "netBalance": 16499.25,
    "totalTransactions": 60,
    "incomeCount": 22,
    "expenseCount": 38
  }
}
```

---

## 🧱 Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| **Singleton services** | `new AuthService()` exported as singleton — avoids re-instantiation on each request |
| **Soft delete** | `isDeleted` flag on records — auditable, recoverable, Mongoose pre-hook auto-excludes |
| **Role hierarchy** | Permission matrix in `rbac.js` — admin inherits analyst, analyst inherits viewer |
| **Lean middleware auth** | JWT middleware fetches full user from DB to catch deactivated/deleted accounts |
| **Compound indexes** | `{ type, date, isDeleted }` on FinancialRecord accelerates dashboard aggregate pipelines |
| **Body size limit** | 10KB max body — rejects abnormally large payloads early |
| **Separate auth limiter** | Auth routes have stricter rate limiting (10/15min) vs global (100/15min) |
| **abortEarly: false** | Joi returns all validation errors at once — better DX |

---

## 🌱 Seed Credentials

After running `npm run seed`:

| Role    | Email                  | Password   |
|---------|------------------------|------------|
| Admin   | admin@finance.com      | admin123   |
| Analyst | analyst@finance.com    | analyst123 |
| Viewer  | viewer@finance.com     | viewer123  |
