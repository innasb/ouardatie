import { useState, useEffect } from 'react';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import AboutPage from './pages/AboutPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminShipping from './pages/admin/AdminShipping';

// Custom routing hook
function useRouter() {
  const [route, setRoute] = useState(() => {
    const path = window.location.pathname;
    return path === '/' ? '/home' : path;
  });

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      setRoute(path === '/' ? '/home' : path);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setRoute(path);
    window.scrollTo(0, 0);
  };

  return { route, navigate };
}

function AppContent() {
  const { user, loading } = useAuth();
  const { route, navigate } = useRouter();
  const [language, setLanguage] = useState<'en' | 'fr' | 'ar'>('en');

  // Parse the route
  const pathSegments = route.split('/').filter(Boolean);
  const page = pathSegments[0] || 'home';
  const subPath = pathSegments[1] || '';
  const id = pathSegments[2] || pathSegments[1] || '';

  // Navigation helper that matches the old onNavigate signature
  const handleNavigate = (targetPage: string, targetId?: string) => {
    if (targetPage === 'product' && targetId) {
      navigate(`/product/${targetId}`);
    } else if (targetPage === 'shop' && targetId) {
      navigate(`/shop/category/${targetId}`);
    } else {
      navigate(`/${targetPage}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F3EF] flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  // Admin routes
  if (page === 'admin') {
    if (!user && subPath !== 'login') {
      return <AdminLoginPage onLoginSuccess={() => navigate('/admin')} />;
    }

    if (subPath === 'login') {
      return <AdminLoginPage onLoginSuccess={() => navigate('/admin')} />;
    }

    if (subPath === 'products') {
      return <AdminProducts onNavigate={(section) => navigate(`/admin/${section}`)} />;
    }

    if (subPath === 'orders') {
      return <AdminOrders onNavigate={(section) => navigate(`/admin/${section}`)} />;
    }

    if (subPath === 'shipping') {
      return <AdminShipping onNavigate={(section) => navigate(`/admin/${section}`)} />;
    }

    return <AdminDashboard onNavigate={(section) => navigate(`/admin/${section}`)} />;
  }

  // Public routes with Navbar
  return (
    <>
      <Navbar
        currentPage={page}
        onNavigate={(targetPage) => navigate(`/${targetPage}`)}
        language={language}
        onLanguageChange={setLanguage}
      />

      {page === 'home' && (
        <HomePage 
          onNavigate={handleNavigate}
          language={language} 
        />
      )}

      {page === 'shop' && (
        <ShopPage
          onNavigate={handleNavigate}
          language={language}
          initialCategoryId={subPath === 'category' ? id : undefined}
        />
      )}

      {page === 'product' && (
        <ProductDetailPage
          productId={subPath || id}
          onNavigate={handleNavigate}
          language={language}
        />
      )}

      {page === 'cart' && (
        <CartPage 
          onNavigate={handleNavigate}
          language={language} 
        />
      )}

      {page === 'checkout' && (
        <CheckoutPage 
          onNavigate={handleNavigate}
          language={language} 
        />
      )}

      {page === 'about' && <AboutPage language={language} />}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;