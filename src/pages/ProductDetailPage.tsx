import { useEffect, useState } from 'react';
import { Minus, Plus, ArrowLeft, ShoppingCart, Zap, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';
import { useCart } from '../contexts/CartContext';

type Product = Database['public']['Tables']['products']['Row'];

interface StockVariant {
  color: string;
  colorHex: string;
  size: string;
  quantity: number;
}

interface ColorOption {
  hex: string;
  name: string;
}

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
    outOfStock: 'Out of Stock',
    outOfStockMessage: 'This product is currently unavailable',
    limitedStock: 'Limited Quantity',
    onlyLeft: 'Only {count} left in stock',
    notifyMe: 'NOTIFY WHEN AVAILABLE',
    unavailable: 'Unavailable',
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
    outOfStock: 'Rupture de Stock',
    outOfStockMessage: 'Ce produit est actuellement indisponible',
    limitedStock: 'Quantité Limitée',
    onlyLeft: 'Plus que {count} en stock',
    notifyMe: 'ME PRÉVENIR',
    unavailable: 'Indisponible',
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
    outOfStock: 'نفذت الكمية',
    outOfStockMessage: 'هذا المنتج غير متوفر حالياً',
    limitedStock: 'كمية محدودة',
    onlyLeft: 'متبقي {count} فقط',
    notifyMe: 'أعلمني عند التوفر',
    unavailable: 'غير متوفر',
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
  const [selectedColor, setSelectedColor] = useState<string>(''); // Stores the hex value
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState<string>('');
  const [showNotification, setShowNotification] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [stockVariants, setStockVariants] = useState<StockVariant[]>([]);
  const [colorOptions, setColorOptions] = useState<ColorOption[]>([]);
  const { addItem } = useCart();

  const t = translations[language];
  const isRTL = language === 'ar';

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
      const firstImage = (data.images && data.images.length > 0 && data.images[0]) ? data.images[0] : '';
      setMainImage(firstImage);
      
      // Parse color options
      let parsedColors: ColorOption[] = [];
      if (data.available_colors && data.available_colors.length > 0) {
        parsedColors = data.available_colors.map((colorStr: string | any) => {
          try {
            // Check if it's already an object
            if (typeof colorStr === 'object' && colorStr !== null && colorStr.hex && colorStr.name) {
              return colorStr as ColorOption;
            }
            // Otherwise parse the JSON string
            const parsed = JSON.parse(colorStr);
            return parsed as ColorOption;
          } catch (e) {
            console.error('Error parsing color:', colorStr, e);
            return null;
          }
        }).filter((c): c is ColorOption => c !== null);
        console.log('Parsed colors:', parsedColors);
        setColorOptions(parsedColors);
      }
      
      // Parse stock variants
      let parsedVariants: StockVariant[] = [];
      if (data.stock_variants && data.stock_variants.length > 0) {
        parsedVariants = data.stock_variants.map((variant: string | any) => {
          try {
            // Check if it's already an object
            if (typeof variant === 'object' && variant !== null && 'quantity' in variant) {
              return variant as StockVariant;
            }
            // Otherwise parse the JSON string
            const parsed = JSON.parse(variant);
            return parsed as StockVariant;
          } catch (e) {
            console.error('Error parsing variant:', variant, e);
            return null;
          }
        }).filter((v): v is StockVariant => v !== null);
        console.log('Parsed variants:', parsedVariants);
        setStockVariants(parsedVariants);
      }
      
      // Set default selections to first available variant
      if (parsedColors.length > 0 && parsedVariants.length > 0) {
        const firstAvailableColor = parsedColors.find(color => 
          parsedVariants.some(v => v.colorHex === color.hex && v.quantity > 0)
        );
        const initialColor = firstAvailableColor ? firstAvailableColor.hex : parsedColors[0].hex;
        setSelectedColor(initialColor);
        
        // Set initial size based on the selected color
        if (data.available_sizes && data.available_sizes.length > 0) {
          const firstAvailableSize = data.available_sizes.find(size => 
            parsedVariants.some(v => v.colorHex === initialColor && v.size === size && v.quantity > 0)
          );
          setSelectedSize(firstAvailableSize || data.available_sizes[0]);
        }
      } else if (parsedColors.length > 0) {
        // No variants system, just set first color
        setSelectedColor(parsedColors[0].hex);
        if (data.available_sizes && data.available_sizes.length > 0) {
          setSelectedSize(data.available_sizes[0]);
        }
      }

      // Only fetch related products if category_id exists
      if (data.category_id) {
        const { data: related } = await supabase
          .from('products')
          .select('*')
          .eq('category_id', data.category_id)
          .neq('id', productId)
          .limit(4);

        if (related) setRelatedProducts(related);
      }
    }
    setLoading(false);
  };

  const getVariantStock = (colorHex: string, size: string): number => {
    const variant = stockVariants.find(
      v => v.colorHex === colorHex && v.size === size
    );
    return variant ? variant.quantity : 0;
  };

  const isColorAvailable = (colorHex: string, variants: StockVariant[]): boolean => {
    if (!variants || variants.length === 0) return true;
    return variants.some(v => v.colorHex === colorHex && v.quantity > 0);
  };

  const isSizeAvailable = (size: string, colorHex: string, variants: StockVariant[]): boolean => {
    if (!variants || variants.length === 0) return true;
    if (!colorHex) return variants.some(v => v.size === size && v.quantity > 0);
    return getVariantStock(colorHex, size) > 0;
  };

  const isCurrentVariantAvailable = (): boolean => {
    if (!selectedColor || !selectedSize) return false;
    if (stockVariants.length === 0) {
      return product?.stock_status !== 'out_of_stock' && (product?.stock_quantity || 0) > 0;
    }
    return getVariantStock(selectedColor, selectedSize) > 0;
  };

  const getCurrentVariantStock = (): number => {
    if (stockVariants.length === 0) {
      return product?.stock_quantity || 0;
    }
    return getVariantStock(selectedColor, selectedSize);
  };

  const isOutOfStock = () => {
    if (!product) return true;
    if (stockVariants.length === 0) {
      const stock = product.stock_quantity || 0;
      return stock === 0 || product.stock_status === 'out_of_stock';
    }
    // Check if ALL variants are out of stock
    return stockVariants.every(v => v.quantity === 0);
  };

  const getMaxQuantity = () => {
    if (!product) return 1;
    const stock = getCurrentVariantStock();
    return stock > 0 ? stock : 1;
  };

  const handleAddToCart = () => {
    if (!product || isOutOfStock()) return;

    const selectedColorName = colorOptions.find(c => c.hex === selectedColor)?.name || selectedColor;

    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      size: selectedSize || 'N/A',
      color: selectedColorName || 'N/A',
      image: (product.images && product.images[0]) || '',
    });

    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleBuyNow = () => {
    if (!product || isOutOfStock()) return;

    const selectedColorName = colorOptions.find(c => c.hex === selectedColor)?.name || selectedColor;

    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      size: selectedSize || 'N/A',
      color: selectedColorName || 'N/A',
      image: (product.images && product.images[0]) || '',
    });

    setShowSuccessMessage(true);

    setTimeout(() => {
      onNavigate('checkout');
    }, 2000);
  };

  const renderStockAlert = () => {
    if (!product) return null;
    
    const stock = getCurrentVariantStock();
    const currentVariantAvailable = isCurrentVariantAvailable();
    
    if (!currentVariantAvailable && selectedColor && selectedSize) {
      return (
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded mb-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-yellow-800">
                {language === 'ar' ? 'هذا المتغير غير متوفر' : language === 'fr' ? 'Cette variante est indisponible' : 'This variant is unavailable'}
              </p>
              <p className="text-xs text-yellow-600 mt-0.5">
                {language === 'ar' ? 'الرجاء اختيار لون أو مقاس آخر' : language === 'fr' ? 'Veuillez sélectionner une autre couleur ou taille' : 'Please select another color or size'}
              </p>
            </div>
          </div>
        </div>
      );
    }
    
    if (stock < 10 && stock > 0) {
      return (
        <div className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded mb-6">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-orange-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-orange-800">{t.limitedStock}</p>
              <p className="text-xs text-orange-600 mt-0.5">
                {t.onlyLeft.replace('{count}', stock.toString())}
              </p>
            </div>
          </div>
        </div>
      );
    }
    
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F3EF] pt-24 flex items-center justify-center">
        <div className={`text-gray-500`} dir={isRTL ? 'rtl' : 'ltr'}>
          {t.loading}
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#F5F3EF] pt-24 flex flex-col items-center justify-center">
        <p className={`text-gray-500 mb-4`} dir={isRTL ? 'rtl' : 'ltr'}>
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

  const outOfStock = isOutOfStock();
  const maxQuantity = getMaxQuantity();

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
            <div className="aspect-[3/4] bg-white rounded-sm overflow-hidden mb-4 relative">
              {mainImage ? (
                <>
                  <img
                    src={mainImage}
                    alt={product.name}
                    className={`w-full h-full object-cover ${outOfStock ? 'opacity-60' : ''}`}
                  />
                  {outOfStock && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
                      <div className="bg-red-500 text-white px-6 py-3 rounded-lg font-semibold text-lg shadow-lg">
                        {t.outOfStock}
                      </div>
                    </div>
                  )}
                </>
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
            {product.images && product.images.length > 1 && (
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
                      className={`w-full h-full object-cover ${outOfStock ? 'opacity-60' : ''}`}
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

            {renderStockAlert()}

            <p
              className={`text-gray-600 leading-relaxed mb-8 ${
                language === 'ar' ? 'text-right' : 'text-left'
              }`}
              dir={language === 'ar' ? 'rtl' : 'ltr'}
            >
              {product.description}
            </p>

            <div className="space-y-6">
              {colorOptions.length > 0 && (
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
                    {colorOptions.map((color) => {
                      const colorAvailable = isColorAvailable(color.hex, stockVariants);
                      return (
                        <button
                          key={color.hex}
                          onClick={() => {
                            if (colorAvailable) {
                              setSelectedColor(color.hex);
                              // Reset quantity when changing color
                              setQuantity(1);
                            }
                          }}
                          disabled={!colorAvailable}
                          className={`relative w-12 h-12 rounded-full border-2 transition-all ${
                            selectedColor === color.hex
                              ? 'border-gray-800 scale-110'
                              : 'border-gray-300'
                          } ${!colorAvailable ? 'opacity-40 cursor-not-allowed' : 'hover:scale-105'}`}
                          title={colorAvailable ? color.name : `${color.name} - ${t.unavailable}`}
                        >
                          <div
                            className="w-full h-full rounded-full"
                            style={{ backgroundColor: color.hex }}
                          />
                          {!colorAvailable && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-full h-0.5 bg-gray-600 rotate-45 transform origin-center" />
                            </div>
                          )}
                          {selectedColor === color.hex && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <svg className="w-6 h-6 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {product.available_sizes && product.available_sizes.length > 0 && (
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
                    {product.available_sizes.map((size) => {
                      const sizeAvailable = isSizeAvailable(size, selectedColor, stockVariants);
                      return (
                        <button
                          key={size}
                          onClick={() => {
                            if (sizeAvailable) {
                              setSelectedSize(size);
                              // Reset quantity when changing size
                              setQuantity(1);
                            }
                          }}
                          disabled={!sizeAvailable}
                          className={`w-12 h-12 border rounded-sm text-sm transition-all ${
                            selectedSize === size
                              ? 'border-gray-800 bg-gray-800 text-white'
                              : 'border-gray-300 hover:border-gray-400'
                          } ${!sizeAvailable ? 'opacity-40 cursor-not-allowed line-through' : ''}`}
                          title={!sizeAvailable ? t.unavailable : ''}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {!outOfStock && isCurrentVariantAvailable() && (
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
                      onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
                      className="w-10 h-10 border border-gray-300 rounded-sm hover:bg-gray-100 transition-colors"
                    >
                      <Plus className="w-4 h-4 mx-auto" />
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 pt-4">
                {outOfStock ? (
                  <button
                    disabled
                    className="col-span-2 py-4 bg-gray-300 text-gray-500 text-sm tracking-widest cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <AlertCircle className="w-4 h-4" />
                    {t.outOfStock}
                  </button>
                ) : !isCurrentVariantAvailable() ? (
                  <button
                    disabled
                    className="col-span-2 py-4 bg-yellow-100 text-yellow-700 text-sm tracking-widest cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <AlertCircle className="w-4 h-4" />
                    {language === 'ar' ? 'الرجاء اختيار متغير متوفر' : language === 'fr' ? 'Veuillez sélectionner une variante disponible' : 'Please select an available variant'}
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleAddToCart}
                      className="py-4 border-2 border-gray-800 text-gray-800 text-sm tracking-widest hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      {t.addToCart}
                    </button>
                    <button
                      onClick={handleBuyNow}
                      className="py-4 bg-gray-800 text-white text-sm tracking-widest hover:bg-gray-700 transition-all flex items-center justify-center gap-2">
                      <Zap className="w-4 h-4" />
                      {t.buyNow}
                    </button>
                  </>
                )}
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
                    {prod.images && prod.images[0] ? (
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