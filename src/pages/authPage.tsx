import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const translations = {
  en: {
    welcome: 'Welcome to',
    brand: 'OUARDATIE',
    tagline: 'Where comfort meets beauty',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    email: 'Email Address',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    fullName: 'Full Name',
    phoneNumber: 'Phone Number',
    wilaya: 'Wilaya',
    commune: 'Commune',
    forgotPassword: 'Forgot password?',
    rememberMe: 'Remember me',
    noAccount: "Don't have an account?",
    haveAccount: 'Already have an account?',
    signInButton: 'Sign In',
    signUpButton: 'Create Account',
    orContinue: 'Or continue with',
    google: 'Google',
    passwordMismatch: 'Passwords do not match',
    signUpSuccess: 'Account created successfully! Please check your email to verify your account before signing in.',
    signInSuccess: 'Welcome back!',
    error: 'An error occurred. Please try again.',
    fieldRequired: 'This field is required',
    emailNotConfirmed: 'Please verify your email before signing in. Check your inbox for the confirmation link.',
    resendConfirmation: 'Resend confirmation email',
    confirmationResent: 'Confirmation email resent! Please check your inbox.',
  },
  fr: {
    welcome: 'Bienvenue chez',
    brand: 'OUARDATIE',
    tagline: 'Où le confort rencontre la beauté',
    signIn: 'Connexion',
    signUp: 'Inscription',
    email: 'Adresse e-mail',
    password: 'Mot de passe',
    confirmPassword: 'Confirmer le mot de passe',
    fullName: 'Nom complet',
    phoneNumber: 'Numéro de téléphone',
    wilaya: 'Wilaya',
    commune: 'Commune',
    forgotPassword: 'Mot de passe oublié?',
    rememberMe: 'Se souvenir de moi',
    noAccount: "Pas de compte?",
    haveAccount: 'Vous avez déjà un compte?',
    signInButton: 'Se connecter',
    signUpButton: 'Créer un compte',
    orContinue: 'Ou continuer avec',
    google: 'Google',
    passwordMismatch: 'Les mots de passe ne correspondent pas',
    signUpSuccess: 'Compte créé avec succès! Veuillez vérifier votre email pour activer votre compte avant de vous connecter.',
    signInSuccess: 'Bon retour!',
    error: 'Une erreur est survenue. Réessayez.',
    fieldRequired: 'Ce champ est obligatoire',
    emailNotConfirmed: 'Veuillez vérifier votre email avant de vous connecter. Consultez votre boîte de réception.',
    resendConfirmation: 'Renvoyer l\'email de confirmation',
    confirmationResent: 'Email de confirmation renvoyé! Consultez votre boîte de réception.',
  },
  ar: {
    welcome: 'مرحباً بك في',
    brand: 'ورداتي',
    tagline: 'حيث تلتقي الراحة بالجمال',
    signIn: 'تسجيل الدخول',
    signUp: 'إنشاء حساب',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    confirmPassword: 'تأكيد كلمة المرور',
    fullName: 'الاسم الكامل',
    phoneNumber: 'رقم الهاتف',
    wilaya: 'الولاية',
    commune: 'البلدية',
    forgotPassword: 'نسيت كلمة المرور؟',
    rememberMe: 'تذكرني',
    noAccount: "ليس لديك حساب؟",
    haveAccount: 'لديك حساب بالفعل؟',
    signInButton: 'تسجيل الدخول',
    signUpButton: 'إنشاء حساب',
    orContinue: 'أو المتابعة مع',
    google: 'جوجل',
    passwordMismatch: 'كلمات المرور غير متطابقة',
    signUpSuccess: 'تم إنشاء الحساب بنجاح! يرجى التحقق من بريدك الإلكتروني لتفعيل حسابك قبل تسجيل الدخول.',
    signInSuccess: 'مرحباً بعودتك!',
    error: 'حدث خطأ. يرجى المحاولة مرة أخرى.',
    fieldRequired: 'هذا الحقل مطلوب',
    emailNotConfirmed: 'يرجى التحقق من بريدك الإلكتروني قبل تسجيل الدخول. تحقق من صندوق الوارد الخاص بك.',
    resendConfirmation: 'إعادة إرسال بريد التأكيد',
    confirmationResent: 'تم إعادة إرسال بريد التأكيد! تحقق من صندوق الوارد الخاص بك.',
  },
};

type Language = 'en' | 'fr' | 'ar';

interface AuthPageProps {
  onNavigate?: (page: string) => void;
  language?: Language;
}

