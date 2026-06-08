# Travel Planner

Travel Planner is a full-stack travel marketplace web application where users can browse travel packages, book tours, and manage their bookings. Travel planners can create and manage packages, approve or cancel bookings, and maintain organization profiles. Admins can approve planners, verify planner profiles, manage packages, and monitor platform statistics.

## Features

* User registration and login
* JWT authentication
* Role-based access control
* User, Planner, and Admin roles
* Travel package CRUD
* Package itinerary and activities
* Multiple package image upload
* Package search and filtering
* Booking system
* Planner booking approval and cancellation
* Planner profile management
* Admin planner approval
* Admin planner profile verification
* Admin platform statistics
* Public planner details page
* Responsive UI

## Technology Stack

### Frontend

* HTML
* CSS
* JavaScript

### Backend

* Node.js
* Express.js

### Database

* MongoDB Atlas
* Mongoose

### Other Packages

* bcrypt
* jsonwebtoken
* dotenv
* cors
* multer
* nodemon

## Project Structure

```text
travel-planner/
├── client/
│   ├── css/
│   ├── js/
│   ├── index.html
│   ├── packages.html
│   ├── package-details.html
│   ├── login.html
│   ├── register.html
│   ├── planner-dashboard.html
│   ├── admin-dashboard.html
│   └── ...
│
└── server/
    ├── config/
    ├── controllers/
    ├── middleware/
    ├── models/
    ├── routes/
    ├── uploads/
    ├── server.js
    └── package.json
```

## Environment Variables

Create a `.env` file inside the `server/` folder.

```env
PORT=5001
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
```

## Installation and Setup

### Backend Setup

```bash
cd server
npm install
npm run dev
```

The backend will run on:

```text
https://travel-planner-3ro5.onrender.com
```

### Frontend Setup

Open the `client/` folder using Live Server or Live Preview.

The frontend may run on:

```text
http://travel-planner-web.netlify.app
```

## Important API Endpoints

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
GET /api/auth/profile
PUT /api/auth/profile
```

### Packages

```http
GET /api/packages
GET /api/packages/:id
POST /api/packages
PUT /api/packages/:id
DELETE /api/packages/:id
GET /api/packages/featured
GET /api/packages/trending
```

### Bookings

```http
POST /api/bookings
GET /api/bookings/my-bookings
GET /api/bookings/planner-bookings
PUT /api/bookings/:id/approve
PUT /api/bookings/:id/cancel
```

### Planner Profile

```http
POST /api/planner-profile
GET /api/planner-profile/me
PUT /api/planner-profile
GET /api/planner-profile/featured
GET /api/planner-profile/:plannerId
```

### Admin

```http
GET /api/admin/stats
GET /api/admin/planners
PUT /api/admin/planners/:id/approve
PUT /api/admin/planners/:id/reject
GET /api/admin/planner-profiles
PUT /api/admin/planner-profiles/:id/verify
PUT /api/admin/planner-profiles/:id/unverify
```

## Default Workflow

1. A user registers and logs in.
2. A planner registers and waits for admin approval.
3. Admin approves the planner.
4. Planner creates a planner profile.
5. Admin verifies the planner profile.
6. Planner creates travel packages.
7. Users browse and book packages.
8. Planner approves or cancels booking requests.

## Security Features

* Password hashing using bcrypt
* JWT authentication
* Protected routes
* Role-based access control
* Planner ownership checks
* Admin-only routes

## Live Website

Add live link here:

```text
[Live Website Link]
```

## GitHub Repository

https://github.com/nitukhorshed/travel-planner

```text
[GitHub Repository Link]
```

## Author

Name: Tamanna Khorshed Nitu
Student ID: 2023100000300
Course: CSE 472.1 - Web and Internet Programming Lab
