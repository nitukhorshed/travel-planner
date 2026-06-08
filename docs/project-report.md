# Travel Planner - Project Documentation Report

---

## Cover Page

**Course:** CSE471  
**Project Title:** Travel Planner - Multi-Planner Travel Marketplace  
**Student Name:** [Your Name]  
**Student ID:** [Your Student ID]  
**GitHub Repository Link:** [Your GitHub Repository URL]  
**Live Website Link:** [Your Live Website URL]

---

## 1. Objectives and Scope

The objective of this project is to design and develop a full-stack web application named **Travel Planner**, which serves as a multi-planner travel marketplace. The platform enables travelers to browse travel packages, view detailed package information including day-by-day itineraries, make bookings, and manage their travel activities through a user-friendly interface. Travel planners can create and manage tour packages with multiple images and detailed itineraries, handle booking requests, and maintain organization profiles.

The system also includes an administrative module that allows administrators to approve or reject planners, verify planner profiles, manage platform-wide activities, and monitor comprehensive statistics. The scope of the project covers user authentication, role-based access control (User, Planner, Admin), full CRUD operations on travel packages, a booking workflow system with approval mechanisms, planner profile management, image uploads, advanced search and filtering capabilities, sorting options, and complete administrative operations.

The application consists of over 20 interconnected pages including Home, Login, Registration, Package Browsing, Package Details, Booking Management, Planner Dashboard, Admin Dashboard, Profile Management, About, and Contact pages.

---

## 2. Technologies Used

### Frontend

| Technology | Purpose |
|---|---|
| HTML5 | Page structure and semantic markup |
| CSS3 | Styling, layout, and responsive design |
| JavaScript (ES6) | Client-side interactivity, DOM manipulation, and API communication |
| Google Fonts (Poppins) | Typography |

### Backend

| Technology | Purpose |
|---|---|
| Node.js | Server-side JavaScript runtime environment |
| Express.js (v5.2.1) | Web application framework for building RESTful APIs |

### Database

| Technology | Purpose |
|---|---|
| MongoDB Atlas | Cloud-hosted NoSQL database for persistent data storage |

### Authentication

| Technology | Purpose |
|---|---|
| JSON Web Token (JWT) | Stateless token-based authentication |
| bcrypt | Secure password hashing with salt rounds |

### Additional Tools and Libraries

| Library | Purpose |
|---|---|
| Mongoose (v9.6.3) | ODM library for MongoDB schema definitions and data modeling |
| Multer (v2.1.1) | Middleware for handling multipart/form-data file uploads |
| bcryptjs (v3.0.3) | JavaScript implementation of bcrypt for password hashing |
| dotenv (v17.4.2) | Environment variable management |
| cors (v2.8.6) | Cross-Origin Resource Sharing middleware |
| validator (v13.15.35) | String validation and sanitization library |
| nodemon (v3.1.14) | Development auto-restart utility |

---

## 3. System Architecture

The Travel Planner system follows a **client-server-database** architecture with clear separation of concerns.

### Architecture Diagram

```
┌─────────────────────┐         ┌─────────────────────────┐         ┌──────────────────────┐
│   Client Browser    │         │     Express Server      │         │   MongoDB Atlas      │
│                     │  HTTP   │                         │ Mongoose│                      │
│  HTML/CSS/JS Pages  │◄───────►│  Routes → Controllers  │◄───────►│  Collections:        │
│  Fetch API Calls    │  REST   │  Middleware (Auth/Role) │   ODM   │  - Users             │
│  LocalStorage (JWT) │         │  File Upload (Multer)   │         │  - Packages          │
│                     │         │  Static Files Serving   │         │  - Bookings          │
└─────────────────────┘         └─────────────────────────┘         │  - PlannerProfiles   │
                                                                     └──────────────────────┘
```

### Flow Description

1. The **frontend** is developed using HTML, CSS, and JavaScript. It presents the user interface, handles user interactions, and communicates with the backend through RESTful API requests using the Fetch API. JWT tokens are stored in `localStorage` for authenticated requests.

2. The **backend** is developed using Node.js and Express.js. It processes incoming HTTP requests, manages authentication and authorization through middleware layers, performs business logic operations in controllers, and interacts with the database through Mongoose models.

3. **MongoDB Atlas** serves as a cloud-based NoSQL database. Mongoose is used as an Object Data Modeling (ODM) library to define schemas, enforce validation rules, and manage communication between the application and MongoDB.

4. **File uploads** are handled via Multer, storing package images locally in the `uploads/package-images/` directory, which is served as static content by Express.