export default function AuthPage({ onNavigate, language: propLanguage = 'en' }: AuthPageProps = {}) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [language, setLanguage] = useState<Language>(propLanguage || 'en');
  const [wilayas, setWilayas] = useState<Array<{ id: string; wilaya: string }>>([]);
  const [allCommunes, setAllCommunes] = useState<Array<{ id: string; commune_name: string; wilaya: string }>>([]);
  const [filteredCommunes, setFilteredCommunes] = useState<Array<{ id: string; commune_name: string; wilaya: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [showResendConfirmation, setShowResendConfirmation] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phoneNumber: '',
    wilaya: '',
    commune: '',
    rememberMe: false,
  });

  const t = translations[language];
  const isRTL = language === 'ar';

  // Load wilayas and communes from Supabase
  useEffect(() => {
    loadWilayas();
    loadCommunes();
  }, []);

  // Filter communes when wilaya changes
  useEffect(() => {
    if (formData.wilaya) {
      const communesForWilaya = allCommunes.filter(
        commune => commune.wilaya === formData.wilaya
      );
      setFilteredCommunes(communesForWilaya);
    } else {
      setFilteredCommunes([]);
    }
  }, [formData.wilaya, allCommunes]);

  const loadWilayas = async () => {
    const { data } = await supabase
      .from('shipping_options')
      .select('*')
      .order('wilaya');
    
    if (data) {
      setWilayas(data);
    }
  };

  const loadCommunes = async () => {
    const { data } = await supabase
      .from('communes')
      .select('*')
      .order('commune_name');
    
    if (data) {
      setAllCommunes(data);
    }
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      if (isSignUp) {
        // Validate sign up form
        if (!formData.fullName || !formData.email || !formData.password || 
            !formData.phoneNumber || !formData.wilaya || !formData.commune) {
          setMessage({ type: 'error', text: t.fieldRequired });
          setLoading(false);
          return;
        }

        if (formData.password !== formData.confirmPassword) {
          setMessage({ type: 'error', text: t.passwordMismatch });
          setLoading(false);
          return;
        }

        // Sign up user with all metadata
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            emailRedirectTo: `${window.location.origin}/home`,
            data: {
              full_name: formData.fullName,
              phone_number: formData.phoneNumber,
              wilaya: formData.wilaya,
              commune: formData.commune,
            },
          },
        });

        if (authError) throw authError;

        if (authData.user) {
          // Create profile directly - this is more reliable than waiting for trigger
          try {
            const { error: profileError } = await supabase
              .from('profiles')
              .insert({
                id: authData.user.id,
                full_name: formData.fullName,
                phone_number: formData.phoneNumber,
                wilaya: formData.wilaya,
                commune: formData.commune,
                is_admin: false,
              });

            // If insert fails due to unique constraint (trigger already created it), try update
            if (profileError && profileError.code === '23505') {
              await supabase
                .from('profiles')
                .update({
                  full_name: formData.fullName,
                  phone_number: formData.phoneNumber,
                  wilaya: formData.wilaya,
                  commune: formData.commune,
                  updated_at: new Date().toISOString(),
                })
                .eq('id', authData.user.id);
            } else if (profileError) {
              console.error('Profile creation error:', profileError);
            }
          } catch (profileErr) {
            console.error('Profile creation exception:', profileErr);
          }
          
          setMessage({ type: 'success', text: t.signUpSuccess });
          
          // Switch to sign in mode
          setTimeout(() => {
            setIsSignUp(false);
            setFormData(prev => ({
              ...prev,
              password: '',
              confirmPassword: '',
              fullName: '',
              phoneNumber: '',
              wilaya: '',
              commune: '',
            }));
          }, 3000);
        }
      } else {
        // Sign in user
        if (!formData.email || !formData.password) {
          setMessage({ type: 'error', text: t.fieldRequired });
          setLoading(false);
          return;
        }

        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) {
          // Check if error is email not confirmed
          if (error.message.includes('Email not confirmed') || error.message.includes('email_not_confirmed')) {
            setMessage({ type: 'info', text: t.emailNotConfirmed });
            setShowResendConfirmation(true);
            setLoading(false);
            return;
          }
          throw error;
        }

        setMessage({ type: 'success', text: t.signInSuccess });
        
        // Redirect to home after successful login
        setTimeout(() => {
          if (onNavigate) onNavigate('home');
        }, 1000);
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || t.error });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      // Reset commune when wilaya changes
      ...(name === 'wilaya' ? { commune: '' } : {})
    }));
  };

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/home`,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || t.error });
    }
  };

  const handleResendConfirmation = async () => {
    if (!formData.email) {
      setMessage({ type: 'error', text: t.fieldRequired });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: formData.email,
      });

      if (error) throw error;

      setMessage({ type: 'success', text: t.confirmationResent });
      setShowResendConfirmation(false);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || t.error });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F7] flex" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Left Side - Image/Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#5C4A3A] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-white via-transparent to-white" />
        </div>
        
        {/* Decorative floral pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="floral" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="1" fill="white" />
              <path d="M10 8 Q 12 10 10 12 Q 8 10 10 8" fill="white" />
            </pattern>
            <rect width="100" height="100" fill="url(#floral)" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-white">
          <div className="max-w-md text-center">
            <h1 className="text-5xl font-light mb-4 tracking-tight font-serif">
              {t.welcome}
            </h1>
            <h2 className="text-6xl font-light mb-6 tracking-wider">
              {t.brand}
            </h2>
            <p className="text-xl text-white/80 font-light leading-relaxed">
              {t.tagline}
            </p>
            
            {/* Decorative flower icon */}
            <div className="mt-12">
              <svg className="w-16 h-16 mx-auto text-white/30" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C11.5 2 11 2.19 10.59 2.59L2.59 10.59C1.8 11.37 1.8 12.63 2.59 13.41L10.59 21.41C11.37 22.2 12.63 22.2 13.41 21.41L21.41 13.41C22.2 12.63 22.2 11.37 21.41 10.59L13.41 2.59C13 2.19 12.5 2 12 2M12 6L18 12L12 18L6 12L12 6Z" />
              </svg>
            </div>
          </div>
        </div>
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
              {showResendConfirmation && (
                <button
                  onClick={handleResendConfirmation}
                  disabled={loading}
                  className="mt-3 text-sm underline hover:no-underline disabled:opacity-50"
                >
                  {t.resendConfirmation}
                </button>
              )}
            </div>
          )}

          {/* Tab Switcher */}
          <div className="flex bg-white rounded-full p-1 mb-8 shadow-sm">
            <button
              onClick={() => setIsSignUp(false)}
              className={`flex-1 py-3 rounded-full text-sm font-light tracking-wide transition-all ${
                !isSignUp
                  ? 'bg-[#5C4A3A] text-white'
                  : 'text-gray-600 hover:text-[#5C4A3A]'
              }`}
            >
              {t.signIn}
            </button>
            <button
              onClick={() => setIsSignUp(true)}
              className={`flex-1 py-3 rounded-full text-sm font-light tracking-wide transition-all ${
                isSignUp
                  ? 'bg-[#5C4A3A] text-white'
                  : 'text-gray-600 hover:text-[#5C4A3A]'
              }`}
            >
              {t.signUp}
            </button>
          </div>

          {/* Form Fields */}
          <div className="space-y-5">
            {isSignUp && (
              <>
                <div>
                  <label className="block text-sm font-light text-gray-700 mb-2">
                    {t.fullName}
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#8B7355] transition-colors text-gray-800"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-light text-gray-700 mb-2">
                    {t.phoneNumber}
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="0555 00 00 00"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#8B7355] transition-colors text-gray-800"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-light text-gray-700 mb-2">
                      {t.wilaya}
                    </label>
                    <select
                      name="wilaya"
                      value={formData.wilaya}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#8B7355] transition-colors text-gray-800"
                      required
                    >
                      <option value="">{isRTL ? 'اختر الولاية' : language === 'fr' ? 'Sélectionnez' : 'Select'}</option>
                      {wilayas.map((wilaya) => (
                        <option key={wilaya.id} value={wilaya.wilaya}>
                          {wilaya.wilaya}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-light text-gray-700 mb-2">
                      {t.commune}
                    </label>
                    <select
                      name="commune"
                      value={formData.commune}
                      onChange={handleChange}
                      disabled={!formData.wilaya}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#8B7355] transition-colors text-gray-800 disabled:bg-gray-50 disabled:cursor-not-allowed"
                      required
                    >
                      <option value="">{isRTL ? 'اختر البلدية' : language === 'fr' ? 'Sélectionnez' : 'Select'}</option>
                      {filteredCommunes.map((commune) => (
                        <option key={commune.id} value={commune.commune_name}>
                          {commune.commune_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-light text-gray-700 mb-2">
                {t.email}
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#8B7355] transition-colors text-gray-800"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-light text-gray-700 mb-2">
                {t.password}
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#8B7355] transition-colors text-gray-800"
                required
              />
            </div>

            {isSignUp && (
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
                />
              </div>
            )}

            {!isSignUp && (
              <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <label className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="w-4 h-4 text-[#8B7355] border-gray-300 rounded focus:ring-[#8B7355]"
                  />
                  <span className="text-sm text-gray-600 font-light">
                    {t.rememberMe}
                  </span>
                </label>
                <button
                  type="button"
                  className="text-sm text-[#8B7355] hover:text-[#5C4A3A] font-light transition-colors"
                >
                  {t.forgotPassword}
                </button>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-4 bg-[#5C4A3A] text-white rounded-full text-sm font-light tracking-widest uppercase hover:bg-[#8B7355] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (isRTL ? 'جاري التحميل...' : language === 'fr' ? 'Chargement...' : 'Loading...') : (isSignUp ? t.signUpButton : t.signInButton)}
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-4 bg-[#FAF9F7] text-gray-500 font-light">
                {t.orContinue}
              </span>
            </div>
          </div>

          {/* Social Login */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full py-3 bg-white border border-gray-200 rounded-full text-sm font-light text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-3 shadow-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {t.google}
          </button>

          {/* Toggle Link */}
          <p className="text-center mt-8 text-sm text-gray-600 font-light">
            {isSignUp ? t.haveAccount : t.noAccount}{' '}
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-[#8B7355] hover:text-[#5C4A3A] font-normal transition-colors"
            >
              {isSignUp ? t.signIn : t.signUp}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}