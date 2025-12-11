import { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';
import React from 'react';

type Product = Database['public']['Tables']['products']['Row'];
type Category = Database['public']['Tables']['categories']['Row'];

// Translation object
const translations = {
  en: {
    hero: {
      title: 'Comfortably\nBeautiful  ',
      subtitle:
        'Like flowers in bloom, OUARDATIE brings natural elegance to your everyday style',
      cta: 'Bloom With Us',
    },
    sections: {
      gardenTitle: 'Our Garden of Styles',
      viewAll: 'View All',
      ctaTitle: 'Where Comfort Meets Beauty',
      ctaText:
        'Ouardatie, founded by Ouarda, creates elegant and minimalist pieces designed to highlight every woman’s beauty. More than a brand, it’s an experience of confidence and elegance.',
      ctaButton: 'Explore Our Bloom',
    },
    footer: {
      information: 'Information',
      aboutUs: 'About Us',
      service: 'Service',
      shipping: 'Shipping',
      cashOnDelivery: 'Cash on Delivery',
      returnPolicy: 'Return Policy',
      reliability: 'Reliability',
      followUs: 'Follow Us',
      rights: '© 2025 OUARDATIE. All rights reserved.',
      admin: 'Admin Access',
    },
  },
  fr: {
    hero: {
      title: 'Confortablement\nBelle  ',
      subtitle:
        'Comme des fleurs en floraison, OUARDATIE apporte une élégance naturelle à votre style quotidien',
      cta: 'Fleurissez Avec Nous',
    },
    sections: {
      gardenTitle: 'Notre Jardin de Styles',
      viewAll: 'Voir Tout',
      ctaTitle: 'Où le Confort Rencontre la Beauté',
      ctaText:
        "Ouardatie, fondée par Ouarda, crée des pièces élégantes et minimalistes pour sublimer chaque femme. Plus qu’une marque, une expérience de confiance et de beauté.",
      ctaButton: 'Explorez Notre Collection',
    },
    footer: {
      information: 'Informations',
      aboutUs: 'À propos',
      service: 'Service',
      shipping: 'Livraison',
      cashOnDelivery: 'Paiement à la livraison',
      returnPolicy: 'Politique de retour',
      reliability: 'Fiabilité',
      followUs: 'Suivez-Nous',
      rights: '© 2025 OUARDATIE. Tous droits réservés.',
      admin: 'Accès Admin',
    },
  },
  ar: {
    hero: {
      title: 'جمال\nبراحة  ',
      subtitle:
        'مثل الورود المتفتحة، ورداتي تضيف لمسة من الأناقة الطبيعية لإطلالتك اليومية',
      cta: 'تسوقي معنا',
    },
    sections: {
      gardenTitle: 'مجموعتنا المميزة',
      viewAll: 'عرض الكل',
      ctaTitle: 'حيث تلتقي الراحة بالجمال',
      ctaText:
        'ورداتي، أسستها وردة، تبتكر قطعًا أنيقة وبسيطة تهدف إلى إبراز جمال كل امرأة. أكثر من مجرد علامة تجارية، إنها تجربة ثقة وأناقة.',
      ctaButton: 'اكتشفي المجموعة',
    },
    footer: {
      information: 'معلومات',
      aboutUs: 'من نحن',
      service: 'الخدمات',
      shipping: 'الشحن',
      cashOnDelivery: 'الدفع عند الاستلام',
      returnPolicy: 'سياسة الإرجاع',
      reliability: 'الموثوقية',
      followUs: 'تابعنا',
      rights: '© 2025 ورداتي. جميع الحقوق محفوظة.',
      admin: 'دخول الإدارة',
    },
  },
};

interface HomePageProps {
  onNavigate: (page: string, productId?: string) => void;
  language?: 'en' | 'fr' | 'ar';
}

// Custom hook for scroll animations
function useScrollAnimation() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.05, rootMargin: '50px' }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return { ref, isVisible };
}

export default function HomePage({
  onNavigate,
  language = 'en',
}: HomePageProps) {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryProducts, setCategoryProducts] = useState<Record<string, Product>>({});
  const [loading, setLoading] = useState(true);

  const featuredSection = useScrollAnimation();
  const gardenSection = useScrollAnimation();
  const ctaSection = useScrollAnimation();

  const t = translations[language];
  const isRTL = language === 'ar';

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadProducts = async () => {
    const { data: featured } = await supabase
      .from('products')
      .select('*')
      .eq('is_featured', true)
      .limit(4);

    if (featured) setFeaturedProducts(featured);
    setLoading(false);
  };
    const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

 