This architecture provides modularity, scalability, maintainability, and efficient separation of concerns between presentation, business logic, and data storage layers.

---

## 4. Main Features

### 4.1 User Authentication

The system provides secure user registration and login functionality. During registration, users can select their role (Traveler or Planner/Organization). User passwords are hashed using bcrypt with 10 salt rounds before being stored in the database. Upon successful login, a JWT token is generated containing the user's ID and returned to the client, where it is stored in `localStorage` and used to authenticate subsequent API requests via Bearer token authorization headers.

### 4.2 Role-Based Access Control

The platform supports three user roles with distinct permissions:

- **User (Traveler):** Can browse packages, view package details, create bookings, view own bookings, cancel own bookings, and manage their profile.
- **Planner:** Can create, update, and delete own travel packages; manage incoming booking requests (approve/cancel); create and maintain an organization profile. Planners require admin approval before accessing planner features.
- **Admin:** Has full control over planner approval/rejection, planner profile verification/unverification, platform statistics monitoring, and overall platform management.

Authorization is enforced through dedicated middleware functions (`protect`, `isAdmin`, `isPlanner`, `isApprovedPlanner`) applied to protected API routes.

### 4.3 Package Management (CRUD Operations)

Approved planners can perform full CRUD operations on travel packages:

- **Create:** Add new packages with title, destination, start location, category, description, price, duration, total seats, images (up to 5), and a detailed day-by-day itinerary with activities.
- **Read:** All users can view active packages publicly. Planners can view their own packages regardless of status.
- **Update:** Planners can update only their own packages. Ownership is verified before allowing modifications.
- **Delete:** Planners can delete only their own packages with ownership verification.

Each package supports the following categories: Adventure, Beach, Family, Couple, Luxury, Religious, Nature, Cultural, and Other.

Packages include embedded itinerary data with day numbers, day titles, and activities (each with title, description, start time, end time, and location).

### 4.4 Booking System

Users can book available travel packages through a structured workflow:

1. User submits a booking request specifying the number of travelers and optional special requests.
2. The system validates seat availability and calculates the total amount (price × number of travelers).
3. The booking is created with a **pending** status.
4. The planner who owns the package can **approve** or **cancel** the booking.
5. Upon approval, available seats are decremented and the booking count is incremented.
6. Upon cancellation of an approved booking, seats are restored.

Both planners and users can cancel bookings, with appropriate seat restoration logic for previously approved bookings.

### 4.5 Planner Profile System

Each approved planner can maintain an organization profile containing:

- Organization name
- Logo image
- Cover image
- Description
- Phone number
- Website URL
- Physical address

Administrators can verify planner profiles, and only verified profiles are publicly displayed as featured planners on the homepage. Each planner is limited to one profile (enforced by a unique constraint on `plannerId`).

### 4.6 Search and Filter

The application provides comprehensive search and filtering capabilities:

- **Keyword Search:** Users can search packages by keyword, which matches against title, destination, start location, and description fields (case-insensitive regex matching).
- **Category Filter:** Filter packages by category (Adventure, Beach, Family, Couple, Luxury, Religious, Nature, Cultural, Other).
- **Destination Filter:** Filter by destination keyword.
- **Start Location Filter:** Filter by starting location.
- **Price Range Filter:** Filter by minimum and maximum price.
- **Duration Range Filter:** Filter by minimum and maximum duration.
- **Featured Filter:** View only featured packages.
- **Sorting Options:** Sort by price (low to high / high to low), duration (low to high / high to low), or popularity (most booked).

The homepage also features a search bar that redirects to the packages page with the search query applied.

### 4.7 Admin Dashboard

The administrative dashboard provides comprehensive platform-wide statistics including:

- Total users, total planners, pending planners, approved planners, rejected planners
- Total packages, active packages, inactive packages, featured packages
- Total bookings, pending bookings, approved bookings, cancelled bookings

Admin functionalities include:
- Viewing all planners with their approval status
- Approving or rejecting planner registration requests
- Viewing all planner profiles
- Verifying or unverifying planner profiles
- Managing platform packages

### 4.8 Image Upload System

The application supports image uploads for package images using Multer middleware:

- Single image upload endpoint (`/api/uploads/package-image`)
- Multiple image upload endpoint (`/api/uploads/package-images`) supporting up to 5 images
- File type validation (JPEG, JPG, PNG, WebP only)
- File size limit of 5MB per image
- Unique filename generation using timestamps and random numbers
- Images served as static files from the `/uploads` directory

### 4.9 Public Statistics

