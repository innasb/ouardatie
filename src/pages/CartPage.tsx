import { Trash2, Minus, Plus } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

const translations = {
  en: {
    title: 'Your Cart',
    empty: 'Your cart is empty',
    continueShopping: 'CONTINUE SHOPPING',
    color: 'Color',
    size: 'Size',
    orderSummary: 'Order Summary',
    subtotal: 'Subtotal',
    shipping: 'Shipping',
    shippingCalc: 'Calculated at checkout',
    total: 'Total',
    checkout: 'PROCEED TO CHECKOUT',
    noImage: 'No Image',
  },
  fr: {
    title: 'Votre Panier',
    empty: 'Votre panier est vide',
    continueShopping: 'CONTINUER VOS ACHATS',
    color: 'Couleur',
    size: 'Taille',
    orderSummary: 'Résumé de Commande',
    subtotal: 'Sous-total',
    shipping: 'Livraison',
    shippingCalc: 'Calculé au paiement',
    total: 'Total',
    checkout: 'PASSER AU PAIEMENT',
    noImage: "Pas d'image",
  },
  ar: {
    title: 'سلة التسوق',
    empty: 'سلة التسوق فارغة',
    continueShopping: 'متابعة التسوق',
    color: 'اللون',
    size: 'المقاس',
    orderSummary: 'ملخص الطلب',
    subtotal: 'المجموع الفرعي',
    shipping: 'الشحن',
    shippingCalc: 'يتم حسابه عند الدفع',
    total: 'المجموع',
    checkout: 'إتمام الطلب',
    noImage: 'لا توجد صورة',
  },
};

interface CartPageProps {
  onNavigate: (page: string) => void;
  language?: 'en' | 'fr' | 'ar';
}

export default function CartPage({
  onNavigate,
  language = 'en',
}: CartPageProps) {
  const { items, removeItem, updateQuantity, totalPrice } = useCart();
  const t = translations[language];

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#F5F3EF] pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center py-12 sm:py-20">
          <h1 className="font-serif text-3xl sm:text-4xl text-gray-800 mb-6 tracking-wide">
            {t.title}
          </h1>
          <p className="text-gray-600 mb-8">{t.empty}</p>
          <button
            onClick={() => onNavigate('shop')}
            className="px-8 sm:px-10 py-3 bg-gray-800 text-white text-xs sm:text-sm tracking-widest hover:bg-gray-700 transition-all"
          >
            {t.continueShopping}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F3EF] pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <h1 className="font-serif text-3xl sm:text-4xl text-gray-800 mb-8 sm:mb-12 tracking-wide">
          {t.title}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, idx) => (
              <div key={idx} className="bg-white rounded-sm p-4 sm:p-6">
                {/* Mobile Layout */}
                <div className="flex flex-col sm:hidden gap-4">
                  <div className="flex gap-4">
                    <div className="w-20 h-20 bg-gray-100 rounded-sm overflow-hidden flex-shrink-0">
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

                    <div className="flex-1 min-w-0">
                      <h3 className="font-serif text-base text-gray-800 mb-2 truncate">
                        {item.name}
                      </h3>
                      <div className="text-xs text-gray-600 space-y-1">
                        <p>
                          {t.color}: {item.color}
                        </p>
                        <p>
                          {t.size}: {item.size}
                        </p>
                        <p className="font-medium text-sm">{item.price} DZD</p>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        removeItem(item.productId, item.size, item.color)
                      }
                      className="text-gray-400 hover:text-red-500 transition-colors h-fit"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.productId,
                            item.size,
                            item.color,
                            item.quantity - 1
                          )
                        }
                        className="w-7 h-7 border border-gray-300 rounded-sm hover:bg-gray-100 transition-colors flex items-center justify-center"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.productId,
                            item.size,
                            item.color,
                            item.quantity + 1
                          )
                        }
                        className="w-7 h-7 border border-gray-300 rounded-sm hover:bg-gray-100 transition-colors flex items-center justify-center"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="text-sm font-medium text-gray-800">
                      {item.price * item.quantity} DZD
                    </p>
                  </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden sm:flex gap-6">
                  <div className="w-24 h-24 bg-gray-100 rounded-sm overflow-hidden flex-shrink-0">
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
                    <h3 className="font-serif text-lg text-gray-800 mb-2">
                      {item.name}
                    </h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>
                        {t.color}: {item.color}
                      </p>
                      <p>
                        {t.size}: {item.size}
                      </p>
                      <p className="font-medium">{item.price} DZD</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() =>
                        removeItem(item.productId, item.size, item.color)
                      }
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.productId,
                            item.size,
                            item.color,
                            item.quantity - 1
                          )
                        }
                        className="w-8 h-8 border border-gray-300 rounded-sm hover:bg-gray-100 transition-colors flex items-center justify-center"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.productId,
                            item.size,
                            item.color,
                            item.quantity + 1
                          )
                        }
                        className="w-8 h-8 border border-gray-300 rounded-sm hover:bg-gray-100 transition-colors flex items-center justify-center"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <p className="text-sm font-medium text-gray-800">
                      {item.price * item.quantity} DZD
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-sm p-4 sm:p-6 lg:sticky lg:top-24">
              <h2 className="font-serif text-xl sm:text-2xl text-gray-800 mb-4 sm:mb-6 tracking-wide">
                {t.orderSummary}
              </h2>

              <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{t.subtotal}</span>
                  <span className="text-gray-800">{totalPrice} DZD</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{t.shipping}</span>
                  <span className="text-gray-800 text-xs sm:text-sm">
                    {t.shippingCalc}
                  </span>
                </div>
              </div>

              <div className="flex justify-between text-base sm:text-lg font-medium mb-4 sm:mb-6">
                <span className="text-gray-800">{t.total}</span>
                <span className="text-gray-800">{totalPrice} DZD</span>
              </div>

              <button
                onClick={() => onNavigate('checkout')}
                className="w-full py-3 sm:py-4 bg-gray-800 text-white text-xs sm:text-sm tracking-widest hover:bg-gray-700 transition-all"
              >
                {t.checkout}
              </button>

              <button
                onClick={() => onNavigate('shop')}
                className="w-full mt-3 sm:mt-4 py-3 sm:py-4 border border-gray-300 text-gray-800 text-xs sm:text-sm tracking-widest hover:bg-gray-100 transition-all"
              >
                {t.continueShopping}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
