import React, { useState, useCallback, useEffect, useRef, createContext, useContext } from 'react';
import { Search, Moon, Sun, Zap, Share2, Check, X, MapPin, Globe, User, LogOut, Mail, Lock, Eye, EyeOff, ChevronDown } from 'lucide-react';
import { supabase } from '../utils/supabase';

// ─────────────────────────────────────────────────────────────────────────────
// LANGUAGE CONTEXT — provides t() translation function throughout app
// ─────────────────────────────────────────────────────────────────────────────
const TRANSLATIONS = {
  en: {
    tagline: "India's Smartest 2-Wheeler Platform",
    heroTitle1: 'Find, Compare &',
    heroTitle2: 'Buy Your Perfect Ride',
    heroSub: 'BikeIQ covers every bike and scooter sold in India — real specs, on-road prices city-by-city, AI-powered comparisons, and tools to help you decide with confidence.',
    searchPlaceholder: 'Search any bike or scooter...',
    go: 'Go',
    featuredThisWeek: '🔥 Featured This Week',
    browseByType: 'Browse by Type',
    trendingSearches: 'Trending Searches',
    allBrands: 'All Brands',
    latestNews: '📰 Latest 2-Wheeler News',
    latestNewsSub: 'Launches, updates & reviews — live',
    bikesListed: 'Bikes Listed',
    brands: 'Brands',
    citiesPriced: 'Cities Priced',
    bikeiqPlusTools: 'BikeIQ+ Tools',
    bikeiqPlusSub: 'Bike Quiz · Commute Finder · Insurance · Resale · Road Tax · AI Mechanic & more',
    trendingIn: 'Trending in',
    pricesIn: 'Prices in',
    selectCity: 'Select City',
    detectLocation: 'Detect my location',
    cityUpdated: 'City updated to',
    selectLanguage: 'Select Language',
    login: 'Login',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    createAccount: 'Create Account',
    welcomeBack: 'Welcome back',
    joinBikeIQ: "Join BikeIQ — it's free",
    signInToBikeIQ: 'Sign in to BikeIQ',
    email: 'Email',
    password: 'Password',
    emailPlaceholder: 'you@example.com',
    passwordPlaceholder: '••••••••',
    noAccount: "Don't have an account?",
    haveAccount: 'Already have an account?',
    signedOut: 'Signed out successfully',
    welcome: 'Welcome',
    linkCopied: 'Link copied to clipboard!',
    locationDenied: 'Location access denied',
    locationError: 'Could not detect city',
    invalidEmail: 'Enter a valid email address',
    passwordShort: 'Password must be at least 6 characters',
    emailExists: 'Email already registered. Please sign in.',
    invalidCredentials: 'Incorrect email or password.',
    authError: 'Something went wrong. Please try again.',
    confirmPassword: 'Confirm Password',
    passwordMismatch: 'Passwords do not match',
    searching: 'Searching...',
    scooters: 'Scooters', commuters: 'Commuters', sports: 'Sports',
    cruisers: 'Cruisers', adventure: 'Adventure', electric: 'Electric',
  },
  hi: {
    tagline: 'भारत का सबसे स्मार्ट 2-व्हीलर प्लेटफॉर्म',
    heroTitle1: 'खोजें, तुलना करें &',
    heroTitle2: 'अपनी परफेक्ट राइड खरीदें',
    heroSub: 'BikeIQ भारत में बिकने वाली हर बाइक और स्कूटर को कवर करता है — असली स्पेसिफिकेशन, शहर-दर-शहर ऑन-रोड कीमतें, AI-पावर्ड तुलनाएं।',
    searchPlaceholder: 'कोई भी बाइक या स्कूटर खोजें...',
    go: 'खोजें',
    featuredThisWeek: '🔥 इस हफ्ते की फीचर्ड बाइक्स',
    browseByType: 'प्रकार के अनुसार ब्राउज़ करें',
    trendingSearches: 'ट्रेंडिंग खोजें',
    allBrands: 'सभी ब्रांड',
    latestNews: '📰 ताजा 2-व्हीलर न्यूज़',
    latestNewsSub: 'लॉन्च, अपडेट और रिव्यू — लाइव',
    bikesListed: 'बाइक्स लिस्टेड',
    brands: 'ब्रांड',
    citiesPriced: 'शहरों में कीमतें',
    bikeiqPlusTools: 'BikeIQ+ टूल्स',
    bikeiqPlusSub: 'बाइक क्विज़ · कम्यूट फाइंडर · बीमा · रीसेल · रोड टैक्स · AI मैकेनिक और अधिक',
    trendingIn: 'ट्रेंडिंग इन',
    pricesIn: 'कीमतें',
    selectCity: 'शहर चुनें',
    detectLocation: 'मेरी लोकेशन पहचानें',
    cityUpdated: 'शहर अपडेट किया गया',
    selectLanguage: 'भाषा चुनें',
    login: 'लॉगिन',
    signIn: 'साइन इन',
    signUp: 'साइन अप',
    createAccount: 'खाता बनाएं',
    welcomeBack: 'वापस स्वागत है',
    joinBikeIQ: 'BikeIQ से जुड़ें — मुफ्त है',
    signInToBikeIQ: 'BikeIQ में साइन इन करें',
    email: 'ईमेल',
    password: 'पासवर्ड',
    emailPlaceholder: 'आपका@ईमेल.com',
    passwordPlaceholder: '••••••••',
    noAccount: 'खाता नहीं है?',
    haveAccount: 'पहले से खाता है?',
    signedOut: 'सफलतापूर्वक साइन आउट किया',
    welcome: 'स्वागत है',
    linkCopied: 'लिंक कॉपी हो गया!',
    locationDenied: 'लोकेशन एक्सेस अस्वीकार',
    locationError: 'शहर नहीं पहचान सका',
    invalidEmail: 'वैध ईमेल पता दर्ज करें',
    passwordShort: 'पासवर्ड कम से कम 6 अक्षर का होना चाहिए',
    emailExists: 'ईमेल पहले से रजिस्टर्ड है। साइन इन करें।',
    invalidCredentials: 'गलत ईमेल या पासवर्ड।',
    authError: 'कुछ गलत हुआ। दोबारा कोशिश करें।',
    confirmPassword: 'पासवर्ड की पुष्टि करें',
    passwordMismatch: 'पासवर्ड मेल नहीं खाते',
    searching: 'खोज रहे हैं...',
    scooters: 'स्कूटर', commuters: 'कम्यूटर', sports: 'स्पोर्ट्स',
    cruisers: 'क्रूज़र', adventure: 'एडवेंचर', electric: 'इलेक्ट्रिक',
  },
  ta: {
    tagline: 'இந்தியாவின் சிறந்த 2-வீலர் தளம்',
    heroTitle1: 'தேடுங்கள், ஒப்பிடுங்கள் &',
    heroTitle2: 'உங்கள் சரியான வாகனம் வாங்குங்கள்',
    heroSub: 'BikeIQ இந்தியாவில் விற்கப்படும் ஒவ்வொரு பைக்கையும் ஸ்கூட்டரையும் உள்ளடக்கியது — உண்மையான விவரக்குறிப்புகள், நகரம்-வாரியான விலைகள்.',
    searchPlaceholder: 'எந்த பைக் அல்லது ஸ்கூட்டரையும் தேடுங்கள்...',
    go: 'தேடு',
    featuredThisWeek: '🔥 இந்த வாரம் சிறப்பு',
    browseByType: 'வகை அடிப்படையில் உலாவுங்கள்',
    trendingSearches: 'டிரெண்டிங் தேடல்கள்',
    allBrands: 'அனைத்து பிராண்டுகள்',
    latestNews: '📰 புதிய 2-வீலர் செய்திகள்',
    latestNewsSub: 'வெளியீடுகள், புதுப்பிப்புகள் & மதிப்புரைகள்',
    bikesListed: 'பைக்குகள்',
    brands: 'பிராண்டுகள்',
    citiesPriced: 'நகரங்கள்',
    bikeiqPlusTools: 'BikeIQ+ கருவிகள்',
    bikeiqPlusSub: 'பைக் வினாடி வினா · காமுட் ஃபைண்டர் · காப்பீடு · மறுவிற்பனை · சாலை வரி · AI மெக்கானிக்',
    trendingIn: 'டிரெண்டிங் இன்',
    pricesIn: 'விலைகள்',
    selectCity: 'நகரம் தேர்ந்தெடுக்கவும்',
    detectLocation: 'என் இருப்பிடத்தை கண்டறி',
    cityUpdated: 'நகரம் புதுப்பிக்கப்பட்டது',
    selectLanguage: 'மொழி தேர்வு',
    login: 'உள்நுழைய',
    signIn: 'உள்நுழைக',
    signUp: 'பதிவு செய்க',
    createAccount: 'கணக்கு உருவாக்கு',
    welcomeBack: 'மீண்டும் வரவேற்கிறோம்',
    joinBikeIQ: 'BikeIQ-ல் சேருங்கள் — இலவசம்',
    signInToBikeIQ: 'BikeIQ-ல் உள்நுழைக',
    email: 'மின்னஞ்சல்',
    password: 'கடவுச்சொல்',
    emailPlaceholder: 'உங்கள்@மின்னஞ்சல்.com',
    passwordPlaceholder: '••••••••',
    noAccount: 'கணக்கு இல்லையா?',
    haveAccount: 'ஏற்கனவே கணக்கு உள்ளதா?',
    signedOut: 'வெற்றிகரமாக வெளியேறினீர்கள்',
    welcome: 'வரவேற்கிறோம்',
    linkCopied: 'இணைப்பு நகலெடுக்கப்பட்டது!',
    locationDenied: 'இருப்பிட அணுகல் மறுக்கப்பட்டது',
    locationError: 'நகரம் கண்டறிய முடியவில்லை',
    invalidEmail: 'சரியான மின்னஞ்சல் உள்ளிடவும்',
    passwordShort: 'கடவுச்சொல் குறைந்தது 6 எழுத்துக்கள் இருக்க வேண்டும்',
    emailExists: 'மின்னஞ்சல் ஏற்கனவே பதிவு செய்யப்பட்டது.',
    invalidCredentials: 'தவறான மின்னஞ்சல் அல்லது கடவுச்சொல்.',
    authError: 'ஏதோ தவறு நடந்தது. மீண்டும் முயற்சிக்கவும்.',
    confirmPassword: 'கடவுச்சொல் உறுதிப்படுத்தவும்',
    passwordMismatch: 'கடவுச்சொற்கள் பொருந்தவில்லை',
    searching: 'தேடுகிறது...',
    scooters: 'ஸ்கூட்டர்கள்', commuters: 'கம்யூட்டர்கள்', sports: 'ஸ்போர்ட்ஸ்',
    cruisers: 'க்ரூசர்கள்', adventure: 'அட்வென்சர்', electric: 'மின்சார',
  },
  te: {
    tagline: 'భారతదేశపు తెలివైన 2-వీలర్ ప్లాట్‌ఫారమ్',
    heroTitle1: 'వెతకండి, పోల్చండి &',
    heroTitle2: 'మీ పర్ఫెక్ట్ రైడ్ కొనండి',
    heroSub: 'BikeIQ భారతదేశంలో అమ్ముడయ్యే ప్రతి బైక్ మరియు స్కూటర్‌ను కవర్ చేస్తుంది — నిజమైన స్పెసిఫికేషన్లు, నగరం వారీగా ధరలు.',
    searchPlaceholder: 'ఏదైనా బైక్ లేదా స్కూటర్ వెతకండి...',
    go: 'వెతకు',
    featuredThisWeek: '🔥 ఈ వారం ఫీచర్డ్',
    browseByType: 'రకం ద్వారా బ్రౌజ్ చేయండి',
    trendingSearches: 'ట్రెండింగ్ శోధనలు',
    allBrands: 'అన్ని బ్రాండ్లు',
    latestNews: '📰 తాజా 2-వీలర్ వార్తలు',
    latestNewsSub: 'లాంచ్‌లు, అప్‌డేట్‌లు & రివ్యూలు',
    bikesListed: 'బైక్‌లు',
    brands: 'బ్రాండ్లు',
    citiesPriced: 'నగరాలు',
    bikeiqPlusTools: 'BikeIQ+ టూల్స్',
    bikeiqPlusSub: 'బైక్ క్విజ్ · కమ్యూట్ ఫైండర్ · బీమా · రీసేల్ · రోడ్ ట్యాక్స్ · AI మెకానిక్',
    trendingIn: 'ట్రెండింగ్ ఇన్',
    pricesIn: 'ధరలు',
    selectCity: 'నగరం ఎంచుకోండి',
    detectLocation: 'నా లొకేషన్ గుర్తించు',
    cityUpdated: 'నగరం అప్‌డేట్ అయింది',
    selectLanguage: 'భాష ఎంచుకోండి',
    login: 'లాగిన్',
    signIn: 'సైన్ ఇన్',
    signUp: 'సైన్ అప్',
    createAccount: 'ఖాతా సృష్టించు',
    welcomeBack: 'తిరిగి స్వాగతం',
    joinBikeIQ: 'BikeIQ లో చేరండి — ఉచితం',
    signInToBikeIQ: 'BikeIQ లో సైన్ ఇన్ చేయండి',
    email: 'ఇమెయిల్',
    password: 'పాస్‌వర్డ్',
    emailPlaceholder: 'మీరు@ఇమెయిల్.com',
    passwordPlaceholder: '••••••••',
    noAccount: 'ఖాతా లేదా?',
    haveAccount: 'ఇప్పటికే ఖాతా ఉందా?',
    signedOut: 'విజయవంతంగా సైన్ అవుట్ అయ్యారు',
    welcome: 'స్వాగతం',
    linkCopied: 'లింక్ కాపీ అయింది!',
    locationDenied: 'లొకేషన్ యాక్సెస్ తిరస్కరించబడింది',
    locationError: 'నగరం గుర్తించలేకపోయాం',
    invalidEmail: 'చెల్లుబాటు అయ్యే ఇమెయిల్ నమోదు చేయండి',
    passwordShort: 'పాస్‌వర్డ్ కనీసం 6 అక్షరాలు ఉండాలి',
    emailExists: 'ఇమెయిల్ ఇప్పటికే నమోదు చేయబడింది.',
    invalidCredentials: 'తప్పు ఇమెయిల్ లేదా పాస్‌వర్డ్.',
    authError: 'ఏదో తప్పు జరిగింది. మళ్ళీ ప్రయత్నించండి.',
    confirmPassword: 'పాస్‌వర్డ్ నిర్ధారించండి',
    passwordMismatch: 'పాస్‌వర్డ్‌లు సరిపోలలేదు',
    searching: 'వెతుకుతున్నాం...',
    scooters: 'స్కూటర్లు', commuters: 'కమ్యూటర్లు', sports: 'స్పోర్ట్స్',
    cruisers: 'క్రూజర్లు', adventure: 'అడ్వెంచర్', electric: 'ఎలక్ట్రిక్',
  },
  mr: {
    tagline: 'भारतातील सर्वात स्मार्ट 2-व्हीलर प्लॅटफॉर्म',
    heroTitle1: 'शोधा, तुलना करा &',
    heroTitle2: 'तुमची परफेक्ट राइड खरेदी करा',
    heroSub: 'BikeIQ भारतात विकल्या जाणाऱ्या प्रत्येक बाइक आणि स्कूटरला कव्हर करते — खरी स्पेसिफिकेशन्स, शहरनिहाय किमती.',
    searchPlaceholder: 'कोणतीही बाइक किंवा स्कूटर शोधा...',
    go: 'शोधा',
    featuredThisWeek: '🔥 या आठवड्यातील फीचर्ड बाइक्स',
    browseByType: 'प्रकारानुसार ब्राउज़ करा',
    trendingSearches: 'ट्रेंडिंग शोध',
    allBrands: 'सर्व ब्रँड्स',
    latestNews: '📰 ताजी 2-व्हीलर बातमी',
    latestNewsSub: 'लॉन्च, अपडेट्स & रिव्यू — लाइव्ह',
    bikesListed: 'बाइक्स',
    brands: 'ब्रँड्स',
    citiesPriced: 'शहरे',
    bikeiqPlusTools: 'BikeIQ+ टूल्स',
    bikeiqPlusSub: 'बाइक क्विझ · कम्युट फाइंडर · विमा · रिसेल · रोड टॅक्स · AI मेकॅनिक',
    trendingIn: 'ट्रेंडिंग इन',
    pricesIn: 'किमती',
    selectCity: 'शहर निवडा',
    detectLocation: 'माझे स्थान शोधा',
    cityUpdated: 'शहर अपडेट केले',
    selectLanguage: 'भाषा निवडा',
    login: 'लॉगिन',
    signIn: 'साइन इन',
    signUp: 'साइन अप',
    createAccount: 'खाते तयार करा',
    welcomeBack: 'पुन्हा स्वागत आहे',
    joinBikeIQ: 'BikeIQ मध्ये सामील व्हा — मोफत',
    signInToBikeIQ: 'BikeIQ मध्ये साइन इन करा',
    email: 'ईमेल',
    password: 'पासवर्ड',
    emailPlaceholder: 'तुमचा@ईमेल.com',
    passwordPlaceholder: '••••••••',
    noAccount: 'खाते नाही?',
    haveAccount: 'आधीच खाते आहे?',
    signedOut: 'यशस्वीरीत्या साइन आउट केले',
    welcome: 'स्वागत आहे',
    linkCopied: 'लिंक कॉपी केले!',
    locationDenied: 'स्थान प्रवेश नाकारला',
    locationError: 'शहर शोधता आले नाही',
    invalidEmail: 'वैध ईमेल पत्ता प्रविष्ट करा',
    passwordShort: 'पासवर्ड किमान 6 अक्षरांचा असावा',
    emailExists: 'ईमेल आधीच नोंदणीकृत आहे. साइन इन करा.',
    invalidCredentials: 'चुकीचा ईमेल किंवा पासवर्ड.',
    authError: 'काहीतरी चुकले. पुन्हा प्रयत्न करा.',
    confirmPassword: 'पासवर्ड पुष्टी करा',
    passwordMismatch: 'पासवर्ड जुळत नाहीत',
    searching: 'शोधत आहे...',
    scooters: 'स्कूटर', commuters: 'कम्यूटर', sports: 'स्पोर्ट्स',
    cruisers: 'क्रूझर', adventure: 'अॅडव्हेंचर', electric: 'इलेक्ट्रिक',
  },
  bn: {
    tagline: 'ভারতের সবচেয়ে স্মার্ট ২-চাকার প্ল্যাটফর্ম',
    heroTitle1: 'খুঁজুন, তুলনা করুন &',
    heroTitle2: 'আপনার পারফেক্ট রাইড কিনুন',
    heroSub: 'BikeIQ ভারতে বিক্রিত প্রতিটি বাইক ও স্কুটার কভার করে — সত্যিকারের স্পেসিফিকেশন, শহর অনুযায়ী দাম।',
    searchPlaceholder: 'যেকোনো বাইক বা স্কুটার খুঁজুন...',
    go: 'খুঁজুন',
    featuredThisWeek: '🔥 এই সপ্তাহের ফিচার্ড',
    browseByType: 'ধরন অনুযায়ী ব্রাউজ করুন',
    trendingSearches: 'ট্রেন্ডিং সার্চ',
    allBrands: 'সব ব্র্যান্ড',
    latestNews: '📰 সর্বশেষ ২-চাকার সংবাদ',
    latestNewsSub: 'লঞ্চ, আপডেট ও রিভিউ — লাইভ',
    bikesListed: 'বাইক তালিকাভুক্ত',
    brands: 'ব্র্যান্ড',
    citiesPriced: 'শহরে দাম',
    bikeiqPlusTools: 'BikeIQ+ টুলস',
    bikeiqPlusSub: 'বাইক কুইজ · কমিউট ফাইন্ডার · বীমা · রিসেল · রোড ট্যাক্স · AI মেকানিক',
    trendingIn: 'ট্রেন্ডিং ইন',
    pricesIn: 'দাম',
    selectCity: 'শহর বেছে নিন',
    detectLocation: 'আমার অবস্থান শনাক্ত করুন',
    cityUpdated: 'শহর আপডেট হয়েছে',
    selectLanguage: 'ভাষা বেছে নিন',
    login: 'লগইন',
    signIn: 'সাইন ইন',
    signUp: 'সাইন আপ',
    createAccount: 'অ্যাকাউন্ট তৈরি করুন',
    welcomeBack: 'আবার স্বাগতম',
    joinBikeIQ: 'BikeIQ-তে যোগ দিন — বিনামূল্যে',
    signInToBikeIQ: 'BikeIQ-তে সাইন ইন করুন',
    email: 'ইমেইল',
    password: 'পাসওয়ার্ড',
    emailPlaceholder: 'আপনার@ইমেইল.com',
    passwordPlaceholder: '••••••••',
    noAccount: 'অ্যাকাউন্ট নেই?',
    haveAccount: 'ইতিমধ্যে অ্যাকাউন্ট আছে?',
    signedOut: 'সফলভাবে সাইন আউট হয়েছে',
    welcome: 'স্বাগতম',
    linkCopied: 'লিংক কপি হয়েছে!',
    locationDenied: 'অবস্থান অ্যাক্সেস অস্বীকৃত',
    locationError: 'শহর শনাক্ত করা যায়নি',
    invalidEmail: 'বৈধ ইমেইল ঠিকানা দিন',
    passwordShort: 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে',
    emailExists: 'ইমেইল ইতিমধ্যে নিবন্ধিত। সাইন ইন করুন।',
    invalidCredentials: 'ভুল ইমেইল বা পাসওয়ার্ড।',
    authError: 'কিছু ভুল হয়েছে। আবার চেষ্টা করুন।',
    confirmPassword: 'পাসওয়ার্ড নিশ্চিত করুন',
    passwordMismatch: 'পাসওয়ার্ড মেলে না',
    searching: 'খুঁজছি...',
    scooters: 'স্কুটার', commuters: 'কমিউটার', sports: 'স্পোর্টস',
    cruisers: 'ক্রুজার', adventure: 'অ্যাডভেঞ্চার', electric: 'ইলেকট্রিক',
  },
};

