import React from 'react';
import { Search, Moon, Sun, Zap } from 'lucide-react';

export default function Header({ navigate, page, darkMode, setDarkMode }) {
  return (
    <header className="header">
      <div className="header-logo" onClick={() => navigate('home')}>
        <Zap size={20} fill="currentColor" />
        Bike<span>IQ</span>
      </div>
      <div className="header-actions">
        <button className="icon-btn" onClick={() => navigate('search')} title="Search">
          <Search size={16} />
        </button>
        <button className="icon-btn" onClick={() => setDarkMode(!darkMode)} title="Toggle theme">
          {darkMode ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </header>
  );
}
