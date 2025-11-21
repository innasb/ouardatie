import { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';

// Import the Commune type
type ShippingOption = Database['public']['Tables']['shipping_options']['Row'];
type Commune = Database['public']['Tables']['communes']['Row'];

const translations = {
  en: {
    title: 'Checkout',
    empty: 'Your cart is empty',
    continueShopping: 'CONTINUE SHOPPING',
    confirmed: 'Order Confirmed',
    thankYou: 'Thank you for your order!',
    orderId: 'Order ID',
    confirmMsg:
      "We've received your order and will contact you shortly to confirm the details. You will receive a call on the phone number you provided.",
    backHome: 'BACK TO HOME',
    shippingInfo: 'Shipping Information',
    fullName: 'Full Name',
    phone: 'Phone Number',
    wilaya: 'Wilaya',
    selectWilaya: 'Select Wilaya',
    commune: 'Commune',
    selectCommune: 'Select Commune', // Added
    shippingType: 'Shipping Type',
    deskDelivery: 'Desk Delivery',
    homeDelivery: 'Home Delivery',
    paymentMethod: 'Payment Method',
    cashOnDelivery: 'Cash on Delivery',
    cardPayment: 'Card Payment',
    placeOrder: 'PLACE ORDER',
    placingOrder: 'PLACING ORDER...',
    orderSummary: 'Order Summary',
    qty: 'Qty',
    subtotal: 'Subtotal',
    shipping: 'Shipping',
    total: 'Total',
    noImage: 'No Image',
  },
  fr: {
    title: 'Paiement',
    empty: 'Votre panier est vide',
    continueShopping: 'CONTINUER VOS ACHATS',
    confirmed: 'Commande Confirmée',
    thankYou: 'Merci pour votre commande!',
    orderId: 'N° de Commande',
    confirmMsg:
      'Nous avons reçu votre commande et vous contacterons bientôt pour confirmer les détails. Vous recevrez un appel sur le numéro de téléphone que vous avez fourni.',
    backHome: "RETOUR À L'ACCUEIL",
    shippingInfo: 'Informations de Livraison',
    fullName: 'Nom Complet',
    phone: 'Numéro de Téléphone',
    wilaya: 'Wilaya',
    selectWilaya: 'Sélectionner Wilaya',
    commune: 'Commune',
    selectCommune: 'Sélectionner Commune', // Added
    shippingType: 'Type de Livraison',
    deskDelivery: 'Livraison au Bureau',
    homeDelivery: 'Livraison à Domicile',
    paymentMethod: 'Mode de Paiement',
    cashOnDelivery: 'Paiement à la Livraison',
    cardPayment: 'Paiement par Carte',
    placeOrder: 'PASSER LA COMMANDE',
    placingOrder: 'TRAITEMENT...',
    orderSummary: 'Résumé de Commande',
    qty: 'Qté',
    subtotal: 'Sous-total',
    shipping: 'Livraison',
    total: 'Total',
    noImage: "Pas d'image",
  },
  ar: {
    title: 'إتمام الطلب',
    empty: 'سلة التسوق فارغة',
    continueShopping: 'متابعة التسوق',
    confirmed: 'تم تأكيد الطلب',
    thankYou: 'شكراً لطلبك!',
    orderId: 'رقم الطلب',
    confirmMsg:
      'لقد استلمنا طلبك وسنتصل بك قريباً لتأكيد التفاصيل. ستتلقى مكالمة على رقم الهاتف الذي قدمته.',
    backHome: 'العودة للرئيسية',
    shippingInfo: 'معلومات الشحن',
    fullName: 'الاسم الكامل',
    phone: 'رقم الهاتف',
    wilaya: 'الولاية',
    selectWilaya: 'اختر الولاية',
    commune: 'البلدية',
    selectCommune: 'اختر البلدية', // Added
    shippingType: 'نوع الشحن',
    deskDelivery: 'التوصيل للمكتب',
    homeDelivery: 'التوصيل للمنزل',
    paymentMethod: 'طريقة الدفع',
    cashOnDelivery: 'الدفع عند الاستلام',
    cardPayment: 'الدفع بالبطاقة',
    placeOrder: 'تأكيد الطلب',
    placingOrder: 'جاري المعالجة...',
    orderSummary: 'ملخص الطلب',
    qty: 'الكمية',
    subtotal: 'المجموع الفرعي',
    shipping: 'الشحن',
    total: 'المجموع',
    noImage: 'لا توجد صورة',
  },
};

interface CheckoutPageProps {
  onNavigate: (page: string) => void;
  language?: 'en' | 'fr' | 'ar';
}

export default function CheckoutPage({
  onNavigate,
  language = 'en',
}: CheckoutPageProps) {
  const { items, totalPrice, clearCart } = useCart();
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);

  // Add state for communes
  const [allCommunes, setAllCommunes] = useState<Commune[]>([]);
  const [filteredCommunes, setFilteredCommunes] = useState<Commune[]>([]);

  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string>('');

  const t = translations[language];

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    wilaya: '',
    commune: '',
    shippingType: 'desk' as 'desk' | 'home',
    paymentMethod: 'cash' as 'card' | 'cash',
  });

  useEffect(() => {
    // Load both shipping options and all communes on component mount
    const loadData = async () => {
      // Load shipping options
      const { data: shippingData } = await supabase
        .from('shipping_options')
        .select('*')
        .order('wilaya');
      if (shippingData) setShippingOptions(shippingData);

      // Load all communes
      const { data: communesData } = await supabase
        .from('communes')
        .select('*')
        .order('commune_name');
      if (communesData) setAllCommunes(communesData);
    };

    loadData();
  }, []);

  // New useEffect to filter communes when wilaya changes
  useEffect(() => {
    if (!formData.wilaya || !allCommunes.length) {
      setFilteredCommunes([]);
      // Reset commune when wilaya changes
      if (formData.commune) {
        setFormData((prev) => ({ ...prev, commune: '' }));
      }
      return;
    }

    const normalize = (str: string) =>
      str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()
        .toLowerCase();

    const selectedWilayaNormalized = normalize(formData.wilaya);

    const communesForWilaya = allCommunes.filter((commune) => {
      const communeWilayaNormalized = normalize(commune.wilaya);
      return communeWilayaNormalized === selectedWilayaNormalized;
    });

    console.log('Selected Wilaya:', formData.wilaya);
    console.log('Total communes in DB:', allCommunes.length);
    console.log('Filtered communes:', communesForWilaya.length);
    console.log(
      'Sample commune wilayas:',
      allCommunes.slice(0, 5).map((c) => c.wilaya)
    );

    setFilteredCommunes(communesForWilaya);

    // Reset commune selection when wilaya changes
    if (formData.commune) {
      setFormData((prev) => ({ ...prev, commune: '' }));
    }
  }, [formData.wilaya, allCommunes]);
  const selectedWilaya = shippingOptions.find(
    (opt) => opt.wilaya === formData.wilaya
  );
  const shippingCost = selectedWilaya
    ? formData.shippingType === 'desk'
      ? selectedWilaya.desk_price
      : selectedWilaya.home_price
    : 0;

  const total = totalPrice + shippingCost;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      alert('Your cart is empty');
      return;
    }

    if (!formData.wilaya) {
      alert('Please select a wilaya');
      return;
    }

    // Add check for commune
    if (!formData.commune) {
      alert('Please select a commune');
      return;
    }

    setLoading(true);

    try {
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_name: formData.fullName,
          customer_phone: formData.phone,
          wilaya: formData.wilaya,
          commune: formData.commune,
          shipping_type: formData.shippingType,
          shipping_cost: shippingCost,
          total_amount: total,
          payment_method: formData.paymentMethod,
          status: 'pending',
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.productId,
        product_name: item.name,
        product_price: item.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      clearCart();
      setOrderId(order.id);
      setOrderSuccess(true);
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0 && !orderSuccess) {
    return (
      <div className="min-h-screen bg-[#F5F3EF] pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-6 text-center py-20">
          <h1 className="font-serif text-4xl text-gray-800 mb-6 tracking-wide">
            {t.title}
          </h1>
          <p className="text-gray-600 mb-8">{t.empty}</p>
          <button
            onClick={() => onNavigate('shop')}
            className="px-10 py-3 bg-gray-800 text-white text-sm tracking-widest hover:bg-gray-700 transition-all"
          >
            {t.continueShopping}
          </button>
        </div>
      </div>
    );
  }

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-[#F5F3EF] pt-24 pb-16">
        <div className="max-w-2xl mx-auto px-6">
          <div className="bg-white rounded-sm p-12 text-center shadow-sm">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h1 className="font-serif text-4xl text-gray-800 mb-4 tracking-wide">
              {t.confirmed}
            </h1>

            <p className="text-gray-600 mb-2">{t.thankYou}</p>

            <p className="text-sm text-gray-500 mb-8">
              {t.orderId}:{' '}
              <span className="font-medium text-gray-700">{orderId}</span>
            </p>

            <div className="bg-gray-50 rounded-sm p-6 mb-8">
              <p className="text-sm text-gray-600 leading-relaxed">
                {t.confirmMsg}
              </p>
            </div>

            <button
              onClick={() => onNavigate('home')}
              className="px-10 py-3 bg-gray-800 text-white text-sm tracking-widest hover:bg-gray-700 transition-all"
            >
              {t.backHome}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F3EF] pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-6">
        <h1
          className={`font-serif text-4xl text-gray-800 mb-12 tracking-wide ${
            language === 'ar' ? 'text-right' : 'text-left'
          }`}
          dir={language === 'ar' ? 'rtl' : 'ltr'}
        >
          {t.title}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <form
            onSubmit={handleSubmit}
            className="lg:col-span-2 bg-white rounded-sm p-8"
          >
            <h2
              className={`font-serif text-2xl text-gray-800 mb-6 tracking-wide ${
                language === 'ar' ? 'text-right' : 'text-left'
              }`}
              dir={language === 'ar' ? 'rtl' : 'ltr'}
            >
              {t.shippingInfo}
            </h2>

            <div className="space-y-6">
              <div>
                <label
                  className={`block text-sm text-gray-600 mb-2 tracking-wide ${
                    language === 'ar' ? 'text-right' : 'text-left'
                  }`}
                  dir={language === 'ar' ? 'rtl' : 'ltr'}
                >
                  {t.fullName}
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:border-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2 tracking-wide">
                  {t.phone}
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:border-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2 tracking-wide">
                  {t.wilaya}
                </label>
                <select
                  required
                  value={formData.wilaya}
                  onChange={(e) =>
                    setFormData({ ...formData, wilaya: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:border-gray-400"
                >
                  <option value="">{t.selectWilaya}</option>
                  {shippingOptions.map((opt) => (
                    <option key={opt.id} value={opt.wilaya}>
                      {opt.wilaya}
                    </option>
                  ))}
                </select>
              </div>

              {/* Updated Commune Field */}
              <div>
                <label className="block text-sm text-gray-600 mb-2 tracking-wide">
                  {t.commune}
                </label>
                <select
                  required
                  value={formData.commune}
                  onChange={(e) =>
                    setFormData({ ...formData, commune: e.target.value })
                  }
                  // Disable dropdown if no wilaya is selected
                  disabled={!formData.wilaya}
                  className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:border-gray-400 disabled:bg-gray-100"
                >
                  <option value="">{t.selectCommune}</option>
                  {filteredCommunes.map((commune) => (
                    <option key={commune.id} value={commune.commune_name}>
                      {commune.commune_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-3 tracking-wide">
                  {t.shippingType}
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, shippingType: 'desk' })
                    }
                    className={`py-4 border rounded-sm transition-all ${
                      formData.shippingType === 'desk'
                        ? 'border-gray-800 bg-gray-800 text-white'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="text-sm tracking-wide">
                      {t.deskDelivery}
                    </div>
                    {selectedWilaya && (
                      <div className="text-xs mt-1 opacity-75">
                        {selectedWilaya.desk_price} DZD
                      </div>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, shippingType: 'home' })
                    }
                    className={`py-4 border rounded-sm transition-all ${
                      formData.shippingType === 'home'
                        ? 'border-gray-800 bg-gray-800 text-white'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="text-sm tracking-wide">
                      {t.homeDelivery}
                    </div>
                    {selectedWilaya && (
                      <div className="text-xs mt-1 opacity-75">
                        {selectedWilaya.home_price} DZD
                      </div>
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-3 tracking-wide">
                  {t.paymentMethod}
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, paymentMethod: 'cash' })
                    }
                    className={`py-4 border rounded-sm text-sm tracking-wide transition-all ${
                      formData.paymentMethod === 'cash'
                        ? 'border-gray-800 bg-gray-800 text-white'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {t.cashOnDelivery}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, paymentMethod: 'card' })
                    }
                    className={`py-4 border rounded-sm text-sm tracking-wide transition-all ${
                      formData.paymentMethod === 'card'
                        ? 'border-gray-800 bg-gray-800 text-white'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {t.cardPayment}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-8 py-4 bg-gray-800 text-white text-sm tracking-widest hover:bg-gray-700 transition-all disabled:bg-gray-400"
            >
              {loading ? t.placingOrder : t.placeOrder}
            </button>
          </form>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-sm p-6 sticky top-24">
              <h2 className="font-serif text-2xl text-gray-800 mb-6 tracking-wide">
                {t.orderSummary}
              </h2>

              <div className="space-y-4 mb-6">
                {items.map((item, idx) => (
                  <div key={idx} className="flex gap-3 text-sm">
                    <div className="w-16 h-16 bg-gray-100 rounded-sm overflow-hidden flex-shrink-0">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                          {t.noImage}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-800 font-medium">{item.name}</p>
                      <p className="text-gray-600 text-xs">
                        {item.color} / {item.size}
                      </p>
                      <p className="text-gray-600 text-xs">
                        {t.qty}: {item.quantity}
                      </p>
                    </div>
                    <p className="text-gray-800">
                      {item.price * item.quantity} DZD
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-3 py-6 border-t border-b border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{t.subtotal}</span>
                  <span className="text-gray-800">{totalPrice} DZD</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{t.shipping}</span>
                  <span className="text-gray-800">{shippingCost} DZD</span>
                </div>
              </div>

              <div className="flex justify-between text-lg font-medium mt-6">
                <span className="text-gray-800">{t.total}</span>
                <span className="text-gray-800">{total} DZD</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