The homepage displays real-time platform statistics fetched from the API:
- Happy Travelers (registered users count)
- Tour Packages (active packages count)
- Verified Planners (approved planners count)
- Total Bookings
- Destinations (unique destination count)

### 4.10 Featured and Trending Packages

- **Featured Packages:** Packages marked as featured by planners are displayed prominently on the homepage.
- **Trending Tours:** Packages sorted by booking count (most popular) are highlighted as trending tours on the homepage.

---

## 5. Database Schema

The Travel Planner application uses **MongoDB Atlas** as its primary database system with **Mongoose** as the ODM library.

### 5.1 Collections and Schema Definitions

#### Users Collection

| Field | Type | Constraints |
|---|---|---|
| _id | ObjectId | Auto-generated primary key |
| fullName | String | Required, trimmed |
| organizationName | String | Default: null (set for planners) |
| email | String | Required, unique, lowercase, trimmed |
| password | String | Required (bcrypt hashed) |
| role | String | Enum: ["user", "planner", "admin"], Default: "user" |
| plannerStatus | String | Enum: ["pending", "approved", "rejected"], Default: "pending" |
| createdAt | Date | Auto-generated timestamp |
| updatedAt | Date | Auto-generated timestamp |

#### Packages Collection

| Field | Type | Constraints |
|---|---|---|
| _id | ObjectId | Auto-generated primary key |
| title | String | Required, trimmed |
| destination | String | Required, trimmed |
| startLocation | String | Required, trimmed |
| category | String | Required, Enum: ["Adventure", "Beach", "Family", "Couple", "Luxury", "Religious", "Nature", "Cultural", "Other"] |
| description | String | Required |
| price | Number | Required, min: 0 |
| duration | Number | Required, min: 1 |
| totalSeats | Number | Required, min: 1 |
| availableSeats | Number | Required, min: 0 |
| images | [String] | Default: [] |
| itinerary | [ItineraryDay] | Default: [] (embedded subdocument) |
| plannerId | ObjectId (ref: User) | Required, foreign key reference |
| featured | Boolean | Default: false |
| bookingCount | Number | Default: 0 |
| status | String | Enum: ["active", "inactive"], Default: "active" |
| createdAt | Date | Auto-generated timestamp |
| updatedAt | Date | Auto-generated timestamp |

**Embedded Itinerary Day Schema:**

| Field | Type | Constraints |
|---|---|---|
| dayNumber | Number | Required |
| dayTitle | String | Required, trimmed |
| activities | [Activity] | Embedded subdocument array |

**Embedded Activity Schema:**

| Field | Type | Constraints |
|---|---|---|
| activityTitle | String | Required, trimmed |
| description | String | Default: "" |
| startTime | String | Default: "" |
| endTime | String | Default: "" |
| location | String | Default: "" |

#### Bookings Collection

| Field | Type | Constraints |
|---|---|---|
| _id | ObjectId | Auto-generated primary key |
| packageId | ObjectId (ref: Package) | Required, foreign key reference |
| userId | ObjectId (ref: User) | Required, foreign key reference |
| plannerId | ObjectId (ref: User) | Required, foreign key reference |
| numberOfTravelers | Number | Required, min: 1 |
| totalAmount | Number | Required, min: 0 |
| bookingStatus | String | Enum: ["pending", "approved", "cancelled"], Default: "pending" |
| specialRequest | String | Default: "" |
| createdAt | Date | Auto-generated timestamp |
| updatedAt | Date | Auto-generated timestamp |

#### PlannerProfiles Collection

| Field | Type | Constraints |
|---|---|---|
| _id | ObjectId | Auto-generated primary key |
| plannerId | ObjectId (ref: User) | Required, unique (one profile per planner) |
| organizationName | String | Required, trimmed |
| logo | String | Default: "" |
| coverImage | String | Default: "" |
| description | String | Default: "" |
| phone | String | Default: "" |
| website | String | Default: "" |
| address | String | Default: "" |
| verified | Boolean | Default: false |
| createdAt | Date | Auto-generated timestamp |
| updatedAt | Date | Auto-generated timestamp |

### 5.2 Relationships

- A **User** (planner) can create multiple **Packages** (one-to-many via `plannerId`).
- A **User** (traveler) can create multiple **Bookings** (one-to-many via `userId`).
- A **Package** can receive multiple **Bookings** (one-to-many via `packageId`).
- Each **Planner** can maintain exactly one **PlannerProfile** (one-to-one via unique `plannerId`).
- **Packages** contain embedded itinerary days and activities (embedded subdocuments).
- **Bookings** reference both the booking user and the package owner planner (via `userId` and `plannerId`).

