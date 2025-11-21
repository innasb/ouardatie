import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';

type Product = Database['public']['Tables']['products']['Row'];
type Category = Database['public']['Tables']['categories']['Row'];

const translations = {
  en: {
    title: 'Shop Collection',
    search: 'Search products...',
    allCategories: 'All Categories',
    allPrices: 'All Prices',
    priceUnder: 'Under 2000 DZD',
    priceRange: '2000 - 5000 DZD',
    priceOver: 'Over 5000 DZD',
    newest: 'Newest',
    priceLow: 'Price: Low to High',
    priceHigh: 'Price: High to Low',
    noProducts: 'No products found',
    noImage: 'No Image',
  },
  fr: {
    title: 'Boutique',
    search: 'Rechercher des produits...',
    allCategories: 'Toutes les Catégories',
    allPrices: 'Tous les Prix',
    priceUnder: 'Moins de 2000 DZD',
    priceRange: '2000 - 5000 DZD',
    priceOver: 'Plus de 5000 DZD',
    newest: 'Plus Récent',
    priceLow: 'Prix: Bas à Élevé',
    priceHigh: 'Prix: Élevé à Bas',
    noProducts: 'Aucun produit trouvé',
    noImage: "Pas d'image",
  },
  ar: {
    title: 'المتجر',
    search: 'البحث عن المنتجات...',
    allCategories: 'جميع الفئات',
    allPrices: 'جميع الأسعار',
    priceUnder: 'أقل من 2000 دج',
    priceRange: '2000 - 5000 دج',
    priceOver: 'أكثر من 5000 دج',
    newest: 'الأحدث',
    priceLow: 'السعر: من الأقل للأعلى',
    priceHigh: 'السعر: من الأعلى للأقل',
    noProducts: 'لم يتم العثور على منتجات',
    noImage: 'لا توجد صورة',
  },
};

interface ShopPageProps {
  onNavigate: (page: string, productId?: string) => void;
  language?: 'en' | 'fr' | 'ar';
}

export default function ShopPage({
  onNavigate,
  language = 'en',
}: ShopPageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');

  const t = translations[language];

  useEffect(() => {
    loadData();
  }, []);

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
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    });

  return (
    <div className="min-h-screen bg-[#F5F3EF] pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="font-serif text-5xl text-gray-800 mb-12 text-center tracking-wide">
          {t.title}
        </h1>

        <div className="bg-white rounded-sm p-6 mb-12 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder={t.search}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:border-gray-400 text-sm"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:border-gray-400 text-sm"
            >
              <option value="all">{t.allCategories}</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:border-gray-400 text-sm"
            >
              <option value="all">{t.allPrices}</option>
              <option value="under-2000">{t.priceUnder}</option>
              <option value="2000-5000">{t.priceRange}</option>
              <option value="over-5000">{t.priceOver}</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:border-gray-400 text-sm"
            >
              <option value="newest">{t.newest}</option>
              <option value="price-low">{t.priceLow}</option>
              <option value="price-high">{t.priceHigh}</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {Array(8)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-sm overflow-hidden animate-pulse"
                >
                  <div className="aspect-[3/4] bg-gray-200" />
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-gray-200 rounded" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">{t.noProducts}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <button
                key={product.id}
                onClick={() => onNavigate('product', product.id)}
                className="group bg-white rounded-sm overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <div className="aspect-[3/4] bg-gray-100 overflow-hidden">
                  {product.images[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      {t.noImage}
                    </div>
                  )}
                </div>
                <div className="p-6 text-left">
                  <h3 className="font-serif text-lg text-gray-800 mb-2 tracking-wide">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-sm tracking-wide">
                    {product.price} DZD
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
