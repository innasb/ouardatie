import { useEffect, useState } from 'react';
import { Minus, Plus, ArrowLeft, ShoppingCart, Zap } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';
import { useCart } from '../contexts/CartContext';

type Product = Database['public']['Tables']['products']['Row'];

const translations = {
  en: {
    loading: 'Loading...',
    notFound: 'Product not found',
    backToShop: 'Back to Shop',
    addedToCart: 'Added to cart!',
    success: 'Success!',
    itemAdded: 'Your item has been added to cart',
    redirecting: 'Redirecting to checkout...',
    color: 'Color',
    size: 'Size',
    quantity: 'Quantity',
    addToCart: 'ADD TO CART',
    buyNow: 'BUY NOW',
    youMayLike: 'You May Also Like',
    noImage: 'No Image',
  },
  fr: {
    loading: 'Chargement...',
    notFound: 'Produit non trouvé',
    backToShop: 'Retour à la Boutique',
    addedToCart: 'Ajouté au panier!',
    success: 'Succès!',
    itemAdded: 'Votre article a été ajouté au panier',
    redirecting: 'Redirection vers le paiement...',
    color: 'Couleur',
    size: 'Taille',
    quantity: 'Quantité',
    addToCart: 'AJOUTER AU PANIER',
    buyNow: 'ACHETER MAINTENANT',
    youMayLike: 'Vous Aimerez Aussi',
    noImage: "Pas d'image",
  },
  ar: {
    loading: 'جاري التحميل...',
    notFound: 'المنتج غير موجود',
    backToShop: 'العودة للمتجر',
    addedToCart: 'تمت الإضافة للسلة!',
    success: 'نجح!',
    itemAdded: 'تمت إضافة المنتج إلى السلة',
    redirecting: 'جاري التحويل للدفع...',
    color: 'اللون',
    size: 'المقاس',
    quantity: 'الكمية',
    addToCart: 'أضف للسلة',
    buyNow: 'اشتري الآن',
    youMayLike: 'قد يعجبك أيضاً',
    noImage: 'لا توجد صورة',
  },
};

interface ProductDetailPageProps {
  productId: string;
  onNavigate: (page: string, productId?: string) => void;
  language?: 'en' | 'fr' | 'ar';
}

