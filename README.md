# OrionX E-Commerce Platform

A full-stack e-commerce platform with an AI-powered shopping assistant. OrionX lets customers browse products, manage their cart and wishlist, place orders — and chat with an intelligent agent that can search the catalog, answer policy questions, and manage their shopping session conversationally.

---

## Project Structure

```
orionx-ecommerce/
├── backend/     # Node.js + Express REST API + AI Agent
├── frontend/    # React + TypeScript web application
└── postman/     # API collection for testing
```

---

## Core Features

### 🛍️ E-Commerce
- Product catalog with categories, brands, filtering, and search
- Product detail pages with images, specs, and ratings
- Shopping cart and wishlist management
- Order placement and order history
- Side-by-side product comparison
- Quotation requests
- Cloudinary-powered image uploads

### 👤 User Management
- JWT-based authentication (register / login)
- User profile management
- Admin dashboard for product and order management

### 🤖 AI Chat Agent
An agentic shopping assistant powered by Google Gemini and LangChain with:
- **Semantic product search** — vector similarity search via pgvector
- **Document retrieval (RAG)** — answers policy, shipping, and FAQ questions
- **Cart & wishlist tools** — add, remove, and view items conversationally
- **Short-term memory** — remembers the last 4 exchanges, summarizes older ones
- **Streaming responses** — word-by-word SSE streaming for smooth UX
- **Iterative tool use** — multi-round, multi-tool agent loop (up to 5 rounds)

---

## Tech Stack

| | Backend | Frontend |
|---|---|---|
| Language | JavaScript (ESM) | TypeScript |
| Framework | Express 5 | React 18 |
| Primary DB | MongoDB (Mongoose) | — |
| Vector DB | PostgreSQL + pgvector | — |
| AI | Google Gemini + LangChain | — |
| Styling | — | Tailwind CSS |
| Routing | — | React Router v6 |
| Build | Node.js | Vite |

---

## Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/your-org/orionx-ecommerce.git
cd orionx-ecommerce
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Create `backend/.env`:
```env
PORT=5050
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/<dbname>
JWT_SECRET=your_jwt_secret

GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash

PG_HOST=localhost
PG_PORT=5432
PG_USER=your_pg_user
PG_PASSWORD=your_pg_password
PG_DATABASE=rag_db

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

```bash
npm run dev
```

### 3. Set up the frontend

```bash
cd frontend
npm install
npm run dev
```

### 4. Sync data to the vector database

Once the backend is running, trigger the sync endpoints using an admin JWT:

```bash
# Sync products
curl -X POST http://localhost:5050/api/agent/sync/products \
  -H "Authorization: Bearer <admin_token>"

# Sync documents (policies, FAQs)
curl -X POST http://localhost:5050/api/agent/sync/documents \
  -H "Authorization: Bearer <admin_token>"
```

---

## Documentation

| Module | README |
|---|---|
| Backend API | [`backend/README.md`](backend/README.md) |
| AI Chat Agent | [`backend/src/agent/README.md`](backend/src/agent/README.md) |
| Frontend App | [`frontend/README.md`](frontend/README.md) |

---

## Application URLs

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:5050 |
| Health Check | http://localhost:5050/api/health |

---

## Roadmap

- [ ] Order management tools for the AI agent
- [ ] Long-term memory with user preference learning
- [ ] Prompt optimization with few-shot examples
- [ ] Product review and ratings system
- [ ] Real-time inventory updates
