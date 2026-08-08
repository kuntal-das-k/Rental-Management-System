# TwinSix Rentals - Multi-Vendor Rental Marketplace

**TwinSix Rentals** is a full-stack, multi-vendor rental marketplace web application built following Odoo Rental module workflow conventions (`Quotation` → `Quotation Sent` → `Sales Order` → `Invoice`).

## Tech Stack
- **Frontend:** React 18 (Vite) + TypeScript, Tailwind CSS, `@tanstack/react-query`, Zustand
- **Backend:** Node.js + Express, 3-layer architecture (`routes` → `services` → `repositories`)
- **Database:** PostgreSQL accessed via Prisma ORM
- **Cache/Queue:** Redis + BullMQ (background job scanner running every 60s for late-fee automation)
- **Auth:** JWT Access + Refresh tokens, bcrypt password hashing, Role-Based Access Control (`CUSTOMER`, `VENDOR`, `ADMIN`)
- **Containerization:** Docker Compose (`api`, `worker`, `frontend`, `postgres`, `redis`)

---

## Quick Start with Docker Compose

To start the entire application suite (Database, Cache, API Server, Worker, Frontend):

```bash
docker compose up --build
```

- **Frontend Application:** [http://localhost:3000](http://localhost:3000)
- **Backend REST API:** [http://localhost:5000/api/v1](http://localhost:5000/api/v1)

---

## Seed Data & Demo Accounts

Run the database seed script to populate demo data:

```bash
cd backend
npm run prisma:seed
```

### Pre-seeded Demo Credentials

| Role | Email | Password | Details |
| --- | --- | --- | --- |
| **Admin** | `admin@twinsix.com` | `Password123!` | Global administration & product publishing control |
| **Vendor 1** | `vendor1@twinsix.com` | `Password123!` | Apex Mobility & Gear Rentals (Cameras & Audio) |
| **Vendor 2** | `vendor2@twinsix.com` | `Password123!` | Urban Fleet & EV Rentals (E-Bikes & Scooters) |
| **Customer 1** | `customer1@gmail.com` | `Password123!` | Alex Morgan (Customer account with address) |
| **Customer 2** | `customer2@gmail.com` | `Password123!` | David Miller (Customer account with address) |

---

## Key Features & Core Workflows

1. **Odoo Rental State Machine:**
   `QUOTATION` → `QUOTATION_SENT` → `SALES_ORDER` → `PICKED_UP` → `RETURNED` (with `CANCELLED` escape state).
2. **Security Deposits as Service Products:**
   Refundable security deposits and downpayments are modeled as regular service products (`product_type = "SERVICE"`), attached directly as order items.
3. **Automated Late Fee Engine:**
   BullMQ worker runs every 60 seconds to scan active rentals past `scheduled_return_at`. Late fees take product-specific rules first, then fall back to global default rates.
4. **Interactive Backoffice Tools:**
   - **Kanban Board:** Color-coded columns per order state with quick action buttons.
   - **Scheduler Calendar:** Monthly vendor view showing `Booked`, `Pick up`, `Due Return`, and `Late Delivery` events.
   - **Condition Inspection Checklist:** Interactive pass/fail inspection modal on pickup and return.
   - **PDF Invoice Generator:** PDFKit invoice generator producing official PDFs stored under `/uploads/invoices/`.
   - **Reusable Bar Chart:** Dynamic reporting chart accepting metric keys (`Revenue`, `Order Count`) and date-range filters.

---

## Admin Panel "Create Rental" Problem & Solution

### 1. Problem Description
When attempting to create a new rental order from the Admin Dashboard modal, order creation failed or misattributed customer data.

### 2. Root Cause Analysis
1. **Customer ID Hardcoding in Controller:**
   `OrderController.createOrder` set `customerId = req.user.userId`. When logged in as an Admin, `req.user.userId` represented the Admin's ID rather than the customer selected in the modal form.
2. **JSON Payload Naming Mismatch:**
   The backend `OrderService` strictly expected `snake_case` fields (`vendor_id`, `scheduled_pickup_at`, `scheduled_return_at`, `product_id`), whereas the frontend Admin modal posted `camelCase` properties (`vendorId`, `scheduledPickupAt`, `scheduledReturnAt`, `productId`). As a result, product IDs and vendor IDs evaluated to `undefined`.

### 3. Technical Solution Applied

#### Backend Fixes
- **`backend/src/controllers/order.controller.ts`**:
  Updated `createOrder` to prioritize `req.body.customerId` or `req.body.customer_id` from the request payload before falling back to `req.user.userId`.
- **`backend/src/services/order.service.ts`**:
  Normalized incoming payload parameters to support both `camelCase` and `snake_case` transparently:
  ```typescript
  const targetCustomerId = data.customerId || data.customer_id || customerId;
  const vendorIdInput = data.vendor_id || data.vendorId;
  const scheduledPickupInput = data.scheduled_pickup_at || data.scheduledPickupAt;
  const scheduledReturnInput = data.scheduled_return_at || data.scheduledReturnAt;
  const productId = item.product_id || item.productId;
  ```
  Added vendor fallback resolution to resolve vendor profiles by either `vendor_profile.id` or `user.id`.

#### Frontend Fixes
- **`frontend/src/pages/AdminDashboard.tsx`**:
  - Added vendor auto-selection when a product is chosen in the form dropdown.
  - Added date auto-defaults (Today for Pickup, +3 Days for Return) if dates are left blank.
  - Added loading indicator (`isCreatingRental`) to prevent duplicate form submissions.

### 4. Verification
Tested end-to-end with full TypeScript compilation (`npm run build:backend` & `npm run build:frontend`). Rental orders can now be created by Admins for any registered customer and vendor cleanly.
