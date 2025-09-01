# E-Commerce Outfits

## Overview

A modern, full-featured e-commerce platform built with Vue 3, Vite, Quasar, and Tailwind CSS. This platform supports user shopping, seller product management, and admin oversight, with a focus on responsive design, real-time features, and scalable architecture.

The application is designed as a multi-role e-commerce system that caters to three main user types:

- **Customers**: Browse products, manage carts, place orders, and track purchases
- **Sellers**: List and manage their products, handle orders, and monitor sales
- **Admins**: Oversee the entire platform, manage users, approve products, and monitor operations

The frontend is built using Vue 3 with the Composition API, leveraging Quasar Framework for UI components and Tailwind CSS for styling. State management is handled by Pinia, and routing is managed by Vue Router. The application integrates with a backend API for data persistence and business logic.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Running the Project](#running-the-project)
- [Project Structure](#project-structure)
- [API Integration](#api-integration)
- [Environment Variables](#environment-variables)
- [Development Guidelines](#development-guidelines)
- [Contributing](#contributing)
- [License](#license)

## Features

### 1. User Panel (Customer Website)

Where users browse products, manage carts, and place orders.

**Features:**

- User registration/login (email, phone, others)
- Profile management (address book, payment methods, order history)
- Product browsing (categories, filters, search)
- Cart & wishlist
- Checkout & payment
- Order tracking
- Reviews & ratings

**Frontend Components:**

- `AuthForms.vue` (login/register/OTP)
- `ProductCard.vue` (title, price, image, rating)
- `ProductDetail.vue` (gallery, specs, reviews)
- `SearchBar.vue` + `FiltersPanel.vue`
- `CartPage.vue` & `WishlistPage.vue`
- `CheckoutForm.vue` (address, shipping, payment)
- `OrderTracking.vue`

**Tasks:**

- Build responsive storefront (Quasar + Tailwind)
- Search with filters (category, price, rating, brand)
- Smooth cart & checkout experience
- Order tracking page with statuses
- Review/rating UI

**Backend Endpoints:**

- `POST /api/users/register`
- `POST /api/users/login`
- `GET /api/products` (with filters & search)
- `GET /api/products/:id`
- `POST /api/cart`
- `POST /api/orders`
- `GET /api/orders/:id`

**Tasks:**

- User schema (users, addresses, payments, orders)
- Product catalog schema (products, categories, inventory, reviews)
- Cart management logic (session-based + DB storage)
- Checkout workflow (order creation → payment → confirmation)
- Order tracking with statuses (Processing → Shipped → Delivered → Returned)

### 2. Merchant/Seller Panel

For sellers who want to list and manage their products.

**Features:**

- Seller registration
- Product listing management (CRUD with images & variants)
- Inventory & pricing management
- Orders management (view, ship, cancel, return)
- Revenue dashboard

**Frontend Components:**

- `SellerDashboard.vue`
- `ProductForm.vue` (create/edit product with images & variants)
- `InventoryTable.vue`
- `OrderManagement.vue`
- `SellerStats.vue` (charts: sales, returns, revenue)

**Tasks:**

- Multi-step seller onboarding wizard
- CRUD product management UI
- Track orders and statuses
- Stats dashboard

**Backend Endpoints:**

- `POST /api/sellers/register`
- `POST /api/products`
- `PATCH /api/products/:id`
- `GET /api/seller/orders`
- `GET /api/seller/stats`

**Tasks:**

- Seller schema (verified/unverified)
- Product schema with variants (size, color, stock)
- Seller-specific stats (sales, revenue, returns)
- Commission calculation per seller

### 3. Admin Panel

Control hub for the e-commerce platform.

**Features:**

- User management
- Seller approvals & monitoring
- Product moderation (approve/remove)
- Order monitoring (disputes, refunds)

**Frontend Components:**

- `AdminDashboard.vue`
- `UsersTable.vue`
- `SellersTable.vue`
- `ProductsApproval.vue`
- `OrdersMonitor.vue`

**Tasks:**

- Build admin tables with filters & bulk actions
- Approval/rejection flows

**Backend Endpoints:**

- `GET /api/admin/users`
- `GET /api/admin/sellers`
- `GET /api/admin/products`
- `GET /api/admin/orders`
- `GET /api/admin/analytics`

**Tasks:**

- Role-based access (admin, seller, user)
- Product approval workflow
- Order monitoring system

### 4. Payments & Transactions

_(Planned for later development)_  
Will integrate payment gateways, transaction handling, and security features.

### 5. Stats & Analytics (Bonus)

For sellers & admin.

**Features:**

- Seller-specific analytics (sales, top products, returns)
- Admin analytics (global sales, top sellers, categories)
- Customer analytics (top buyers, repeat buyers)

**Frontend Components:**

- `SalesChart.vue`
- `CategoryStats.vue`
- `TopSellers.vue`
- `CustomerInsights.vue`

**Tasks:**

- Interactive charts with filters
- Export reports (CSV, PDF)

**Backend Endpoints:**

- `GET /api/stats/seller/:id`
- `GET /api/stats/admin`

**Tasks:**

- Aggregated queries (Postgres/MongoDB)
- Pre-aggregated JSON APIs for frontend
- Efficient indexing for large datasets

### 6. Order & Checkout Flow

The heart of the e-commerce platform.

**Features:**

- Cart → Checkout → Payment → Confirmation → Delivery
- Real-time stock check
- Order status tracking (Processing → Shipped → Delivered → Returned)
- Return/refund system

**Frontend Components:**

- `CartPage.vue`
- `CheckoutForm.vue`
- `OrderConfirmation.vue`
- `OrderTracking.vue`
- `ReturnRequest.vue`

**Tasks:**

- Multi-step checkout flow
- Real-time stock check before placing order
- Order tracking timeline

**Backend Endpoints:**

- `POST /api/cart`
- `POST /api/orders`
- `PATCH /api/orders/:id` (update status)
- `POST /api/orders/:id/return`

**Tasks:**

- Order schema with tracking
- Inventory lock (prevent overselling)
- Shipment integration (tracking IDs with courier APIs)
- Refund workflow

## Tech Stack

### Frontend Framework & Build Tools

- **Vue 3**: Progressive JavaScript framework using Composition API for better code organization and reusability
- **Vite**: Fast build tool and development server with hot module replacement for rapid development
- **Quasar Framework**: Vue-based framework providing Material Design components and responsive layouts

### Styling & UI

- **Tailwind CSS**: Utility-first CSS framework for rapid UI development and consistent design
- **Sass**: CSS preprocessor for advanced styling features and better maintainability

### State Management & Routing

- **Pinia**: Intuitive state management library for Vue 3, replacing Vuex with a simpler API
- **Vue Router**: Official routing library for Vue.js applications with nested routes and navigation guards

### HTTP & Data Handling

- **Axios**: Promise-based HTTP client for making API requests with interceptors for authentication
- **Chart.js**: Simple yet flexible JavaScript charting library for data visualization in dashboards

### Development & Testing

- **Vitest**: Fast unit testing framework built on top of Vite for Vue components and utilities
- **ESLint**: Linting tool for maintaining code quality and consistency

### Backend Integration

- **Backend**: Separate API server (assumed to be built with frameworks like Express.js, Django, or similar)
- **Authentication**: JWT-based authentication with Bearer tokens stored in localStorage

## Prerequisites

- Node.js (v16 or higher) - Download from [nodejs.org](https://nodejs.org/)
- npm or yarn (comes with Node.js) - Package managers for installing dependencies
- Git - Version control system for cloning the repository

## Getting Started

### Quick Start

1. **Clone the repository** to your local machine
2. **Install dependencies** using npm or yarn
3. **Set up environment variables** (if needed)
4. **Run the development server** to start the application
5. **Access the application** in your browser

### Development Workflow

- Use `npm run dev` for development with hot reload
- Use `npm run build` to create a production build
- Use `npm run preview` to preview the production build locally
- Follow the project structure for organizing new components and features

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/alihamza-12/e-commerce-outfits.git
   cd e-commerce-outfits
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. (Optional) Set up environment variables (see [Environment Variables](#environment-variables)).

## Running the Project

### Development

Run the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173` (default Vite port).

### Build for Production

Build the project:

```bash
npm run build
```

### Preview Production Build

Preview the built app:

```bash
npm run preview
```

## Project Structure

```
e-commerce-outfits/
├── public/                 # Static assets
├── src/
│   ├── api/                # API services (axios, sellerService, etc.)
│   ├── assets/             # Images, styles
│   ├── components/         # Reusable components (auth, admin, common, etc.)
│   ├── router/             # Vue Router configuration
│   ├── services/           # API service files
│   ├── stores/             # Pinia stores (auth, cart, product, etc.)
│   ├── views/              # Page components (admin, customer, seller, home)
│   ├── App.vue             # Root component
│   ├── main.js             # Entry point
│   └── style.css           # Global styles
├── scripts/                # Utility scripts
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind configuration
├── postcss.config.js       # PostCSS configuration
└── README.md               # This file
```

## API Integration

The frontend communicates with a RESTful backend API for all data operations. The API integration is handled through dedicated service files in the `src/services/` directory.

### API Base URLs

- **Production:** `http://13.60.188.147/api`
- **Development:** `http://192.168.12.215:8000/api` (configured in service files)

### Authentication

- Uses JWT (JSON Web Tokens) for authentication
- Bearer tokens are stored in localStorage for persistent sessions
- Automatic token attachment via Axios interceptors

### Key API Endpoints by Module

#### User Authentication & Profile

- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

#### Product Management

- `GET /api/products` - List products (with query parameters for filtering/searching)
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create new product (seller only)
- `PUT /api/products/:id` - Update product (seller only)
- `DELETE /api/products/:id` - Delete product (seller only)

#### Cart & Wishlist

- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:itemId` - Update cart item
- `DELETE /api/cart/:itemId` - Remove item from cart
- `GET /api/wishlist` - Get user's wishlist
- `POST /api/wishlist` - Add to wishlist

#### Orders

- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get order details
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id/status` - Update order status
- `POST /api/orders/:id/cancel` - Cancel order

#### Seller Panel

- `POST /api/sellers/register` - Seller registration
- `GET /api/sellers/profile` - Get seller profile
- `GET /api/sellers/products` - Get seller's products
- `GET /api/sellers/orders` - Get seller's orders
- `GET /api/sellers/stats` - Get seller statistics

#### Admin Panel

- `GET /api/admin/users` - List all users
- `GET /api/admin/sellers` - List all sellers
- `GET /api/admin/products` - List all products (for approval)
- `PUT /api/admin/products/:id/approve` - Approve/reject product
- `GET /api/admin/orders` - List all orders
- `GET /api/admin/analytics` - Platform analytics

### Error Handling

- API responses include standard HTTP status codes
- Error messages are displayed to users via Quasar notifications
- Network errors are handled gracefully with retry mechanisms

## Environment Variables

Create a `.env` file in the root directory if needed (e.g., for custom API URLs):

```
VITE_API_BASE_URL=http://13.60.188.147/api
```

## Development Guidelines

### Code Organization

- **Components**: Place reusable components in `src/components/`, organized by feature (auth, admin, common)
- **Views**: Page-level components go in `src/views/`, structured by user role (admin, customer, seller)
- **Stores**: Use Pinia stores in `src/stores/` for state management, one store per domain
- **Services**: API calls and business logic in `src/services/`
- **Router**: Route definitions and guards in `src/router/`

### Component Structure

```vue
<template>
  <!-- HTML structure -->
</template>

<script setup>
// Composition API logic
import { ref, computed } from "vue";
import { useStore } from "pinia";

// Props, emits, reactive data
const props = defineProps(["title"]);
const emit = defineEmits(["update"]);

// Component logic
</script>

<style scoped>
/* Component-specific styles */
</style>
```

### Naming Conventions

- **Components**: PascalCase (e.g., `ProductCard.vue`, `UserProfile.vue`)
- **Files**: kebab-case for multi-word files (e.g., `product-detail.vue`)
- **Variables**: camelCase for JavaScript, kebab-case for CSS classes
- **Stores**: camelCase with descriptive names (e.g., `useAuthStore`, `useCartStore`)

### State Management

- Use Pinia stores for global state
- Keep stores focused on specific domains
- Use reactive references for local component state
- Implement proper error handling in async operations

### API Integration

- Use dedicated service files for API calls
- Implement proper error handling and loading states
- Use Axios interceptors for authentication
- Follow RESTful conventions for endpoints

### Styling Guidelines

- Use Tailwind CSS utility classes for styling
- Leverage Quasar components for consistent UI
- Create custom CSS variables for theme colors
- Ensure responsive design with mobile-first approach

### Testing

- Write unit tests for components using Vitest
- Test API services and store actions
- Include integration tests for critical user flows
- Aim for good test coverage on business logic

## Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature`.
3. Commit changes: `git commit -m 'Add your feature'`.
4. Push to the branch: `git push origin feature/your-feature`.
5. Open a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Support

### Getting Help

- **Documentation**: Refer to this README for setup and usage instructions
- **Issues**: Report bugs or request features via GitHub Issues
- **Discussions**: Join community discussions for questions and feedback

### Known Issues

- Some features may require backend API to be running
- Mobile responsiveness testing recommended for all new components
- Chart.js integration may need additional configuration for complex visualizations

### Roadmap

- [ ] Payment gateway integration
- [ ] Real-time notifications
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Progressive Web App (PWA) features

---

**Happy coding!** 🎉 If you find this project helpful, please give it a star on GitHub.
