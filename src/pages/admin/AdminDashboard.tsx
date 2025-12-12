import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

const allTranslations = {
  en: {
    loading: 'Loading your garden...',
    currency: 'DZD',
    'dashboard.title': 'Dashboard',
    'dashboard.welcome': 'Welcome back to OUARDATIE · Your garden is blooming',
    signOut: 'Sign Out',
    'stats.totalOrders': 'Total Orders',
    'stats.pendingOrders': 'Pending Orders',
    'stats.pendingBadge': 'Active',
    'stats.totalRevenue': 'Total Revenue',
    'stats.totalProducts': 'Total Products',
    'stats.productsSubtitle': 'In catalog',
    'revenue.title': 'Revenue Trend',
    'revenue.subtitle': 'Last 7 days',
    'revenue.noData': 'No revenue data yet',
    'revenue.order_one': 'order',
    'revenue.order_other': 'orders',
    'status.title': 'Order Status',
    'status.total': 'Total Orders',
    'status.pending': 'Pending',
    'status.confirmed': 'Confirmed',
    'status.shipped': 'Shipped',
    'status.delivered': 'Delivered',
    'status.canceled': 'Canceled',
    'status.noOrders': 'No orders yet',
    'dailyOrders.title': 'Daily Orders',
    'dailyOrders.noData': 'No order data yet',
    'recentOrders.title': 'Recent Orders',
    'recentOrders.noOrders': 'No orders yet',
    'nav.products': 'Products',
    'nav.productsDesc': 'Manage your bloom collection',
    'nav.orders': 'Orders',
    'nav.ordersDesc': 'View and manage orders',
    'nav.shipping': 'Shipping',
    'nav.shippingDesc': 'Configure shipping options',
    'nav.users': 'Users',
    'nav.usersDesc': 'Manage your customer base',
  },
  fr: {
    loading: 'Chargement de votre jardin...',
    currency: 'DZD',
    'dashboard.title': 'Tableau de bord',
    'dashboard.welcome': 'Bienvenue à OUARDATIE · Votre jardin est en fleur',
    signOut: 'Se déconnecter',
    'stats.totalOrders': 'Commandes totales',
    'stats.pendingOrders': 'Commandes en attente',
    'stats.pendingBadge': 'Actif',
    'stats.totalRevenue': 'Revenu total',
    'stats.totalProducts': 'Produits totaux',
    'stats.productsSubtitle': 'En catalogue',
    'revenue.title': 'Tendance des revenus',
    'revenue.subtitle': 'Les 7 derniers jours',
    'revenue.noData': 'Aucune donnée de revenu pour le moment',
    'revenue.order_one': 'commande',
    'revenue.order_other': 'commandes',
    'status.title': 'Statut des commandes',
    'status.total': 'Commandes totales',
    'status.pending': 'En attente',
    'status.confirmed': 'Confirmée',
    'status.shipped': 'Expédiée',
    'status.delivered': 'Livrée',
    'status.canceled': 'Annulée',
    'status.noOrders': 'Aucune commande pour le moment',
    'dailyOrders.title': 'Commandes quotidiennes',
    'dailyOrders.noData': 'Aucune donnée de commande pour le moment',
    'recentOrders.title': 'Commandes récentes',
    'recentOrders.noOrders': 'Aucune commande pour le moment',
    'nav.products': 'Produits',
    'nav.productsDesc': 'Gérez votre collection florale',
    'nav.orders': 'Commandes',
    'nav.ordersDesc': 'Voir et gérer les commandes',
    'nav.shipping': 'Livraison',
    'nav.shippingDesc': 'Configurer les options de livraison',
    'nav.users': 'Utilisateurs',
    'nav.usersDesc': 'Gérez votre base de clients',
  },
  ar: {
    loading: 'جاري تحميل حديقتك...',
    currency: 'د.ج',
    'dashboard.title': 'لوحة التحكم',
    'dashboard.welcome': 'مرحبًا بك مجددًا في وردتي · حديقتك مزدهرة',
    signOut: 'تسجيل الخروج',
    'stats.totalOrders': 'إجمالي الطلبات',
    'stats.pendingOrders': 'طلبات معلقة',
    'stats.pendingBadge': 'نشط',
    'stats.totalRevenue': 'إجمالي الإيرادات',
    'stats.totalProducts': 'إجمالي المنتجات',
    'stats.productsSubtitle': 'في الكتالوج',
    'revenue.title': 'مؤشر الإيرادات',
    'revenue.subtitle': 'آخر 7 أيام',
    'revenue.noData': 'لا توجد بيانات إيرادات حتى الآن',
    'revenue.order_one': 'طلب',
    'revenue.order_other': 'طلبات',
    'status.title': 'حالة الطلبات',
    'status.total': 'إجمالي الطلبات',
    'status.pending': 'معلقة',
    'status.confirmed': 'مؤكدة',
    'status.shipped': 'تم الشحن',
    'status.delivered': 'تم التوصيل',
    'status.canceled': 'ملغاة',
    'status.noOrders': 'لا توجد طلبات بعد',
    'dailyOrders.title': 'الطلبات اليومية',
    'dailyOrders.noData': 'لا توجد بيانات طلبات بعد',
    'recentOrders.title': 'الطلبات الأخيرة',
    'recentOrders.noOrders': 'لا توجد طلبات بعد',
    'nav.products': 'المنتجات',
    'nav.productsDesc': 'إدارة مجموعة أزهارك',
    'nav.orders': 'الطلبات',
    'nav.ordersDesc': 'عرض وإدارة الطلبات',
    'nav.shipping': 'الشحن',
    'nav.shippingDesc': 'تكوين خيارات الشحن',
    'nav.users': 'المستخدمين',
    'nav.usersDesc': 'إدارة قاعدة عملائك',
  },
};

