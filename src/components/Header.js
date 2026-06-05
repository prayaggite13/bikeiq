import React, { useState, useCallback } from 'react';
import { Search, Moon, Sun, Zap, Share2, Check, X } from 'lucide-react';

function Toast({ message, type, visible }) {
  if (!visible) return null;
  const isSuccess = type === 'success';
  return (
    <div style={{
      position: 'fixed',
      bottom: 90, left: '50%', transform: 'translateX(-50%)',
      zIndex: 9999,
      background: isSuccess ? 'rgba(0,230,118,0.95)' : 'rgba(255,82,82,0.95)',
      color: '#000',
      padding: '10px 20px',
      borderRadius: 30,
      fontSize: 13,
      fontWeight: 700,
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
      animation: 'fadeIn 0.2s ease',
      whiteSpace: 'nowrap',
    }}>
      {isSuccess ? <Check size={14} /> : <X size={14} />}
      {message}
    </div>
  );
}

export default function Header({ navigate, page, darkMode, setDarkMode }) {
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });

  const showToast = useCallback((message, type = 'success') => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast(t => ({ ...t, visible: false })), 2500);
  }, []);

  const handleShare = useCallback(async () => {
    const url = window.location.href;
    const title = 'BikeIQ — India\'s Smartest Bike Platform';
    const text = 'Search, compare and get AI insights on every bike and scooter in India.';

    // Mobile: use native Web Share API
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        // Native share sheet opened — no toast needed
      } catch (err) {
        // User cancelled share — don't show error
        if (err.name !== 'AbortError') {
          showToast('Could not share', 'error');
        }
      }
      return;
    }

    // Desktop: copy to clipboard
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        // Fallback for older browsers
        const el = document.createElement('textarea');
        el.value = url;
        el.style.position = 'fixed';
        el.style.opacity = '0';
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
      }
      showToast('Link copied to clipboard!', 'success');
    } catch {
      showToast('Could not copy link', 'error');
    }
  }, [showToast]);

  return (
    <>
      <header className="header">
        <div className="header-logo" onClick={() => navigate('home')}>
          <Zap size={20} fill="currentColor" />
          Bike<span>IQ</span>
        </div>
        <div className="header-actions">
          <button className="icon-btn" onClick={() => navigate('search')} title="Search">
            <Search size={16} />
          </button>
          <button className="icon-btn" onClick={handleShare} title="Share BikeIQ">
            <Share2 size={16} />
          </button>
          <button className="icon-btn" onClick={() => setDarkMode(!darkMode)} title="Toggle theme">
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </header>
      <Toast message={toast.message} type={toast.type} visible={toast.visible} />
    </>
  );
}
