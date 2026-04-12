# Grocery Booking System - Docker Setup

A complete grocery booking system with user authentication, item management, pending multi-item order bookings, and inventory control, containerized with Docker for easy deployment and scaling.

## 🚀 Quick Start

### Prerequisites
- Docker Engine 20.10+
- Docker Compose 2.0+

### Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd grocery-booking-system
   ```

2. **Start the application**
   ```bash
   docker-compose up -d
   ```

3. **View logs**
   ```bash
   docker-compose logs -f app
   ```

4. **Access the application**
   - API: http://localhost:3000
   - Health Check: http://localhost:3000/api/health

## 📁 Project Structure

```
├── Dockerfile                 # Application container configuration
├── docker-compose.yml         # Development environment
├── healthcheck.js             # Container health check
├── .dockerignore             # Docker build exclusions
├── .env.docker.example       # Docker environment variables example
├── .env.docker               # Docker environment variables (local, ignored)
└── src/                      # Application source code
```

> Copy `.env.docker.example` to `.env.docker` and update secrets locally. Do not commit `.env.docker`. 

## 🐳 Docker Commands

### Development
```bash
# Start all services
docker-compose up -d

# Start with rebuild
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild and restart
docker-compose down && docker-compose up -d --build
```

### Database Management
```bash
# Access PostgreSQL
docker-compose exec postgres psql -U postgres -d grocery_booking_db

# Backup database
docker-compose exec postgres pg_dump -U postgres grocery_booking_db > backup.sql

# Restore database
docker-compose exec -T postgres psql -U postgres -d grocery_booking_db < backup.sql
```

## 🔧 Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | Application environment |
| `PORT` | Application port |
| `DB_HOST` | Database host |
| `DB_PORT` | Database port |
| `DB_NAME` | Database name |
| `DB_USER` | Database user |
| `DB_PASSWORD` | Database password |
| `JWT_SECRET` | - | JWT signing secret |
| `JWT_EXPIRATION` | JWT token expiration |
| `API_SECURE_KEY` | - | API security key |

### Database

The application uses PostgreSQL with Sequelize ORM. The database schema includes:
- **Actors**: User authentication and authorization
- **Items**: Grocery items with inventory management
- **Orders**: User orders with multiple items in a single booking
- **OrderItems**: Individual item lines within an order
- **InventoryHistory**: Audit trail for inventory changes

## 🏗️ Architecture

### Services
- **app**: Node.js Express application
- **postgres**: PostgreSQL database

### Networking
- **grocery-network**: Isolated Docker network for service communication

### Volumes
- **postgres_data**: Persistent database storage

## 🔍 Monitoring & Health Checks

### Application Health
- Endpoint: `GET /api/health`
- Docker health check every 30 seconds

### Database Health
- PostgreSQL health check using `pg_isready`

## 🚀 Deployment Strategies

### Development
- Hot reload with volume mounting
- Debug port exposed (9229)
- Full logging enabled

### Production Deployment
For production deployment, consider:
- Using environment-specific docker-compose files
- Setting up proper reverse proxy (nginx)
- Configuring SSL certificates
- Implementing monitoring and logging solutions
- Setting up backup strategies for the database

## 🔒 Security

### Container Security
- Non-root user execution
- Minimal base images (Alpine Linux)
- No unnecessary packages

### Application Security
- JWT token authentication
- Input validation with express-validator
- CORS configuration

## 📊 Performance

### Database Optimization
- Connection pooling configured
- Query logging disabled in production
- Indexes on frequently queried columns

### Application Optimization
- Production dependencies only
- Health checks for container orchestration
- Resource limits to prevent resource exhaustion

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Check what's using the port
   lsof -i :3000
   # Change port in docker-compose.yml
   ```

2. **Database connection failed**
   ```bash
   # Check database logs
   docker-compose logs postgres
   # Verify environment variables
   docker-compose exec app env | grep DB_
   ```

3. **Application not responding**
   ```bash
   # Check application logs
   docker-compose logs app
   # Test health endpoint
   curl http://localhost:3000/api/health
   ```

### Logs
```bash
# Application logs
docker-compose logs -f app

# Database logs
docker-compose logs -f postgres

# All logs
docker-compose logs -f
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login

### Item Management Endpoints (Public)
- `GET /api/items` - List items with search/pagination
- `GET /api/items/slug/:slug` - Get item by slug

### Item Management (Admin)
- `POST /api/items` - Create new item
- `GET /api/items/id/:id` - Get item by ID
- `PATCH /api/items/:id` - Update item
- `DELETE /api/items/:id` - Delete item

### Inventory Management (Admin)
- `POST /api/items/:id/inventory/add` - Add stock
- `POST /api/items/:id/inventory/reduce` - Reduce stock
- `PUT /api/items/:id/inventory` - Set stock quantity
- `GET /api/items/:id/inventory/history` - Inventory history

### Order Management (User)
- `POST /api/orders` - Create a pending order with multiple grocery items
- `GET /api/orders` - List orders of a user with pagination
- `GET /api/orders/id/:id` - Get order by ID (user&admin)