// City-specific trending bikes data
export const CITY_TRENDING = {
  Mumbai:    ['Honda Activa 6G', 'TVS Jupiter 125', 'Ola S1 Pro', 'Ather 450X', 'Bajaj Pulsar N160'],
  Delhi:     ['Hero Splendor Plus', 'Honda SP 125', 'Bajaj Pulsar NS200', 'Royal Enfield Classic 350', 'Ola S1 Pro'],
  Bangalore: ['Ather 450X', 'Ola S1 Pro', 'Royal Enfield Classic 350', 'KTM Duke 390', 'TVS Apache RTR 160 4V'],
  Chennai:   ['TVS Apache RTR 160 4V', 'TVS Jupiter 125', 'Ather 450X', 'Honda Activa 6G', 'Bajaj Pulsar N160'],
  Pune:      ['Royal Enfield Classic 350', 'KTM Duke 390', 'Ather 450X', 'Bajaj Pulsar NS200', 'Honda Activa 6G'],
  Hyderabad: ['Bajaj Pulsar N160', 'Honda SP 125', 'Ola S1 Pro', 'TVS Apache RTR 160 4V', 'Hero Splendor Plus'],
  Kolkata:   ['Hero Splendor Plus', 'Honda Activa 6G', 'Bajaj Pulsar 150', 'TVS Jupiter 125', 'Yamaha R15 V4'],
  Ahmedabad: ['Hero HF Deluxe', 'Honda Activa 6G', 'Bajaj Chetak Electric', 'TVS iQube Electric', 'Bajaj Pulsar N160'],
  Jaipur:    ['Hero Splendor Plus', 'Honda Activa 6G', 'Bajaj Pulsar N160', 'Royal Enfield Classic 350', 'TVS Apache RTR 160 4V'],
  Surat:     ['Honda Activa 6G', 'Hero HF Deluxe', 'Bajaj Chetak Electric', 'TVS Jupiter 125', 'Bajaj Pulsar N160'],
};

