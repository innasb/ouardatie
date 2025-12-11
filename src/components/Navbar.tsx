import { ShoppingBag, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../contexts/CartContext';

const navTranslations = {
  en: {
    home: 'Home',
    shop: 'Shop',
    about: 'About',
    cart: 'Cart',
  },
  fr: {
    home: 'Accueil',
    shop: 'Boutique',
    about: 'À Propos',
    cart: 'Panier',
  },
  ar: {
    home: 'الرئيسية',
    shop: 'المتجر',
    about: 'من نحن',
    cart: 'السلة',
  },
};

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  language?: 'en' | 'fr' | 'ar';
  onLanguageChange?: (lang: 'en' | 'fr' | 'ar') => void;
}

export default function Navbar({
  currentPage,
  onNavigate,
  language = 'en',
  onLanguageChange,
}: NavbarProps) {
  const { totalItems, totalPrice } = useCart();
  const t = navTranslations[language];
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavigate = (page: string) => {
    onNavigate(page);
    setIsMenuOpen(false);
  };

  const handleLanguageChange = (lang: 'en' | 'fr' | 'ar') => {
    onLanguageChange?.(lang);
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:justify-between">
          {/* Left - Logo */}
          <div className="flex-1"></div>

          {/* Center - Logo */}
          <div className="flex justify-center">
            <button
              onClick={() => handleNavigate('home')}
              className="hover:opacity-80 transition-opacity"
            >
              <img
                src="/logo_ouarda.jpg"
                alt="OUARDATIE"
                className="rounded-md"
                style={{ width: '220px', height: '55px', objectFit: 'cover' }}
              />
            </button>
          </div>

          {/* Right - All Navigation & Actions */}
          <div className="flex-1 flex items-center justify-end gap-6">
            <button
              onClick={() => handleNavigate('home')}
              className={`text-sm tracking-wide transition-colors ${
                currentPage === 'home'
                  ? 'text-gray-800 border-b border-gray-800'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {t.home}
            </button>
            <button
              onClick={() => handleNavigate('shop')}
              className={`text-sm tracking-wide transition-colors ${
                currentPage === 'shop'
                  ? 'text-gray-800 border-b border-gray-800'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {t.shop}
            </button>
            <button
              onClick={() => handleNavigate('about')}
              className={`text-sm tracking-wide transition-colors ${
                currentPage === 'about'
                  ? 'text-gray-800 border-b border-gray-800'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {t.about}
            </button>

            {/* Language Dropdown */}
            {onLanguageChange && (
              <div className="relative group">
                <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors flex items-center gap-1">
                  {language.toUpperCase()}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute right-0 mt-1 w-24 bg-white rounded-md shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <button
                    onClick={() => handleLanguageChange('en')}
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                      language === 'en' ? 'bg-gray-100 font-medium' : ''
                    }`}
                  >
                    EN
                  </button>
                  <button
                    onClick={() => handleLanguageChange('fr')}
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                      language === 'fr' ? 'bg-gray-100 font-medium' : ''
                    }`}
                  >
                    FR
                  </button>
                  <button
                    onClick={() => handleLanguageChange('ar')}
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors rounded-b-md ${
                      language === 'ar' ? 'bg-gray-100 font-medium' : ''
                    }`}
                  >
                    AR
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={() => handleNavigate('cart')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gray-800 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </div>
              <span className="text-sm tracking-wide">{t.cart} {totalPrice} DZD</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="flex md:hidden items-center justify-between">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>

          <button
            onClick={() => handleNavigate('home')}
            className="hover:opacity-80 transition-opacity"
          >
            <img
              src="/logo_ouarda.jpg"
              alt="OUARDATIE"
              className="rounded-md"
              style={{ width: '160px', height: '45px', objectFit: 'cover' }}
            />
          </button>

          <button
            onClick={() => handleNavigate('cart')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-gray-800 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </div>
            <span className="text-sm tracking-wide">{t.cart} {totalPrice} DZD</span>
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-100 pt-4">
            <div className="flex flex-col space-y-4">
              <button
                onClick={() => handleNavigate('home')}
                className={`text-left text-sm tracking-wide transition-colors ${
                  currentPage === 'home'
                    ? 'text-gray-800 font-medium'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {t.home}
              </button>
              <button
                onClick={() => handleNavigate('shop')}
                className={`text-left text-sm tracking-wide transition-colors ${
                  currentPage === 'shop'
                    ? 'text-gray-800 font-medium'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {t.shop}
              </button>
              <button
                onClick={() => handleNavigate('about')}
                className={`text-left text-sm tracking-wide transition-colors ${
                  currentPage === 'about'
                    ? 'text-gray-800 font-medium'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {t.about}
              </button>

              {/* Mobile Language Selector */}
              {onLanguageChange && (
                <div className="pt-2 border-t border-gray-100">
                  <p className="text-xs text-gray-500 mb-2">Language</p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleLanguageChange('en')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        language === 'en'
                          ? 'bg-gray-800 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      EN
                    </button>
                    <button
                      onClick={() => handleLanguageChange('fr')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        language === 'fr'
                          ? 'bg-gray-800 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      FR
                    </button>
                    <button
                      onClick={() => handleLanguageChange('ar')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        language === 'ar'
                          ? 'bg-gray-800 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      AR
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}