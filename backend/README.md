# Backend

Node.js + Express backend for the Employee Management app.

## Setup

```bash
cd backend
npm install
npm run dev
```

Server runs on `http://localhost:5000`

## Auth

- `POST /api/register` — { name, email, password } → creates user
- `POST /api/login` — { email, password } → returns { token, user }

All routes below require header: `Authorization: Bearer <token>`

## Users

- `GET /api/users` — list of users
- `GET /api/users/:id` — single user profile
- `PUT /api/users/:id` — { name?, email? } → update user

## Employees

- `POST /api/employees` — { name, email, department, role } → create
- `GET /api/employees` — list of employees
- `GET /api/employees/:id` — single employee profile
- `PUT /api/employees/:id` — { name?, email?, department?, role? } → update
- `DELETE /api/employees/:id` — delete

## Note

Data is stored in-memory — restarting the server clears all users and employees. Register + login again after any restart.
