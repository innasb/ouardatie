import { ShoppingBag, Menu, X, Search, User, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { supabase } from '../lib/supabase';

const navTranslations = {
  en: {
    home: 'Home',
    shop: 'Shop',
    about: 'About',
    cart: 'Cart',
    account: 'Account',
    logout: 'Logout',
    login: 'Login',
  },
  fr: {
    home: 'Accueil',
    shop: 'Boutique',
    about: 'À Propos',
    cart: 'Panier',
    account: 'Compte',
    logout: 'Déconnexion',
    login: 'Connexion',
  },
  ar: {
    home: 'الرئيسية',
    shop: 'المتجر',
    about: 'من نحن',
    cart: 'السلة',
    account: 'الحساب',
    logout: 'تسجيل الخروج',
    login: 'تسجيل الدخول',
  },
};

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  language?: 'en' | 'fr' | 'ar';
  onLanguageChange?: (lang: 'en' | 'fr' | 'ar') => void;
  onSearch?: (query: string) => void;
}

export default function Navbar({
  currentPage,
  onNavigate,
  language = 'en',
  onLanguageChange,
  onSearch,
}: NavbarProps) {
  const { totalItems, totalPrice } = useCart();
  const t = navTranslations[language];
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Check authentication status
  useEffect(() => {
    checkUser();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          loadUserProfile(session.user.id);
        } else {
          setUser(null);
          setUserProfile(null);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUser(user);
      loadUserProfile(user.id);
    }
  };

  const loadUserProfile = async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (data) {
      setUserProfile(data);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setUserProfile(null);
    setShowUserMenu(false);
    setIsMenuOpen(false);
    onNavigate('home');
  };

  const handleNavigate = (page: string) => {
    onNavigate(page);
    setIsMenuOpen(false);
    setShowUserMenu(false);
  };

  const handleLanguageChange = (lang: 'en' | 'fr' | 'ar') => {
    onLanguageChange?.(lang);
    setIsMenuOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate('shop');
      if (onSearch) {
        onSearch(searchQuery);
      }
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  const getUserDisplayName = () => {
    if (userProfile?.full_name) {
      return userProfile.full_name.split(' ')[0]; // First name only
    }
    return user?.email?.split('@')[0] || 'User';
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:justify-between">
          {/* Left - Logo */}
          <div className="flex-1 flex items-center gap-4">
            {/* Search Icon for Desktop */}
            <div className="relative">
              {isSearchOpen ? (
                <form onSubmit={handleSearch} className="flex items-center gap-2 animate-in fade-in duration-200">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search..."
                      className="w-56 pl-10 pr-3 py-2 text-sm bg-gray-50 border-0 rounded-full focus:outline-none focus:ring-1 focus:ring-gray-300 focus:bg-white transition-all"
                      autoFocus
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* User Authentication */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span className="text-sm font-medium">{getUserDisplayName()}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {showUserMenu && (
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-100 py-1">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-800">{userProfile?.full_name || 'User'}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      {t.logout}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => handleNavigate('auth')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <User className="w-5 h-5" />
                <span className="text-sm">{t.login}</span>
              </button>
            )}
          </div>

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

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => handleNavigate('cart')}
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gray-800 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-100 pt-4">
            <div className="flex flex-col space-y-4">
              {/* User Section */}
              {user ? (
                <div className="pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-2 mb-3">
                    <User className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">{userProfile?.full_name || 'User'}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left text-sm text-red-600 hover:text-red-700 transition-colors flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    {t.logout}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleNavigate('auth')}
                  className="text-left text-sm tracking-wide text-gray-600 hover:text-gray-800 transition-colors flex items-center gap-2 pb-4 border-b border-gray-100"
                >
                  <User className="w-4 h-4" />
                  {t.login}
                </button>
              )}
              
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

        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-100 pt-4">
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full pl-10 pr-3 py-2 text-sm bg-gray-50 border-0 rounded-full focus:outline-none focus:ring-1 focus:ring-gray-300 focus:bg-white transition-all"
                  autoFocus
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsSearchOpen(false);
                  setSearchQuery('');
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </form>
          </div>
        )}
      </div>
    </nav>
  );
}