// City price offset multipliers (relative to base ex-showroom price)
export const CITY_PRICE_FACTORS = {
  Mumbai:    1.07, Delhi:    1.05, Bangalore: 1.06, Chennai:   1.05,
  Pune:      1.06, Hyderabad:1.05, Kolkata:   1.04, Ahmedabad: 1.03,
  Jaipur:    1.04, Surat:    1.03,
};

export const SUPPORTED_CITIES = Object.keys(CITY_TRENDING);

// ─────────────────────────────────────────────────────────────────────────────
// CONTEXTS — exported so any page can consume them
// ─────────────────────────────────────────────────────────────────────────────
export const LangContext  = createContext({ lang: 'en', t: k => k });
export const CityContext  = createContext({ city: '', setCity: () => {} });
export const UserContext  = createContext({ user: null, setUser: () => {} });

export function useLang() { return useContext(LangContext); }
export function useCity() { return useContext(CityContext); }
export function useUser() { return useContext(UserContext); }

// Helper: get translation
function getT(lang) {
  const dict = TRANSLATIONS[lang] || TRANSLATIONS.en;
  return (key) => dict[key] || TRANSLATIONS.en[key] || key;
}

// ─────────────────────────────────────────────────────────────────────────────
// LANGUAGES list
// ─────────────────────────────────────────────────────────────────────────────
const LANGUAGES = [
  { code: 'en', label: 'English',  native: 'English'  },
  { code: 'hi', label: 'Hindi',    native: 'हिंदी'     },
  { code: 'mr', label: 'Marathi',  native: 'मराठी'    },
  { code: 'ta', label: 'Tamil',    native: 'தமிழ்'    },
  { code: 'te', label: 'Telugu',   native: 'తెలుగు'   },
  { code: 'bn', label: 'Bengali',  native: 'বাংলা'    },
];

