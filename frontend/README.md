# Authentication + Dashboard App

A simple full-stack web application with **Sign In**, **Sign Up**, and **Dashboard** screens.  
Users can view and update their profile. Fully responsive UI and tested backend.

## Tech Stack

- Frontend: Next.js, TailwindCSS, Redux Toolkit
- Backend: Django REST Framework, JWT Authenticationa
- Database: PostgreSQL
- Testing: pytest (backend)

## Features

- User Registration
- User Login (JWT-based)
- Dashboard with authenticated user info
- Edit profile (first name, last name)
- Email is read-only
- Responsive UI
- Error handling and validation
- Unit tests for backend

## Backend Setup

```
cd backend/teamshiksha
Activate the venv
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

## Frontend Setup

```
cd frontend
npm install
npm run dev
```

## Running Tests

### Backend Tests

```
pytest --tb=short -q
```

### Frontend Tests

```
npm run test
```
