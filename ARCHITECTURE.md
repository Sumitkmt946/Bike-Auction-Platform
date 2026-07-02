# Bike Auction Platform — Architecture & Design Document

## 1. System Overview

The Bike Auction Platform is a full-stack web application for conducting live auctions on used motorcycles. It supports real-time bidding via WebSockets, JWT-based authentication, and role-based access control for users and administrators.

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                         │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  React 18 + Vite + Tailwind CSS                           │  │
│  │  ┌──────────┐  ┌──────────┐  ┌───────────┐               │  │
│  │  │  Pages   │  │Components│  │  Context   │               │  │
│  │  │ (Routes) │  │  (UI)    │  │(Auth,Socket│               │  │
│  │  └────┬─────┘  └────┬─────┘  └─────┬─────┘               │  │
│  │       │              │              │                      │  │
│  │       └──────────────┼──────────────┘                      │  │
│  │                      │                                     │  │
│  │              ┌───────┴───────┐                             │  │
│  │              │  Axios + S.IO │                             │  │
│  │              │   Client      │                             │  │
│  │              └───────┬───────┘                             │  │
│  └──────────────────────┼────────────────────────────────────┘  │
└─────────────────────────┼───────────────────────────────────────┘
                          │
           HTTP REST + WebSocket (Socket.IO)
                          │
┌─────────────────────────┼───────────────────────────────────────┐
│                     SERVER (Node.js)                             │
│  ┌──────────────────────┴────────────────────────────────────┐  │
│  │              Express.js + Socket.IO                        │  │
│  │                                                            │  │
│  │  ┌──────────┐  ┌────────────┐  ┌──────────────────────┐   │  │
│  │  │  Routes  │──│Controllers │──│  Middleware           │   │  │
│  │  │          │  │            │  │  (Auth, Admin, Error) │   │  │
│  │  └──────────┘  └─────┬──────┘  └──────────────────────┘   │  │
│  │                      │                                     │  │
│  │              ┌───────┴───────┐                             │  │
│  │              │   Mongoose    │                             │  │
│  │              │   Models      │                             │  │
│  │              └───────┬───────┘                             │  │
│  └──────────────────────┼────────────────────────────────────┘  │
└─────────────────────────┼───────────────────────────────────────┘
                          │
                  ┌───────┴───────┐
                  │   MongoDB     │
                  │   Database    │
                  └───────────────┘
```

## 2. Architecture Pattern

### MVC (Model-View-Controller)

| Layer | Responsibility | Implementation |
|-------|---------------|----------------|
| **Model** | Data schema, validation, business logic | Mongoose schemas in `server/models/` |
| **View** | User interface rendering | React components in `client/src/` |
| **Controller** | Request handling, business logic orchestration | Express handlers in `server/controllers/` |

### Additional Layers

- **Routes**: URL-to-controller mapping (`server/routes/`)
- **Middleware**: Cross-cutting concerns — auth, validation, error handling (`server/middleware/`)
- **Socket Handler**: Real-time event management (`server/socket/`)
- **Utilities**: Shared helpers — logging, scheduling (`server/utils/`)

## 3. Database Design

### Entity Relationship Diagram

```
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│    Users     │       │    Bikes     │       │   Auctions   │
├──────────────┤       ├──────────────┤       ├──────────────┤
│ _id          │◄──┐   │ _id          │◄──┐   │ _id          │
│ name         │   │   │ name         │   │   │ bike ────────┼──► Bikes._id
│ email        │   │   │ brand        │   │   │ startTime    │
│ password     │   │   │ model        │   └───┤ createdBy    │
│ role         │   │   │ year         │       │ status       │
│ createdAt    │   │   │ description  │   ┌───┤ highestBidder│
└──────────────┘   │   │ startingPrice│   │   │ winner ──────┼──► Users._id
                   │   │ images[]     │   │   │ highestBid   │
                   ├───┤ createdBy    │   │   │ totalBids    │
                   │   │ createdAt    │   │   │ startTime    │
                   │   └──────────────┘   │   │ endTime      │
                   │                      │   │ createdAt    │
                   │   ┌──────────────┐   │   └──────────────┘
                   │   │    Bids      │   │
                   │   ├──────────────┤   │
                   │   │ _id          │   │
                   │   │ auction ─────┼───┼──► Auctions._id
                   └───┤ bidder       │   │
                       │ amount       │   │
                       │ createdAt    │   │
                       └──────────────┘
```

### Collections

#### Users
| Field | Type | Constraints |
|-------|------|-------------|
| name | String | Required, trimmed |
| email | String | Required, unique, lowercase |
| password | String | Required, min 6 chars, hashed (bcrypt) |
| role | String | Enum: 'user', 'admin'. Default: 'user' |
| createdAt | Date | Auto-generated |

#### Bikes
| Field | Type | Constraints |
|-------|------|-------------|
| name | String | Required |
| brand | String | Required |
| model | String | Required |
| year | Number | Required |
| description | String | Required |
| startingPrice | Number | Required, min 0 |
| images | [String] | Array of URL strings |
| createdBy | ObjectId | Ref: User |

#### Auctions
| Field | Type | Constraints |
|-------|------|-------------|
| bike | ObjectId | Ref: Bike, Required |
| startTime | Date | Required |
| endTime | Date | Required, must be > startTime |
| status | String | Enum: 'upcoming', 'active', 'ended'. Default: 'upcoming' |
| highestBid | Number | Default: 0 |
| highestBidder | ObjectId | Ref: User |
| winner | ObjectId | Ref: User |
| totalBids | Number | Default: 0 |
| createdBy | ObjectId | Ref: User |

#### Bids
| Field | Type | Constraints |
|-------|------|-------------|
| auction | ObjectId | Ref: Auction, Indexed |
| bidder | ObjectId | Ref: User |
| amount | Number | Required, min 0 |
| createdAt | Date | Auto-generated |

**Index**: `{ auction: 1, createdAt: -1 }` for efficient bid history queries.

## 4. Authentication & Authorization

### JWT Flow

```
┌────────┐                    ┌────────┐                    ┌────────┐
│ Client │                    │ Server │                    │   DB   │
└───┬────┘                    └───┬────┘                    └───┬────┘
    │  POST /api/auth/login       │                            │
    │  { email, password }        │                            │
    ├────────────────────────────►│                            │
    │                             │  Find user by email        │
    │                             ├───────────────────────────►│
    │                             │◄───────────────────────────┤
    │                             │  bcrypt.compare(password)  │
    │                             │  jwt.sign({ id, role })    │
    │  { token, user }            │                            │
    │◄────────────────────────────┤                            │
    │                             │                            │
    │  GET /api/auctions          │                            │
    │  Authorization: Bearer <t>  │                            │
    ├────────────────────────────►│                            │
    │                             │  jwt.verify(token)         │
    │                             │  Find user by decoded.id   │
    │                             ├───────────────────────────►│
    │                             │◄───────────────────────────┤
    │                             │  req.user = user           │
    │  { auctions }               │  Proceed to controller     │
    │◄────────────────────────────┤                            │
```

### Role-Based Access

| Role | Capabilities |
|------|-------------|
| **User** | View auctions, place bids, view dashboard |
| **Admin** | All user capabilities + CRUD bikes, CRUD auctions, start/end auctions |

### Middleware Chain

```
Request → protect (JWT verify) → adminOnly (role check) → validate (input) → Controller
```

## 5. Real-Time Architecture (Socket.IO)

### Connection Flow

```
1. Client authenticates via REST API, receives JWT
2. Client connects to Socket.IO with token in handshake
3. Server verifies token on connection
4. Client joins auction-specific rooms
5. Server broadcasts bid updates and auction events to rooms
```

### Event Flow — Placing a Bid

```
┌────────┐         ┌────────┐         ┌────────┐         ┌────────────┐
│Client A│         │ Server │         │Client B│         │  Client C  │
│(Bidder)│         │        │         │(Viewer)│         │  (Viewer)  │
└───┬────┘         └───┬────┘         └───┬────┘         └─────┬──────┘
    │ POST /bids       │                  │                    │
    │ { amount: 5000 } │                  │                    │
    ├─────────────────►│                  │                    │
    │                  │ Validate bid     │                    │
    │                  │ Save to DB       │                    │
    │                  │ Update auction   │                    │
    │  { bid }         │                  │                    │
    │◄─────────────────┤                  │                    │
    │                  │                  │                    │
    │                  │ io.to(room).emit('newBid', data)      │
    │  newBid          │  newBid          │  newBid            │
    │◄─────────────────┼─────────────────►│───────────────────►│
    │                  │                  │                    │
    │ UI updates       │                  │ UI updates         │ UI updates
    │ instantly        │                  │ instantly          │ instantly
```

### Auction Auto-End Flow

```
Server Start
    │
    ├── Load active/upcoming auctions from DB
    │
    ├── For each auction:
    │   ├── If endTime is in the future → setTimeout(endAuction, remaining ms)
    │   └── If endTime has passed → Mark as ended immediately
    │
    └── When timer fires:
        ├── Update auction: status='ended', winner=highestBidder
        ├── Save to DB
        └── io.to(room).emit('auctionEnded', { auction })
```

## 6. API Design

### Response Format

All API responses follow a consistent structure:

**Success:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error description",
  "errors": [ ... ]
}
```

### Error Handling Strategy

| Error Type | HTTP Status | Example |
|------------|-------------|---------|
| Validation Error | 400 | Invalid email format |
| Authentication Error | 401 | Missing/invalid token |
| Authorization Error | 403 | Non-admin accessing admin route |
| Not Found | 404 | Auction not found |
| Business Logic Error | 400 | Bid lower than current highest |
| Server Error | 500 | Database connection failure |

## 7. Frontend Architecture

### State Management

```
AuthContext (Global)
├── user (object | null)
├── token (string | null)
├── loading (boolean)
├── login()
├── register()
└── logout()

SocketContext (Global)
├── socket (Socket.IO instance | null)
├── connected (boolean)
└── Auto-connect when authenticated
```

### Routing Structure

```
/ ........................ Home (public)
/login ................... Login (public)
/register ................ Register (public)
/auctions ................ Auction List (protected)
/auctions/:id ............ Auction Detail (protected)
/dashboard ............... User Dashboard (protected)
/admin ................... Admin Dashboard (admin only)
/admin/bikes ............. Manage Bikes (admin only)
/admin/bikes/create ...... Create Bike (admin only)
/admin/bikes/:id/edit .... Edit Bike (admin only)
/admin/auctions .......... Manage Auctions (admin only)
/admin/auctions/create ... Create Auction (admin only)
/admin/auctions/:id/edit . Edit Auction (admin only)
```

### Component Hierarchy

```
App
├── AuthProvider
│   └── SocketProvider
│       └── BrowserRouter
│           └── Layout
│               ├── Navbar
│               ├── Routes
│               │   ├── Home
│               │   ├── Login / Register
│               │   ├── ProtectedRoute
│               │   │   ├── AuctionList
│               │   │   ├── AuctionDetail
│               │   │   │   ├── AuctionTimer
│               │   │   │   ├── BidPanel
│               │   │   │   └── BidHistory
│               │   │   └── Dashboard
│               │   └── AdminRoute
│               │       ├── AdminDashboard
│               │       ├── ManageBikes
│               │       ├── ManageAuctions
│               │       ├── CreateBike / EditBike
│               │       └── CreateAuction / EditAuction
│               └── Footer
```

## 8. Security Measures

| Measure | Implementation |
|---------|---------------|
| Password Hashing | bcrypt with 12 salt rounds |
| JWT Tokens | Signed with secret, 7-day expiry |
| Input Validation | express-validator on all endpoints |
| HTTP Security Headers | Helmet middleware |
| CORS | Configured for frontend origin |
| MongoDB Injection | Mongoose schema validation |
| XSS Prevention | React's built-in escaping + Helmet |
| Route Protection | JWT middleware on all protected routes |
| Role-Based Access | Admin middleware for admin-only routes |

## 9. Technology Justifications

| Technology | Why Chosen |
|------------|------------|
| **React + Vite** | Fast development, excellent DX, component-based architecture |
| **Tailwind CSS** | Rapid UI development, consistent design system, small bundle |
| **Express.js** | Lightweight, flexible, extensive middleware ecosystem |
| **MongoDB/Mongoose** | Flexible schema for auction data, good for real-time apps |
| **Socket.IO** | Reliable WebSocket abstraction with fallbacks, room support |
| **JWT** | Stateless authentication, scalable, works with Socket.IO |
| **bcrypt** | Industry-standard password hashing |
| **Winston + Morgan** | Production-grade logging with file and console outputs |

## 10. Scalability Considerations

### Current Design (Single Server)
- In-memory setTimeout for auction scheduling
- Single MongoDB instance
- Socket.IO with in-memory adapter

### Future Scaling Path
- **Multiple servers**: Use Redis adapter for Socket.IO, Bull/BullMQ for job scheduling
- **Database**: MongoDB replica set for high availability
- **Caching**: Redis for session/auction data caching
- **CDN**: Serve static assets and images via CDN
- **Load balancing**: Nginx/HAProxy with sticky sessions for WebSocket
