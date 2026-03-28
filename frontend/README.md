# OrionX Frontend

The customer-facing web application for the OrionX e-commerce platform. Built with React 18, TypeScript, and Tailwind CSS.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Routing | React Router v6 |
| HTTP Client | Axios |
| Animations | Framer Motion |
| Icons | Lucide React |
| Build Tool | Vite |

---

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── features/      # Feature-specific components (cart, products, etc.)
│   │   ├── layout/        # Header, Footer, navigation
│   │   └── ui/            # Reusable UI primitives (buttons, modals, etc.)
│   ├── context/           # React context providers (auth, cart, etc.)
│   ├── data/              # Static data and constants
│   ├── hooks/             # Custom React hooks
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── ShopPage.tsx
│   │   ├── ProductDetailPage.tsx
│   │   ├── CartPage.tsx
│   │   ├── WishlistPage.tsx
│   │   ├── CheckoutPage.tsx
│   │   ├── ComparePage.tsx
│   │   ├── QuotationPage.tsx
│   │   ├── ProfilePage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── AboutPage.tsx
│   │   ├── ContactPage.tsx
│   │   └── Admin/         # Admin dashboard pages
│   ├── services/          # API service layer (Axios calls)
│   ├── types/             # TypeScript type definitions
│   ├── App.tsx            # Root component with routing
│   └── index.tsx          # Entry point
├── index.html
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- Backend server running on `http://localhost:5050`

### Installation

```bash
cd frontend
npm install
```

### Run

```bash
# Development
npm run dev
```

App starts at `http://localhost:5173`

```bash
# Production build
npm run build

# Preview production build
npm run preview
```

---

## Pages

| Page | Route | Description |
|---|---|---|
| Home | `/` | Landing page with featured products |
| Shop | `/shop` | Full product catalog with filters |
| Product Detail | `/products/:id` | Single product page |
| Cart | `/cart` | Shopping cart |
| Wishlist | `/wishlist` | Saved items |
| Checkout | `/checkout` | Order placement |
| Compare | `/compare` | Side-by-side product comparison |
| Quotation | `/quotation` | Request a quote |
| Profile | `/profile` | User account settings |
| Login | `/login` | User login |
| Register | `/register` | New user registration |
| About | `/about` | About OrionX |
| Contact | `/contact` | Contact page |
| Admin Dashboard | `/admin` | Admin panel (admin only) |
| Admin Products | `/admin/products` | Manage product catalog |
| Admin Add Product | `/admin/products/add` | Create new product |
| Admin Edit Product | `/admin/products/edit/:id` | Update existing product |

---

## Environment

The frontend connects to the backend at `http://localhost:5050` by default. To change this, update the base URL in `src/services/`.

---

## Backend API

The frontend communicates with the backend REST API. See the [backend README](../backend/README.md) for full API documentation.
