# RESTful API for User Management

This project implements a RESTful API with user authentication and CRUD operations using Node.js, Express, MongoDB, and JWT authentication.

## Features
- User Authentication (JWT-Based)
- Signup and Login Endpoints
- CRUD Operations for Users
- Role-Based Access Control (Admin Only for Delete)
- Input Validation with Joi/Express Validator

## Prerequisites
- Node.js (>= 16.x)
- MongoDB (local or cloud)

## Setup Instructions

1. **Clone the repository**

```bash
git clone https://github.com/Namit2111/Express-Crud
cd Express-Crud
```

2. **Install dependencies**

```bash
npm install
```

3. **Environment configuration**

Create a `.env` file in the root directory with the following variables:

```bash
PORT=5000
MONGO_URI=mongodb://localhost:27017/your-database
JWT_SECRET=your_jwt_secret
```

4. **Run the application**

```bash
npm start
```

The application will start on `http://localhost:5000` by default.

## API Endpoints

### Authentication
- **POST /api/auth/signup** - Create a new user
  - Body: `{ "name": "Namit Jain", "email": "namit@example.com", "password": "password123" }`
- **POST /api/auth/login** - Authenticate user and get a token
  - Body: `{ "email": "namit@example.com", "password": "password123" }`

### User Management (Protected Routes)
Requires `Authorization: Bearer <token>` header.

- **POST /api/users** - Create a new user
  - Body: `{ "name": "Namit", "email": "namit@example.com", "role": "user" }`
- **GET /api/users** - Get all users
- **GET /api/users/:id** - Get a single user by ID
- **PUT /api/users/:id** - Update a user
  - Body: `{ "name": "Namit Updated", "email": "namit.updated@example.com", "role": "user" }`
- **DELETE /api/users/:id** - Delete a user (Admin only)

## Testing

To run tests:

```bash
npm test
```

## Code Structure
- `models/` - Mongoose models
- `controllers/` - Route logic
- `routes/` - Express routes
- `middlewares/` - Authentication and validation middleware
- `tests/` - Jest tests