// ─────────────────────────────────────────────────────────────────────────────
// TOAST
// ─────────────────────────────────────────────────────────────────────────────
function Toast({ message, type, visible }) {
  if (!visible) return null;
  const ok = type === 'success';
  return (
    <div style={{
      position: 'fixed', bottom: 90, left: '50%', transform: 'translateX(-50%)',
      zIndex: 9999, background: ok ? 'rgba(0,230,118,0.95)' : 'rgba(255,82,82,0.95)',
      color: '#000', padding: '10px 20px', borderRadius: 30, fontSize: 13,
      fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8,
      boxShadow: '0 4px 20px rgba(0,0,0,0.4)', whiteSpace: 'nowrap',
      animation: 'fadeIn 0.2s ease',
    }}>
      {ok ? <Check size={14} /> : <X size={14} />}{message}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DROPDOWN WRAPPER
// ─────────────────────────────────────────────────────────────────────────────
function Dropdown({ open, onClose, children, align = 'right' }) {
  const ref = useRef();
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div ref={ref} style={{
      position: 'absolute', top: 46, [align]: 0, zIndex: 2000,
      background: 'var(--bg2)', border: '1px solid var(--border)',
      borderRadius: 16, minWidth: 240, boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
      overflow: 'hidden', animation: 'fadeIn 0.15s ease',
      maxHeight: '80vh', overflowY: 'auto',
    }}>
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// AUTH MODAL — uses real Supabase auth
// ─────────────────────────────────────────────────────────────────────────────
function AuthModal({ open, onClose, onLogin, t }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showPw, setShowPw]   = useState(false);
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!open) {
      setEmail(''); setPassword(''); setConfirmPw('');
      setError(''); setLoading(false); setShowPw(false);
    }
  }, [open]);

  if (!open) return null;

  const validate = () => {
    if (!email.includes('@') || !email.includes('.')) return t('invalidEmail');
    if (password.length < 6) return t('passwordShort');
    if (!isLogin && password !== confirmPw) return t('passwordMismatch');
    return '';
  };

  const handleSubmit = async () => {
    const err = validate();
    if (err) { setError(err); return; }
    setLoading(true); setError('');

    try {
      if (isLogin) {
        // ── SIGN IN ──────────────────────────────────────────────
        const { data, error: authErr } = await supabase.auth.signInWithPassword({ email, password });
        if (authErr) {
          if (authErr.message?.toLowerCase().includes('invalid') || authErr.message?.toLowerCase().includes('credentials')) {
            setError(t('invalidCredentials'));
          } else {
            setError(t('authError'));
          }
          setLoading(false);
          return;
        }
        const user = {
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata?.name || data.user.email.split('@')[0],
        };
        onLogin(user);
        onClose();
      } else {
        // ── SIGN UP ──────────────────────────────────────────────
        const { data, error: authErr } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { name: email.split('@')[0] } },
        });
        if (authErr) {
          if (authErr.message?.toLowerCase().includes('already')) {
            setError(t('emailExists'));
          } else {
            setError(t('authError'));
          }
          setLoading(false);
          return;
        }
        // signUp returns a session immediately if email confirmation is off
        // (which is the default for local/simple Supabase projects)
        if (data.session) {
          const user = {
            id: data.user.id,
            email: data.user.email,
            name: data.user.user_metadata?.name || email.split('@')[0],
          };
          onLogin(user);
          onClose();
        } else {
          // Email confirmation required — show message
          setError('');
          setLoading(false);
          // Reuse error slot for a success message
          setError('✅ Check your email to confirm your account, then sign in.');
          return;
        }
      }
    } catch {
      setError(t('authError'));
    }
    setLoading(false);
  };

  const isSuccess = error.startsWith('✅');

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9998,
      background: 'rgba(0,0,0,0.75)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: 20,
    }} onClick={onClose}>
      <div style={{
        background: 'var(--bg2)', border: '1px solid var(--border)',
        borderRadius: 20, padding: 24, width: '100%', maxWidth: 360,
        boxShadow: '0 20px 60px rgba(0,0,0,0.6)', animation: 'slideUp 0.2s ease',
      }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <div style={{ fontFamily: 'Rajdhani,sans-serif', fontSize: 22, fontWeight: 800, color: 'var(--text)' }}>
              {isLogin ? t('welcomeBack') : t('createAccount')}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2 }}>
              {isLogin ? t('signInToBikeIQ') : t('joinBikeIQ')}
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)', fontSize: 20 }}>✕</button>
        </div>

        {/* Email */}
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block', marginBottom: 6 }}>{t('email')}</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px' }}>
            <Mail size={15} color="var(--text3)" />
            <input
              type="email" value={email} onChange={e => { setEmail(e.target.value); setError(''); }}
              placeholder={t('emailPlaceholder')}
              style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: 'var(--text)', fontSize: 14, fontFamily: 'inherit' }}
            />
          </div>
        </div>

        {/* Password */}
        <div style={{ marginBottom: isLogin ? 16 : 12 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block', marginBottom: 6 }}>{t('password')}</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px' }}>
            <Lock size={15} color="var(--text3)" />
            <input
              type={showPw ? 'text' : 'password'} value={password}
              onChange={e => { setPassword(e.target.value); setError(''); }}
              placeholder={t('passwordPlaceholder')}
              onKeyDown={e => e.key === 'Enter' && isLogin && handleSubmit()}
              style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: 'var(--text)', fontSize: 14, fontFamily: 'inherit' }}
            />
            <button onClick={() => setShowPw(!showPw)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)', display: 'flex' }}>
              {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        {/* Confirm Password — Sign Up only */}
        {!isLogin && (
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block', marginBottom: 6 }}>{t('confirmPassword')}</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px' }}>
              <Lock size={15} color="var(--text3)" />
              <input
                type={showPw ? 'text' : 'password'} value={confirmPw}
                onChange={e => { setConfirmPw(e.target.value); setError(''); }}
                placeholder={t('passwordPlaceholder')}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: 'var(--text)', fontSize: 14, fontFamily: 'inherit' }}
              />
            </div>
          </div>
        )}

        {/* Error / Success message */}
        {error && (
          <div style={{
            background: isSuccess ? 'rgba(0,230,118,0.1)' : 'rgba(255,82,82,0.1)',
            border: `1px solid ${isSuccess ? 'rgba(0,230,118,0.3)' : 'rgba(255,82,82,0.3)'}`,
            borderRadius: 8, padding: '8px 12px', fontSize: 12,
            color: isSuccess ? 'var(--green)' : 'var(--red)', marginBottom: 12,
          }}>
            {error}
          </div>
        )}

        <button
          onClick={handleSubmit} disabled={loading}
          style={{
            width: '100%', padding: '13px',
            background: 'var(--accent)', color: '#000',
            fontWeight: 700, fontSize: 15, borderRadius: 12,
            border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1, fontFamily: 'inherit',
          }}
        >
          {loading ? '⏳ ' + t('searching').replace('...', '...') : (isLogin ? t('signIn') : t('createAccount'))}
        </button>

        <div style={{ textAlign: 'center', marginTop: 14, fontSize: 13, color: 'var(--text3)' }}>
          {isLogin ? t('noAccount') + ' ' : t('haveAccount') + ' '}
          <span
            style={{ color: 'var(--accent)', cursor: 'pointer', fontWeight: 600 }}
            onClick={() => { setIsLogin(!isLogin); setError(''); setPassword(''); setConfirmPw(''); }}
          >
            {isLogin ? t('signUp') : t('signIn')}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CITY DROPDOWN
