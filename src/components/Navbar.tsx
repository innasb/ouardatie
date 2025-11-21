import { ShoppingBag, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../contexts/CartContext';

const navTranslations = {
  en: {
    home: 'Home',
    shop: 'Shop',
    about: 'About',
  },
  fr: {
    home: 'Accueil',
    shop: 'Boutique',
    about: 'À Propos',
  },
  ar: {
    home: 'الرئيسية',
    shop: 'المتجر',
    about: 'من نحن',
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
  const { totalItems } = useCart();
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
        <div className="flex items-center justify-between">
          <button
            onClick={() => handleNavigate('home')}
            className="flex items-center space-x-2 sm:space-x-3 hover:opacity-80 transition-opacity"
          >
            <img
              src="/logo_ouarda.jpg"
              alt="OUARDATIE"
              className="h-10 sm:h-12 w-auto object-contain rounded-md shadow-sm"
            />
            <span className="text-lg sm:text-2xl font-serif tracking-wider text-gray-800">
              OUARDATIE
            </span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
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

            {/* Language Selector */}
            {onLanguageChange && (
              <div className="flex items-center gap-1 bg-gray-100 rounded-full p-1">
                <button
                  onClick={() => handleLanguageChange('en')}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    language === 'en'
                      ? 'bg-white text-gray-800 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => handleLanguageChange('fr')}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    language === 'fr'
                      ? 'bg-white text-gray-800 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  FR
                </button>
                <button
                  onClick={() => handleLanguageChange('ar')}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    language === 'ar'
                      ? 'bg-white text-gray-800 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  AR
                </button>
              </div>
            )}

            <button
              onClick={() => handleNavigate('cart')}
              className="relative text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-gray-800 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          <div className="flex md:hidden items-center gap-3">
            <button
              onClick={() => handleNavigate('cart')}
              className="relative text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-gray-800 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
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
          </div>
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
