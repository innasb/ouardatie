import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

const translations = {
  en: {
    title: 'Users Management',
    subtitle: 'Manage your customer base',
    loading: 'Loading users...',
    searchPlaceholder: 'Search by name, phone, or location...',
    filters: 'Filters',
    allUsers: 'All Users',
    admins: 'Admins',
    customers: 'Customers',
    sortBy: 'Sort by',
    newest: 'Newest',
    oldest: 'Oldest',
    mostPurchases: 'Most Purchases',
    highestSpent: 'Highest Spent',
    stats: {
      total: 'Total Users',
      admins: 'Admins',
      active: 'Active Customers',
      inactive: 'No Purchases',
      confirmedOrders: 'Confirmed Orders',
      canceledOrders: 'Canceled Orders',
    },
    table: {
      name: 'Name',
      contact: 'Contact',
      location: 'Location',
      stats: 'Purchase Stats',
      lastOrder: 'Last Order',
      status: 'Status',
      actions: 'Actions',
    },
    orders: 'orders',
    spent: 'spent',
    noOrders: 'No orders yet',
    admin: 'Admin',
    customer: 'Customer',
    viewDetails: 'View Details',
    noUsers: 'No users found',
    noResults: 'No users match your search',
    currency: 'DZD',
    back: 'Back',
    confirmed: 'confirmed',
    canceled: 'canceled',
  },
  fr: {
    title: 'Gestion des utilisateurs',
    subtitle: 'Gérez votre base de clients',
    loading: 'Chargement des utilisateurs...',
    searchPlaceholder: 'Rechercher par nom, téléphone ou lieu...',
    filters: 'Filtres',
    allUsers: 'Tous les utilisateurs',
    admins: 'Administrateurs',
    customers: 'Clients',
    sortBy: 'Trier par',
    newest: 'Plus récent',
    oldest: 'Plus ancien',
    mostPurchases: 'Plus d\'achats',
    highestSpent: 'Plus dépensé',
    stats: {
      total: 'Total utilisateurs',
      admins: 'Administrateurs',
      active: 'Clients actifs',
      inactive: 'Sans achats',
      confirmedOrders: 'Commandes confirmées',
      canceledOrders: 'Commandes annulées',
    },
    table: {
      name: 'Nom',
      contact: 'Contact',
      location: 'Localisation',
      stats: 'Statistiques d\'achat',
      lastOrder: 'Dernière commande',
      status: 'Statut',
      actions: 'Actions',
    },
    orders: 'commandes',
    spent: 'dépensé',
    noOrders: 'Aucune commande',
    admin: 'Admin',
    customer: 'Client',
    viewDetails: 'Voir détails',
    noUsers: 'Aucun utilisateur trouvé',
    noResults: 'Aucun utilisateur ne correspond',
    currency: 'DZD',
    back: 'Retour',
    confirmed: 'confirmées',
    canceled: 'annulées',
  },
  ar: {
    title: 'إدارة المستخدمين',
    subtitle: 'إدارة قاعدة عملائك',
    loading: 'جاري تحميل المستخدمين...',
    searchPlaceholder: 'البحث بالاسم أو الهاتف أو الموقع...',
    filters: 'التصفية',
    allUsers: 'جميع المستخدمين',
    admins: 'المسؤولون',
    customers: 'العملاء',
    sortBy: 'ترتيب حسب',
    newest: 'الأحدث',
    oldest: 'الأقدم',
    mostPurchases: 'الأكثر شراءً',
    highestSpent: 'الأعلى إنفاقًا',
    stats: {
      total: 'إجمالي المستخدمين',
      admins: 'المسؤولون',
      active: 'عملاء نشطون',
      inactive: 'بدون مشتريات',
      confirmedOrders: 'طلبات مؤكدة',
      canceledOrders: 'طلبات ملغاة',
    },
    table: {
      name: 'الاسم',
      contact: 'التواصل',
      location: 'الموقع',
      stats: 'إحصائيات الشراء',
      lastOrder: 'آخر طلب',
      status: 'الحالة',
      actions: 'الإجراءات',
    },
    orders: 'طلبات',
    spent: 'تم الإنفاق',
    noOrders: 'لا توجد طلبات بعد',
    admin: 'مسؤول',
    customer: 'عميل',
    viewDetails: 'عرض التفاصيل',
    noUsers: 'لا يوجد مستخدمون',
    noResults: 'لا يوجد مستخدمون مطابقون',
    currency: 'د.ج',
    back: 'رجوع',
    confirmed: 'مؤكدة',
    canceled: 'ملغاة',
  },
};