// ─────────────────────────────────────────────────────────────────────────────
function CityDropdown({ open, onClose, city, onSelectCity, onDetect, locating, t }) {
  return (
    <Dropdown open={open} onClose={onClose}>
      <div style={{ padding: '8px 0' }}>
        <div style={{ padding: '8px 16px 6px', fontSize: 10, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
          {t('selectCity')}
        </div>

        {/* Auto-detect option */}
        <div
          onClick={() => { onDetect(); onClose(); }}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 16px', cursor: 'pointer', fontSize: 13,
            color: 'var(--accent)', borderBottom: '1px solid var(--border)',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--bg3)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <MapPin size={14} />
          {locating ? '...' : t('detectLocation')}
        </div>

        {/* City list */}
        {SUPPORTED_CITIES.map(c => (
          <div
            key={c}
            onClick={() => { onSelectCity(c); onClose(); }}
            style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '10px 16px', cursor: 'pointer', fontSize: 14,
              background: city === c ? 'rgba(0,212,255,0.08)' : 'transparent',
              color: city === c ? 'var(--accent)' : 'var(--text)',
              fontWeight: city === c ? 700 : 400,
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg3)'}
            onMouseLeave={e => e.currentTarget.style.background = city === c ? 'rgba(0,212,255,0.08)' : 'transparent'}
          >
            <span>{c}</span>
            {city === c && <Check size={14} color="var(--accent)" />}
          </div>
        ))}
      </div>
    </Dropdown>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN HEADER — also provides LangContext, CityContext, UserContext to the tree
// ─────────────────────────────────────────────────────────────────────────────
export default function Header({ navigate, page, darkMode, setDarkMode, children }) {
  const [toast, setToast]       = useState({ visible: false, message: '', type: 'success' });
  const [langOpen, setLangOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [locating, setLocating] = useState(false);

  const [lang, setLang] = useState(() => localStorage.getItem('bikeiq_lang') || 'en');
  const [city, setCityState] = useState(() => localStorage.getItem('bikeiq_city') || '');
  const [user, setUser] = useState(null);

  const t = getT(lang);

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

  const showToast = useCallback((message, type = 'success') => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 2500);
  }, []);

  const setCity = useCallback((c) => {
    setCityState(c);
    localStorage.setItem('bikeiq_city', c);
  }, []);

  // Share
  const handleShare = useCallback(async () => {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: "BikeIQ", text: t('tagline'), url }); } catch {}
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      showToast(t('linkCopied'), 'success');
    } catch { showToast('Could not copy link', 'error'); }
  }, [showToast, t]);

  // Detect location
  const detectCity = useCallback(() => {
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`);
          const data = await res.json();
          const raw = data.address?.city || data.address?.town || data.address?.state_district || '';
          // Try to match to a supported city
          const matched = SUPPORTED_CITIES.find(c => raw.toLowerCase().includes(c.toLowerCase())) || raw || 'India';
          setCity(matched);
          showToast(`📍 ${t('cityUpdated')} ${matched}`);
        } catch { showToast(t('locationError'), 'error'); }
        setLocating(false);
      },
      () => { showToast(t('locationDenied'), 'error'); setLocating(false); }
    );
  }, [showToast, t, setCity]);

  // Language select
  const selectLang = (code) => {
    setLang(code);
    localStorage.setItem('bikeiq_lang', code);
    setLangOpen(false);
    const chosen = LANGUAGES.find(l => l.code === code);
    showToast(`${chosen?.native || chosen?.label}`);
  };

  // Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setUserOpen(false);
    showToast(t('signedOut'));
  };

  const currentLang   = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];
  const avatarLetter  = user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U';

  return (
    <LangContext.Provider value={{ lang, t }}>
      <CityContext.Provider value={{ city, setCity }}>
        <UserContext.Provider value={{ user, setUser }}>
          <header className="header">
            {/* Logo */}
            <div className="header-logo" onClick={() => navigate('home')}>
              <Zap size={20} fill="currentColor" />
              Bike<span>IQ</span>
            </div>

            <div className="header-actions">

              {/* Search */}
              <button className="icon-btn" onClick={() => navigate('search')} title="Search">
                <Search size={16} />
              </button>

              {/* City picker */}
              <div style={{ position: 'relative' }}>
                <button
                  className={`icon-btn ${city ? 'active' : ''}`}
                  onClick={() => { setCityOpen(!cityOpen); setLangOpen(false); setUserOpen(false); }}
                  title={city || t('selectCity')}
                  style={{ display: 'flex', alignItems: 'center', gap: 4, width: 'auto', padding: '0 8px', fontSize: 11 }}
                >
                  <MapPin size={14} />
                  <span style={{ maxWidth: 55, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 700 }}>
                    {locating ? '...' : (city || t('selectCity').split(' ')[0])}
                  </span>
                  <ChevronDown size={11} />
                </button>
                <CityDropdown
                  open={cityOpen} onClose={() => setCityOpen(false)}
                  city={city} onSelectCity={(c) => { setCity(c); showToast(`📍 ${t('cityUpdated')} ${c}`); }}
                  onDetect={detectCity} locating={locating} t={t}
                />
              </div>

              {/* Language */}
              <div style={{ position: 'relative' }}>
                <button
                  className="icon-btn"
                  onClick={() => { setLangOpen(!langOpen); setUserOpen(false); setCityOpen(false); }}
                  title="Language"
                  style={{ display: 'flex', alignItems: 'center', gap: 4, width: 'auto', padding: '0 8px', fontSize: 11 }}
                >
                  <Globe size={14} />
                  <span style={{ fontSize: 11, fontWeight: 700 }}>{currentLang.code.toUpperCase()}</span>
                </button>
                <Dropdown open={langOpen} onClose={() => setLangOpen(false)}>
                  <div style={{ padding: '8px 0' }}>
                    <div style={{ padding: '8px 16px 6px', fontSize: 10, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                      {t('selectLanguage')}
                    </div>
                    {LANGUAGES.map(l => (
                      <div
                        key={l.code}
                        onClick={() => selectLang(l.code)}
                        style={{
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                          padding: '10px 16px', cursor: 'pointer', fontSize: 14,
                          background: lang === l.code ? 'rgba(0,212,255,0.08)' : 'transparent',
                          color: lang === l.code ? 'var(--accent)' : 'var(--text)',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg3)'}
                        onMouseLeave={e => e.currentTarget.style.background = lang === l.code ? 'rgba(0,212,255,0.08)' : 'transparent'}
                      >
                        <span style={{ fontWeight: lang === l.code ? 700 : 400 }}>{l.native}</span>
                        {lang === l.code && <Check size={14} color="var(--accent)" />}
                      </div>
                    ))}
                  </div>
                </Dropdown>
              </div>

              {/* Share */}
              <button className="icon-btn" onClick={handleShare} title="Share BikeIQ">
                <Share2 size={15} />
              </button>

              {/* Theme */}
              <button className="icon-btn" onClick={() => setDarkMode(!darkMode)} title="Toggle theme">
                {darkMode ? <Sun size={15} /> : <Moon size={15} />}
              </button>

              {/* User / Login */}
              <div style={{ position: 'relative' }}>
                {user ? (
                  <button
                    className="icon-btn"
                    onClick={() => { setUserOpen(!userOpen); setLangOpen(false); setCityOpen(false); }}
                    style={{
                      width: 34, height: 34, borderRadius: '50%',
                      background: 'var(--accent)', color: '#000',
                      fontWeight: 800, fontSize: 14, border: 'none', cursor: 'pointer',
                      fontFamily: 'Rajdhani,sans-serif',
                    }}
                    title={user.name || user.email}
                  >
                    {avatarLetter}
                  </button>
                ) : (
                  <button
                    className="icon-btn"
                    onClick={() => { setAuthOpen(true); setUserOpen(false); setLangOpen(false); setCityOpen(false); }}
                    title={t('signIn')}
                    style={{ display: 'flex', alignItems: 'center', gap: 4, width: 'auto', padding: '0 10px', fontSize: 12 }}
                  >
                    <User size={14} />
                    <span style={{ fontSize: 11, fontWeight: 700 }}>{t('login')}</span>
                  </button>
                )}

                {/* User dropdown */}
                <Dropdown open={userOpen} onClose={() => setUserOpen(false)}>
                  <div style={{ padding: 16, borderBottom: '1px solid var(--border)' }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: '50%',
                      background: 'var(--accent)', color: '#000',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 800, fontSize: 18, marginBottom: 8,
                      fontFamily: 'Rajdhani,sans-serif',
                    }}>
                      {avatarLetter}
                    </div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>{user?.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2 }}>{user?.email}</div>
                    {city && <div style={{ fontSize: 11, color: 'var(--accent)', marginTop: 4 }}>📍 {city}</div>}
                  </div>
                  <div style={{ padding: '8px 0' }}>
                    <div
                      onClick={handleLogout}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', cursor: 'pointer', fontSize: 14, color: 'var(--red)' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg3)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <LogOut size={15} /> {t('signedOut').split(' ')[0]}…
                    </div>
                  </div>
                </Dropdown>
              </div>
            </div>
          </header>

          <Toast message={toast.message} type={toast.type} visible={toast.visible} />
          <AuthModal
            open={authOpen}
            onClose={() => setAuthOpen(false)}
            t={t}
            onLogin={(u) => {
              setUser(u);
              showToast(`${t('welcome')}, ${u.name}! 👋`);
            }}
          />
        </UserContext.Provider>
      </CityContext.Provider>
    </LangContext.Provider>
  );
}