export default function ProductDetailPage({
  productId,
  onNavigate,
  language = 'en',
}: ProductDetailPageProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState<string>('');
  const [showNotification, setShowNotification] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const { addItem } = useCart();

  const t = translations[language];

  useEffect(() => {
    loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .maybeSingle();

    if (data) {
      setProduct(data);
      setMainImage(data.images[0] || '');
      if (data.available_sizes.length > 0)
        setSelectedSize(data.available_sizes[0]);
      if (data.available_colors.length > 0)
        setSelectedColor(data.available_colors[0]);

      const { data: related } = await supabase
        .from('products')
        .select('*')
        .eq('category_id', data.category_id)
        .neq('id', productId)
        .limit(4);

      if (related) setRelatedProducts(related);
    }
    setLoading(false);
  };

  const handleAddToCart = () => {
    if (!product) return;

    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      size: selectedSize || 'N/A',
      color: selectedColor || 'N/A',
      image: product.images[0] || '',
    });

    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleBuyNow = () => {
    if (!product) return;

    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      size: selectedSize || 'N/A',
      color: selectedColor || 'N/A',
      image: product.images[0] || '',
    });

    setShowSuccessMessage(true);

    setTimeout(() => {
      onNavigate('checkout');
    }, 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F3EF] pt-24 flex items-center justify-center">
        <div
          className={`text-gray-500 ${
            language === 'ar' ? 'text-right' : 'text-left'
          }`}
          dir={language === 'ar' ? 'rtl' : 'ltr'}
        >
          {t.loading}
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#F5F3EF] pt-24 flex flex-col items-center justify-center">
        <p
          className={`text-gray-500 mb-4 ${
            language === 'ar' ? 'text-right' : 'text-left'
          }`}
          dir={language === 'ar' ? 'rtl' : 'ltr'}
        >
          {t.notFound}
        </p>
        <button
          onClick={() => onNavigate('shop')}
          className="text-gray-800 text-sm tracking-wide hover:underline"
        >
          {t.backToShop}
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F3EF] pt-24 pb-16">
      {/* Add to Cart Notification */}
      {showNotification && (
        <div className="fixed top-24 right-6 bg-green-600 text-white px-6 py-3 rounded-sm shadow-lg z-50 animate-fade-in">
          <p
            className={`text-sm tracking-wide ${
              language === 'ar' ? 'text-right' : 'text-left'
            }`}
            dir={language === 'ar' ? 'rtl' : 'ltr'}
          >
            {t.addedToCart}
          </p>
        </div>
      )}

      {/* Buy Now Success Message */}
      {showSuccessMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full text-center animate-fade-in shadow-2xl">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8 text-green-600"
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
            <h3
              className={`font-serif text-2xl text-gray-800 mb-3 tracking-wide ${
                language === 'ar' ? 'text-right' : 'text-left'
              }`}
              dir={language === 'ar' ? 'rtl' : 'ltr'}
            >
              {t.success}
            </h3>
            <p
              className={`text-gray-600 mb-2 ${
                language === 'ar' ? 'text-right' : 'text-left'
              }`}
              dir={language === 'ar' ? 'rtl' : 'ltr'}
            >
              {t.itemAdded}
            </p>
            <p
              className={`text-sm text-gray-500 ${
                language === 'ar' ? 'text-right' : 'text-left'
              }`}
              dir={language === 'ar' ? 'rtl' : 'ltr'}
            >
              {t.redirecting}
            </p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6">
        <button
          onClick={() => onNavigate('shop')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span
            className={`text-sm tracking-wide ${
              language === 'ar' ? 'text-right' : 'text-left'
            }`}
            dir={language === 'ar' ? 'rtl' : 'ltr'}
          >
            {t.backToShop}
          </span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <div>
            <div className="aspect-[3/4] bg-white rounded-sm overflow-hidden mb-4">
              {mainImage ? (
                <img
                  src={mainImage}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className={`w-full h-full flex items-center justify-center text-gray-400 ${
                    language === 'ar' ? 'text-right' : 'text-left'
                  }`}
                  dir={language === 'ar' ? 'rtl' : 'ltr'}
                >
                  {t.noImage}
                </div>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setMainImage(img)}
                    className={`aspect-square bg-white rounded-sm overflow-hidden border-2 transition-colors ${
                      mainImage === img
                        ? 'border-gray-800'
                        : 'border-transparent'
                    }`}
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-sm p-8">
            <h1
              className={`font-serif text-4xl text-gray-800 mb-4 tracking-wide ${
                language === 'ar' ? 'text-right' : 'text-left'
              }`}
              dir={language === 'ar' ? 'rtl' : 'ltr'}
            >
              {product.name}
            </h1>
            <p
              className={`text-2xl text-gray-600 mb-6 ${
                language === 'ar' ? 'text-right' : 'text-left'
              }`}
              dir={language === 'ar' ? 'rtl' : 'ltr'}
            >
              {product.price} DZD
            </p>
            <p
              className={`text-gray-600 leading-relaxed mb-8 ${
                language === 'ar' ? 'text-right' : 'text-left'
              }`}
              dir={language === 'ar' ? 'rtl' : 'ltr'}
            >
              {product.description}
            </p>

            <div className="space-y-6">
              {product.available_colors.length > 0 && (
                <div>
                  <label
                    className={`block text-sm text-gray-600 mb-3 tracking-wide ${
                      language === 'ar' ? 'text-right' : 'text-left'
                    }`}
                    dir={language === 'ar' ? 'rtl' : 'ltr'}
                  >
                    {t.color}
                  </label>
                  <div className="flex gap-3 flex-wrap">
                    {product.available_colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-6 py-2 border rounded-sm text-sm transition-all ${
                          selectedColor === color
                            ? 'border-gray-800 bg-gray-800 text-white'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {product.available_sizes.length > 0 && (
                <div>
                  <label
                    className={`block text-sm text-gray-600 mb-3 tracking-wide ${
                      language === 'ar' ? 'text-right' : 'text-left'
                    }`}
                    dir={language === 'ar' ? 'rtl' : 'ltr'}
                  >
                    {t.size}
                  </label>
                  <div className="flex gap-3 flex-wrap">
                    {product.available_sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`w-12 h-12 border rounded-sm text-sm transition-all ${
                          selectedSize === size
                            ? 'border-gray-800 bg-gray-800 text-white'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label
                  className={`block text-sm text-gray-600 mb-3 tracking-wide ${
                    language === 'ar' ? 'text-right' : 'text-left'
                  }`}
                  dir={language === 'ar' ? 'rtl' : 'ltr'}
                >
                  {t.quantity}
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 border border-gray-300 rounded-sm hover:bg-gray-100 transition-colors"
                  >
                    <Minus className="w-4 h-4 mx-auto" />
                  </button>
                  <span className="text-lg w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 border border-gray-300 rounded-sm hover:bg-gray-100 transition-colors"
                  >
                    <Plus className="w-4 h-4 mx-auto" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <button
                  onClick={handleAddToCart}
                  className="py-4 border-2 border-gray-800 text-gray-800 text-sm tracking-widest hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  {t.addToCart}
                </button>
                <button
                  onClick={handleBuyNow}
                  className="py-4 bg-gray-800 text-white text-sm tracking-widest hover:bg-gray-700 transition-all flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4" />
                  {t.buyNow}
                </button>
              </div>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <section>
            <h2
              className={`font-serif text-3xl text-gray-800 mb-8 tracking-wide ${
                language === 'ar' ? 'text-right' : 'text-left'
              }`}
              dir={language === 'ar' ? 'rtl' : 'ltr'}
            >
              {t.youMayLike}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((prod) => (
                <button
                  key={prod.id}
                  onClick={() => onNavigate('product', prod.id)}
                  className="group bg-white rounded-sm overflow-hidden hover:shadow-lg transition-all duration-300"
                >
                  <div className="aspect-[3/4] bg-gray-100 overflow-hidden">
                    {prod.images[0] ? (
                      <img
                        src={prod.images[0]}
                        alt={prod.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div
                        className={`w-full h-full flex items-center justify-center text-gray-400 ${
                          language === 'ar' ? 'text-right' : 'text-left'
                        }`}
                        dir={language === 'ar' ? 'rtl' : 'ltr'}
                      >
                        {t.noImage}
                      </div>
                    )}
                  </div>
                  <div className="p-6 text-left">
                    <h3
                      className={`font-serif text-lg text-gray-800 mb-2 tracking-wide ${
                        language === 'ar' ? 'text-right' : 'text-left'
                      }`}
                      dir={language === 'ar' ? 'rtl' : 'ltr'}
                    >
                      {prod.name}
                    </h3>
                    <p
                      className={`text-gray-600 text-sm ${
                        language === 'ar' ? 'text-right' : 'text-left'
                      }`}
                      dir={language === 'ar' ? 'rtl' : 'ltr'}
                    >
                      {prod.price} DZD
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