### 5.3 Entity Relationship Diagram

```
┌──────────────┐       1:N        ┌──────────────┐       N:1        ┌──────────────┐
│    Users     │──────────────────►│   Packages   │◄────────────────│   Bookings   │
│              │  (as planner)     │              │  (packageId)     │              │
│  _id         │                   │  _id         │                  │  _id         │
│  fullName    │                   │  title       │                  │  packageId   │
│  email       │       1:1         │  destination │                  │  userId      │
│  password    │──────────┐        │  price       │                  │  plannerId   │
│  role        │          │        │  itinerary[] │                  │  totalAmount │
│  plannerStatus│         ▼        │  plannerId   │                  │  bookingStatus│
└──────────────┘   ┌──────────────┐└──────────────┘                  └──────────────┘
       │           │PlannerProfiles│                                         ▲
       │           │              │                                         │
       │   1:N     │  plannerId   │                                         │
       └──────────►│  orgName     │              Users (as traveler)  ───────┘
       (as user)   │  verified    │                    1:N (userId)
                   └──────────────┘
```

---

## 6. Validation and Security

The application incorporates multiple layers of validation and security mechanisms to ensure data integrity and secure system operation.

### Authentication Security

- **Password Hashing:** All user passwords are hashed using bcrypt with 10 salt rounds before storage. Plain text passwords are never stored in the database.
- **JWT-Based Authentication:** Stateless authentication using JSON Web Tokens. Tokens are verified on each protected API request through the `protect` middleware.
- **Token Transmission:** Tokens are sent via the `Authorization: Bearer <token>` header, preventing exposure in URL parameters.

### Authorization and Access Control

- **Protected Routes:** Authentication middleware (`protect`) verifies JWT tokens and attaches user data to requests before processing.
- **Role-Based Authorization:** Dedicated middleware functions (`isAdmin`, `isPlanner`, `isApprovedPlanner`) restrict access based on user roles.
- **Ownership Verification:** Planners can only modify or delete their own packages. Booking approval is restricted to the package owner planner only.
- **Planner Approval Gate:** Planners must be approved by an admin before they can create packages or access planner features.

### Input Validation

- **Schema Validation:** Mongoose schema definitions enforce required fields, data types, enumerations, minimum values, and unique constraints at the database level.
- **File Upload Validation:** Multer middleware restricts uploaded files to allowed image types (JPEG, JPG, PNG, WebP) and enforces a 5MB size limit.
- **Request Validation:** API controllers validate required fields before processing (e.g., checking `packageId` and `numberOfTravelers` in booking creation).
- **Validator Library:** The `validator` package provides additional string validation and sanitization capabilities.

### Data Protection

- **Password Exclusion:** Password fields are excluded from query results when returning user data (using Mongoose `.select("-password")`).
- **CORS Configuration:** Cross-Origin Resource Sharing is configured to control which origins can access the API.
- **Environment Variables:** Sensitive configuration (database URI, JWT secret) is stored in environment variables using dotenv, keeping secrets out of source code.

---

## 7. Testing

| # | Test Case | Input/Action | Expected Result | Status |
|---|---|---|---|---|
| 1 | User Registration | Valid name, email, and password with role "user" | Account created successfully with status 201 | Passed |
| 2 | Duplicate Registration | Registration with an existing email address | Error message "Email already exists" with status 400 | Passed |
| 3 | User Login (Valid) | Valid email and password credentials | JWT token generated and user data returned with status 200 | Passed |
| 4 | User Login (Invalid) | Incorrect password | Error message "Invalid email or password" with status 401 | Passed |
| 5 | Package Creation (Approved Planner) | Approved planner creates a package with all required fields | Package stored in database and returned with status 201 | Passed |
| 6 | Package Creation (Unapproved Planner) | Pending planner attempts to create a package | Error "Planner account is not approved yet" with status 403 | Passed |
| 7 | Package Search | Search using destination keyword "Cox's Bazar" | Matching packages displayed with case-insensitive matching | Passed |
| 8 | Package Category Filter | Filter packages by category "Beach" | Only Beach category packages displayed | Passed |
| 9 | Package Booking | User submits booking request with 2 travelers | Booking created with pending status and correct total amount | Passed |
| 10 | Booking with Insufficient Seats | User books more travelers than available seats | Error "Not enough seats available" with status 400 | Passed |
| 11 | Booking Approval | Planner approves a pending booking | Booking status updated to approved, seats decremented | Passed |
| 12 | Unauthorized Package Update | Planner attempts to update another planner's package | Error "You can update only your own packages" with status 403 | Passed |
| 13 | Planner Approval by Admin | Admin approves a pending planner account | Planner status updated to "approved" successfully | Passed |
| 14 | Image Upload Validation | Upload a non-image file (e.g., .pdf) | Error "Only image files are allowed" | Passed |
| 15 | Access Protected Route Without Token | Request to protected endpoint without Authorization header | Error "Not authorized" with status 401 | Passed |

