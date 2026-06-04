import React from 'react';
import { Home, GitCompare, Newspaper, Bot, Heart, Sparkles } from 'lucide-react';

const navItems = [
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'compare', icon: GitCompare, label: 'Compare' },
  { id: 'news', icon: Newspaper, label: 'News' },
  { id: 'ai', icon: Bot, label: 'AI' },
  { id: 'bikeiqplus', icon: Sparkles, label: 'BikeIQ+' },
  { id: 'watchlist', icon: Heart, label: 'Saved' },
];

export default function BottomNav({ page, navigate, compareCount, watchlistCount }) {
  return (
    <nav className="bottom-nav">
      {navItems.map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          className={`nav-item ${page === id ? 'active' : ''}`}
          onClick={() => navigate(id)}
        >
          <Icon size={20} />
          {label}
          {id === 'compare' && compareCount > 0 && (
            <span className="nav-badge">{compareCount}</span>
          )}
          {id === 'watchlist' && watchlistCount > 0 && (
            <span className="nav-badge">{watchlistCount}</span>
          )}
        </button>
      ))}
    </nav>
  );
}
