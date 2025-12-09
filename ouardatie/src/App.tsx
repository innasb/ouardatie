// App.tsx
import { useState } from 'react';
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

function AppContent() {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [adminSection, setAdminSection] = useState('dashboard');
  const [language, setLanguage] = useState<'en' | 'fr' | 'ar'>('en');

  const handleNavigate = (page: string, id?: string) => {
    setCurrentPage(page);
    
    if (page === 'product' && id) {
      setSelectedProductId(id);
    } else if (page === 'shop' && id) {
      setSelectedCategoryId(id);
    } else if (page === 'shop' && !id) {
      // Clear category filter when navigating to shop without a category
      setSelectedCategoryId('');
    }
    
    window.scrollTo(0, 0);
  };

  const handleAdminNavigate = (section: string) => {
    setAdminSection(section);
  };

  const handleLanguageChange = (lang: 'en' | 'fr' | 'ar') => {
    setLanguage(lang);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F3EF] flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (currentPage === 'admin') {
    if (!user) {
      return <AdminLoginPage onLoginSuccess={() => handleNavigate('admin')} />;
    }

    if (adminSection === 'dashboard') {
      return <AdminDashboard onNavigate={handleAdminNavigate} />;
    } else if (adminSection === 'products') {
      return <AdminProducts onNavigate={handleAdminNavigate} />;
    } else if (adminSection === 'orders') {
      return <AdminOrders onNavigate={handleAdminNavigate} />;
    } else if (adminSection === 'shipping') {
      return <AdminShipping onNavigate={handleAdminNavigate} />;
    }
  }

  return (
    <>
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        language={language}
        onLanguageChange={handleLanguageChange}
      />
      {currentPage === 'home' && (
        <HomePage onNavigate={handleNavigate} language={language} />
      )}
      {currentPage === 'shop' && (
        <ShopPage 
          onNavigate={handleNavigate} 
          language={language}
          initialCategoryId={selectedCategoryId || undefined}
        />
      )}
      {currentPage === 'product' && (
        <ProductDetailPage
          productId={selectedProductId}
          onNavigate={handleNavigate}
          language={language}
        />
      )}
      {currentPage === 'cart' && (
        <CartPage onNavigate={handleNavigate} language={language} />
      )}
      {currentPage === 'checkout' && (
        <CheckoutPage onNavigate={handleNavigate} language={language} />
      )}
      {currentPage === 'about' && <AboutPage language={language} />}
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