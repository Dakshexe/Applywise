# ApplyWise

MERN job board with two roles: **candidates apply** and **recruiters shortlist**. Built for a resume — auth, search, file uploads, an application pipeline, and views-vs-applies analytics.

## Stack

- MongoDB + Mongoose (text + compound indexes)
- Express REST API with JWT and role checks
- React (Vite) + Tailwind
- Resume uploads (Multer), in-app notifications, optional SMTP email

## Run locally

1. Start MongoDB on `127.0.0.1:27017`.
2. From the project root:

```bash
npm run seed
npm run dev
```

- API: http://localhost:5000
- App: http://localhost:5173

Copy `server/.env.example` to `server/.env` if you need to change secrets. Add SMTP vars to send real emails; without them, emails are logged to the server console and in-app notifications still work.

> **Seed data warning:** `npm run seed` deletes all users, jobs, applications, notifications, and saved searches in the configured MongoDB database before inserting demo data. Only run it against a local or otherwise disposable database.

## Demo logins (after seed)

| Role | Email | Password |
| --- | --- | --- |
| Recruiter | recruiter@applywise.dev | password123 |
| Candidate | candidate@applywise.dev | password123 |

## What to show in interviews

- Candidate vs recruiter routes and JWT middleware
- Job search with MongoDB text indexes and saved searches
- Application statuses: applied → reviewing → shortlisted → rejected / hired
- Recruiter analytics: listing views, apply count, conversion
- Resume download restricted to the candidate and that job’s recruiter
- Candidate profile resume upload and private download