interface UserData {
  id: string;
  full_name: string | null;
  phone_number: string | null;
  wilaya: string | null;
  commune: string | null;
  is_admin: boolean;
  created_at: string;
  total_purchases: number;
  total_spent: number;
  last_purchase_date: string | null;
  confirmed_orders: number;
  canceled_orders: number;
}

type Language = 'en' | 'fr' | 'ar';

interface AdminUsersProps {
  onNavigate: (section: string) => void;
}

export default function AdminUsers({ onNavigate }: AdminUsersProps) {
  const [language, setLanguage] = useState<Language>('en');
  const [users, setUsers] = useState<UserData[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'admin' | 'customer'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'purchases' | 'spent'>('newest');
  const [mounted, setMounted] = useState(false);

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };

  useEffect(() => {
    document.body.dir = language === 'ar' ? 'rtl' : 'ltr';
    loadUsers();
    setTimeout(() => setMounted(true), 50);
  }, [language]);

  useEffect(() => {
    applyFilters();
  }, [users, searchTerm, filterType, sortBy]);

  const loadUsers = async () => {
    setLoading(true);
    
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (profilesError) {
      console.error('Error loading profiles:', profilesError);
      setLoading(false);
      return;
    }

    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('user_id, total_amount, created_at, status');

    if (ordersError) {
      console.error('Error loading orders:', ordersError);
    }

    console.log('Raw orders data:', orders);

    const usersWithStats = profiles.map(profile => {
      const userOrders = orders?.filter(o => {
        const matches = o.user_id === profile.id && o.status === 'delivered';
        if (o.user_id === profile.id) {
          console.log(`Order for ${profile.full_name}:`, o.status, matches);
        }
        return matches;
      }) || [];
      
      const confirmedOrders = orders?.filter(o => o.user_id === profile.id && o.status === 'confirmed') || [];
      const canceledOrders = orders?.filter(o => o.user_id === profile.id && o.status === 'canceled') || [];
      
      const totalSpent = userOrders.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);
      const lastOrder = userOrders.length > 0 
        ? [...userOrders].sort((a, b) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          )[0]
        : null;

      console.log(`Stats for ${profile.full_name}:`, {
        orders: userOrders.length,
        spent: totalSpent,
        lastOrder: lastOrder?.created_at,
        confirmed: confirmedOrders.length,
        canceled: canceledOrders.length
      });

      return {
        ...profile,
        total_purchases: userOrders.length,
        total_spent: totalSpent,
        last_purchase_date: lastOrder?.created_at || null,
        confirmed_orders: confirmedOrders.length,
        canceled_orders: canceledOrders.length,
      };
    });

    setUsers(usersWithStats);
    setLoading(false);
  };

  const applyFilters = () => {
    let filtered = [...users];

    if (filterType === 'admin') {
      filtered = filtered.filter(u => u.is_admin);
    } else if (filterType === 'customer') {
      filtered = filtered.filter(u => !u.is_admin);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(u =>
        u.full_name?.toLowerCase().includes(term) ||
        u.phone_number?.toLowerCase().includes(term) ||
        u.wilaya?.toLowerCase().includes(term) ||
        u.commune?.toLowerCase().includes(term)
      );
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'purchases':
          return b.total_purchases - a.total_purchases;
        case 'spent':
          return b.total_spent - a.total_spent;
        default:
          return 0;
      }
    });

    setFilteredUsers(filtered);
  };

  const stats = {
    total: users.length,
    admins: users.filter(u => u.is_admin).length,
    activeCustomers: users.filter(u => !u.is_admin && u.total_purchases > 0).length,
    inactiveCustomers: users.filter(u => !u.is_admin && u.total_purchases === 0).length,
    confirmedOrders: users.reduce((sum, u) => sum + (u.confirmed_orders || 0), 0),
    canceledOrders: users.reduce((sum, u) => sum + (u.canceled_orders || 0), 0),
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FAF9F7] via-[#F5F1EB] to-[#E8E3DC] flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 text-lg font-medium animate-pulse">
            {t('loading')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF9F7] via-[#F5F1EB] to-[#E8E3DC] p-4 md:p-8 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl animate-float-delayed"></div>
      </div>

      <div className={`max-w-7xl mx-auto relative z-10 transition-all duration-1000 ${
        mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigate('')}
                className="p-2 hover:bg-white/50 rounded-xl transition-all duration-300 hover:scale-110"
              >
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <h1 className="font-bold text-3xl md:text-5xl bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 bg-clip-text text-transparent">
                👥 {t('title')}
              </h1>
            </div>
            <p className="text-gray-600 text-sm md:text-base ml-14">{t('subtitle')}</p>
          </div>

          <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-2 rounded-xl shadow-lg border border-gray-200/50">
            {['en', 'fr', 'ar'].map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang as Language)}
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {[
            { title: t('stats.total'), value: stats.total, icon: '👥', color: 'from-blue-400 to-blue-600', bg: 'bg-blue-50' },
            { title: t('stats.admins'), value: stats.admins, icon: '👑', color: 'from-purple-400 to-purple-600', bg: 'bg-purple-50' },
            { title: t('stats.active'), value: stats.activeCustomers, icon: '✅', color: 'from-green-400 to-green-600', bg: 'bg-green-50' },
            { title: t('stats.inactive'), value: stats.inactiveCustomers, icon: '💤', color: 'from-gray-400 to-gray-600', bg: 'bg-gray-50' },
            { title: t('stats.confirmedOrders'), value: stats.confirmedOrders, icon: '✔️', color: 'from-emerald-400 to-emerald-600', bg: 'bg-emerald-50' },
            { title: t('stats.canceledOrders'), value: stats.canceledOrders, icon: '❌', color: 'from-red-400 to-red-600', bg: 'bg-red-50' },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/50 hover:scale-105"
              style={{ animation: `slideInUp 0.6s ease-out ${i * 0.1}s both` }}
            >
              <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center text-2xl mb-4`}>
                {stat.icon}
              </div>
              <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">{stat.title}</p>
              <p className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder={t('searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 pl-12 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <svg className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">{t('filters')}</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="all">{t('allUsers')}</option>
                <option value="admin">{t('admins')}</option>
                <option value="customer">{t('customers')}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">{t('sortBy')}</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="newest">{t('newest')}</option>
                <option value="oldest">{t('oldest')}</option>
                <option value="purchases">{t('mostPurchases')}</option>
                <option value="spent">{t('highestSpent')}</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 overflow-hidden">
          {filteredUsers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      {t('table.name')}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      {t('table.contact')}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      {t('table.location')}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      {t('table.stats')}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      {t('table.lastOrder')}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      {t('table.status')}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.map((user, i) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50 transition-colors duration-200"
                      style={{ animation: `fadeInLeft 0.6s ease-out ${i * 0.05}s both` }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                            {user.full_name?.charAt(0).toUpperCase() || '?'}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">{user.full_name || 'N/A'}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(user.created_at).toLocaleDateString(language, { year: 'numeric', month: 'short', day: 'numeric' })}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm text-gray-800">{user.phone_number || 'N/A'}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          <p className="text-gray-800 font-medium">{user.wilaya || 'N/A'}</p>
                          <p className="text-gray-500">{user.commune || 'N/A'}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">📦</span>
                            <span className="text-sm font-semibold text-gray-800">
                              {user.total_purchases} {t('orders')}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xl">💰</span>
                            <span className="text-sm font-semibold text-green-600">
                              {user.total_spent.toLocaleString(language)} {t('currency')}
                            </span>
                          </div>
                          {user.confirmed_orders > 0 && (
                            <div className="flex items-center gap-2">
                              <span className="text-lg">✔️</span>
                              <span className="text-xs font-semibold text-emerald-600">
                                {user.confirmed_orders} {t('confirmed')}
                              </span>
                            </div>
                          )}
                          {user.canceled_orders > 0 && (
                            <div className="flex items-center gap-2">
                              <span className="text-lg">❌</span>
                              <span className="text-xs font-semibold text-red-600">
                                {user.canceled_orders} {t('canceled')}
                              </span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm text-gray-800">
                          {user.last_purchase_date
                            ? new Date(user.last_purchase_date).toLocaleDateString(language, { year: 'numeric', month: 'short', day: 'numeric' })
                            : t('noOrders')}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1.5 text-xs font-bold rounded-full ${
                            user.is_admin
                              ? 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700'
                              : 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700'
                          }`}
                        >
                          {user.is_admin ? t('admin') : t('customer')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-16 px-4">
              <div className="text-6xl mb-4 animate-bounce">👥</div>
              <p className="text-gray-600 text-lg font-medium">
                {searchTerm ? t('noResults') : t('noUsers')}
              </p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInLeft {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(30px, -30px) scale(1.1); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-30px, 30px) scale(1.05); }
        }
        .animate-float {
          animation: float 20s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 25s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}