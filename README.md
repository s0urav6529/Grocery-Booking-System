# Grocery Booking System

A Node.js Express application for managing grocery bookings, user authentication, inventory, and pending orders.

## Features

- RESTful API built with Express.js
- JWT authentication for users and admin
- Public item browsing and item details by slug
- Admin item management and inventory control
- User order creation with multiple grocery items in one booking
- Input validation with express-validator
- Health check endpoint
- Docker-ready configuration and environment-backed setup

## Project Structure

```
src/
├── app.js                 # Main application setup
├── config/
│   ├── db.config.js       # Database connection and sync
│   └── init.js            # Configuration initialization
├── controllers/
│   ├── auth.controller.js # Authentication controller
│   ├── item.controller.js # Item controller
│   ├── order.controller.js# Order controller
│   └── init.js            # Controllers initialization
├── middlewares/
│   ├── auth.rules.middleware.js  # Auth validation rules
│   ├── item.rules.middleware.js  # Item validation rules
│   ├── order.rules.middleware.js # Order validation rules
│   ├── init.js                  # Middlewares initialization
│   └── common/
│       ├── api.middleware.js        # API security middleware
│       ├── auth.middleware.js       # Authentication middleware
│       └── validation.middleware.js # Request validation middleware
├── models/
│   ├── Actor.js             # User model
│   ├── Item.js              # Grocery item model
│   ├── InventoryHistory.js  # Inventory audit model
│   ├── Order.js             # Order model
│   ├── OrderItem.js         # Order item line model
│   └── init.js              # Models initialization
├── routes/
│   ├── actor.route.js  # Actor details route
│   ├── auth.route.js   # Auth routes
│   ├── item.route.js   # Item routes
│   ├── order.route.js  # Order routes
│   └── init.js         # Routes initialization
├── services/
│   ├── auth.service.js  # Auth service
│   ├── item.service.js  # Item service
│   ├── order.service.js # Order service
│   └── init.js         # Services initialization
└── utils/
    ├── auth.utils.js    # Authentication utilities
    ├── contact.utils.js # Contact utilities
    ├── init.js          # Utils initialization
    └── slug.utils.js    # Slug generation utilities
```

## Prerequisites

- Node.js (version 14 or higher)
- npm

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/s0urav6529/Grocery-Booking-System.git
   cd Grocery-Booking-System
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Copy the example environment file and update values:

   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your local database and JWT settings and others.

   ```bash
   PORT=<your-port>
   NODE_ENV=<your-environment>
   DB_HOST=<your-database-host>
   DB_USER=<your-database-user>
   DB_PASSWORD=<your-database-password>
   DB_PORT=<your-database-port>
   DB_NAME=<your-database-name>
   JWT_SECRET=<jwt-secret>
   JWT_EXPIRATION=<expiration-time>
   API_SECURE_KEY=<api-secure-key>
   ```

````

## Running the Application

### Development Mode

```bash
npm run dev
````

This starts the server with nodemon for automatic restarts on file changes.

### Production Mode

```bash
npm start
```

This starts the server with Node.js.

The application will be available at `http://localhost:3000`.

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login and receive a JWT token

### Item Catalog (Public)

- `GET /api/items` - List items with optional search and pagination
- `GET /api/items/slug/:slug` - Retrieve item details by slug

### Item Management (Admin)

- `POST /api/items` - Create a new item
- `GET /api/items/id/:id` - Get item details by ID
- `PATCH /api/items/:id` - Update item details
- `DELETE /api/items/:id` - Delete an item

### Inventory Management (Admin)

- `POST /api/items/:id/inventory/add` - Add stock to an item
- `POST /api/items/:id/inventory/reduce` - Reduce stock for an item
- `PUT /api/items/:id/inventory` - Set item stock quantity
- `GET /api/items/:id/inventory/history` - View inventory history for an item

### Order Management (User)

- `POST /api/orders` - Create a pending order with multiple items
- `GET /api/orders` - List orders for the authenticated user
- `GET /api/orders/id/:id` - Retrieve a single order by ID

## Technologies Used

- **Express.js** - Web framework for Node.js
- **CORS** - Cross-origin resource sharing
- **Morgan** - HTTP request logger
- **Dotenv** - Environment variable management
- **Nodemon** - Development tool for auto-restarting the server

## License

ISC
