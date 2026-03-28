# OrionX AI Chat Agent

A production-grade AI shopping assistant built on LangChain and Google Gemini, powering the OrionX e-commerce platform with semantic product search, document retrieval, cart & wishlist management, and short-term conversation memory.

---

## Architecture Overview

```
src/agent/
├── config/
│   ├── models.js          # Dynamic Gemini model selection (faster / smarter)
│   └── pgClient.js        # PostgreSQL connection pool (raw pg)
├── db/
│   ├── initProductsTable.js   # Creates products table with pgvector
│   └── initDocumentsTable.js  # Creates documents table with pgvector
├── embeddings/
│   └── embeddingModel.js  # Gemini embedding-001 (768-dim vectors)
├── memory/
│   └── memoryStore.js     # In-memory conversation buffer with summarization
├── routes/
│   ├── chatRoutes.js      # POST /api/agent/chat  (SSE streaming)
│   └── syncRoutes.js      # POST /api/agent/sync/products|documents  (admin)
├── services/
│   ├── chatAgent.js       # Core agent loop with tool calling & streaming
│   ├── syncProducts.js    # MongoDB → PostgreSQL product sync
│   └── syncDocuments.js   # MongoDB → PostgreSQL document sync
└── tools/
    ├── searchProducts.js  # search_products + get_product_by_id tools
    ├── searchDocuments.js # get_document_contents tool
    ├── cartTools.js       # get_cart / add_to_cart / remove_from_cart
    └── wishlistTools.js   # get_wishlist / add_to_wishlist / remove_from_wishlist
```

---

## Setup

### 1. PostgreSQL & pgvector

The agent uses PostgreSQL as a vector database via the `pgvector` extension.

**Install pgvector** (if not already installed):
```bash
# macOS
brew install pgvector

# Ubuntu / Debian
sudo apt install postgresql-15-pgvector
```

**Create the database:**
```sql
CREATE DATABASE rag_db;
```

**Enable the extension** (the agent does this automatically on first sync, but you can also run it manually):
```sql
\c rag_db
CREATE EXTENSION IF NOT EXISTS vector;
```

### 2. Environment Variables

Add the following to your `.env` file in the `backend/` directory:

```env
# PostgreSQL (Vector DB)
PG_HOST=localhost
PG_PORT=5432
PG_USER=your_pg_user
PG_PASSWORD=your_pg_password
PG_DATABASE=rag_db

# Google Gemini
GEMINI_API_KEY=your_gemini_api_key
```

### 3. Install Dependencies

```bash
cd backend
npm install
```

### 4. Sync Data from MongoDB to PostgreSQL

The sync endpoints are **admin-protected**. Call them with a valid admin JWT token.

**Sync products:**
```http
POST /api/agent/sync/products
Authorization: Bearer <admin_token>
```

**Sync documents (policies, FAQs, etc.):**
```http
POST /api/agent/sync/documents
Authorization: Bearer <admin_token>
```

Both endpoints return a summary:
```json
{
  "message": "Sync complete",
  "summary": {
    "inserted": 42,
    "updated": 3,
    "skipped": 10,
    "failed": 0
  }
}
```

**How sync works:**
- Each product/document is embedded using `gemini-embedding-001` (768 dimensions)
- MongoDB `__v` (version field) is used to detect changes — only records with a higher `__v` are re-embedded and updated
- Records with the same `__v` are skipped to avoid unnecessary Gemini API calls

**What gets embedded:**

| Type | Embedded fields |
|---|---|
| Product | name + category + subcategory + brand + price + description + shortDescription + discountPercentage |
| Document | title + content (HTML stripped to plain text) |

---

## Chat API

**Endpoint:** `POST /api/agent/chat`
**Auth:** Bearer token (user login required)
**Response:** Server-Sent Events (SSE) stream

**Request body:**
```json
{
  "message": "Show me laptops under $1000",
  "mode": "faster"
}
```

| Field | Values | Description |
|---|---|---|
| `message` | string | The user's message |
| `mode` | `faster` \| `smarter` | `faster` = gemini-2.5-flash-lite, `smarter` = gemini-2.5-flash |

**SSE event types:**

| Event | Payload | Description |
|---|---|---|
| `progress` | `{ "status": "..." }` | Status updates during processing |
| `token` | `{ "token": "..." }` | Word-level response tokens |
| `error` | `{ "error": "..." }` | Error details if something fails |

**Example progress flow:**
```
progress → "Getting things ready..."
progress → "Understanding your request..."
progress → "Searching for products..."      ← tool called
progress → "Adding product to your cart..."  ← tool called
progress → "Preparing a response..."
token    → "Here" "are" "the" "results" ...
progress → "done"
```

---

## Current Features

### 🔍 Semantic Product Search
- Natural language queries embedded into 768-dim vectors
- Cosine similarity search against the PostgreSQL vector store
- Optional `max_price` filter
- Returns up to 3 most relevant products above a 0.5 similarity threshold

### 📄 Document Retrieval (RAG)
- Searches policy/FAQ documents stored in PostgreSQL
- Strips HTML before embedding for clean semantic search
- Used automatically when the user asks about policies, shipping, returns, etc.

### 🛒 Cart Management
- View cart contents
- Add products (with product existence validation)
- Remove products

### ❤️ Wishlist Management
- View wishlist
- Add / remove products by ID

### 🧠 Short-Term Memory
- Custom implementation of `ConversationSummaryBufferMemory`
- Keeps the last 4 exchanges in full
- Older exchanges are summarized by the LLM and prepended as context
- Memory is scoped per user and automatically evicted after **5 minutes** of inactivity

### ⚙️ Agentic Tool Loop
- Model can call multiple tools per round (up to 3 tools simultaneously)
- Iterative tool calling with a maximum of **5 rounds**
- Tools execute in parallel via `Promise.all`
- Final response is always streamed token-by-token via SSE

### 🔒 Security
- Chat endpoint protected by JWT middleware
- Sync endpoints protected by JWT + admin-only middleware
- User ID extracted from JWT payload — never supplied by the LLM

---

## Future Enhancements

### 🛍️ Order Management
- Tools for placing orders, viewing order history, and tracking order status
- Integration with the existing orders collection in MongoDB
- Ability to answer questions like "Where is my order?" or "Cancel my last order"

### 🧾 Prompt Optimization
- Few-shot examples tailored to the OrionX product catalog
- Dynamic system prompt injection based on conversation context
- A/B testing different prompt strategies

### 🗄️ Long-Term Memory Integration
- Persist conversation summaries to MongoDB across sessions
- Allow the agent to remember user preferences from past conversations

### 👤 User Preference Learning
- Track browsing patterns (preferred brands, categories, price ranges)
- Personalize search results and recommendations based on purchase and chat history
- Build a user preference profile that evolves over time