const carouselImages = [
  "/landing_ouarda.jpg",
  "/landing2 (2).jpg",  // Add your second image
  "/landing3.jpg"    // Add your third image
];
  const loadCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .limit(4);

    if (data) {
      setCategories(data);
      // Load best product for each category
      loadCategoryProducts(data);
    }
  };

  const loadCategoryProducts = async (cats: Category[]) => {
    const productsMap: Record<string, Product> = {};
    
    for (const category of cats) {
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('category_id', category.id)
        .eq('is_featured', true)
        .limit(1);
      
      // If no featured product, get the newest one
      if (!data || data.length === 0) {
        const { data: fallback } = await supabase
          .from('products')
          .select('*')
          .eq('category_id', category.id)
          .order('created_at', { ascending: false })
          .limit(1);
        
        if (fallback && fallback[0]) {
          productsMap[category.id] = fallback[0];
        }
      } else {
        productsMap[category.id] = data[0];
      }
    }
    
    setCategoryProducts(productsMap);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F7]" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Modern Hero Section */}
<div className="relative min-h-screen flex items-center overflow-hidden py-20">
        {/* Background Carousel */}
        <div className="absolute inset-0">
          {carouselImages.map((img, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                idx === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {/* Blurred background */}
              <img
                src={img}
                alt=""
                className="w-full h-full object-cover blur-2xl scale-110"
                aria-hidden="true"
              />
              {/* Main image on top */}
              <img
                src={img}
                alt={`OUARDATIE Fashion ${idx + 1}`}
                className="absolute inset-0 w-full h-full object-contain"
                loading={idx === 0 ? "eager" : "lazy"}
              />
            </div>
          ))}
        </div>
        {/* Carousel Navigation Dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {carouselImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentImageIndex(idx)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                idx === currentImageIndex 
                  ? 'bg-white w-8' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full">
          <div className="max-w-2xl">
<h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-light text-white mb-6 sm:mb-8 leading-[1.2] tracking-tight font-serif drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
  {t.hero.title}
</h1>
<p className="text-white/90 text-base sm:text-lg md:text-xl mb-8 sm:mb-12 leading-relaxed font-light drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] [text-shadow:_2px_2px_8px_rgb(0_0_0_/_80%)]">
  {t.hero.subtitle}
</p>
            <button
              onClick={() => onNavigate('shop')}
              className="px-8 sm:px-10 py-3 sm:py-4 bg-white text-[#5C4A3A] text-xs sm:text-sm font-normal tracking-widest uppercase hover:bg-[#8B7355] hover:text-white transition-all duration-300 rounded-full"
            >
              {t.hero.cta}
            </button>
          </div>
        </div>
      </div>
      {/* Featured Products Grid */}
      <section
        ref={featuredSection.ref}
        className={`py-16 sm:py-20 px-4 sm:px-6 md:px-12 bg-white transition-all duration-700 ease-out ${
          featuredSection.isVisible
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-20'
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <div
            className={`text-center mb-12 ${
              isRTL ? 'text-right' : 'text-left'
            } md:text-center`}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-[#5C4A3A] mb-4 tracking-tight">
              Featured Collection
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto font-light">
              Discover our handpicked selection of the season's most beautiful
              pieces
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {loading
              ? Array(4)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="aspect-[3/4] bg-gray-100 rounded-lg mb-4" />
                      <div className="h-3 bg-gray-100 rounded mb-2" />
                      <div className="h-3 bg-gray-100 rounded w-1/2" />
                    </div>
                  ))
              : featuredProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className={`transition-all duration-700 ease-out ${
                      featuredSection.isVisible
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-20'
                    }`}
                    style={{
                      transitionDelay: featuredSection.isVisible
                        ? `${index * 150}ms`
                        : '0ms',
                    }}
                  >
                    <button
                      onClick={() => onNavigate('product', product.id)}
                      className="group text-center w-full"
                    >
                      <div className="aspect-[3/4] bg-gray-50 rounded-lg overflow-hidden mb-4 shadow-sm hover:shadow-xl transition-all duration-300">
                        {product.images && product.images[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            loading="lazy"
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
                      </div>
                      <h3 className="text-sm md:text-base text-[#5C4A3A] mb-1 font-light group-hover:text-[#8B7355] transition-colors tracking-wide">
                        {product.name}
                      </h3>
                      <p className="text-gray-600 text-sm font-light">
                        {product.price} DZD
                      </p>
                      <div
                        className={`flex items-center justify-center mt-2 text-[#8B7355] text-xs ${
                          isRTL ? 'flex-row-reverse' : ''
                        }`}
                      >
                      </div>
                    </button>
                  </div>
                ))}
          </div>
        </div>
      </section>

      {/* Garden Section - Category Cards */}
      <section
        ref={gardenSection.ref}
        className={`py-16 sm:py-20 px-4 sm:px-6 md:px-12 bg-[#FAF9F7] transition-all duration-700 ease-out ${
          gardenSection.isVisible
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-20'
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-[#5C4A3A] tracking-tight">
              {t.sections.gardenTitle}
            </h2>
            <button
              onClick={() => onNavigate('shop')}
              className={`flex items-center gap-2 text-[#5C4A3A] hover:text-[#8B7355] transition-colors group ${
                isRTL ? 'flex-row-reverse' : ''
              }`}
            >
              <span className="text-sm font-light tracking-wide">
                {t.sections.viewAll}
              </span>
              <svg
                className={`w-5 h-5 group-hover:translate-x-1 transition-transform ${
                  isRTL ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {loading
              ? Array(4)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="aspect-square bg-gray-100 rounded-lg mb-4" />
                      <div className="h-4 bg-gray-100 rounded w-3/4 mx-auto" />
                    </div>
                  ))
              : categories.map((category, index) => {
                  const categoryProduct = categoryProducts[category.id];
                  const backgroundImage = categoryProduct?.images?.[0];

                  return (
                    <div
                      key={category.id}
                      className={`transition-all duration-700 ease-out ${
                        gardenSection.isVisible
                          ? 'opacity-100 translate-y-0'
                          : 'opacity-0 translate-y-20'
                      }`}
                      style={{
                        transitionDelay: gardenSection.isVisible
                          ? `${index * 150}ms`
                          : '0ms',
                      }}
                    >
                      <button
                        onClick={() => onNavigate('shop', category.id)}
                        className="group w-full"
                      >
                        <div className="aspect-square bg-white rounded-lg overflow-hidden mb-4 shadow-sm hover:shadow-xl transition-all duration-500 flex items-center justify-center relative border border-gray-100">
                          {backgroundImage ? (
                            <>
                              <img
                                src={backgroundImage}
                                alt={category.name}
                                className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-500"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-white/60 to-white/40" />
                            </>
                          ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-[#8B7355]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          )}
                          <span className="relative text-xl sm:text-2xl md:text-3xl font-light text-[#5C4A3A] tracking-wide group-hover:scale-105 transition-transform duration-500 z-10">
                            {category.name}
                          </span>
                        </div>
                      </button>
                    </div>
                  );
                })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        ref={ctaSection.ref}
        className={`py-20 sm:py-32 px-4 sm:px-6 md:px-12 bg-[#5C4A3A] text-white relative overflow-hidden transition-all duration-700 ease-out ${
          ctaSection.isVisible
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-20'
        }`}
      >
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-br from-white via-transparent to-white" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light mb-6 tracking-tight">
            {t.sections.ctaTitle}
          </h2>
          <p className="text-white/80 text-base sm:text-lg md:text-xl leading-relaxed mb-10 max-w-2xl mx-auto font-light">
            {t.sections.ctaText}
          </p>
          <button
            onClick={() => onNavigate('shop')}
            className={`inline-flex items-center gap-3 px-8 sm:px-10 py-4 bg-[#8B7355] text-white text-sm sm:text-base font-light tracking-[0.2em] hover:bg-[#735E47] transition-all duration-300 shadow-2xl rounded-full group hover:scale-105 transform uppercase ${
              isRTL ? 'flex-row-reverse' : ''
            }`}
          >
            <span>{t.sections.ctaButton}</span>
            <svg
              className={`w-5 h-5 group-hover:translate-x-1 transition-transform ${
                isRTL ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 md:px-12 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="text-sm font-light mb-4 text-[#5C4A3A] tracking-wide">
                {t.footer.information}
              </h4>
              <ul className="space-y-2 text-xs text-gray-600 font-light">
                <li>
                  <button
                    onClick={() => onNavigate('about')}
                    className="hover:text-[#8B7355] transition-colors"
                  >
                    {t.footer.aboutUs}
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-light mb-4 text-[#5C4A3A] tracking-wide">
                {t.footer.service}
              </h4>
              <ul className="space-y-2 text-xs text-gray-600 font-light">
                <li>
                  <button className="hover:text-[#8B7355] transition-colors">
                    {t.footer.shipping}
                  </button>
                </li>
                <li>
                  <button className="hover:text-[#8B7355] transition-colors">
                    {t.footer.cashOnDelivery}
                  </button>
                </li>
                <li>
                  <button className="hover:text-[#8B7355] transition-colors">
                    {t.footer.returnPolicy}
                  </button>
                </li>
                <li>
                  <button className="hover:text-[#8B7355] transition-colors">
                    {t.footer.reliability}
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-light mb-4 text-[#5C4A3A] tracking-wide">
                {t.footer.followUs}
              </h4>
              <a
                href="https://www.instagram.com/ouardatie/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#FAF9F7] border border-gray-200 rounded-full hover:bg-[#8B7355] hover:border-[#8B7355] hover:text-white transition-colors text-gray-600 text-xs"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span>@ouardatie</span>
              </a>
            </div>
          </div>

<div className="border-t border-gray-200 pt-6 flex flex-col md:flex-row justify-center items-center text-xs text-gray-600 gap-4 font-light">
  <p>{t.footer.rights}</p>
  {/* <button
    onClick={() => onNavigate('admin')}
    className="text-gray-400 hover:text-[#8B7355] transition-colors"
  >
    {t.footer.admin}
  </button> */}
</div>

        </div>
      </footer>
    </div>
  );
}