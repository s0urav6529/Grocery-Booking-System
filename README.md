# Grocery Booking System

A Node.js Express application for managing grocery bookings.

## Features

- RESTful API built with Express.js
- CORS enabled for cross-origin requests
- JSON and URL-encoded request parsing
- Development logging with Morgan
- Health check endpoint
- Environment variable configuration with dotenv

## Project Structure

```
src/
├── app.js                 # Main application setup
├── config/
│   └── init.js            # Configuration initialization 
├── controllers/
│   └── init.js            # Controllers initialization 
├── middlewares/
│   ├── init.js            # Middlewares initialization 
│   └── common/
│       ├── auth.middleware.js      # Authentication middleware 
│       └── validation.middleware.js # Validation middleware 
├── models/
│   └── init.js            # Models initialization 
├── routes/
│   └── init.js            # Routes initialization 
├── services/
│   └── init.js            # Services initialization 
└── utils/
    ├── init.js            # Utils initialization 
    └── auth.utils.js      # Authentication utilities 
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

4. Update `.env` with your local database and JWT settings.

## Running the Application

### Development Mode
```bash
npm run dev
```
This starts the server with nodemon for automatic restarts on file changes.

### Production Mode
```bash
npm start
```
This starts the server with Node.js.

The application will be available at `http://localhost:3000`.

## API Endpoints

- `GET /health` - Health check endpoint

## Technologies Used

- **Express.js** - Web framework for Node.js
- **CORS** - Cross-origin resource sharing
- **Morgan** - HTTP request logger
- **Dotenv** - Environment variable management
- **Nodemon** - Development tool for auto-restarting the server

## License

ISC