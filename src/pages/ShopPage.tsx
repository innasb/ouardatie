import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';

type Product = Database['public']['Tables']['products']['Row'];
type Category = Database['public']['Tables']['categories']['Row'];

const translations = {
  en: {
    title: 'Shop Collection',
    search: 'Search products...',
    filters: 'Filters',
    allCategories: 'All Categories',
    allSizes: 'All Sizes',
    allColors: 'All Colors',
    allPrices: 'All Prices',
    priceUnder: 'Under 2000 DZD',
    priceRange: '2000 - 5000 DZD',
    priceOver: 'Over 5000 DZD',
    sortBy: 'Sort by',
    newest: 'Newest',
    bestSellers: 'Best Sellers',
    priceLow: 'Price: Low to High',
    priceHigh: 'Price: High to Low',
    noProducts: 'No products found',
    noImage: 'No Image',
    outOfStock: 'Out of Stock',
    limitedQuantity: 'Limited Quantity',
    onlyLeft: '{count} left',
    category: 'Category',
    size: 'Size',
    color: 'Color',
    sort: 'Sort',
    all: 'All',
  },
  fr: {
    title: 'Boutique',
    search: 'Rechercher des produits...',
    filters: 'Filtres',
    allCategories: 'Toutes les Catégories',
    allSizes: 'Toutes les Tailles',
    allColors: 'Toutes les Couleurs',
    allPrices: 'Tous les Prix',
    priceUnder: 'Moins de 2000 DZD',
    priceRange: '2000 - 5000 DZD',
    priceOver: 'Plus de 5000 DZD',
    sortBy: 'Trier par',
    newest: 'Nouveautés',
    bestSellers: 'Meilleures Ventes',
    priceLow: 'Prix: Bas à Élevé',
    priceHigh: 'Prix: Élevé à Bas',
    noProducts: 'Aucun produit trouvé',
    noImage: "Pas d'image",
    outOfStock: 'Rupture de Stock',
    limitedQuantity: 'Quantité Limitée',
    onlyLeft: '{count} restant',
    category: 'Catégorie',
    size: 'Taille',
    color: 'Couleur',
    sort: 'Trier',
    all: 'Tout',
  },
  ar: {
    title: 'المتجر',
    search: 'البحث عن المنتجات...',
    filters: 'الفلاتر',
    allCategories: 'جميع الفئات',
    allSizes: 'جميع المقاسات',
    allColors: 'جميع الألوان',
    allPrices: 'جميع الأسعار',
    priceUnder: 'أقل من 2000 دج',
    priceRange: '2000 - 5000 دج',
    priceOver: 'أكثر من 5000 دج',
    sortBy: 'ترتيب حسب',
    newest: 'الأحدث',
    bestSellers: 'الأكثر مبيعاً',
    priceLow: 'السعر: من الأقل للأعلى',
    priceHigh: 'السعر: من الأعلى للأقل',
    noProducts: 'لم يتم العثور على منتجات',
    noImage: 'لا توجد صورة',
    outOfStock: 'نفذت الكمية',
    limitedQuantity: 'كمية محدودة',
    onlyLeft: 'متبقي {count} فقط',
    category: 'الفئة',
    size: 'المقاس',
    color: 'اللون',
    sort: 'ترتيب',
    all: 'الكل',
  },
};

interface ShopPageProps {
  onNavigate: (page: string, productId?: string) => void;
  language?: 'en' | 'fr' | 'ar';
  initialCategoryId?: string;
}

