# 🌸 OUARDATIE - Minimalist E-Commerce Platform

A sleek, multilingual e-commerce website for OUARDATIE, designed with elegance, simplicity, and user comfort in mind. Built with React, TypeScript, Tailwind CSS, and Supabase — and crafted with a developer's love for clean architecture and intuitive user experience.

## Overview

OUARDATIE (which means "my flowers" in Arabic 🌷) is more than just an online store — it's a place where natural elegance meets everyday style.

With a minimalist design, multilingual support, and a powerful admin dashboard, OUARDATIE makes shopping a breeze for customers and product management effortless for admins.

## ✨ Features

### Customer-Facing Features

- **Multilingual Support**: Seamless English, French, and Arabic support (with RTL for Arabic)
- **Product Catalog**: Filter by category, price range, and sorting options
- **Product Details**: Beautiful product pages with gallery, size/color selection, and quantity controls
- **Shopping Cart**: Persistent cart with real-time updates, quantity management, and smooth UX
- **Checkout**: Streamlined checkout with wilaya/commune selection and flexible shipping options
- **Order Management**: Place and track orders, choose desk or home delivery

### Admin Panel Features

- **Dashboard**: Analytics at a glance — revenue trends, daily metrics, and order stats
- **Product Management**: Add, edit, delete products, upload images effortlessly
- **Order Management**: View, filter, update statuses, and export CSVs
- **Shipping Configurations**: Set shipping prices by wilaya for desk or home delivery
- **Multilingual Admin**: English, French, Arabic — just like the customer side

## 🛠 Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Backend**: Supabase (PostgreSQL, Auth, RLS)
- **Icons**: Lucide React
- **State Management**: React Context API
- **Build Tool**: Vite

## 💾 Database Schema

### Main Tables

- **products** – Product catalog with images, sizes, colors, and pricing
- **categories** – Organize products by category
- **orders** – Customer orders with shipping and payment info
- **order_items** – Individual items per order
- **shipping_options** – Shipping prices by wilaya and delivery type
- **communes** – List of communes per wilaya

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Supabase project set up
- Basic understanding of React + TypeScript

### Installation

```bash
git clone <repository-url>
cd ouardatie
npm install
```

### Environment Variables

Create a `.env` file in the root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Start Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` to see OUARDATIE in action. 🌷

### Build for Production

```bash
npm run build
```

Production files will be in the `dist/` folder.

## 🛡 Admin Access

To access the admin panel:

1. Go to your Supabase dashboard → Authentication → Users
2. Click Add User, create an account with email & password
3. Login on the admin page and manage your products, orders, and shipping

See `ADMIN_ACCESS.md` for detailed instructions.

## 🏗 Project Structure

```
ouardatie/
├── src/
│   ├── components/      # Reusable UI components
│   ├── contexts/        # React Context providers (Auth, Cart)
│   ├── lib/             # Utilities and configurations
│   ├── pages/           # All page components
│   ├── App.tsx          # Main app
│   ├── main.tsx         # Entry point
│   └── index.css        # Global styles
├── public/              # Static assets (images, logos)
├── supabase/            # Database migrations
└── package.json
```

## 💡 Key Features Implementation

- **Multilingual Support** – UI adapts to English, French, or Arabic seamlessly.
- **Shopping Cart** – Uses Context API + localStorage for persistent state.
- **Order Processing** – Shipping cost automatically calculated based on wilaya & delivery type.
- **Admin Dashboard** – Analytics, revenue trends, order status visualization, and recent order tracking.
- **Security** – RLS enabled, admin auth required, validation on orders.

## 🎨 Design Philosophy

OUARDATIE embodies minimalist elegance:

- **Colors**: Warm, earthy tones – beige, cream, soft grays
- **Typography**: Serif for headings, clean sans-serif for body
- **Layout**: Spacious, clear, mobile-first design
- **Animations**: Smooth transitions & subtle hover effects

## 🔧 Scripts

- `npm run dev` – Start development server
- `npm run build` – Build production files
- `npm run preview` – Preview production build
- `npm run lint` – Run ESLint
- `npm run typecheck` – Run TypeScript type checks

## 🌐 Browser Support

- Chrome / Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

Want to contribute? Awesome! Please:

- Test thoroughly in dev
- Keep TypeScript types correct
- Respect the design system
- Ensure multilingual functionality works
- Preserve RLS security

## 📝 License

All rights reserved – OUARDATIE 2025

## 📞 Support

Need help? Reach out to the development team for assistance.

---

**Built with ❤️ and care — OUARDATIE: Where Comfort Meets Beauty 🌸**
