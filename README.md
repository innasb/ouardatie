# OUARDATIE - Minimalist E-commerce Platform

A beautiful, multilingual e-commerce website for OUARDATIE, designed with elegance and comfort in mind. Built with React, TypeScript, Tailwind CSS, and Supabase.

## Overview

OUARDATIE (meaning "my flowers" in Arabic) is a modern e-commerce platform that brings natural elegance to everyday style. The platform features a clean, minimalist design with full multilingual support (English, French, Arabic) and comprehensive admin management tools.

## Features

### Customer-Facing Features
- **Multilingual Support**: Full support for English, French, and Arabic with RTL layout for Arabic
- **Product Catalog**: Browse products with filtering by category, price range, and sorting options
- **Product Details**: Detailed product pages with image gallery, size/color selection, and quantity controls
- **Shopping Cart**: Persistent cart with real-time updates and quantity management
- **Checkout Process**: Streamlined checkout with wilaya/commune selection and shipping options
- **Order Management**: Create orders with support for desk delivery or home delivery

### Admin Panel Features
- **Dashboard**: Beautiful analytics dashboard with revenue trends, order statistics, and daily metrics
- **Product Management**: Add, edit, and delete products with image upload support
- **Order Management**: View, filter, and update order statuses with CSV export functionality
- **Shipping Configuration**: Manage shipping prices by wilaya for both desk and home delivery
- **Multilingual Admin**: Admin panel supports English, French, and Arabic

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Backend**: Supabase (PostgreSQL database, Authentication, Row Level Security)
- **Icons**: Lucide React
- **State Management**: React Context API
- **Build Tool**: Vite

## Database Schema

### Tables
- **products**: Product catalog with images, sizes, colors, and pricing
- **categories**: Product categories for organization
- **orders**: Customer orders with shipping and payment details
- **order_items**: Individual items within each order
- **shipping_options**: Shipping prices by wilaya and delivery type
- **communes**: List of communes by wilaya for address selection

## Getting Started

### Prerequisites
- Node.js 18+ installed
- Supabase account with a project set up
- Basic understanding of React and TypeScript

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd ouardatie
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables

Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the development server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The production-ready files will be in the `dist` directory.

## Admin Access

To access the admin panel, you need to create an admin user in Supabase:

1. Navigate to your Supabase project dashboard
2. Go to Authentication > Users
3. Click "Add User" and create an account with email and password
4. Access the admin panel by navigating to the admin page in your application

For detailed instructions, see `ADMIN_ACCESS.md`

## Project Structure

```
ouardatie/
├── src/
│   ├── components/         # Reusable UI components
│   │   └── Navbar.tsx
│   ├── contexts/          # React Context providers
│   │   ├── AuthContext.tsx
│   │   └── CartContext.tsx
│   ├── lib/               # Utility libraries and configurations
│   │   ├── supabase.ts
│   │   └── database.types.ts
│   ├── pages/             # Page components
│   │   ├── admin/         # Admin panel pages
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── AdminLoginPage.tsx
│   │   │   ├── AdminOrders.tsx
│   │   │   ├── AdminProducts.tsx
│   │   │   └── AdminShipping.tsx
│   │   ├── AboutPage.tsx
│   │   ├── CartPage.tsx
│   │   ├── CheckoutPage.tsx
│   │   ├── HomePage.tsx
│   │   ├── ProductDetailPage.tsx
│   │   └── ShopPage.tsx
│   ├── App.tsx            # Main application component
│   ├── main.tsx           # Application entry point
│   └── index.css          # Global styles
├── public/                # Static assets
│   ├── landing_ouarda.jpg
│   └── logo_ouarda.jpg
├── supabase/
│   └── migrations/        # Database migrations
└── package.json           # Project dependencies
```

## Key Features Implementation

### Multilingual Support
The application uses a translation system that supports three languages. Each page component includes translation objects with keys for all UI text. The language state is managed at the app level and passed down to components.

### Shopping Cart
The cart uses React Context API for global state management and localStorage for persistence. Items are stored with product details, selected size, color, and quantity.

### Order Processing
Orders are created with customer information, shipping details, and order items. The system calculates shipping costs based on the selected wilaya and delivery type (desk or home delivery).

### Admin Dashboard
The admin dashboard provides comprehensive analytics including:
- Total orders, pending orders, revenue, and product count
- Revenue trends over the last 7 days
- Order status distribution with visual charts
- Recent orders list
- Daily order volume visualization

### Security
- Row Level Security (RLS) enabled on all tables
- Authentication required for admin access
- Secure order processing with validation

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

## Design Philosophy

OUARDATIE follows a minimalist design philosophy inspired by natural elegance:

- **Color Palette**: Warm, earthy tones (beige, cream, soft grays)
- **Typography**: Serif fonts for headings, clean sans-serif for body text
- **Layout**: Clean, spacious layouts with generous white space
- **Animations**: Subtle, smooth transitions and hover effects
- **Responsive**: Mobile-first design with breakpoints for all screen sizes

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

This is a production e-commerce platform. For modifications or feature requests, please follow proper development practices:

1. Test changes thoroughly in development
2. Ensure all TypeScript types are correct
3. Maintain the existing design system
4. Test multilingual functionality
5. Verify RLS policies remain secure

## License

All rights reserved - OUARDATIE 2025

## Support

For technical support or questions about the platform, please contact the development team.

---

Built with care for OUARDATIE - Where Comfort Meets Beauty
