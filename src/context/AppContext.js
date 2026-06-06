import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';

// ── Translations (English + Hindi only) ──────────────────────────────────────
const TRANSLATIONS = {
  en: {
    tagline:          "India's Smartest 2-Wheeler Platform",
    heroTitle1:       'Find, Compare &',
    heroTitle2:       'Buy Your Perfect Ride',
    heroSub:          'BikeIQ covers every bike and scooter sold in India — real specs, on-road prices, AI-powered comparisons, and tools to help you decide with confidence.',
    searchPlaceholder:'Search any bike or scooter...',
    go:               'Go',
    featuredThisWeek: '🔥 Featured This Week',
    browseByType:     'Browse by Type',
    trendingSearches: 'Trending Searches',
    allBrands:        'All Brands',
    latestNews:       '📰 Latest 2-Wheeler News',
    latestNewsSub:    'Launches, updates & reviews — live',
    bikesListed:      'Bikes Listed',
    brands:           'Brands',
    citiesPriced:     'Cities Priced',
    bikeiqPlusTools:  'BikeIQ+ Tools',
    bikeiqPlusSub:    'Bike Quiz · Commute Finder · Insurance · Resale · Road Tax · AI Mechanic & more',
    scooters:         'Scooters',
    commuters:        'Commuters',
    sports:           'Sports',
    cruisers:         'Cruisers',
    adventure:        'Adventure',
    electric:         'Electric',
    selectLanguage:   'Select Language',
    login:            'Login',
    signIn:           'Sign In',
    signUp:           'Sign Up',
    createAccount:    'Create Account',
    welcomeBack:      'Welcome back',
    joinBikeIQ:       "Join BikeIQ — it's free",
    signInToBikeIQ:   'Sign in to BikeIQ',
    email:            'Email',
    password:         'Password',
    confirmPassword:  'Confirm Password',
    emailPlaceholder: 'you@example.com',
    passwordPlaceholder: '••••••••',
    noAccount:        "Don't have an account?",
    haveAccount:      'Already have an account?',
    signedOut:        'Signed out successfully',
    welcome:          'Welcome',
    linkCopied:       'Link copied!',
    invalidEmail:     'Enter a valid email address',
    passwordShort:    'Password must be at least 6 characters',
    passwordMismatch: 'Passwords do not match',
    emailExists:      'Email already registered. Please sign in.',
    invalidCredentials:'Incorrect email or password.',
    authError:        'Something went wrong. Please try again.',
    pleaseWait:       'Please wait...',
  },
  hi: {
    tagline:          'भारत का सबसे स्मार्ट 2-व्हीलर प्लेटफॉर्म',
    heroTitle1:       'खोजें, तुलना करें &',
    heroTitle2:       'अपनी परफेक्ट राइड खरीदें',
    heroSub:          'BikeIQ भारत में बिकने वाली हर बाइक और स्कूटर को कवर करता है — असली स्पेसिफिकेशन, ऑन-रोड कीमतें, AI तुलनाएं।',
    searchPlaceholder:'कोई भी बाइक या स्कूटर खोजें...',
    go:               'खोजें',
    featuredThisWeek: '🔥 इस हफ्ते की फीचर्ड बाइक्स',
    browseByType:     'प्रकार के अनुसार ब्राउज़ करें',
    trendingSearches: 'ट्रेंडिंग खोजें',
    allBrands:        'सभी ब्रांड',
    latestNews:       '📰 ताजा 2-व्हीलर न्यूज़',
    latestNewsSub:    'लॉन्च, अपडेट और रिव्यू — लाइव',
    bikesListed:      'बाइक्स लिस्टेड',
    brands:           'ब्रांड',
    citiesPriced:     'शहरों में कीमतें',
    bikeiqPlusTools:  'BikeIQ+ टूल्स',
    bikeiqPlusSub:    'बाइक क्विज़ · कम्यूट फाइंडर · बीमा · रीसेल · रोड टैक्स · AI मैकेनिक और अधिक',
    scooters:         'स्कूटर',
    commuters:        'कम्यूटर',
    sports:           'स्पोर्ट्स',
    cruisers:         'क्रूज़र',
    adventure:        'एडवेंचर',
    electric:         'इलेक्ट्रिक',
    selectLanguage:   'भाषा चुनें',
    login:            'लॉगिन',
    signIn:           'साइन इन',
    signUp:           'साइन अप',
    createAccount:    'खाता बनाएं',
    welcomeBack:      'वापस स्वागत है',
    joinBikeIQ:       'BikeIQ से जुड़ें — मुफ्त है',
    signInToBikeIQ:   'BikeIQ में साइन इन करें',
    email:            'ईमेल',
    password:         'पासवर्ड',
    confirmPassword:  'पासवर्ड की पुष्टि करें',
    emailPlaceholder: 'आपका@ईमेल.com',
    passwordPlaceholder: '••••••••',
    noAccount:        'खाता नहीं है?',
    haveAccount:      'पहले से खाता है?',
    signedOut:        'सफलतापूर्वक साइन आउट किया',
    welcome:          'स्वागत है',
    linkCopied:       'लिंक कॉपी हो गया!',
    invalidEmail:     'वैध ईमेल पता दर्ज करें',
    passwordShort:    'पासवर्ड कम से कम 6 अक्षर का होना चाहिए',
    passwordMismatch: 'पासवर्ड मेल नहीं खाते',
    emailExists:      'ईमेल पहले से रजिस्टर्ड है। साइन इन करें।',
    invalidCredentials:'गलत ईमेल या पासवर्ड।',
    authError:        'कुछ गलत हुआ। दोबारा कोशिश करें।',
    pleaseWait:       'कृपया प्रतीक्षा करें...',
  },
};

export function getT(lang) {
  const dict = TRANSLATIONS[lang] || TRANSLATIONS.en;
  return (key) => dict[key] ?? TRANSLATIONS.en[key] ?? key;
}

// ── Contexts ──────────────────────────────────────────────────────────────────
export const LangContext = createContext({ lang: 'en', setLang: () => {}, t: k => k });
export const UserContext = createContext({ user: null, setUser: () => {} });

export function useLang() { return useContext(LangContext); }
export function useUser() { return useContext(UserContext); }

// ── AppProvider — wrap around everything in App.js ────────────────────────────
export function AppProvider({ children }) {
  const [lang, setLangState] = useState(() => localStorage.getItem('bikeiq_lang') || 'en');
  const [user, setUser]      = useState(null);

  // Restore Supabase session on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data?.session?.user) {
        const u = data.session.user;
        setUser({ id: u.id, email: u.email, name: u.user_metadata?.name || u.email.split('@')[0] });
      }
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const u = session.user;
        setUser({ id: u.id, email: u.email, name: u.user_metadata?.name || u.email.split('@')[0] });
      } else {
        setUser(null);
      }
    });
    return () => listener?.subscription?.unsubscribe();
  }, []);

  const setLang = (code) => {
    setLangState(code);
    localStorage.setItem('bikeiq_lang', code);
  };

  const t = getT(lang);

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      <UserContext.Provider value={{ user, setUser }}>
        {children}
      </UserContext.Provider>
    </LangContext.Provider>
  );
}
