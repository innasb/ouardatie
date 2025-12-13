import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const translations = {
  en: {
    brand: 'OUARDATIE',
    tagline: 'Where comfort meets beauty',
    resetPassword: 'Reset Your Password',
    newPassword: 'New Password',
    confirmPassword: 'Confirm New Password',
    resetButton: 'Reset Password',
    passwordMismatch: 'Passwords do not match',
    passwordTooShort: 'Password must be at least 6 characters',
    resetSuccess: 'Password reset successfully! Redirecting to sign in...',
    resetError: 'Failed to reset password. Please try again or request a new reset link.',
    invalidToken: 'Invalid or expired reset link. Please request a new one.',
    backToSignIn: 'Back to Sign In',
    fieldRequired: 'This field is required',
  },
  fr: {
    brand: 'OUARDATIE',
    tagline: 'Où le confort rencontre la beauté',
    resetPassword: 'Réinitialiser votre mot de passe',
    newPassword: 'Nouveau mot de passe',
    confirmPassword: 'Confirmer le mot de passe',
    resetButton: 'Réinitialiser',
    passwordMismatch: 'Les mots de passe ne correspondent pas',
    passwordTooShort: 'Le mot de passe doit contenir au moins 6 caractères',
    resetSuccess: 'Mot de passe réinitialisé avec succès! Redirection...',
    resetError: 'Échec de la réinitialisation. Veuillez réessayer ou demander un nouveau lien.',
    invalidToken: 'Lien invalide ou expiré. Veuillez en demander un nouveau.',
    backToSignIn: 'Retour à la connexion',
    fieldRequired: 'Ce champ est obligatoire',
  },
  ar: {
    brand: 'ورداتي',
    tagline: 'حيث تلتقي الراحة بالجمال',
    resetPassword: 'إعادة تعيين كلمة المرور',
    newPassword: 'كلمة المرور الجديدة',
    confirmPassword: 'تأكيد كلمة المرور',
    resetButton: 'إعادة التعيين',
    passwordMismatch: 'كلمات المرور غير متطابقة',
    passwordTooShort: 'يجب أن تكون كلمة المرور 6 أحرف على الأقل',
    resetSuccess: 'تم إعادة تعيين كلمة المرور بنجاح! جاري التحويل...',
    resetError: 'فشل إعادة التعيين. يرجى المحاولة مرة أخرى أو طلب رابط جديد.',
    invalidToken: 'رابط غير صالح أو منتهي الصلاحية. يرجى طلب رابط جديد.',
    backToSignIn: 'العودة إلى تسجيل الدخول',
    fieldRequired: 'هذا الحقل مطلوب',
  },
};

type Language = 'en' | 'fr' | 'ar';

interface ResetPasswordPageProps {
  onNavigate?: (page: string) => void;
  language?: Language;
}

export default function ResetPasswordPage({ onNavigate, language: propLanguage = 'en' }: ResetPasswordPageProps = {}) {
  const [language, setLanguage] = useState<Language>(propLanguage || 'en');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [isValidToken, setIsValidToken] = useState(true);
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });

  const t = translations[language];
  const isRTL = language === 'ar';

  useEffect(() => {
    // Check if we have a valid session (user clicked the reset link)
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setIsValidToken(false);
        setMessage({ type: 'error', text: t.invalidToken });
      }
    };

    checkSession();
  }, [t.invalidToken]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setMessage(null);

    // Validation
    if (!formData.password || !formData.confirmPassword) {
      setMessage({ type: 'error', text: t.fieldRequired });
      return;
    }

    if (formData.password.length < 6) {
      setMessage({ type: 'error', text: t.passwordTooShort });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: 'error', text: t.passwordMismatch });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: formData.password,
      });

      if (error) throw error;

      setMessage({ type: 'success', text: t.resetSuccess });

      // Redirect to auth page after 2 seconds
      setTimeout(() => {
        if (onNavigate) {
          onNavigate('auth');
        } else {
          window.location.href = '/auth';
        }
      }, 2000);
    } catch (error: any) {
      console.error('Reset password error:', error);
      setMessage({ type: 'error', text: error.message || t.resetError });
    } finally {
      setLoading(false);
    }
  };

  const handleBackToSignIn = () => {
    if (onNavigate) {
      onNavigate('auth');
    } else {
      window.location.href = '/auth';
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F7] flex" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Left Side - Logo */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#E3DECB] relative overflow-hidden items-center justify-center">
        <img 
          src="/logo_ouarda1.jpg" 
          alt="OUARDATIE Logo" 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          {/* Language Selector */}
          <div className="flex justify-end mb-8 gap-2">
            {(['en', 'fr', 'ar'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-3 py-1 text-xs rounded-full transition-all ${
                  language === lang
                    ? 'bg-[#8B7355] text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Mobile Brand Name */}
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-4xl font-light text-[#5C4A3A] mb-2 tracking-wider font-serif">
              {t.brand}
            </h1>
            <p className="text-gray-600 font-light">{t.tagline}</p>
          </div>

          {/* Message Display */}
          {message && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : message.type === 'info'
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              <p>{message.text}</p>
            </div>
          )}

          {isValidToken ? (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-light text-[#5C4A3A] mb-2">
                  {t.resetPassword}
                </h2>
              </div>

              {/* Form Fields */}
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-light text-gray-700 mb-2">
                    {t.newPassword}
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#8B7355] transition-colors text-gray-800"
                    required
                    minLength={6}
                  />
                </div>

                <div>
                  <label className="block text-sm font-light text-gray-700 mb-2">
                    {t.confirmPassword}
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#8B7355] transition-colors text-gray-800"
                    required
                    minLength={6}
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full py-4 bg-[#5C4A3A] text-white rounded-full text-sm font-light tracking-widest uppercase hover:bg-[#8B7355] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {loading ? (
                    isRTL ? 'جاري التحميل...' : language === 'fr' ? 'Chargement...' : 'Loading...'
                  ) : (
                    t.resetButton
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <button
                onClick={handleBackToSignIn}
                className="text-[#8B7355] hover:text-[#5C4A3A] font-light transition-colors"
              >
                {t.backToSignIn}
              </button>
            </div>
          )}

          {/* Back to Sign In Link */}
          {isValidToken && (
            <p className="text-center mt-8">
              <button
                type="button"
                onClick={handleBackToSignIn}
                className="text-sm text-[#8B7355] hover:text-[#5C4A3A] font-light transition-colors"
              >
                {t.backToSignIn}
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}