interface Stats {
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  totalProducts: number;
  recentOrders: Array<{
    id: string;
    customer_name: string;
    total_amount: number;
    status: string;
    created_at: string;
  }>;
  ordersByStatus: {
    pending: number;
    confirmed: number;
    shipped: number;
    delivered: number;
    canceled: number;
  };
  revenueData: Array<{
    date: string;
    revenue: number;
    orders: number;
  }>;
}

interface AdminDashboardProps {
  onNavigate: (section: string) => void;
}

type Language = 'en' | 'fr' | 'ar';

export default function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const { signOut } = useAuth();
  const [language, setLanguage] = useState<Language>('en');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const t = (key: string): string => {
    const translations = allTranslations[language] as Record<string, string>;
    return translations[key] || key;
  };
  const changeLanguage = (newLang: Language) => {
    if (newLang === language) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setLanguage(newLang);
      setTimeout(() => setIsTransitioning(false), 300);
    }, 300);
  };

  useEffect(() => {
    document.body.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const [stats, setStats] = useState<Stats>({
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    recentOrders: [],
    ordersByStatus: {
      pending: 0,
      confirmed: 0,
      shipped: 0,
      delivered: 0,
      canceled: 0,
    },
    revenueData: [],
  });
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    loadStats();
    setTimeout(() => setMounted(true), 50);
  }, [language]);

  const loadStats = async () => {
    setLoading(true);
    const [ordersRes, productsRes] = await Promise.all([
      supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false }),
      supabase.from('products').select('id', { count: 'exact' }),
    ]);

  if (ordersRes.data) {
      const orders = ordersRes.data;
      const totalRevenue = orders
        .filter((o) => o.status === 'delivered')
        .reduce((sum, o) => sum + o.total_amount, 0);

      const ordersByStatus = {
        pending: orders.filter((o) => o.status === 'pending').length,
        confirmed: orders.filter((o) => o.status === 'confirmed').length,
        shipped: orders.filter((o) => o.status === 'shipped').length,
        delivered: orders.filter((o) => o.status === 'delivered').length,
        canceled: orders.filter((o) => o.status === 'canceled').length,
      };

      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return date.toISOString().split('T')[0];
      });

      const revenueByDay = last7Days.map((date) => {
        const dayOrders = orders.filter(
          (o) => o.created_at.startsWith(date) && o.status !== 'canceled'
        );
        const revenue = dayOrders.reduce((sum, o) => sum + o.total_amount, 0);
        return {
          date: new Date(date).toLocaleDateString(language, {
            month: 'short',
            day: 'numeric',
          }),
          revenue: Math.round(revenue),
          orders: dayOrders.length,
        };
      });

      setStats({
        totalOrders: orders.length,
        pendingOrders: ordersByStatus.pending,
        totalRevenue,
        totalProducts: productsRes.count || 0,
        recentOrders: orders.slice(0, 6),
        ordersByStatus,
        revenueData: revenueByDay,
      });
    }
    setLoading(false);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FAF9F7] via-[#F5F1EB] to-[#E8E3DC] flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50"
              style={{ animation: `fadeInUp 0.6s ease-out ${i * 0.1}s both` }}
            >
              <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg w-3/4 mb-4 animate-shimmer bg-[length:200%_100%]"></div>
              <div className="h-10 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg w-1/2 animate-shimmer bg-[length:200%_100%]"></div>
            </div>
          ))}
          <p className="text-center text-gray-600 text-sm font-light mt-8 animate-pulse">
            🌸 {t('loading')}
          </p>
        </div>
        <style>{`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
          .animate-shimmer { animation: shimmer 2s infinite linear; }
        `}</style>
      </div>
    );
  }

  const maxRevenue = Math.max(...stats.revenueData.map((d) => d.revenue), 1);
  const totalOrders = Object.values(stats.ordersByStatus).reduce(
    (a, b) => a + b,
    0
  );

  const statusData = [
    {
      name: t('status.pending'),
      value: stats.ordersByStatus.pending,
      color: '#F59E0B',
      textColor: 'text-amber-700',
      bgColor: 'bg-amber-50',
      gradient: 'from-amber-400 to-amber-600',
    },
    {
      name: t('status.confirmed'),
      value: stats.ordersByStatus.confirmed,
      color: '#3B82F6',
      textColor: 'text-blue-700',
      bgColor: 'bg-blue-50',
      gradient: 'from-blue-400 to-blue-600',
    },
    {
      name: t('status.shipped'),
      value: stats.ordersByStatus.shipped,
      color: '#8B5CF6',
      textColor: 'text-purple-700',
      bgColor: 'bg-purple-50',
      gradient: 'from-purple-400 to-purple-600',
    },
    {
      name: t('status.delivered'),
      value: stats.ordersByStatus.delivered,
      color: '#10B981',
      textColor: 'text-green-700',
      bgColor: 'bg-green-50',
      gradient: 'from-green-400 to-green-600',
    },
    {
      name: t('status.canceled'),
      value: stats.ordersByStatus.canceled,
      color: '#EF4444',
      textColor: 'text-red-700',
      bgColor: 'bg-red-50',
      gradient: 'from-red-400 to-red-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF9F7] via-[#F5F1EB] to-[#E8E3DC] p-4 md:p-8 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-green-200/20 rounded-full blur-3xl animate-float-slow"></div>
      </div>

      <div
        className={`max-w-7xl mx-auto relative z-10 transition-all duration-1000 ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        } ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
        style={{
          transition: 'opacity 300ms ease-in-out, transform 300ms ease-in-out',
        }}
      >
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-1">
            <h1 className="font-bold text-3xl md:text-5xl bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 bg-clip-text text-transparent animate-gradient">
              {t('dashboard.title')}
            </h1>
            <p className="text-gray-600 text-xs md:text-sm flex items-center gap-2">
              <span className="hidden sm:inline">{t('dashboard.welcome')}</span>
              <span className="sm:hidden">OUARDATIE</span>
            </p>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-2 rounded-xl shadow-lg border border-gray-200/50">
              {['en', 'fr', 'ar'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => changeLanguage(lang as Language)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all duration-300 ${
                    language === lang
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md scale-105'
                      : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>

            <button
              onClick={handleSignOut}
              className="group flex items-center gap-2 px-5 py-2.5 bg-white/80 backdrop-blur-sm text-gray-700 text-sm hover:bg-white transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl border border-gray-200/50 hover:scale-105 active:scale-95"
            >
              <svg
                className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span className="font-medium">{t('signOut')}</span>
            </button>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 hover:scale-105 active:scale-95 transition-all duration-300"
          >
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {isMobileMenuOpen && (
          <div
            className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40 animate-fadeIn"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        <div
          className={`md:hidden fixed top-0 ${
            language === 'ar' ? 'left-0' : 'right-0'
          } h-full w-72 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out ${
            isMobileMenuOpen
              ? 'translate-x-0'
              : language === 'ar'
              ? '-translate-x-full'
              : 'translate-x-full'
          }`}
        >
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">Menu</h2>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Language
              </p>
              <div className="grid grid-cols-3 gap-2">
                {['en', 'fr', 'ar'].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      changeLanguage(lang as Language);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`py-2.5 text-sm font-bold rounded-lg transition-all duration-300 ${
                      language === lang
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg scale-105'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-4">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                Navigation
              </p>
              {[
                {
                  title: t('nav.products'),
                  icon: '🌸',
                  onClick: () => onNavigate('products'),
                },
                {
                  title: t('nav.orders'),
                  icon: '📦',
                  onClick: () => onNavigate('orders'),
                },
                {
                  title: t('nav.shipping'),
                  icon: '🚚',
                  onClick: () => onNavigate('shipping'),
                },
              ].map((item, i) => (
                <button
                  key={i}
                  onClick={() => {
                    item.onClick();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-300 text-left"
                >
                  <span className="text-2xl">{item.icon}</span>
                  <span className="font-semibold text-gray-800">
                    {item.title}
                  </span>
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                handleSignOut();
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 p-4 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-all duration-300 font-semibold"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              {t('signOut')}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          {[
            {
              title: t('stats.totalOrders'),
              value: stats.totalOrders.toLocaleString(language),
              icon: '📦',
              gradient: 'from-slate-400 to-slate-600',
              iconBg: 'bg-gradient-to-br from-slate-100 to-slate-200',
              delay: '0s',
            },
            {
              title: t('stats.pendingOrders'),
              value: stats.pendingOrders.toLocaleString(language),
              icon: '⏰',
              gradient: 'from-amber-400 to-amber-600',
              iconBg: 'bg-gradient-to-br from-amber-50 to-amber-100',
              badge: t('stats.pendingBadge'),
              delay: '0.1s',
            },
            {
              title: t('stats.totalRevenue'),
              value: `${stats.totalRevenue.toLocaleString(language)} ${t(
                'currency'
              )}`,
              icon: '💰',
              gradient: 'from-green-400 to-green-600',
              iconBg: 'bg-gradient-to-br from-green-50 to-green-100',
              delay: '0.2s',
            },
            {
              title: t('stats.totalProducts'),
              value: stats.totalProducts.toLocaleString(language),
              icon: '🌸',
              gradient: 'from-purple-400 to-purple-600',
              iconBg: 'bg-gradient-to-br from-purple-50 to-purple-100',
              subtitle: t('stats.productsSubtitle'),
              delay: '0.3s',
            },
          ].map((card, i) => (
            <div
              key={i}
              className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/50 hover:scale-105 hover:-translate-y-2 cursor-pointer"
              style={{
                animation: `slideInUp 0.6s ease-out ${card.delay} both`,
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`w-14 h-14 ${card.iconBg} rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-md`}
                >
                  {card.icon}
                </div>
                {card.badge && (
                  <span className="text-xs text-amber-600 font-semibold bg-amber-100 px-3 py-1.5 rounded-full animate-pulse">
                    {card.badge}
                  </span>
                )}
              </div>
              <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">
                {card.title}
              </p>
              <p
                className={`text-3xl font-bold bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent`}
              >
                {card.value}
              </p>
              {card.subtitle && (
                <p className="text-xs text-gray-400 mt-2 font-medium">
                  {card.subtitle}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-500">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-2xl text-gray-800 flex items-center gap-2">
                <span className="text-2xl">📈</span>
                {t('revenue.title')}
              </h2>
              <span className="text-xs text-gray-600 bg-gray-100 px-4 py-2 rounded-full font-semibold">
                {t('revenue.subtitle')}
              </span>
            </div>
            {stats.revenueData.length > 0 ? (
              <div className="space-y-5">
                {stats.revenueData.map((item, i) => (
                  <div
                    key={i}
                    className="group"
                    style={{
                      animation: `fadeIn 0.6s ease-out ${i * 0.1}s both`,
                    }}
                  >
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="text-gray-700 font-bold">
                        {item.date}
                      </span>
                      <div className="flex items-center gap-4">
                        <span className="text-gray-600 font-medium">
                          {item.orders.toLocaleString(language)}{' '}
                          {item.orders === 1
                            ? t('revenue.order_one')
                            : t('revenue.order_other')}
                        </span>
                        <span className="text-gray-800 font-bold">
                          {item.revenue.toLocaleString(language)}{' '}
                          {t('currency')}
                        </span>
                      </div>
                    </div>
                    <div className="h-3 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full overflow-hidden shadow-inner">
                      <div
                        className="h-full bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 rounded-full transition-all duration-1000 ease-out relative overflow-hidden group-hover:shadow-lg"
                        style={{
                          width: `${Math.max(
                            (item.revenue / maxRevenue) * 100,
                            2
                          )}%`,
                          animationDelay: `${i * 0.1}s`,
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer-slow"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-gray-400">
                <div className="text-6xl mb-4 animate-bounce">📊</div>
                <p className="font-medium">{t('revenue.noData')}</p>
              </div>
            )}
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-500">
            <h2 className="font-bold text-2xl text-gray-800 mb-6 flex items-center gap-2">
              <span className="text-2xl">📊</span>
              {t('status.title')}
            </h2>
            {totalOrders > 0 ? (
              <>
                <div className="flex items-center justify-center mb-8">
                  <div className="relative w-48 h-48">
                    <svg
                      className="w-full h-full transform -rotate-90"
                      viewBox="0 0 192 192"
                      style={{
                        filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))',
                      }}
                    >
                      {statusData.map((item, index) => {
                        const percentage = item.value / totalOrders;
                        const radius = 70;
                        const circumference = 2 * Math.PI * radius;
                        const dashLength = percentage * circumference;
                        const gapLength = circumference - dashLength;
                        const previousPercentages = statusData
                          .slice(0, index)
                          .reduce((sum, s) => sum + s.value / totalOrders, 0);
                        const rotation = previousPercentages * circumference;

                        return (
                          <circle
                            key={index}
                            cx="96"
                            cy="96"
                            r={radius}
                            fill="none"
                            stroke={item.color}
                            strokeWidth="28"
                            strokeDasharray={`${dashLength} ${gapLength}`}
                            strokeLinecap="round"
                            className="transition-all duration-1000"
                            style={{
                              strokeDashoffset: -rotation,
                              animation: `drawCircleSegment 1.5s ease-out ${
                                index * 0.2
                              }s both`,
                            }}
                          />
                        );
                      })}
                      <circle
                        cx="96"
                        cy="96"
                        r="50"
                        fill="white"
                        className="drop-shadow-lg"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <p className="text-3xl font-bold text-gray-800 animate-count">
                        {totalOrders.toLocaleString(language)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 font-semibold">
                        {t('status.total')}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  {statusData.map((item, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-3 rounded-xl ${item.bgColor} transition-all duration-300 hover:shadow-md hover:scale-105 cursor-pointer`}
                      style={{
                        animation: `slideInRight 0.6s ease-out ${
                          index * 0.1
                        }s both`,
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded-full shadow-md"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className={`text-sm font-bold ${item.textColor}`}>
                          {item.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xl font-bold ${item.textColor}`}>
                          {item.value.toLocaleString(language)}
                        </span>
                        <span className="text-xs text-gray-500 font-semibold">
                          ({Math.round((item.value / totalOrders) * 100)}%)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-16 text-gray-400">
                <div className="text-6xl mb-4 animate-bounce">📦</div>
                <p className="font-medium">{t('status.noOrders')}</p>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-500">
            <h2 className="font-bold text-2xl text-gray-800 mb-6 flex items-center gap-2">
              <span className="text-2xl">📊</span>
              {t('dailyOrders.title')}
            </h2>
           {stats.revenueData.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-end justify-between gap-3 px-2" style={{ height: '240px' }}>
                  {stats.revenueData.map((item, i) => {
                    const maxOrders = Math.max(
                      ...stats.revenueData.map((d) => d.orders),
                      1
                    );
                    const height = Math.max((item.orders / maxOrders) * 100, 5);
                    return (
                      <div
                        key={i}
                        className="flex-1 flex flex-col items-center justify-end group"
                        style={{
                          animation: `growUp 0.8s ease-out ${i * 0.1}s both`,
                          height: '100%'
                        }}
                      >
                        <div className="relative w-full flex flex-col items-center justify-end" style={{ height: `${height}%`, minHeight: '12px' }}>
                          <span className="absolute -top-7 text-sm font-bold text-gray-800 opacity-0 group-hover:opacity-100 group-hover:-translate-y-1 transition-all duration-300">
                            {item.orders.toLocaleString(language)}
                          </span>
                          <div
                            className="w-full h-full bg-gradient-to-t from-blue-600 via-blue-500 to-blue-400 rounded-t-xl transition-all duration-700 hover:from-blue-700 hover:via-blue-600 hover:to-blue-500 relative overflow-hidden shadow-xl group-hover:shadow-2xl"
                          >
                            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-white/30"></div>
                            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between px-2">
                  {stats.revenueData.map((item, i) => (
                    <div key={i} className="flex-1 text-center">
                      <span className="text-xs text-gray-600 font-bold">
                        {item.date.split(' ')[1] || item.date.split('/')[0]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-16 text-gray-400">
                <div className="text-6xl mb-4 animate-bounce">📊</div>
                <p className="font-medium">{t('dailyOrders.noData')}</p>
              </div>
            )}
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-500">
            <h2 className="font-bold text-2xl text-gray-800 mb-6 flex items-center gap-2">
              <span className="text-2xl">🛍️</span>
              {t('recentOrders.title')}
            </h2>
            <div className="space-y-2 max-h-72 overflow-y-auto custom-scrollbar">
              {stats.recentOrders.length > 0 ? (
                stats.recentOrders.map((order, i) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between py-3 px-4 rounded-xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all duration-300 border border-transparent hover:border-gray-200 hover:shadow-md cursor-pointer group"
                    style={{
                      animation: `fadeInLeft 0.6s ease-out ${i * 0.1}s both`,
                    }}
                  >
                    <div className="space-y-1 flex-1">
                      <p className="text-gray-800 font-bold text-sm group-hover:text-gray-900">
                        {order.customer_name}
                      </p>
                      <p className="text-gray-500 text-xs flex items-center gap-1 font-medium">
                        <span className="text-sm">📅</span>
                        {new Date(order.created_at).toLocaleDateString(
                          language,
                          { month: 'short', day: 'numeric', year: 'numeric' }
                        )}
                      </p>
                    </div>
                    <div className="text-right space-y-1 ml-4">
                      <p className="text-gray-800 text-sm font-bold">
                        {order.total_amount.toLocaleString(language)}{' '}
                        <span className="text-gray-500 text-xs font-medium">
                          {t('currency')}
                        </span>
                      </p>
                      <span
                        className={`text-xs px-3 py-1.5 rounded-full font-bold inline-block ${
                          order.status === 'pending'
                            ? 'bg-gradient-to-r from-amber-100 to-amber-200 text-amber-700'
                            : order.status === 'confirmed'
                            ? 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700'
                            : order.status === 'shipped'
                            ? 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700'
                            : order.status === 'delivered'
                            ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-700'
                            : 'bg-gradient-to-r from-red-100 to-red-200 text-red-700'
                        }`}
                      >
                        {t(`status.${order.status}`)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-16 text-gray-400">
                  <div className="text-6xl mb-4 animate-bounce">🛍️</div>
                  <p className="font-medium">{t('recentOrders.noOrders')}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: t('nav.products'),
              icon: '🌸',
              gradient: 'from-purple-400 to-purple-600',
              description: t('nav.productsDesc'),
              onClick: () => onNavigate('products'),
              delay: '0s',
            },
            {
              title: t('nav.orders'),
              icon: '📦',
              gradient: 'from-blue-400 to-blue-600',
              description: t('nav.ordersDesc'),
              onClick: () => onNavigate('orders'),
              delay: '0.1s',
            },
            {
              title: t('nav.shipping'),
              icon: '🚚',
              gradient: 'from-green-400 to-green-600',
              description: t('nav.shippingDesc'),
              onClick: () => onNavigate('shipping'),
              delay: '0.2s',
            },
            {
              title: t('nav.users'),
              icon: '👥',
              gradient: 'from-orange-400 to-orange-600',
              description: t('nav.usersDesc'),
              onClick: () => onNavigate('users'),
              delay: '0.3s',
            },
          ].map((button, i) => (
            <button
              key={i}
              onClick={button.onClick}
              className="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 text-left border border-white/50 hover:scale-105 hover:-translate-y-2 active:scale-95"
              style={{
                animation: `fadeInUp 0.6s ease-out ${button.delay} both`,
              }}
            >
              <div className="text-5xl mb-6 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 inline-block">
                {button.icon}
              </div>
              <h3
                className={`font-bold text-2xl mb-3 bg-gradient-to-r ${button.gradient} bg-clip-text text-transparent`}
              >
                {button.title}
              </h3>
              <p className="text-gray-600 text-sm font-medium leading-relaxed">
                {button.description}
              </p>
            </button>
          ))} </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeInLeft {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes growUp {
          from { transform: scaleY(0); transform-origin: bottom; }
          to { transform: scaleY(1); transform-origin: bottom; }
        }
        @keyframes drawCircleSegment {
          from { stroke-dasharray: 0 440; }
          to { }
        }
        @keyframes shimmer-slow {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(30px, -30px) scale(1.1); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-30px, 30px) scale(1.05); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(20px, -20px) rotate(5deg); }
        }
        @keyframes wave {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(20deg); }
          75% { transform: rotate(-10deg); }
        }
        @keyframes sparkle {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }
        @keyframes count {
          from { opacity: 0; transform: scale(0.5); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-fadeInScale {
          animation: fadeInScale 0.3s ease-out;
        }
        .animate-shimmer-slow {
          animation: shimmer-slow 3s infinite;
        }
        .animate-float {
          animation: float 20s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 25s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: float-slow 30s ease-in-out infinite;
        }
        .animate-wave {
          animation: wave 2s ease-in-out infinite;
        }
        .animate-sparkle {
          animation: sparkle 2s ease-in-out infinite;
        }
        .animate-count {
          animation: count 0.8s ease-out;
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #a855f7, #8b5cf6);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #9333ea, #7c3aed);
        }
        
        [dir='rtl'] .animate-float {
          animation-name: float-rtl;
        }
        [dir='rtl'] .animate-float-delayed {
          animation-name: float-delayed-rtl;
        }
        [dir='rtl'] .animate-wave {
          animation-name: wave-rtl;
        }
        
        @keyframes float-rtl {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-30px, -30px) scale(1.1); }
        }
        @keyframes float-delayed-rtl {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(30px, 30px) scale(1.05); }
        }
        @keyframes wave-rtl {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-20deg); }
          75% { transform: rotate(10deg); }
        }
      `}</style>
    </div>
  );
}
