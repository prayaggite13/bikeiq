import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import BikeDetailPage from './pages/BikeDetailPage';
import ComparePage from './pages/ComparePage';
import WatchlistPage from './pages/WatchlistPage';
import NewsPage from './pages/NewsPage';
import AIPage from './pages/AIPage';
import CommuteFinderPage from './pages/CommuteFinderPage';
import OwnershipPage from './pages/OwnershipPage';
import BikeQuizPage from './pages/BikeQuizPage';
import ResalePage from './pages/ResalePage';
import FirstBikePage from './pages/FirstBikePage';
import InsurancePage from './pages/InsurancePage';
import RoadTaxPage from './pages/RoadTaxPage';
import BikeIQPlusPage from './pages/BikeIQPlusPage';
import AIMechanicPage from './pages/AIMechanicPage';
import BikeHealthPage from './pages/BikeHealthPage';
import ServiceCenterPage from './pages/ServiceCenterPage';
import DealerLocatorPage from './pages/DealerLocatorPage';
import AccessoryAdvisorPage from './pages/AccessoryAdvisorPage';
import UsedPricePage from './pages/UsedPricePage';
import EMICalculatorPage from './pages/EMICalculatorPage';
import { LanguageProvider } from './utils/LanguageContext';
import { setMeta, resetMeta } from './utils/meta';
import './App.css';

export default function App() {
  const [page, setPage] = useState('home');
  const [selectedBike, setSelectedBike] = useState(null);
  const [compareList, setCompareList] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const navigate = (p, data = null) => {
    setPage(p);
    if (data) setSelectedBike(data);
    window.scrollTo(0, 0);

    // Update meta tags per page
    const pageMeta = {
      home:        ["India's Smartest Bike Platform", "Search, compare and get AI insights on every bike and scooter in India. Real specs, city-wise on-road prices, EV analysis."],
      search:      ["Search Bikes & Scooters", "Find any bike or scooter sold in India. Specs, price, mileage, variants — powered by AI."],
      compare:     ["Compare Bikes Side by Side", "Compare up to 3 bikes with specs, price and AI verdict. Find the best bike for you."],
      news:        ["Latest Bike News India", "Live 2-wheeler news — new launches, price updates, reviews and EV updates from India."],
      ai:          ["AI Bike Assistant", "Ask anything about bikes. BikeIQ AI answers your questions about specs, buying advice and more."],
      bikeiqplus:  ["BikeIQ+ Premium Tools", "AI Mechanic, EMI Calculator, Road Tax, Insurance, Commute Finder and more premium tools."],
      roadtax:     ["Road Tax Calculator India", "State-wise RTO and road tax calculator for bikes and scooters across all Indian states."],
      emi:         ["Bike EMI Calculator", "Calculate monthly EMI for any bike. Compare lenders, tenures and interest rates instantly."],
      insurance:   ["Bike Insurance Estimator", "Estimate your bike insurance premium based on city, bike model and NCB."],
      commute:     ["Commute Finder", "AI picks the best bike for your daily commute based on distance, road type and budget."],
      mechanic:    ["AI Mechanic", "Describe your bike issue — AI diagnoses the problem and suggests fixes."],
      usedprice:   ["Used Bike Price Checker", "Get fair market value for any used bike in India based on age, km and condition."],
    };
    if (p !== 'bike' && pageMeta[p]) {
      setMeta(pageMeta[p][0], pageMeta[p][1]);
    } else if (p !== 'bike') {
      resetMeta();
    }
  };

  const addToCompare = (bike) => {
    if (compareList.length >= 3) return alert('Max 3 bikes for comparison');
    if (compareList.find(b => b.name === bike.name)) return;
    setCompareList(prev => [...prev, bike]);
  };

  const removeFromCompare = (name) => setCompareList(prev => prev.filter(b => b.name !== name));

  const toggleWatchlist = (bike) => {
    setWatchlist(prev =>
      prev.find(b => b.name === bike.name)
        ? prev.filter(b => b.name !== bike.name)
        : [...prev, bike]
    );
  };

  const isWatchlisted = (bike) => watchlist.some(b => b.name === bike?.name);

  const props = {
    navigate, selectedBike, compareList, addToCompare, removeFromCompare,
    watchlist, toggleWatchlist, isWatchlisted, darkMode, setDarkMode,
  };

  return (
    <LanguageProvider>
      <div className="app">
        <Header {...props} page={page} />
        <main className="main-content">
          {page === 'home'          && <HomePage {...props} />}
          {page === 'search'        && <SearchPage {...props} />}
          {page === 'bike'          && <BikeDetailPage {...props} />}
          {page === 'compare'       && <ComparePage {...props} />}
          {page === 'watchlist'     && <WatchlistPage {...props} />}
          {page === 'news'          && <NewsPage {...props} />}
          {page === 'ai'            && <AIPage {...props} />}
          {page === 'commute'       && <CommuteFinderPage {...props} />}
          {page === 'ownership'     && <OwnershipPage {...props} />}
          {page === 'quiz'          && <BikeQuizPage {...props} />}
          {page === 'resale'        && <ResalePage {...props} />}
          {page === 'firstbike'     && <FirstBikePage {...props} />}
          {page === 'insurance'     && <InsurancePage {...props} />}
          {page === 'roadtax'       && <RoadTaxPage {...props} />}
          {page === 'bikeiqplus'    && <BikeIQPlusPage {...props} />}
          {page === 'mechanic'      && <AIMechanicPage {...props} />}
          {page === 'health'        && <BikeHealthPage {...props} />}
          {page === 'servicecenter' && <ServiceCenterPage {...props} />}
          {page === 'dealer'        && <DealerLocatorPage {...props} />}
          {page === 'accessory'     && <AccessoryAdvisorPage {...props} />}
          {page === 'usedprice'     && <UsedPricePage {...props} />}
          {page === 'emi'           && <EMICalculatorPage {...props} />}
        </main>
        <BottomNav page={page} navigate={navigate} compareCount={compareList.length} watchlistCount={watchlist.length} />
      </div>
    </LanguageProvider>
  );
}
