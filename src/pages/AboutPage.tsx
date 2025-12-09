const onNavigate = (path: string) => {
  window.location.href = `/${path}`;
};

const translations = {
  en: {
    hero: {
      title: 'About OUARDATIE',
      subtitle: 'Elegant · Minimalist · Feminine ✨',
    },
    story: {
      title: 'Our Story',
      p1: 'Ouardatie, above all, is Ouarda. A young woman passionate about fashion and the beauty of details, recognized for her simple, refined, and deeply feminine style.',
      p2: 'Ouardatie is an Algerian brand born from a sincere desire: to create elegant, minimalist, and accessible pieces, designed to enhance every woman.',
      p3: 'From the beginning, our ambition has not been limited to creating clothes. We want to offer an experience — a moment where every woman feels beautiful, confident, and unique in what she wears.',
      imageAlt: 'Story Image',
    },
    philosophy: {
      title: 'Our Philosophy',
      p1: 'Beauty should never compromise comfort. Elegance should feel effortless. Style should be as natural as breathing.',
      p2: 'At OUARDATIE, we believe fashion is most powerful when it whispers rather than shouts. Our pieces are designed for the woman who knows that true confidence comes from feeling comfortable in her own skin — and in clothes that move with her, not against her.',
    },
    values: {
      title: 'What Guides Us',
      elegance: {
        title: 'Natural Elegance',
        desc: 'Like flowers in their prime, our designs embrace organic beauty and timeless grace',
      },
      comfort: {
        title: 'Comfort First',
        desc: 'Every piece is crafted to embrace you gently, moving with your body throughout the day',
      },
      heritage: {
        title: 'Heritage & Modernity',
        desc: 'We honor Algerian craftsmanship while embracing contemporary aesthetics and innovation',
      },
    },
    craftsmanship: {
      title: 'Crafted with Care',
      p1: 'Every OUARDATIE piece begins with a vision and ends with meticulous attention to detail. We work with skilled artisans who share our passion for quality and our respect for the craft of garment-making.',
      p2: 'From selecting soft, breathable fabrics to perfecting each stitch, we ensure that every garment meets our high standards. The result? Pieces that feel as luxurious as they look, designed to become beloved staples in your wardrobe.',
      p3: "This is more than fashion — it's a celebration of artistry, patience, and the beauty that emerges when skilled hands bring designs to life. Each piece is a testament to our commitment to excellence and our love for what we do.",
      imageAlt: 'Craftsmanship Image',
    },
    closing: {
      quote:
        'Like a garden in full bloom, we invite you to find your unique beauty within our collection.',
      signature: '— The OUARDATIE Family',
    },
    cta: {
      title: 'Ready to bloom with us?',
      desc: 'Discover pieces that celebrate your natural beauty and embrace your comfort.',
      button: 'Explore Collection',
    },
  },
  fr: {
    hero: {
      title: 'À Propos de OUARDATIE',
      subtitle: 'Élégant · Minimaliste · Féminin ✨',
    },
    story: {
      title: 'Notre Histoire',
      p1: "Ouardatie, c'est avant tout Ouarda. Une jeune femme passionnée par la mode, par la beauté des détails, reconnue pour son style simple, raffiné et profondément féminin.",
      p2: "Ouardatie est une marque algérienne née d'un désir sincère : créer des pièces élégantes, minimalistes et accessibles, pensées pour sublimer chaque femme.",
      p3: "Depuis le début, notre ambition ne se limite pas à créer des vêtements. Nous voulons offrir une expérience - un moment où chaque femme se sent belle, confiante et unique dans ce qu'elle porte.",
      imageAlt: 'Image Histoire',
    },
    philosophy: {
      title: 'Notre Philosophie',
      p1: "La beauté ne devrait jamais compromettre le confort. L'élégance devrait sembler sans effort. Le style devrait être aussi naturel que de respirer.",
      p2: "Chez OUARDATIE, nous croyons que la mode est plus puissante quand elle murmure plutôt que de crier. Nos pièces sont conçues pour la femme qui sait que la vraie confiance vient du fait de se sentir à l'aise dans sa peau — et dans des vêtements qui bougent avec elle, pas contre elle.",
    },
    values: {
      title: 'Ce Qui Nous Guide',
      elegance: {
        title: 'Élégance Naturelle',
        desc: 'Comme des fleurs dans leur prime, nos créations embrassent la beauté organique et la grâce intemporelle',
      },
      comfort: {
        title: "Confort d'Abord",
        desc: 'Chaque pièce est conçue pour vous envelopper doucement, bougeant avec votre corps tout au long de la journée',
      },
      heritage: {
        title: 'Patrimoine & Modernité',
        desc: "Nous honorons l'artisanat algérien tout en embrassant l'esthétique contemporaine et l'innovation",
      },
    },
    craftsmanship: {
      title: 'Fabriqué avec Soin',
      p1: "Chaque pièce OUARDATIE commence par une vision et se termine par une attention méticuleuse aux détails. Nous travaillons avec des artisans qualifiés qui partagent notre passion pour la qualité et notre respect pour l'art de la confection.",
      p2: "De la sélection de tissus doux et respirants à la perfection de chaque point, nous veillons à ce que chaque vêtement réponde à nos normes élevées. Le résultat ? Des pièces qui se sentent aussi luxueuses qu'elles en ont l'air, conçues pour devenir des incontournables bien-aimés de votre garde-robe.",
      p3: "C'est plus que de la mode — c'est une célébration de l'art, de la patience et de la beauté qui émerge lorsque des mains habiles donnent vie aux créations. Chaque pièce est un témoignage de notre engagement envers l'excellence et de notre amour pour ce que nous faisons.",
      imageAlt: 'Image Artisanat',
    },
    closing: {
      quote:
        'Comme un jardin en pleine floraison, nous vous invitons à trouver votre beauté unique dans notre collection.',
      signature: '— La Famille OUARDATIE',
    },
    cta: {
      title: 'Prête à fleurir avec nous?',
      desc: 'Découvrez des pièces qui célèbrent votre beauté naturelle et embrassent votre confort.',
      button: 'Explorer la Collection',
    },
  },
  ar: {
    hero: {
      title: 'عن ورداتي',
      subtitle: 'أنيق · بسيط · أنثوي ✨',
    },
    story: {
      title: 'قصتنا',
      p1: 'ورداتي، هي في المقام الأول وردة. امرأة شابة شغوفة بالموضة وجمال التفاصيل، معروفة بأسلوبها البسيط والراقي والأنثوي العميق.',
      p2: 'ورداتي هي علامة جزائرية ولدت من رغبة صادقة: إنشاء قطع أنيقة وبسيطة وميسورة التكلفة، مصممة لإبراز جمال كل امرأة.',
      p3: 'منذ البداية، لم يقتصر طموحنا على صناعة الملابس فقط. نريد تقديم تجربة - لحظة تشعر فيها كل امرأة بالجمال والثقة والتفرد فيما ترتديه.',
      imageAlt: 'صورة القصة',
    },
    philosophy: {
      title: 'فلسفتنا',
      p1: 'الجمال لا يجب أن يضحي بالراحة أبداً. الأناقة يجب أن تكون سهلة وطبيعية. الأسلوب يجب أن يكون طبيعياً كالتنفس.',
      p2: 'في ورداتي، نؤمن أن الموضة أقوى عندما تهمس بدلاً من أن تصرخ. قطعنا مصممة للمرأة التي تعلم أن الثقة الحقيقية تأتي من الشعور بالراحة في بشرتها — وفي ملابس تتحرك معها وليس ضدها.',
    },
    values: {
      title: 'ما يوجهنا',
      elegance: {
        title: 'أناقة طبيعية',
        desc: 'مثل الزهور في أوج ازدهارها، تصاميمنا تعانق الجمال الطبيعي والرقي الخالد',
      },
      comfort: {
        title: 'الراحة أولاً',
        desc: 'كل قطعة مصممة لتحتضنك برقة، تتحرك مع جسمك طوال اليوم',
      },
      heritage: {
        title: 'تراث وحداثة',
        desc: 'نكرّم الحرفية الجزائرية بينما نتبنى الجماليات المعاصرة والابتكار',
      },
    },
    craftsmanship: {
      title: 'مصنوعة بعناية',
      p1: 'كل قطعة من ورداتي تبدأ برؤية وتنتهي باهتمام دقيق بالتفاصيل. نعمل مع حرفيين مهرة يشاركوننا شغفنا بالجودة واحترامنا لحرفة صناعة الملابس.',
      p2: 'من اختيار الأقمشة الناعمة والمريحة إلى إتقان كل غرزة، نضمن أن كل قطعة تلبي معاييرنا العالية. النتيجة؟ قطع تشعرين بفخامتها كما تبدو، مصممة لتصبح قطعاً أساسية محبوبة في خزانة ملابسك.',
      p3: 'هذا أكثر من مجرد موضة — إنه احتفال بالفن والصبر والجمال الذي ينبثق عندما تُحيي الأيدي الماهرة التصاميم. كل قطعة شاهد على التزامنا بالتميز وحبنا لما نقوم به.',
      imageAlt: 'صورة الحرفية',
    },
    closing: {
      quote:
        'مثل حديقة في كامل ازدهارها، ندعوك لاكتشاف جمالك الفريد ضمن مجموعتنا.',
      signature: '— عائلة ورداتي',
    },
    cta: {
      title: 'مستعدة للتألق معنا؟',
      desc: 'اكتشفي قطعاً تحتفي بجمالك الطبيعي وتحتضن راحتك.',
      button: 'اكتشفي المجموعة',
    },
  },
};

