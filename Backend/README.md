# OrionX Backend

The REST API server for the OrionX e-commerce platform. Built with Node.js, Express, MongoDB (primary database), and PostgreSQL (vector database for the AI agent).

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js (ESM) |
| Framework | Express 5 |
| Primary DB | MongoDB via Mongoose |
| Vector DB | PostgreSQL + pgvector |
| AI / LLM | Google Gemini (via LangChain) |
| Auth | JWT (jsonwebtoken) |
| File Uploads | Cloudinary + Multer |
| Environment | dotenv |

---

## Project Structure

```
backend/
├── src/
│   ├── agent/             # AI chat agent (see agent/README.md)
│   ├── config/
│   │   └── db.js          # MongoDB connection
│   ├── middleware/
│   │   └── authMiddleware.js  # JWT protect + adminOnly guards
│   ├── models/
│   │   ├── User.js        # User schema (cart, wishlist, orders)
│   │   ├── Product.js     # Product schema
│   │   └── Order.js       # Order schema
│   ├── routes/
│   │   ├── UserRoutes.js      # /api/users
│   │   ├── productRoutes.js   # /api/products
│   │   ├── orderRoutes.js     # /api/orders
│   │   ├── uploadRoutes.js    # /api/uploads
│   │   ├── infoRoutes.js      # /api/info
│   │   └── chatbotRoutes.js   # /api/chatbot (legacy)
│   └── server.js          # Express app entry point
├── .env                   # Environment variables (not committed)
├── package.json
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- PostgreSQL with pgvector extension
- Google Gemini API key
- Cloudinary account

### Installation

```bash
cd backend
npm install
```

### Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Server
PORT=5050

# MongoDB
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/<dbname>

# JWT
JWT_SECRET=your_jwt_secret_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Gemini AI
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash

# PostgreSQL (Vector DB)
PG_HOST=localhost
PG_PORT=5432
PG_USER=your_pg_user
PG_PASSWORD=your_pg_password
PG_DATABASE=rag_db
```

### Run

```bash
# Development (with hot reload)
npm run dev

# Production
npm start
```

Server starts at `http://localhost:5050`

---

## API Endpoints

### Users — `/api/users`
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/register` | Public | Register new user |
| POST | `/login` | Public | Login and receive JWT |
| GET | `/profile` | User | Get current user profile |
| PUT | `/profile` | User | Update profile |

### Products — `/api/products`
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/` | Public | List all products |
| GET | `/:id` | Public | Get single product |
| POST | `/` | Admin | Create product |
| PUT | `/:id` | Admin | Update product |
| DELETE | `/:id` | Admin | Delete product |

### Orders — `/api/orders`
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/` | User | Place a new order |
| GET | `/myorders` | User | Get current user's orders |
| GET | `/` | Admin | Get all orders |
| PUT | `/:id` | Admin | Update order status |

### Uploads — `/api/uploads`
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/` | Admin | Upload image to Cloudinary |

### AI Agent — `/api/agent`
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/chat` | User | SSE streaming chat endpoint |
| POST | `/sync/products` | Admin | Sync products to vector DB |
| POST | `/sync/documents` | Admin | Sync documents to vector DB |

> See [`src/agent/README.md`](src/agent/README.md) for full AI agent documentation.

---

## Authentication

All protected routes use JWT Bearer token authentication:

```http
Authorization: Bearer <token>
```

The JWT payload contains:
```json
{
  "id": "userId",
  "iat": 1234567890,
  "exp": 1234567890
}
```

Two guard levels:
- **`protect`** — any authenticated user
- **`adminOnly`** — requires `user.isAdmin === true`

---

## Health Check

```http
GET /api/health
```

```json
{
  "status": "ok",
  "timestamp": "2026-03-28T10:00:00.000Z",
  "uptime": 3600,
  "database": "connected"
}
```
