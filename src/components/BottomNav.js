import React from 'react';
import { Home, GitCompare, Newspaper, Bot, Heart, Sparkles } from 'lucide-react';
import { useLang } from '../utils/LanguageContext';

export default function BottomNav({ page, navigate, compareCount, watchlistCount }) {
  const { t } = useLang();

  const navItems = [
    { id: 'home',       icon: Home,       label: t('home') },
    { id: 'compare',    icon: GitCompare, label: t('compare') },
    { id: 'news',       icon: Newspaper,  label: t('news') },
    { id: 'ai',         icon: Bot,        label: t('ai') },
    { id: 'bikeiqplus', icon: Sparkles,   label: t('bikeiqplus') },
    { id: 'watchlist',  icon: Heart,      label: t('saved') },
  ];

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
          {id === 'compare' && compareCount > 0 && <span className="nav-badge">{compareCount}</span>}
          {id === 'watchlist' && watchlistCount > 0 && <span className="nav-badge">{watchlistCount}</span>}
        </button>
      ))}
    </nav>
  );
}
