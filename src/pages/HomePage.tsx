import { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';

type Product = Database['public']['Tables']['products']['Row'];

// Translation object
const translations = {
  en: {
    hero: {
      title: 'Comfortably\nBeautiful ✨',
      subtitle:
        'Like flowers in bloom, OUARDATIE brings natural elegance to your everyday style',
      cta: 'Bloom With Us',
    },
    sections: {
      gardenTitle: 'Our Garden of Styles',
      viewAll: 'View All',
      ctaTitle: 'Where Comfort Meets Beauty',
      ctaText:
        'Like petals unfolding in perfect harmony, each OUARDATIE piece is designed to make you feel naturally beautiful and effortlessly comfortable.',
      ctaButton: 'Explore Our Bloom',
    },
    footer: {
      information: 'Information',
      aboutUs: 'About Us',
      contact: 'Contact',
      privacy: 'Privacy Policy',
      service: 'Service',
      shipping: 'Shipping',
      returns: 'Returns',
      faq: 'FAQ',
      customerCare: 'Customer Care',
      trackOrder: 'Track Order',
      sizeGuide: 'Size Guide',
      support: 'Support',
      followUs: 'Follow Us',
      rights: '© 2025 OUARDATIE. All rights reserved.',
      admin: 'Admin Access',
    },
  },
  fr: {
    hero: {
      title: 'Confortablement\nBelle ✨',
      subtitle:
        'Comme des fleurs en floraison, OUARDATIE apporte une élégance naturelle à votre style quotidien',
      cta: 'Fleurissez Avec Nous',
    },
    sections: {
      gardenTitle: 'Notre Jardin de Styles',
      viewAll: 'Voir Tout',
      ctaTitle: 'Où le Confort Rencontre la Beauté',
      ctaText:
        "Comme des pétales s'ouvrant en parfaite harmonie, chaque pièce OUARDATIE est conçue pour vous faire sentir naturellement belle et confortablement à l'aise.",
      ctaButton: 'Explorez Notre Collection',
    },
    footer: {
      information: 'Informations',
      aboutUs: 'À Propos',
      contact: 'Contact',
      privacy: 'Politique de Confidentialité',
      service: 'Service',
      shipping: 'Livraison',
      returns: 'Retours',
      faq: 'FAQ',
      customerCare: 'Service Client',
      trackOrder: 'Suivre Commande',
      sizeGuide: 'Guide des Tailles',
      support: 'Support',
      followUs: 'Suivez-Nous',
      rights: '© 2025 OUARDATIE. Tous droits réservés.',
      admin: 'Accès Admin',
    },
  },
  ar: {
    hero: {
      title: 'جمال\nبراحة ✨',
      subtitle:
        'مثل الورود المتفتحة، ورداتي تضيف لمسة من الأناقة الطبيعية لإطلالتك اليومية',
      cta: 'تسوقي معنا',
    },
    sections: {
      gardenTitle: 'مجموعتنا المميزة',
      viewAll: 'عرض الكل',
      ctaTitle: 'حيث تلتقي الراحة بالجمال',
      ctaText:
        'كل قطعة من ورداتي مصممة بعناية لتمنحك إحساساً بالجمال الطبيعي والراحة المطلقة.',
      ctaButton: 'اكتشفي المجموعة',
    },
    footer: {
      information: 'معلومات',
      aboutUs: 'من نحن',
      contact: 'اتصل بنا',
      privacy: 'سياسة الخصوصية',
      service: 'الخدمات',
      shipping: 'الشحن',
      returns: 'الإرجاع',
      faq: 'الأسئلة الشائعة',
      customerCare: 'خدمة العملاء',
      trackOrder: 'تتبع الطلب',
      sizeGuide: 'دليل المقاسات',
      support: 'الدعم الفني',
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
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const featuredSection = useScrollAnimation();
  const gardenSection = useScrollAnimation();
  const ctaSection = useScrollAnimation();

  const t = translations[language];
  const isRTL = language === 'ar';

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const { data: featured } = await supabase
      .from('products')
      .select('*')
      .eq('is_featured', true)
      .limit(4);

    const { data: all } = await supabase.from('products').select('*').limit(3);

    if (featured) setFeaturedProducts(featured);
    if (all) setAllProducts(all);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F7]" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Modern Hero Section */}
      <div className="relative h-screen flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/landing_ouarda.jpg"
            alt="OUARDATIE Fashion"
            className="w-full h-full object-cover"
            loading="eager"
            style={{ imageRendering: 'high-quality' }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full">
          <div className="max-w-2xl">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extralight text-white mb-8 leading-[1.1] tracking-tight">
              {t.hero.title}
            </h1>

            <p className="text-white/90 text-lg md:text-xl mb-12 leading-relaxed font-light">
              {t.hero.subtitle}
            </p>

            <button
              onClick={() => onNavigate('shop')}
              className="px-10 py-4 bg-white text-[#5C4A3A] text-sm font-normal tracking-wide hover:bg-[#8B7355] hover:text-white transition-all duration-300 rounded-full"
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
                        {product.images[0] ? (
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
                        {'★'.repeat(5)}
                      </div>
                    </button>
                  </div>
                ))}
          </div>
        </div>
      </section>

      {/* Garden Section */}
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
            {loading
              ? Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="aspect-[3/4] bg-gray-100 rounded-lg mb-4" />
                      <div className="h-3 bg-gray-100 rounded mb-2" />
                      <div className="h-3 bg-gray-100 rounded w-1/2 mx-auto" />
                    </div>
                  ))
              : allProducts.slice(0, 3).map((product, index) => (
                  <div
                    key={product.id}
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
                      onClick={() => onNavigate('product', product.id)}
                      className="group text-center w-full"
                    >
                      <div className="aspect-[3/4] bg-white rounded-lg overflow-hidden mb-4 shadow-md hover:shadow-2xl transition-all duration-300">
                        {product.images[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <svg
                              className="w-16 h-16 sm:w-20 sm:h-20"
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
                      <h3 className="text-base text-[#5C4A3A] mb-1 font-light tracking-wide">
                        {product.name}
                      </h3>
                      <p className="text-gray-600 text-sm font-light">
                        {product.price} DZD
                      </p>
                    </button>
                  </div>
                ))}
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-8">
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
                <li>
                  <button className="hover:text-[#8B7355] transition-colors">
                    {t.footer.contact}
                  </button>
                </li>
                <li>
                  <button className="hover:text-[#8B7355] transition-colors">
                    {t.footer.privacy}
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
                    {t.footer.returns}
                  </button>
                </li>
                <li>
                  <button className="hover:text-[#8B7355] transition-colors">
                    {t.footer.faq}
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-light mb-4 text-[#5C4A3A] tracking-wide">
                {t.footer.customerCare}
              </h4>
              <ul className="space-y-2 text-xs text-gray-600 font-light">
                <li>
                  <button className="hover:text-[#8B7355] transition-colors">
                    {t.footer.trackOrder}
                  </button>
                </li>
                <li>
                  <button className="hover:text-[#8B7355] transition-colors">
                    {t.footer.sizeGuide}
                  </button>
                </li>
                <li>
                  <button className="hover:text-[#8B7355] transition-colors">
                    {t.footer.support}
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-light mb-4 text-[#5C4A3A] tracking-wide">
                {t.footer.followUs}
              </h4>
              <div
                className={`flex gap-3 ${
                  isRTL ? 'flex-row-reverse justify-end' : ''
                }`}
              >
                <button className="w-8 h-8 bg-[#FAF9F7] border border-gray-200 rounded-full hover:bg-[#8B7355] hover:border-[#8B7355] hover:text-white transition-colors flex items-center justify-center text-gray-600">
                  <span className="text-xs">f</span>
                </button>
                <button className="w-8 h-8 bg-[#FAF9F7] border border-gray-200 rounded-full hover:bg-[#8B7355] hover:border-[#8B7355] hover:text-white transition-colors flex items-center justify-center text-gray-600">
                  <span className="text-xs">tw</span>
                </button>
                <button className="w-8 h-8 bg-[#FAF9F7] border border-gray-200 rounded-full hover:bg-[#8B7355] hover:border-[#8B7355] hover:text-white transition-colors flex items-center justify-center text-gray-600">
                  <span className="text-xs">in</span>
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-gray-600 gap-4 font-light">
            <p>{t.footer.rights}</p>
            <button
              onClick={() => onNavigate('admin')}
              className="text-gray-400 hover:text-[#8B7355] transition-colors"
            >
              {t.footer.admin}
            </button>
          </div>
        </div>
      </footer>

      <style jsx>{`
        /* Removed keyframes animation - using Tailwind transitions instead */
      `}</style>
    </div>
  );
}
