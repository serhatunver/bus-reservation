# Bus Reservation System

A full-stack bus reservation system built with Node.js/Express backend and Nuxt.js frontend applications. The system implements advanced seat availability algorithms, dynamic pricing based on seat priority, and comprehensive reservation management.

## Screenshots

<img width="1869" alt="home" src="https://github.com/user-attachments/assets/3cd8679d-8991-406a-b6cc-393df3037d42" />
<img width="1869" alt="search_desktop" src="https://github.com/user-attachments/assets/18783c53-d0b5-48c9-b33a-446ba796a30f" />
<img width="1869" alt="trip" src="https://github.com/user-attachments/assets/93334c74-feb5-4d9f-9b94-28aff301ca6c" />
<img width="1869" alt="track_desktop" src="https://github.com/user-attachments/assets/03d81425-c45b-482e-9d6a-e58dcff6b42c" />

| ![home_mobile_dark](https://github.com/user-attachments/assets/c0d44f1a-40e4-43fe-9865-1ef9ed9c3d0b) | ![search_mobile](https://github.com/user-attachments/assets/f87faa50-625b-4b5e-8c37-d77da1170989) |
|---|---|

| ![seat_priority_2](https://github.com/user-attachments/assets/ce2c7421-cebe-4925-9573-2e774c11b5e6) | ![select_trip](https://github.com/user-attachments/assets/3b0891a8-55fd-49d5-9825-c76418f9f593) |
|---|---|

<img width="1869" alt="admin_reservations" src="https://github.com/user-attachments/assets/6a890210-8b29-4e7e-8f11-e665be691123" />

## Architecture

The system follows a three-tier architecture:

- **Backend API**: RESTful API built with Express.js, MongoDB, and Mongoose ODM
- **Client Application**: Customer-facing SPA built with Nuxt.js 3
- **Admin Panel**: Administrative interface built with Nuxt.js 3

### Project Structure

```
bus-reservation/
├── api/                      # Backend API
│   ├── controllers/          # Request handlers and business logic
│   ├── models/               # Mongoose schemas and models
│   ├── routes/               # Express route definitions
│   ├── middleware/           # Authentication and authorization middleware
│   ├── services/             # Business logic services (seat availability, etc.)
│   ├── helpers/              # Utility functions (price calculation, range building)
│   ├── __tests__/            # Jest test suites
│   ├── app.js                # Express application entry point
│   └── seed.js               # Database seeding script
├── client/                   # Customer frontend application
│   ├── components/           # Vue components
│   │   ├── ui/               # shadcn-nuxt UI component library
│   │   ├── TripView/        # Trip selection and seat booking components
│   │   └── SearchForm/       # Search functionality components
│   ├── pages/                # Nuxt page components
│   ├── stores/               # Pinia stores for state management
│   ├── layouts/              # Layout components
│   └── nuxt.config.ts        # Nuxt configuration
└── admin/                    # Admin panel application
    ├── components/           # Vue components
    │   ├── ui/               # shadcn-nuxt UI component library
    │   ├── bus/              # Bus management components
    │   ├── trip/             # Trip management components
    │   ├── reservation/      # Reservation management components
    │   └── user/             # User management components
    ├── pages/                # Nuxt page components
    ├── stores/               # Pinia stores for state management
    └── nuxt.config.ts        # Nuxt configuration
```

## Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js 5.x
- **Database**: MongoDB with Mongoose 8.x
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt 6.x
- **Testing**: Jest with ES Modules support
- **Utilities**: nanoid (PNR generation), fuzzysort (search)

### Frontend (Client & Admin)
- **Framework**: Nuxt.js 3.x
- **Language**: TypeScript 5.x
- **UI Library**: Vue 3.x with Composition API
- **State Management**: Pinia 3.x
- **Styling**: Tailwind CSS 4.x
- **Component Library**: shadcn-nuxt (Reka UI components)
- **Form Validation**: Vee-Validate with Zod schemas
- **Date Handling**: @internationalized/date
- **Table Management**: @tanstack/vue-table
- **Authentication**: @sidebase/nuxt-auth

## Core Features

### Seat Availability Algorithm

The system implements a sophisticated seat availability algorithm that handles overlapping reservations across route segments:

1. **Route Segment Mapping**: Each trip route is mapped to a sequential array of stop indices
2. **Reservation Conflict Detection**: For each seat, existing reservations are checked for conflicts with the requested route segment
3. **Free Range Calculation**: Available segments are calculated using a range-building algorithm that identifies gaps between reservations
4. **Priority Assignment**: Seats are assigned priority based on the minimum extra space available beyond the requested segment
5. **Dynamic Pricing**: Price is calculated using a multiplier based on seat priority and route segment pricing

**Algorithm Complexity**: O(n * m) where n is the number of seats and m is the average number of reservations per seat.

### Dynamic Pricing System

Pricing is calculated using a multi-factor approach:

- **Base Price**: Sum of prices for all route segments between origin and destination
- **Priority Multiplier**: `1 + (priority - 1) / (maxPriority - 1)` where priority ranges from 1 to maxPriority
- **Final Price**: `ceil(basePrice * priorityMultiplier)`

This ensures that seats with less availability (higher priority) are priced higher, creating a dynamic pricing model that adapts to demand.

### Reservation System

- **PNR Generation**: 8-digit numeric PNR codes generated using nanoid
- **Conflict Prevention**: Seat conflicts are prevented at the database level
- **Status Management**: Reservations support three states: `booked`, `cancelled`, `completed`
- **Guest Reservations**: Supports both authenticated user reservations and guest reservations with passenger details

### Authentication & Authorization

- **JWT-based Authentication**: Bearer token authentication with configurable expiration
- **Role-based Access Control**: Two roles - `admin` and `user`
- **Optional Authentication**: Some endpoints support optional authentication for guest users
- **Password Security**: bcrypt hashing with salt rounds

## API Specification

### Base URL
```
http://localhost:3000/api
```

### API Endpoints Overview

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/session` - Get session information

#### Trips
- `GET /api/trip` - List all trips
- `GET /api/trip/search` - Search trips by origin, destination, and date
- `GET /api/trip/:id` - Get trip details
- `GET /api/trip/:tripId/seats` - Get available seats for a trip
- `POST /api/trip` - Create new trip (Admin)
- `PUT /api/trip/:id` - Update trip (Admin)
- `DELETE /api/trip/:id` - Delete trip (Admin)

#### Reservations
- `GET /api/reservation` - List reservations
- `GET /api/reservation/:id` - Get reservation details
- `GET /api/reservation/pnr/:pnr` - Get reservation by PNR code
- `POST /api/reservation` - Create new reservation
- `PUT /api/reservation/:id` - Update reservation
- `DELETE /api/reservation/:id` - Delete reservation

#### Buses
- `GET /api/bus` - List all buses
- `GET /api/bus/:id` - Get bus details
- `POST /api/bus` - Create new bus (Admin)
- `PUT /api/bus/:id` - Update bus (Admin)
- `DELETE /api/bus/:id` - Delete bus (Admin)

#### Stops
- `GET /api/stop` - List all stops
- `GET /api/stop/:id` - Get stop details
- `POST /api/stop` - Create new stop (Admin)
- `PUT /api/stop/:id` - Update stop (Admin)
- `DELETE /api/stop/:id` - Delete stop (Admin)

#### Users
- `GET /api/user` - List users (Admin)
- `GET /api/user/:id` - Get user details
- `PUT /api/user/:id` - Update user
- `DELETE /api/user/:id` - Delete user (Admin)

### Detailed Endpoint Documentation

### Authentication Endpoints

#### POST /api/auth/register
Register a new user account.

**Request Body**:
```json
{
  "name": "string",
  "surname": "string",
  "email": "string",
  "password": "string",
  "phone": "string"
}
```

**Response**: User object with JWT token

#### POST /api/auth/login
Authenticate user and receive JWT token.

**Request Body**:
```json
{
  "email": "string",
  "password": "string"
}
```

**Response**: User object with JWT token

#### GET /api/auth/session
Get current session information.

**Headers**: `Authorization: Bearer <token>`

**Response**: User object

### Trip Endpoints

#### GET /api/trip/search
Search for trips based on origin, destination, and date.

**Query Parameters**:
- `fromStopId`: MongoDB ObjectId of origin stop
- `toStopId`: MongoDB ObjectId of destination stop
- `outboundDate`: ISO date string (YYYY-MM-DD)

**Response**:
```json
{
  "trips": [
    {
      "_id": "ObjectId",
      "name": "string",
      "route": [...],
      "departureTime": "ISO date",
      "arrivalTime": "ISO date",
      "bus": {...},
      "price": "number",
      "duration": "number"
    }
  ],
  "fromStop": {...},
  "toStop": {...}
}
```

#### GET /api/trip/:tripId/seats
Get available seats for a trip between specified stops.

**Query Parameters**:
- `fromStopId`: MongoDB ObjectId
- `toStopId`: MongoDB ObjectId

**Response**:
```json
{
  "seats": [
    {
      "seatNumber": "number",
      "priority": "number",
      "price": "number"
    }
  ]
}
```

#### GET /api/trip/:tripId
Get detailed trip information.

**Query Parameters**:
- `fromStopId`: MongoDB ObjectId
- `toStopId`: MongoDB ObjectId

**Response**: Enriched trip object with pricing and availability information

### Reservation Endpoints

#### POST /api/reservation
Create a new reservation.

**Request Body**:
```json
{
  "tripId": "ObjectId",
  "fromStopId": "ObjectId",
  "toStopId": "ObjectId",
  "seatNumber": "number",
  "price": "number",
  "passengerName": "string",
  "passengerSurname": "string",
  "email": "string",
  "phone": "string"
}
```

**Headers**: `Authorization: Bearer <token>` (optional)

**Response**: Reservation object with generated PNR

#### GET /api/reservation/pnr/:pnr
Retrieve reservation by PNR code.

**Response**: Reservation object with populated trip and stop information

#### GET /api/reservation
List reservations (filtered by authenticated user if not admin).

**Headers**: `Authorization: Bearer <token>`

**Response**: Array of reservation objects

### Bus Management Endpoints (Admin Only)

#### POST /api/bus
Create a new bus.

**Request Body**:
```json
{
  "capacity": "number",
  "model": "string",
  "modelYear": "number",
  "plateNumber": "string",
  "seats": [
    {
      "seatNumber": "number",
      "row": "number",
      "column": "number"
    }
  ]
}
```

#### PUT /api/bus/:id
Update bus information.

#### DELETE /api/bus/:id
Delete a bus (soft delete via isActive flag).

### Stop Management Endpoints (Admin Only)

#### POST /api/stop
Create a new stop.

**Request Body**:
```json
{
  "name": "string"
}
```

### Trip Management Endpoints (Admin Only)

#### POST /api/trip
Create a new trip.

**Request Body**:
```json
{
  "name": "string",
  "route": [
    {
      "from": "ObjectId",
      "to": "ObjectId",
      "price": "number",
      "duration": "number"
    }
  ],
  "departureTime": "ISO date",
  "arrivalTime": "ISO date",
  "bus": "ObjectId"
}
```

## Database Schema

### User Model
```javascript
{
  _id: ObjectId,
  name: String (required),
  surname: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  phone: String (required),
  role: String (enum: ['admin', 'user'], default: 'user'),
  reservations: [ObjectId] (ref: 'Reservation'),
  createdAt: Date,
  updatedAt: Date
}
```

### Bus Model
```javascript
{
  _id: ObjectId,
  capacity: Number (required),
  model: String (required),
  modelYear: Number (required),
  plateNumber: String (required, unique),
  isActive: Boolean (default: true),
  seats: [{
    seatNumber: Number (required),
    row: Number (required),
    column: Number (required)
  }],
  trips: [ObjectId] (ref: 'Trip'),
  createdAt: Date,
  updatedAt: Date
}
```

### Trip Model
```javascript
{
  _id: ObjectId,
  name: String,
  route: [{
    from: ObjectId (ref: 'Stop'),
    to: ObjectId (ref: 'Stop'),
    price: Number,
    duration: Number
  }],
  departureTime: Date,
  arrivalTime: Date,
  bus: ObjectId (ref: 'Bus', required),
  createdAt: Date,
  updatedAt: Date
}
```

### Reservation Model
```javascript
{
  _id: ObjectId,
  trip: ObjectId (ref: 'Trip'),
  pnr: String (8-digit, auto-generated),
  seatNumber: Number,
  fromStop: ObjectId (ref: 'Stop'),
  toStop: ObjectId (ref: 'Stop'),
  passengerName: String,
  passengerSurname: String,
  email: String,
  phone: String,
  price: Number,
  status: String (enum: ['booked', 'cancelled', 'completed'], default: 'booked'),
  passenger: ObjectId (ref: 'User', optional),
  createdAt: Date,
  updatedAt: Date
}
```

### Stop Model
```javascript
{
  _id: ObjectId,
  name: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Installation & Setup

### Prerequisites

- Node.js v18 or higher
- pnpm v8 or higher
- MongoDB v5 or higher (running locally or accessible instance)

### Environment Variables

Create a `.env` file in the `api/` directory:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/bus-reservation
JWT_SECRET=your-secret-key-here
```

### Installation Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd bus-reservation
```

2. **Install backend dependencies**
```bash
cd api
pnpm install
```

3. **Seed the database**
```bash
node seed.js
```

This will populate the database with Turkish cities as stops and sample data.

4. **Start the backend server**
```bash
pnpm dev
```

The API will be available at `http://localhost:3000`

5. **Install and start the client application**
```bash
cd ../client
pnpm install
pnpm dev
```

The client application will be available at `http://localhost:5176`

6. **Install and start the admin panel**
```bash
cd ../admin
pnpm install
pnpm dev
```

The admin panel will be available at `http://localhost:5175`

## Testing

Run backend tests with Jest:

```bash
cd api
pnpm test
```

Generate coverage report:

```bash
pnpm test -- --coverage
```

Coverage reports are generated in the `coverage/` directory.

## License

MIT

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

**Note**: This project is developed for educational purposes.