The testing process confirmed that the primary functionalities of the application operate correctly, handle edge cases appropriately, and enforce security constraints as intended.

---

## 8. Development Timeline

| Phase | Task | Duration |
|---|---|---|
| Phase 1 | Requirement Analysis, Planning, and Project Structure Setup | 1 Day |
| Phase 2 | Backend Setup, Express Server Configuration, and MongoDB Atlas Connection | 1 Day |
| Phase 3 | User Model, Authentication (Register/Login), JWT Implementation | 1 Day |
| Phase 4 | Role-Based Middleware, Planner Approval System | 1 Day |
| Phase 5 | Package Model, CRUD Operations, Itinerary System, Image Upload | 2 Days |
| Phase 6 | Booking Model, Booking Workflow (Create, Approve, Cancel) | 1 Day |
| Phase 7 | Planner Profile System, Featured Planners, Verification | 1 Day |
| Phase 8 | Admin Dashboard, Statistics, Planner Management | 2 Days |
| Phase 9 | Frontend Pages: Home, Auth, Packages, Package Details | 3 Days |
| Phase 10 | Frontend Pages: Dashboards (User, Planner, Admin), Booking Management | 2 Days |
| Phase 11 | Search/Filter Integration, Sorting, Responsive Design | 1 Day |
| Phase 12 | Testing, Debugging, UI Improvements, and Edge Case Handling | 2 Days |
| Phase 13 | Documentation and Deployment Preparation | 1 Day |

---

## 9. Reflection

The development of Travel Planner provided valuable practical experience in full-stack web application development. Through this project, I gained a deeper understanding of frontend-backend communication using RESTful APIs, NoSQL database design with MongoDB, token-based authentication systems, and role-based access control implementation.

One of the most challenging aspects of the project was implementing a multi-role architecture where users, planners, and administrators each required different permissions and interfaces. Designing the booking workflow with proper state management (pending → approved/cancelled) while maintaining data consistency (seat availability tracking) required careful logic and edge case handling.

Another significant challenge was implementing the embedded itinerary system within packages, where each package can contain multiple days with multiple activities. This nested data structure required thoughtful schema design using Mongoose subdocuments and careful frontend handling for dynamic form generation.

The search and filtering system also posed interesting challenges, requiring the construction of dynamic MongoDB queries based on multiple optional parameters while maintaining performance.

The project significantly improved my understanding of modern web development technologies including Node.js, Express.js, MongoDB, Mongoose ODM, JWT authentication, and vanilla JavaScript for client-side development. It also strengthened my problem-solving, debugging, API design, and software architecture skills.

Overall, the project successfully demonstrates the integration of frontend, backend, and database technologies to create a practical, secure, and scalable multi-user web application.

---

## 10. References

1. MDN Web Docs (2025) *HTML, CSS, and JavaScript Documentation*. Available at: https://developer.mozilla.org/ (Accessed: June 2026).
2. MongoDB Documentation (2025) *MongoDB Atlas Documentation*. Available at: https://www.mongodb.com/docs/atlas/ (Accessed: June 2026).
3. Express.js Documentation (2025) *Express.js Web Framework*. Available at: https://expressjs.com/ (Accessed: June 2026).
4. Node.js Documentation (2025) *Node.js Runtime Documentation*. Available at: https://nodejs.org/ (Accessed: June 2026).
5. Mongoose Documentation (2025) *Mongoose ODM Documentation*. Available at: https://mongoosejs.com/ (Accessed: June 2026).
6. JSON Web Token (2025) *Introduction to JSON Web Tokens*. Available at: https://jwt.io/ (Accessed: June 2026).
7. bcrypt Documentation (2025) *bcrypt npm package*. Available at: https://www.npmjs.com/package/bcrypt (Accessed: June 2026).
8. Multer Documentation (2025) *Multer - Node.js Middleware for File Uploads*. Available at: https://www.npmjs.com/package/multer (Accessed: June 2026).
9. Google Fonts (2025) *Poppins Font Family*. Available at: https://fonts.google.com/specimen/Poppins (Accessed: June 2026).
10. Unsplash (2025) *Free Stock Images*. Available at: https://unsplash.com/ (Accessed: June 2026).
