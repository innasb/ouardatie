import { useEffect, useState } from 'react';
import { ArrowLeft, Download, Eye, X, Menu } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Database } from '../../lib/database.types';

type Order = Database['public']['Tables']['orders']['Row'];
type OrderItem = Database['public']['Tables']['order_items']['Row'];

interface OrderWithItems extends Order {
  items: OrderItem[];
}

interface AdminOrdersProps {
  onNavigate: (section: string) => void;
}

type Language = 'en' | 'fr' | 'ar';

const translations = {
  en: {
    title: 'Orders',
    back: 'Back',
    exportConfirmed: 'Export Confirmed',
    exportAll: 'Export All',
    all: 'All',
    pending: 'Pending',
    confirmed: 'Confirmed',
    shipped: 'Shipped',
    delivered: 'Delivered',
    canceled: 'Canceled',
    loading: 'Loading...',
    noOrders: 'No orders found',
    orderId: 'Order ID',
    customer: 'Customer',
    date: 'Date',
    total: 'Total',
    status: 'Status',
    actions: 'Actions',
    orderDetails: 'Order Details',
    customerInfo: 'Customer Information',
    name: 'Name',
    phone: 'Phone',
    wilaya: 'Wilaya',
    commune: 'Commune',
    shipping: 'Shipping',
    payment: 'Payment',
    orderItems: 'Order Items',
    subtotal: 'Subtotal',
    shippingCost: 'Shipping',
    updateStatus: 'Update Status',
    currency: 'DZD',
    close: 'Close',
    menu: 'Menu',
    updateSuccess: 'Order status updated successfully',
    updateError: 'Error updating order status',
  },
  fr: {
    title: 'Commandes',
    back: 'Retour',
    exportConfirmed: 'Exporter Confirmées',
    exportAll: 'Tout Exporter',
    all: 'Toutes',
    pending: 'En attente',
    confirmed: 'Confirmée',
    shipped: 'Expédiée',
    delivered: 'Livrée',
    canceled: 'Annulée',
    loading: 'Chargement...',
    noOrders: 'Aucune commande trouvée',
    orderId: 'ID Commande',
    customer: 'Client',
    date: 'Date',
    total: 'Total',
    status: 'Statut',
    actions: 'Actions',
    orderDetails: 'Détails de la commande',
    customerInfo: 'Informations client',
    name: 'Nom',
    phone: 'Téléphone',
    wilaya: 'Wilaya',
    commune: 'Commune',
    shipping: 'Livraison',
    payment: 'Paiement',
    orderItems: 'Articles commandés',
    subtotal: 'Sous-total',
    shippingCost: 'Livraison',
    updateStatus: 'Mettre à jour le statut',
    currency: 'DZD',
    close: 'Fermer',
    menu: 'Menu',
    updateSuccess: 'Statut de commande mis à jour avec succès',
    updateError: 'Erreur lors de la mise à jour du statut',
  },
  ar: {
    title: 'الطلبات',
    back: 'رجوع',
    exportConfirmed: 'تصدير المؤكدة',
    exportAll: 'تصدير الكل',
    all: 'الكل',
    pending: 'معلقة',
    confirmed: 'مؤكدة',
    shipped: 'تم الشحن',
    delivered: 'تم التوصيل',
    canceled: 'ملغاة',
    loading: 'جاري التحميل...',
    noOrders: 'لا توجد طلبات',
    orderId: 'رقم الطلب',
    customer: 'العميل',
    date: 'التاريخ',
    total: 'المجموع',
    status: 'الحالة',
    actions: 'الإجراءات',
    orderDetails: 'تفاصيل الطلب',
    customerInfo: 'معلومات العميل',
    name: 'الاسم',
    phone: 'الهاتف',
    wilaya: 'الولاية',
    commune: 'البلدية',
    shipping: 'الشحن',
    payment: 'الدفع',
    orderItems: 'المنتجات',
    subtotal: 'المجموع الفرعي',
    shippingCost: 'الشحن',
    updateStatus: 'تحديث الحالة',
    currency: 'د.ج',
    close: 'إغلاق',
    menu: 'القائمة',
    updateSuccess: 'تم تحديث حالة الطلب بنجاح',
    updateError: 'خطأ في تحديث حالة الطلب',
  },
};

