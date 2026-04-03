# Finance Data Processing & Access Control System

A production-ready Node.js/Express backend for financial data management with Role-Based Access Control (RBAC), JWT authentication, MongoDB aggregations for dashboard analytics, Swagger API documentation, rate limiting, and structured logging.

---

## Folder Structure

```
zorvyn/
├── server.js
├── .env
├── .env.example
├── .gitignore
├── package.json
├── logs/
└── src/
    ├── app.js
    ├── config/
    │   ├── db.js
    │   └── swagger.js
    ├── models/
    │   ├── User.js
    │   └── FinancialRecord.js
    ├── middleware/
    │   ├── auth.js
    │   ├── rbac.js
    │   ├── errorHandler.js
    │   ├── rateLimiter.js
    │   └── logger.js
    ├── controllers/
    │   ├── auth.controller.js
    │   ├── record.controller.js
    │   └── dashboard.controller.js
    ├── services/
    │   ├── auth.service.js
    │   ├── record.service.js
    │   └── dashboard.service.js
    ├── routes/
    │   ├── index.js
    │   ├── auth.routes.js
    │   ├── record.routes.js
    │   └── dashboard.routes.js
    ├── validators/
    │   ├── auth.validator.js
    │   └── record.validator.js
    └── utils/
        ├── jwt.util.js
        ├── response.util.js
        ├── pagination.util.js
        ├── logger.util.js
        └── seeder.js
```

---

## Getting Started

### Prerequisites

* Node.js >= 16
* MongoDB (local or Atlas)

---

### Installation

```bash
npm install
```

```bash
cp .env.example .env
```

Edit `.env` and set:

* MONGO_URI
* JWT_SECRET
* BASE_URL

---

### Seed Database (Optional)

```bash
npm run seed
```

---

### Run Server

```bash
npm run dev
```

Server:

```
http://localhost:5000
```

Swagger Docs:

```
http://localhost:5000/api-docs
```

---

## Live API

```
https://zorvyn-finance-api-1.onrender.com
```

Swagger Docs:

```
https://zorvyn-finance-api-1.onrender.com/api-docs
```

---

## API Endpoints

### Authentication — `/api/v1/auth`

| Method | Endpoint                   | Access |
| ------ | -------------------------- | ------ |
| POST   | /auth/register             | Public |
| POST   | /auth/login                | Public |
| GET    | /auth/me                   | All    |
| GET    | /auth/users                | Admin  |
| PATCH  | /auth/users/:id/role       | Admin  |
| PATCH  | /auth/users/:id/activate   | Admin  |
| PATCH  | /auth/users/:id/deactivate | Admin  |

---

### Records — `/api/v1/records`

| Method | Endpoint     | Access   |
| ------ | ------------ | -------- |
| GET    | /records     | Viewer+  |
| GET    | /records/:id | Viewer+  |
| POST   | /records     | Analyst+ |
| PUT    | /records/:id | Analyst+ |
| DELETE | /records/:id | Admin    |

---

### Dashboard — `/api/v1/dashboard`

| Method | Endpoint                  | Access   |
| ------ | ------------------------- | -------- |
| GET    | /dashboard/summary        | Analyst+ |
| GET    | /dashboard/categories     | Analyst+ |
| GET    | /dashboard/trends         | Analyst+ |
| GET    | /dashboard/recent         | Viewer+  |
| GET    | /dashboard/top-categories | Analyst+ |

---

## Role-Based Access Control (RBAC)

| Permission               | Viewer | Analyst | Admin |
| ------------------------ | ------ | ------- | ----- |
| Read records             | Yes    | Yes     | Yes   |
| View recent transactions | Yes    | Yes     | Yes   |
| Create records           | No     | Yes     | Yes   |
| Update records           | No     | Yes     | Yes   |
| Delete records           | No     | No      | Yes   |
| View analytics           | No     | Yes     | Yes   |
| Manage users             | No     | No      | Yes   |

---

## Example Request / Response

### Login

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

Response:

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

---

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

## Seed Credentials

| Role    | Email                                             | Password   |
| ------- | ------------------------------------------------- | ---------- |
| Admin   | [admin@finance.com](mailto:admin@finance.com)     | admin123   |
| Analyst | [analyst@finance.com](mailto:analyst@finance.com) | analyst123 |
| Viewer  | [viewer@finance.com](mailto:viewer@finance.com)   | viewer123  |

---

## Design Decisions

* Service layer used for separation of concerns
* RBAC implemented using middleware
* MongoDB aggregation for dashboard analytics
* Soft delete using `isDeleted`
* Joi validation for request validation
* Centralized error handling
* Rate limiting for API protection

---

## Notes

* API may take 30–60 seconds to wake up (Render free tier)
* Use Swagger UI for testing endpoints
* Use Bearer token for protected routes

---

## Author

Bhupathi Sanjay
