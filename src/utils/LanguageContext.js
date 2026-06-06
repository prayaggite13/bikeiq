import React, { createContext, useContext, useState } from 'react';

// ── All UI strings in English + Hindi ──────────────────────────────
export const STRINGS = {
  en: {
    // Nav
    home: 'Home', compare: 'Compare', news: 'News', ai: 'AI',
    bikeiqplus: 'BikeIQ+', saved: 'Saved',
    // Header
    search: 'Search', login: 'Login', signout: 'Sign Out',
    language: 'Language', share: 'Share',
    linkCopied: 'Link copied to clipboard!', couldNotCopy: 'Could not copy link',
    // Auth
    welcomeBack: 'Welcome back', createAccount: 'Create Account',
    signInTo: 'Sign in to BikeIQ', joinBikeIQ: 'Join BikeIQ — it\'s free',
    email: 'Email', password: 'Password',
    signIn: 'Sign In', signUp: 'Sign Up',
    noAccount: "Don't have an account?", haveAccount: 'Already have an account?',
    pleaseWait: 'Please wait...', welcome: 'Welcome',
    signedOut: 'Signed out successfully',
    invalidEmail: 'Enter a valid email address',
    shortPassword: 'Password must be at least 6 characters',
    emailExists: 'This email is already registered. Please sign in.',
    wrongCredentials: 'Incorrect email or password.',
    authError: 'Something went wrong. Please try again.',
    // Home
    platformBadge: "India's Smartest 2-Wheeler Platform",
    heroTitle1: 'Find, Compare &',
    heroTitle2: 'Buy Your Perfect Ride',
    heroDesc: 'BikeIQ covers every bike and scooter sold in India — real specs, on-road prices city-by-city, AI-powered comparisons, and tools to help you decide with confidence.',
    searchPlaceholder: 'Search any bike or scooter...',
    featuresSearch: 'Search 500+ bikes', featuresCompare: 'Compare up to 3',
    featuresEV: 'EV range & costs', featuresAI: 'AI insights',
    featuresNews: 'Live news', featuresPrices: 'On-road prices',
    statBikes: 'Bikes Listed', statBrands: 'Brands', statCities: 'Cities Priced',
    featuredWeek: '🔥 Featured This Week',
    browseType: 'Browse by Type', trendingSearches: 'Trending Searches',
    allBrands: 'All Brands', latestNews: '📰 Latest 2-Wheeler News',
    newsLive: 'Launches, updates & reviews — live',
    bikeiqPlusTools: 'BikeIQ+ Tools',
    bikeiqPlusDesc: 'Bike Quiz · Commute Finder · Insurance · Resale · Road Tax · AI Mechanic & more',
    retry: 'Retry', couldNotLoad: 'Could not load featured bikes.',
    scooters: 'Scooters', commuters: 'Commuters', sports: 'Sports',
    cruisers: 'Cruisers', adventure: 'Adventure', electric: 'Electric',
    // News
    liveNews: '📰 Live News', aiPowered: 'AI POWERED',
    bikeiqEngine: 'BikeIQ News Engine', generatingNews: 'Generating latest news...',
    noArticles: 'No articles found', tryDifferentFilter: 'Try a different filter or refresh',
    readFullArticle: 'Read full article', couldNotLoadNews: 'Could not load news. Check your Groq API key.',
    tryAgain: 'Try Again',
    allNews: 'All News', launches: '🚀 Launches', ev: '⚡ EV',
    reviews: '🏍️ Reviews', prices: '💰 Prices',
    royalEnfield: '🏆 Royal Enfield', ktmBajaj: '🟠 KTM Bajaj',
    // BikeIQ+
    premiumTools: 'Premium AI Tools', diagnoseLocate: 'Diagnose, locate, advise — all in one place',
    // General
    onwards: 'onwards', loading: 'Loading...', error: 'Error',
    go: 'Go',
  },

  hi: {
    // Nav
    home: 'होम', compare: 'तुलना', news: 'समाचार', ai: 'AI',
    bikeiqplus: 'BikeIQ+', saved: 'सेव किया',
    // Header
    search: 'खोजें', login: 'लॉगिन', signout: 'साइन आउट',
    language: 'भाषा', share: 'शेयर',
    linkCopied: 'लिंक कॉपी हो गया!', couldNotCopy: 'लिंक कॉपी नहीं हुई',
    // Auth
    welcomeBack: 'वापस स्वागत है', createAccount: 'खाता बनाएं',
    signInTo: 'BikeIQ में साइन इन करें', joinBikeIQ: 'BikeIQ से जुड़ें — निःशुल्क',
    email: 'ईमेल', password: 'पासवर्ड',
    signIn: 'साइन इन', signUp: 'साइन अप',
    noAccount: 'खाता नहीं है?', haveAccount: 'पहले से खाता है?',
    pleaseWait: 'कृपया प्रतीक्षा करें...', welcome: 'स्वागत है',
    signedOut: 'सफलतापूर्वक साइन आउट किया',
    invalidEmail: 'सही ईमेल पता दर्ज करें',
    shortPassword: 'पासवर्ड कम से कम 6 अक्षर का होना चाहिए',
    emailExists: 'यह ईमेल पहले से रजिस्टर है। कृपया साइन इन करें।',
    wrongCredentials: 'गलत ईमेल या पासवर्ड।',
    authError: 'कुछ गड़बड़ हुई। दोबारा कोशिश करें।',
    // Home
    platformBadge: 'भारत का सबसे स्मार्ट 2-व्हीलर प्लेटफॉर्म',
    heroTitle1: 'खोजें, तुलना करें और',
    heroTitle2: 'अपनी परफेक्ट बाइक पाएं',
    heroDesc: 'BikeIQ भारत में बिकने वाली हर बाइक और स्कूटर को कवर करता है — असली स्पेक्स, शहर के अनुसार ऑन-रोड कीमत, AI तुलना और आपके निर्णय में मदद।',
    searchPlaceholder: 'कोई भी बाइक या स्कूटर खोजें...',
    featuresSearch: '500+ बाइक खोजें', featuresCompare: '3 तक तुलना करें',
    featuresEV: 'EV रेंज और लागत', featuresAI: 'AI जानकारी',
    featuresNews: 'लाइव समाचार', featuresPrices: 'ऑन-रोड कीमत',
    statBikes: 'बाइक सूचीबद्ध', statBrands: 'ब्रांड', statCities: 'शहर कीमत में',
    featuredWeek: '🔥 इस सप्ताह की खास बाइक',
    browseType: 'प्रकार से देखें', trendingSearches: 'ट्रेंडिंग खोज',
    allBrands: 'सभी ब्रांड', latestNews: '📰 ताज़ा 2-व्हीलर समाचार',
    newsLive: 'लॉन्च, अपडेट और समीक्षा — लाइव',
    bikeiqPlusTools: 'BikeIQ+ टूल्स',
    bikeiqPlusDesc: 'बाइक क्विज़ · कम्यूट फाइंडर · बीमा · रीसेल · रोड टैक्स · AI मैकेनिक और अधिक',
    retry: 'पुनः प्रयास', couldNotLoad: 'फीचर्ड बाइक लोड नहीं हुईं।',
    scooters: 'स्कूटर', commuters: 'कम्यूटर', sports: 'स्पोर्ट्स',
    cruisers: 'क्रूज़र', adventure: 'एडवेंचर', electric: 'इलेक्ट्रिक',
    // News
    liveNews: '📰 लाइव समाचार', aiPowered: 'AI संचालित',
    bikeiqEngine: 'BikeIQ न्यूज़ इंजन', generatingNews: 'ताज़ा समाचार तैयार हो रहे हैं...',
    noArticles: 'कोई लेख नहीं मिला', tryDifferentFilter: 'दूसरा फिल्टर या रिफ्रेश करें',
    readFullArticle: 'पूरा लेख पढ़ें', couldNotLoadNews: 'समाचार लोड नहीं हुए। Groq API की जाँच करें।',
    tryAgain: 'दोबारा कोशिश करें',
    allNews: 'सभी समाचार', launches: '🚀 लॉन्च', ev: '⚡ EV',
    reviews: '🏍️ समीक्षा', prices: '💰 कीमतें',
    royalEnfield: '🏆 Royal Enfield', ktmBajaj: '🟠 KTM Bajaj',
    // BikeIQ+
    premiumTools: 'प्रीमियम AI टूल्स', diagnoseLocate: 'निदान, खोज, सलाह — एक ही जगह',
    // General
    onwards: 'से शुरू', loading: 'लोड हो रहा है...', error: 'त्रुटि',
    go: 'खोजें',
  },
};

const LanguageContext = createContext({
  lang: 'en', setLang: () => {}, t: (k) => k,
});

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => localStorage.getItem('bikeiq_lang') || 'en');

  const setLang = (code) => {
    setLangState(code);
    localStorage.setItem('bikeiq_lang', code);
  };

  const t = (key) => STRINGS[lang]?.[key] || STRINGS['en']?.[key] || key;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}
