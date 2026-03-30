# 🍽️ Tasty Bites - Premium Restaurant Management System

[![Frontend Deployment](https://img.shields.io/badge/Frontend-Vercel-black?style=for-the-badge&logo=vercel)](https://tasty-bites-restaurant-ten.vercel.app)
[![Backend Status](https://img.shields.io/badge/Backend-Render-EFEFEF?style=for-the-badge&logo=render)](https://tasty-bites-restaurant.onrender.com/api/health)
[![Full Repo](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/anitha-software-dev/tasty-bites-restaurant)

Tasty Bites is a sophisticated, full-stack restaurant management solution designed for the modern culinary industry. It seamlessly integrates a high-conversion customer-facing website with a powerful, real-time administrative ecosystem.

---

## 🚀 Key Modules & Features

### 🛒 Customer Experience (Frontend)
- **High-End UI/UX**: Built with Framer Motion for liquid-smooth transitions and a premium aesthetic.
- **Dynamic Menu**: Categorized digital menu with real-time filtering and search.
- **Online Ordering**: Integrated cart and checkout flow with localized address management.
- **Table Reservations**: Intuitive booking system with instant status tracking.
- **Catering Portal**: Dedicated inquiry flow for event management.
- **Personalized Profiles**: User accounts for order history and saved preferences.
- **Social Proof**: Elegant testimonials and FAQ sections to build brand trust.

### 🛡️ Administrative Portal (Staff Only)
- **Live Order Tracking**: Purpose-built interfaces for **Chefs** (Kitchen Display) and **Waiters** (Floor Management).
- **Menu Management**: Full CRUD capabilities for dishes, categories, and availability.
- **Reservation Control**: Manage bookings, update statuses, and seat guests efficiently.
- **Staff Administration**: Role-based access control (RBAC) for managing the restaurant team.
- **Business Intelligence**: Real-time analytics dashboard with revenue trends and order distribution charts.
- **Store Preferences**: Global control over restaurant info, logos, and operating details.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, Framer Motion, Tailwind CSS, Axios |
| **Backend** | Node.js, Express, Sequelize ORM, JWT, Bcrypt |
| **Database** | PostgreSQL (Neon for Production) |
| **Services** | SendGrid, Nodemailer (Email Automation) |
| **Deployment** | Vercel (Frontend), Render (Backend) |

---

## 📂 Project Architecture

The project follows a modern monorepo structure for seamless coordination between services:

```text
├── frontend/             # React + Vite application (Customer & Admin)
│   ├── src/
│   │   ├── admin/        # Secured Administrative Dashboard
│   │   ├── components/   # Shared UI components
│   │   ├── pages/        # Customer-facing views
│   │   └── services/     # API interaction layer
├── backend/              # Node.js + Express API
│   ├── config/           # Database & Auth configuration
│   ├── models/           # Sequelize schema definitions
│   ├── routes/           # API Endpoint controllers
│   └── services/         # Business logic & Email integration
├── vercel.json           # Root Vercel build configuration
└── render.yaml           # Root Render blueprint for infrastructure
```

---

## ☁️ Deployment Strategy

### **Frontend & Admin (Vercel)**
- **Auto-build**: Configured via `vercel.json` at the root.
- **Target**: The `frontend` workspace is compiled and served as a SPA.
- **Env Required**: `VITE_API_URL` (Points to the Render API).

### **Backend & API (Render)**
- **Live Service**: Hosted on Render using the `render.yaml` blueprint.
- **Database**: Connected to a high-availability PostgreSQL instance.
- **Env Required**: `DATABASE_URL`, `JWT_SECRET`, `SMTP_USER`, `SMTP_PASS`.

---

## 💻 Local Quickstart

1. **Clone the repository**:
   ```bash
   git clone https://github.com/anitha-software-dev/tasty-bites-restaurant.git
   cd tasty-bites-restaurant
   ```

2. **Install all dependencies**:
   ```bash
   npm run install:all
   ```

3. **Configure Environment**:
   - Create `backend/.env` (DB_URL, JWT_SECRET, etc.)
   - Ensure local PostgreSQL is running.

4. **Initialize System**:
   ```bash
   npm run seed
   ```

5. **Launch Project**:
   ```bash
   npm run dev
   ```
   - Dashboard: `http://localhost:5173/admin`
   - Website: `http://localhost:5173`
   - API: `http://localhost:5000`

---

## 📄 License
Distributed under the **MIT License**. See `LICENSE` for more information.
