const onNavigate = (path: string) => {
  window.location.href = `/${path}`;
};

const translations = {
  en: {
    story: {
      title: 'Our Story',
      p1: 'Ouardatie, above all, is Ouarda. A young woman passionate about fashion and the beauty of details, recognized for her simple, refined, and deeply feminine style.',
      p2: 'Ouardatie is an Algerian brand born from a sincere desire: to create elegant, minimalist, and accessible pieces, designed to enhance every woman.',
      p3: 'From the beginning, our ambition has not been limited to creating clothes. We want to offer an experience — a moment where every woman feels beautiful, confident, and unique in what she wears.',
      imageAlt: 'Story Image',
    },
  },
  fr: {
    story: {
      title: 'Notre Histoire',
      p1: "Ouardatie, c'est avant tout Ouarda. Une jeune femme passionnée par la mode, par la beauté des détails, reconnue pour son style simple, raffiné et profondément féminin.",
      p2: "Ouardatie est une marque algérienne née d'un désir sincère : créer des pièces élégantes, minimalistes et accessibles, pensées pour sublimer chaque femme.",
      p3: "Depuis le début, notre ambition ne se limite pas à créer des vêtements. Nous voulons offrir une expérience - un moment où chaque femme se sent belle, confiante et unique dans ce qu'elle porte.",
      imageAlt: 'Image Histoire',
    },
  },
  ar: {
    story: {
      title: 'قصتنا',
      p1: 'ورداتي، هي في المقام الأول وردة. امرأة شابة شغوفة بالموضة وجمال التفاصيل، معروفة بأسلوبها البسيط والراقي والأنثوي العميق.',
      p2: 'ورداتي هي علامة جزائرية ولدت من رغبة صادقة: إنشاء قطع أنيقة وبسيطة وميسورة التكلفة، مصممة لإبراز جمال كل امرأة.',
      p3: 'منذ البداية، لم يقتصر طموحنا على صناعة الملابس فقط. نريد تقديم تجربة - لحظة تشعر فيها كل امرأة بالجمال والثقة والتفرد فيما ترتديه.',
      imageAlt: 'صورة القصة',
    },
  },
};

interface AboutPageProps {
  language?: 'en' | 'fr' | 'ar';
}

export default function AboutPage({ language = 'en' }: AboutPageProps) {
  const t = translations[language];

  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-6 py-24 md:py-32">
        <div className="grid lg:grid-cols-5 gap-16 lg:gap-24 items-center">
          {/* Text Content */}
          <div className="lg:col-span-3">
            <h1
              className={`text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 mb-12 tracking-tight ${
                language === 'ar' ? 'text-right' : 'text-left'
              }`}
              dir={language === 'ar' ? 'rtl' : 'ltr'}
            >
              {t.story.title}
            </h1>
            
            <div
              className={`space-y-8 text-base md:text-lg text-gray-600 leading-relaxed ${
                language === 'ar' ? 'text-right' : 'text-left'
              }`}
              dir={language === 'ar' ? 'rtl' : 'ltr'}
            >
              <p>{t.story.p1}</p>
              <p>{t.story.p2}</p>
              <p>{t.story.p3}</p>
            </div>
          </div>

          {/* Image */}
          <div className="lg:col-span-2">
            <div className="aspect-square w-full max-w-md mx-auto">
              <img
                src="logo_ouarda1.jpg"
                alt={t.story.imageAlt}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}