# 🎁 Gifts in Egypt

A modern and responsive e-commerce platform for discovering and purchasing gifts online in Egypt. Built with **Next.js**, **React**, **TypeScript**, and **Redux Toolkit**, the application provides a complete shopping experience including product browsing, filtering, cart management, checkout, user authentication, online payments, and order tracking.

---

## ✨ Features

### 🛍️ Shopping Experience
- Home page with featured products and promotional sections.
- Browse products by categories and collections.
- Product search functionality.
- Advanced product filtering:
  - Category
  - Price
  - Color
  - Size
  - Style
- Product detail pages with complete information.
- Pagination for product listings.

### 🛒 Cart & Checkout
- Redux-powered shopping cart.
- Quantity management and price calculations.
- Coupon and discount support.
- Order summary and delivery information.
- Mobile-friendly checkout experience.
- Checkout order confirmation via email.

### 👤 User Accounts
- Firebase Authentication (Email & Password).
- Customer profile dashboard.
- User order history.
- Secure user-specific order access. 

### 💳 Payments
- Paymob online payment integration.
- Secure hosted payment iframe.
- Support for online card payments.

### 📧 Notifications
- Contact form email notifications.
- Checkout order emails using SMTP and Nodemailer.

---

## 🚀 Tech Stack

### Frontend
- Next.js 13
- React 18
- TypeScript
- Redux Toolkit
- React Redux

### Backend & Services
- Firebase Authentication
- Firebase Firestore
- Nodemailer
- Paymob Payment Gateway

### Styling
- CSS
- Responsive Design

### Package Manager
- Yarn 

---

## 📂 Project Structure

```text
src/
├── components/      # Reusable UI components
├── pages/           # Next.js pages and API routes
├── store/           # Redux store and slices
├── styles/          # Global styling
├── types/           # Shared TypeScript types

public/
└── assets/          # Product and website assets