interface AboutPageProps {
  language?: 'en' | 'fr' | 'ar';
}

export default function AboutPage({ language = 'en' }: AboutPageProps) {
  const t = translations[language];

  return (
    <div className="min-h-screen bg-[#FAF9F7]">
      {/* Hero Section */}
      <div className="relative h-[60vh] flex items-center justify-center bg-gradient-to-b from-[#E8E3DC] to-[#FAF9F7]">
        <div className="text-center px-6">
          <h1
            className={`font-light text-5xl md:text-6xl lg:text-7xl text-gray-800 mb-4 tracking-wide ${
              language === 'ar' ? 'text-right' : 'text-left'
            }`}
            dir={language === 'ar' ? 'rtl' : 'ltr'}
          >
            {t.hero.title}
          </h1>
          <p
            className={`text-lg md:text-xl text-gray-600 tracking-wide ${
              language === 'ar' ? 'text-right' : 'text-left'
            }`}
            dir={language === 'ar' ? 'rtl' : 'ltr'}
          >
            {t.hero.subtitle}
          </p>
        </div>
      </div>

      {/* Our Story */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2
                className={`font-light text-4xl text-gray-800 mb-6 ${
                  language === 'ar' ? 'text-right' : 'text-left'
                }`}
                dir={language === 'ar' ? 'rtl' : 'ltr'}
              >
                {t.story.title}
              </h2>
              <div
                className={`space-y-5 text-gray-600 leading-relaxed ${
                  language === 'ar' ? 'text-right' : 'text-left'
                }`}
                dir={language === 'ar' ? 'rtl' : 'ltr'}
              >
                <p>{t.story.p1}</p>
                <p>{t.story.p2}</p>
                <p>{t.story.p3}</p>
              </div>
            </div>
<div className="aspect-[4/5] flex items-center justify-center p-12">
              <img
                src="logo_ouarda1.jpg"
                alt={t.story.imageAlt}
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Banner */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block mb-8">
            <svg
              className="w-16 h-16 text-gray-300 mx-auto"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"
                opacity="0.2"
              />
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>
          <h2
            className={`font-light text-3xl md:text-4xl text-gray-800 mb-6 ${
              language === 'ar' ? 'text-right' : 'text-left'
            }`}
            dir={language === 'ar' ? 'rtl' : 'ltr'}
          >
            {t.philosophy.title}
          </h2>
          <p
            className={`text-gray-600 text-lg leading-relaxed mb-6 ${
              language === 'ar' ? 'text-right' : 'text-left'
            }`}
            dir={language === 'ar' ? 'rtl' : 'ltr'}
          >
            {t.philosophy.p1}
          </p>
          <p
            className={`text-gray-600 leading-relaxed max-w-2xl mx-auto ${
              language === 'ar' ? 'text-right' : 'text-left'
            }`}
            dir={language === 'ar' ? 'rtl' : 'ltr'}
          >
            {t.philosophy.p2}
          </p>
        </div>
      </section>

      {/* Values Grid */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2
            className={`font-light text-3xl md:text-4xl text-center text-gray-800 mb-16 ${
              language === 'ar' ? 'text-right' : 'text-left'
            }`}
            dir={language === 'ar' ? 'rtl' : 'ltr'}
          >
            {t.values.title}
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[#E8E3DC] to-[#F5F1EB] rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
              </div>
              <h3
                className={`font-light text-xl text-gray-800 mb-3 ${
                  language === 'ar' ? 'text-right' : 'text-left'
                }`}
                dir={language === 'ar' ? 'rtl' : 'ltr'}
              >
                {t.values.elegance.title}
              </h3>
              <p
                className={`text-gray-600 text-sm leading-relaxed ${
                  language === 'ar' ? 'text-right' : 'text-left'
                }`}
                dir={language === 'ar' ? 'rtl' : 'ltr'}
              >
                {t.values.elegance.desc}
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[#E8E3DC] to-[#F5F1EB] rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <h3 className="font-light text-xl text-gray-800 mb-3">
                {t.values.comfort.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {t.values.comfort.desc}
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[#E8E3DC] to-[#F5F1EB] rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="font-light text-xl text-gray-800 mb-3">
                {t.values.heritage.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {t.values.heritage.desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Craftsmanship Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="aspect-[4/5] bg-gradient-to-br from-[#F5F1EB] to-[#E8E3DC] rounded-sm flex items-center justify-center order-2 md:order-1">
              <div className="text-gray-400 text-center p-8">
                <svg
                  className="w-24 h-24 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-sm">{t.craftsmanship.imageAlt}</p>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <h2 className="font-light text-4xl text-gray-800 mb-6">
                {t.craftsmanship.title}
              </h2>
              <div className="space-y-5 text-gray-600 leading-relaxed">
                <p>{t.craftsmanship.p1}</p>
                <p>{t.craftsmanship.p2}</p>
                <p>{t.craftsmanship.p3}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Closing Statement */}
      <section className="py-20 px-6 bg-gradient-to-b from-[#FAF9F7] to-[#E8E3DC]">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-2xl md:text-3xl font-light text-gray-800 leading-relaxed mb-8">
            "{t.closing.quote}"
          </p>
          <p className="text-gray-600 text-lg">{t.closing.signature}</p>
        </div>
      </section>

      {/* Footer CTA */}
<section className="py-16 px-6 bg-white border-t border-gray-200">
  <div className="max-w-4xl mx-auto text-center">
    <h3 className="font-light text-2xl text-gray-800 mb-4">
      {t.cta.title}
    </h3>
    <p className="text-gray-600 mb-8">{t.cta.desc}</p>
    <button
      onClick={() => onNavigate('shop')}
      className="px-10 py-3 bg-gray-800 text-white text-sm font-medium tracking-wide hover:bg-gray-700 transition-all duration-300 rounded-sm"
    >
      {t.cta.button}
    </button>
  </div>
</section>
    </div>
  );
}