export default function AdminOrders({ onNavigate }: AdminOrdersProps) {
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<OrderWithItems | null>(
    null
  );
  const [language, setLanguage] = useState<Language>('en');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const t = (key: string): string => {
    return translations[language][key] || key;
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

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    const { data: ordersData } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (ordersData) {
      const ordersWithItems = await Promise.all(
        ordersData.map(async (order) => {
          const { data: items } = await supabase
            .from('order_items')
            .select('*')
            .eq('order_id', order.id);

          return { ...order, items: items || [] };
        })
      );

      setOrders(ordersWithItems);
    }
    setLoading(false);
  };

  const updateOrderStatus = async (
    orderId: string,
    newStatus: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'canceled'
  ) => {
    try {
      // Get the order details first
      const order = orders.find((o) => o.id === orderId);
      if (!order) {
        alert(t('updateError'));
        return;
      }

      const oldStatus = order.status;

      // Update the order status
      const { error: orderError } = await supabase
        .from('orders')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', orderId);

      if (orderError) {
        alert(t('updateError'));
        console.error('Error updating order:', orderError);
        return;
      }

      // Handle purchase tracking for user orders
      if (order.user_id) {
        // If order is being canceled (and wasn't canceled before), decrement purchase stats
        if (newStatus === 'canceled' && oldStatus !== 'canceled') {
          const { data: profile } = await supabase
            .from('profiles')
            .select('total_purchases, total_spent')
            .eq('id', order.user_id)
            .single();

          if (profile) {
            await supabase
              .from('profiles')
              .update({
                total_purchases: Math.max(0, (profile.total_purchases || 0) - 1),
                total_spent: Math.max(0, (profile.total_spent || 0) - order.total_amount),
                updated_at: new Date().toISOString(),
              })
              .eq('id', order.user_id);
          }
        }

        // If order is being un-canceled (was canceled, now not), increment purchase stats back
        if (oldStatus === 'canceled' && newStatus !== 'canceled') {
          const { data: profile } = await supabase
            .from('profiles')
            .select('total_purchases, total_spent')
            .eq('id', order.user_id)
            .single();

          if (profile) {
            await supabase
              .from('profiles')
              .update({
                total_purchases: (profile.total_purchases || 0) + 1,
                total_spent: (profile.total_spent || 0) + order.total_amount,
                updated_at: new Date().toISOString(),
              })
              .eq('id', order.user_id);
          }
        }

        // Update last_purchase_date when order is delivered
        if (newStatus === 'delivered') {
          await supabase
            .from('profiles')
            .update({
              last_purchase_date: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq('id', order.user_id);
        }
      }

      // Reload orders to reflect changes
      await loadOrders();

      // Update selected order if it's the one being modified
      if (selectedOrder?.id === orderId) {
        const updatedOrder = orders.find((o) => o.id === orderId);
        if (updatedOrder) {
          setSelectedOrder({ ...updatedOrder, status: newStatus });
        }
      }

      // Show success message
      console.log(t('updateSuccess'));
    } catch (error) {
      console.error('Error in updateOrderStatus:', error);
      alert(t('updateError'));
    }
  };

  const exportToCSV = (ordersToExport: OrderWithItems[]) => {
    const headers = [
      t('orderId'),
      t('name'),
      t('phone'),
      t('wilaya'),
      t('commune'),
      t('shipping'),
      t('payment'),
      t('status'),
      t('orderItems'),
      t('subtotal'),
      t('shippingCost'),
      t('total'),
      t('date'),
    ];

    const rows = ordersToExport.map((order) => [
      order.id,
      order.customer_name,
      order.customer_phone,
      order.wilaya,
      order.commune,
      order.shipping_type,
      order.payment_method,
      t(order.status),
      order.items
        .map(
          (item) =>
            `${item.product_name} (${item.color}/${item.size}) x${item.quantity}`
        )
        .join('; '),
      order.total_amount - order.shipping_cost,
      order.shipping_cost,
      order.total_amount,
      new Date(order.created_at).toLocaleDateString(language),
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const filteredOrders =
    filterStatus === 'all'
      ? orders
      : orders.filter((o) => o.status === filterStatus);

  const confirmedOrders = orders.filter((o) => o.status === 'confirmed');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'confirmed':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'shipped':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'delivered':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'canceled':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF9F7] via-[#F5F1EB] to-[#E8E3DC] p-4 md:p-8">
      <div
        className={`max-w-7xl mx-auto transition-all duration-300 ${
          isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('dashboard')}
              className="p-2 hover:bg-white/50 rounded-xl transition-all"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <h1 className="font-bold text-3xl md:text-4xl bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 bg-clip-text text-transparent">
              {t('title')}
            </h1>
          </div>

          {/* Desktop: Language + Export */}
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
              onClick={() => exportToCSV(confirmedOrders)}
              disabled={confirmedOrders.length === 0}
              className="flex items-center gap-2 px-5 py-2.5 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl hover:bg-white transition-all disabled:opacity-50 shadow-lg"
            >
              <Download className="w-4 h-4" />
              <span className="text-sm font-medium">
                {t('exportConfirmed')}
              </span>
            </button>

            <button
              onClick={() => exportToCSV(filteredOrders)}
              disabled={filteredOrders.length === 0}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-gray-800 to-gray-700 text-white rounded-xl hover:shadow-xl transition-all disabled:opacity-50 shadow-lg"
            >
              <Download className="w-4 h-4" />
              <span className="text-sm font-medium">{t('exportAll')}</span>
            </button>
          </div>

          {/* Mobile: Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div
            className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        <div
          className={`md:hidden fixed top-0 ${
            language === 'ar' ? 'left-0' : 'right-0'
          } h-full w-72 bg-white shadow-2xl z-50 transform transition-transform duration-300 ${
            isMobileMenuOpen
              ? 'translate-x-0'
              : language === 'ar'
              ? '-translate-x-full'
              : 'translate-x-full'
          }`}
        >
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b">
              <h2 className="text-xl font-bold">{t('menu')}</h2>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-bold text-gray-500 uppercase">
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
                    className={`py-2.5 text-sm font-bold rounded-lg transition-all ${
                      language === lang
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-4">
              <p className="text-xs font-bold text-gray-500 uppercase mb-3">
                Export
              </p>
              <button
                onClick={() => {
                  exportToCSV(confirmedOrders);
                  setIsMobileMenuOpen(false);
                }}
                disabled={confirmedOrders.length === 0}
                className="w-full flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all disabled:opacity-50"
              >
                <Download className="w-5 h-5" />
                <span className="font-semibold">{t('exportConfirmed')}</span>
              </button>
              <button
                onClick={() => {
                  exportToCSV(filteredOrders);
                  setIsMobileMenuOpen(false);
                }}
                disabled={filteredOrders.length === 0}
                className="w-full flex items-center gap-3 p-4 bg-gray-800 text-white hover:bg-gray-700 rounded-xl transition-all disabled:opacity-50"
              >
                <Download className="w-5 h-5" />
                <span className="font-semibold">{t('exportAll')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 mb-6 shadow-lg border border-white/50">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[
              { key: 'all', count: orders.length },
              {
                key: 'pending',
                count: orders.filter((o) => o.status === 'pending').length,
              },
              {
                key: 'confirmed',
                count: orders.filter((o) => o.status === 'confirmed').length,
              },
              {
                key: 'shipped',
                count: orders.filter((o) => o.status === 'shipped').length,
              },
              {
                key: 'delivered',
                count: orders.filter((o) => o.status === 'delivered').length,
              },
              {
                key: 'canceled',
                count: orders.filter((o) => o.status === 'canceled').length,
              },
            ].map(({ key, count }) => (
              <button
                key={key}
                onClick={() => setFilterStatus(key)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                  filterStatus === key
                    ? 'bg-gradient-to-r from-gray-800 to-gray-700 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t(key)} ({count})
              </button>
            ))}
          </div>
        </div>

        {/* Orders Table */}
        {loading ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-20 text-center shadow-lg">
            <div className="text-gray-500 animate-pulse">{t('loading')}</div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-20 text-center shadow-lg">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-gray-500 font-medium">{t('noOrders')}</p>
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg border border-white/50">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      {t('orderId')}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      {t('customer')}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      {t('date')}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      {t('total')}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      {t('status')}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      {t('actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-gray-800 font-mono">
                        {order.id.slice(0, 8)}...
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-800 font-semibold">
                          {order.customer_name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {order.customer_phone}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(order.created_at).toLocaleDateString(
                          language
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800 font-bold">
                        {order.total_amount.toLocaleString(language)}{' '}
                        {t('currency')}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1.5 rounded-full text-xs font-bold border ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {t(order.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
            <div className="bg-white rounded-2xl p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-fadeInScale">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-2xl text-gray-800">
                  {t('orderDetails')}
                </h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-gray-800 mb-3">
                    {t('customerInfo')}
                  </h3>
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 space-y-2 text-sm">
                    <p>
                      <span className="text-gray-600 font-medium">
                        {t('name')}:
                      </span>{' '}
                      <span className="font-semibold">
                        {selectedOrder.customer_name}
                      </span>
                    </p>
                    <p>
                      <span className="text-gray-600 font-medium">
                        {t('phone')}:
                      </span>{' '}
                      <span className="font-semibold">
                        {selectedOrder.customer_phone}
                      </span>
                    </p>
                    <p>
                      <span className="text-gray-600 font-medium">
                        {t('wilaya')}:
                      </span>{' '}
                      <span className="font-semibold">
                        {selectedOrder.wilaya}
                      </span>
                    </p>
                    <p>
                      <span className="text-gray-600 font-medium">
                        {t('commune')}:
                      </span>{' '}
                      <span className="font-semibold">
                        {selectedOrder.commune}
                      </span>
                    </p>
                    <p>
                      <span className="text-gray-600 font-medium">
                        {t('shipping')}:
                      </span>{' '}
                      <span className="font-semibold">
                        {selectedOrder.shipping_type}
                      </span>
                    </p>
                    <p>
                      <span className="text-gray-600 font-medium">
                        {t('payment')}:
                      </span>{' '}
                      <span className="font-semibold">
                        {selectedOrder.payment_method}
                      </span>
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-gray-800 mb-3">
                    {t('orderItems')}
                  </h3>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item) => (
                      <div
                        key={item.id}
                        className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 flex justify-between items-center text-sm"
                      >
                        <div>
                          <p className="font-bold text-gray-800">
                            {item.product_name}
                          </p>
                          <p className="text-gray-600 text-xs mt-1">
                            {item.color} / {item.size} × {item.quantity}
                          </p>
                        </div>
                        <p className="text-gray-800 font-bold">
                          {(item.product_price * item.quantity).toLocaleString(
                            language
                          )}{' '}
                          {t('currency')}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">
                      {t('subtotal')}:
                    </span>
                    <span className="text-gray-800 font-bold">
                      {(
                        selectedOrder.total_amount - selectedOrder.shipping_cost
                      ).toLocaleString(language)}{' '}
                      {t('currency')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">
                      {t('shippingCost')}:
                    </span>
                    <span className="text-gray-800 font-bold">
                      {selectedOrder.shipping_cost.toLocaleString(language)}{' '}
                      {t('currency')}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-base pt-2 border-t border-gray-300">
                    <span className="text-gray-800">{t('total')}:</span>
                    <span className="text-gray-800">
                      {selectedOrder.total_amount.toLocaleString(language)}{' '}
                      {t('currency')}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-gray-800 mb-3">
                    {t('updateStatus')}
                  </h3>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) =>
                      updateOrderStatus(
                        selectedOrder.id,
                        e.target.value as 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'canceled'
                      )
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-all font-medium"
                  >
                    <option value="pending">{t('pending')}</option>
                    <option value="confirmed">{t('confirmed')}</option>
                    <option value="shipped">{t('shipped')}</option>
                    <option value="delivered">{t('delivered')}</option>
                    <option value="canceled">{t('canceled')}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}
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
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-fadeInScale {
          animation: fadeInScale 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}