export default function ShopPage({
  onNavigate,
  language = 'en',
  initialCategoryId,
}: ShopPageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(
    initialCategoryId || 'all'
  );
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [selectedColor, setSelectedColor] = useState<string>('all');
  const [priceRange] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const t = translations[language];
  const isRTL = language === 'ar';

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth > 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (initialCategoryId) {
      setSelectedCategory(initialCategoryId);
    }
  }, [initialCategoryId]);

  const loadData = async () => {
    const [productsRes, categoriesRes] = await Promise.all([
      supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false }),
      supabase.from('categories').select('*').order('name'),
    ]);

    if (productsRes.data) setProducts(productsRes.data);
    if (categoriesRes.data) setCategories(categoriesRes.data);
    setLoading(false);
  };

  // Extract unique sizes and colors from products
  const availableSizes = Array.from(
    new Set(
      products.flatMap((p) => p.available_sizes || []).filter((s): s is string => !!s)
    )
  ).sort();

  const availableColors = Array.from(
    new Set(
      products.flatMap((p) => p.available_colors || [])
        .filter((c): c is string => !!c)
        .map(c => {
          try {
            const parsed = JSON.parse(c);
            return parsed.name || c;
          } catch {
            return c;
          }
        })
    )
  ).sort();

  const filteredProducts = products
    .filter((product) => {
      if (
        searchQuery &&
        !product.name.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      if (
        selectedCategory !== 'all' &&
        product.category_id !== selectedCategory
      ) {
        return false;
      }

      if (selectedSize !== 'all') {
        if (!product.available_sizes || !product.available_sizes.includes(selectedSize)) {
          return false;
        }
      }

      if (selectedColor !== 'all') {
        if (!product.available_colors) return false;
        const hasColor = product.available_colors.some(c => {
          try {
            const parsed = JSON.parse(c);
            return parsed.name === selectedColor;
          } catch {
            return c === selectedColor;
          }
        });
        if (!hasColor) return false;
      }

      if (priceRange !== 'all') {
        const price = product.price;
        if (priceRange === 'under-2000' && price >= 2000) return false;
        if (priceRange === '2000-5000' && (price < 2000 || price > 5000))
          return false;
        if (priceRange === 'over-5000' && price <= 5000) return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'best-sellers') {
        if (a.is_featured && !b.is_featured) return -1;
        if (!a.is_featured && b.is_featured) return 1;
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      }
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    });

  const getStockBadge = (product: Product) => {
    const quantity = product.stock_quantity || 0;
    const status = product.stock_status;

    if (status === 'out_of_stock' || quantity === 0) {
      return (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80">
          <div className="bg-red-500 text-white px-4 py-2 rounded-md text-sm font-semibold shadow-lg">
            {t.outOfStock}
          </div>
        </div>
      );
    }

    if (status === 'low_stock' || quantity < 10) {
      return (
        <div className="absolute top-3 left-3 right-3">
          <div className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-3 py-1.5 rounded-md text-xs font-semibold shadow-lg backdrop-blur-sm bg-opacity-95 flex items-center justify-center gap-1.5">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{t.limitedQuantity}</span>
          </div>
        </div>
      );
    }

    return null;
  };

  const sortOptions = [
    { value: 'newest', label: t.newest },
    { value: 'best-sellers', label: t.bestSellers },
    { value: 'price-low', label: t.priceLow },
    { value: 'price-high', label: t.priceHigh },
  ];

  // Filter Content Component
  const FilterContent = ({ isSidebar = false }) => (
    <div className={`space-y-8 ${isSidebar ? '' : 'mb-16'}`}>
      {/* Search Bar */}
      <div className={isSidebar ? '' : 'max-w-xl mx-auto'}>
        <div className="relative group">
          <input
            type="text"
            placeholder={t.search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-6 py-3.5 bg-transparent border-b border-gray-200 focus:outline-none focus:border-[#5C4A3A] text-sm font-light tracking-widest transition-all text-center placeholder:text-gray-400"
          />
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#8B7355] to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity" />
        </div>
      </div>

      {/* Category Slider */}
      <div className="space-y-3">
        <h3 className={`text-xs font-light tracking-widest uppercase text-[#5C4A3A] opacity-60 ${isSidebar ? '' : 'text-center'}`}>
          {t.category}
        </h3>
        <div className="overflow-x-auto scrollbar-hide">
          <div className={`flex gap-3 min-w-max ${isSidebar ? '' : 'justify-center px-6'}`}>
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-6 py-2 text-xs font-light tracking-widest uppercase transition-all ${
                selectedCategory === 'all'
                  ? 'bg-[#5C4A3A] text-white'
                  : 'bg-white text-[#5C4A3A] hover:bg-gray-50'
              }`}
            >
              {t.all}
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-6 py-2 text-xs font-light tracking-widest uppercase whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-[#5C4A3A] text-white'
                    : 'bg-white text-[#5C4A3A] hover:bg-gray-50'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Size Slider */}
      {availableSizes.length > 0 && (
        <div className="space-y-3">
          <h3 className={`text-xs font-light tracking-widest uppercase text-[#5C4A3A] opacity-60 ${isSidebar ? '' : 'text-center'}`}>
            {t.size}
          </h3>
          <div className="overflow-x-auto scrollbar-hide">
            <div className={`flex gap-3 min-w-max ${isSidebar ? '' : 'justify-center px-6'}`}>
              <button
                onClick={() => setSelectedSize('all')}
                className={`px-6 py-2 text-xs font-light tracking-widest uppercase transition-all ${
                  selectedSize === 'all'
                    ? 'bg-[#5C4A3A] text-white'
                    : 'bg-white text-[#5C4A3A] hover:bg-gray-50'
                }`}
              >
                {t.all}
              </button>
              {availableSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-6 py-2 text-xs font-light tracking-widest uppercase whitespace-nowrap transition-all ${
                    selectedSize === size
                      ? 'bg-[#5C4A3A] text-white'
                      : 'bg-white text-[#5C4A3A] hover:bg-gray-50'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Color Slider */}
      {availableColors.length > 0 && (
        <div className="space-y-3">
          <h3 className={`text-xs font-light tracking-widest uppercase text-[#5C4A3A] opacity-60 ${isSidebar ? '' : 'text-center'}`}>
            {t.color}
          </h3>
          <div className="overflow-x-auto scrollbar-hide">
            <div className={`flex gap-3 min-w-max ${isSidebar ? '' : 'justify-center px-6'}`}>
              <button
                onClick={() => setSelectedColor('all')}
                className={`px-6 py-2 text-xs font-light tracking-widest uppercase transition-all ${
                  selectedColor === 'all'
                    ? 'bg-[#5C4A3A] text-white'
                    : 'bg-white text-[#5C4A3A] hover:bg-gray-50'
                }`}
              >
                {t.all}
              </button>
              {availableColors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-6 py-2 text-xs font-light tracking-widest uppercase whitespace-nowrap transition-all ${
                    selectedColor === color
                      ? 'bg-[#5C4A3A] text-white'
                      : 'bg-white text-[#5C4A3A] hover:bg-gray-50'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sort Slider */}
      <div className="space-y-3">
        <h3 className={`text-xs font-light tracking-widest uppercase text-[#5C4A3A] opacity-60 ${isSidebar ? '' : 'text-center'}`}>
          {t.sort}
        </h3>
        <div className="overflow-x-auto scrollbar-hide">
          <div className={`flex gap-3 min-w-max ${isSidebar ? '' : 'justify-center px-6'}`}>
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setSortBy(option.value)}
                className={`px-6 py-2 text-xs font-light tracking-widest uppercase whitespace-nowrap transition-all ${
                  sortBy === option.value
                    ? 'bg-[#5C4A3A] text-white'
                    : 'bg-white text-[#5C4A3A] hover:bg-gray-50'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className="min-h-screen bg-[#FAF9F7] pt-24 pb-16"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-4xl sm:text-5xl font-light text-[#5C4A3A] mb-12 text-center tracking-tight">
          {t.title}
        </h1>

        {/* Filter Toggle Button */}
        <div className="flex justify-end mb-8 max-w-7xl mx-auto">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-6 py-2.5 bg-white hover:bg-gray-50 text-[#5C4A3A] text-xs font-light tracking-widest uppercase transition-all shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            {t.filters}
          </button>
        </div>

        {/* MOBILE: Slide-out Panel */}
        {isMobile ? (
          <>
            {/* Overlay */}
            {showFilters && (
              <div 
                className="fixed inset-0 bg-black bg-opacity-30 z-40 transition-opacity duration-300"
                onClick={() => setShowFilters(false)}
              />
            )}
            
            {/* Side Panel */}
            <div className={`fixed top-0 ${isRTL ? 'left-0' : 'right-0'} h-full w-full sm:w-96 bg-[#FAF9F7] z-50 shadow-2xl transition-transform duration-500 ease-in-out ${
              showFilters ? 'translate-x-0' : (isRTL ? '-translate-x-full' : 'translate-x-full')
            } overflow-y-auto`}>
              <div className="p-8">
                {/* Close Button */}
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-xl font-light tracking-widest uppercase text-[#5C4A3A]">{t.filters}</h2>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <svg className="w-5 h-5 text-[#5C4A3A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <FilterContent isSidebar={true} />
              </div>
            </div>
          </>
        ) : (
          /* DESKTOP: Collapsible Horizontal Filters */
          <div className={`transition-all duration-500 ease-in-out ${
            showFilters ? 'opacity-100 max-h-[1000px]' : 'opacity-0 max-h-0 overflow-hidden'
          }`}>
            <FilterContent isSidebar={false} />
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {Array(8)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[3/4] bg-gray-100 rounded-lg mb-4" />
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-100 rounded" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                  </div>
                </div>
              ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg font-light">{t.noProducts}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {filteredProducts.map((product) => (
              <button
                key={product.id}
                onClick={() => onNavigate('product', product.id)}
                className={`group text-center ${
                  (product.stock_status === 'out_of_stock' || (product.stock_quantity || 0) === 0)
                    ? 'opacity-99'
                    : ''
                }`}
              >
                <div className="aspect-[3/4] bg-white rounded-lg overflow-hidden mb-4 shadow-sm hover:shadow-xl transition-all duration-300 relative">
                  {product.images && product.images[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <svg
                        className="w-12 h-12 sm:w-16 sm:h-16"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  )}
                  {getStockBadge(product)}
                </div>
                <h3 className="text-sm md:text-base text-[#5C4A3A] mb-1 font-light group-hover:text-[#8B7355] transition-colors tracking-wide">
                  {product.name}
                </h3>
                {product.is_on_promotion && product.promotion_price ? (
                  <div className="flex items-center justify-center gap-2 flex-wrap">
                    <span className="text-gray-400 text-xs line-through font-light">
                      {product.price} DZD
                    </span>
                    <span className="text-[#8B7355] text-sm font-medium">
                      {product.promotion_price} DZD
                    </span>
                    <span className="inline-block px-2 py-0.5 bg-gradient-to-r from-red-50 to-orange-50 text-red-600 text-xs font-medium rounded-full border border-red-100">
                      -{Math.round(((product.price - product.promotion_price) / product.price) * 100)}%
                    </span>
                  </div>
                ) : (
                  <p className="text-gray-600 text-sm font-light">
                    {product.price} DZD
                  </p>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
      
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}