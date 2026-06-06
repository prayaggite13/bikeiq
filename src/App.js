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
