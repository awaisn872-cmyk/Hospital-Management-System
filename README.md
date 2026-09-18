# Hospital Management System — Full Stack

Converted from the supplied HTML/CSS/JavaScript HMS into a React + Express + MongoDB application.

## Features

- Same core sidebar/navigation and visual direction
- React frontend with component/page structure
- Express + Node.js REST API
- MongoDB persistence with Mongoose
- Patient CRUD
- Doctor CRUD
- Appointment booking/cancellation
- Billing and paid invoice records
- Dashboard counts and revenue from MongoDB
- Global search for patient/doctor/appointment data
- Mobile responsive sidebar/table/form layout
- Print bill
- No localStorage database dependency

## Project structure

- `frontend/` — React + Vite
- `backend/` — Node.js + Express + MongoDB

## Run backend

```powershell
cd backend
npm install
Copy-Item .env.example .env
```

Open `.env` and put your MongoDB connection string in `MONGODB_URI`.

Then:

```powershell
npm run dev
```

Backend runs at `http://localhost:5000`.

## Run frontend

Open a second terminal:

```powershell
cd frontend
npm install
npm run dev
```

Open the Vite URL shown in the terminal, normally `http://localhost:5173`.

## MongoDB

Create/use a MongoDB Atlas cluster and database. The database name in the connection string can be `hospital_management`.

Example:

```env
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/hospital_management
```

Do not commit your real `.env` file or database password.

## Important behavior

Deleting a patient or doctor also removes their related appointments to prevent broken appointment references.

A payment creates an invoice and the dashboard revenue is calculated from paid invoices, so it persists in MongoDB instead of browser localStorage.

The supplied original version stored the whole HMS store in localStorage. This project replaces that persistence layer with MongoDB while keeping the same main workflow.
