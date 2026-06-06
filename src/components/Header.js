import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Search, Moon, Sun, Zap, Share2, Check, X, MapPin, Globe, User, LogOut, Mail, Lock, Eye, EyeOff } from 'lucide-react';

// ── Languages ──────────────────────────────────────────────────────
const LANGUAGES = [
  { code: 'en', label: 'English',  native: 'English'  },
  { code: 'hi', label: 'Hindi',    native: 'हिंदी'     },
  { code: 'mr', label: 'Marathi',  native: 'मराठी'    },
  { code: 'ta', label: 'Tamil',    native: 'தமிழ்'    },
  { code: 'te', label: 'Telugu',   native: 'తెలుగు'   },
  { code: 'bn', label: 'Bengali',  native: 'বাংলা'    },
];

// ── Toast ──────────────────────────────────────────────────────────
function Toast({ message, type, visible }) {
  if (!visible) return null;
  const ok = type === 'success';
  return (
    <div style={{
      position: 'fixed', bottom: 90, left: '50%', transform: 'translateX(-50%)',
      zIndex: 9999, background: ok ? 'rgba(0,230,118,0.95)' : 'rgba(255,82,82,0.95)',
      color: '#000', padding: '10px 20px', borderRadius: 30, fontSize: 13,
      fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8,
      boxShadow: '0 4px 20px rgba(0,0,0,0.4)', whiteSpace: 'nowrap', animation: 'fadeIn 0.2s ease',
    }}>
      {ok ? <Check size={14} /> : <X size={14} />}{message}
    </div>
  );
}

// ── Dropdown wrapper ───────────────────────────────────────────────
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
      borderRadius: 16, minWidth: 220, boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
      overflow: 'hidden', animation: 'fadeIn 0.15s ease',
    }}>
      {children}
    </div>
  );
}

// ── Auth Modal ─────────────────────────────────────────────────────
function AuthModal({ open, onClose, onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const validate = () => {
    if (!email.includes('@')) return 'Enter a valid email address';
    if (password.length < 6) return 'Password must be at least 6 characters';
    return '';
  };

  const handleSubmit = async () => {
    const err = validate();
    if (err) { setError(err); return; }
    setLoading(true); setError('');
    // Simulate auth (replace with real Supabase auth later)
    await new Promise(r => setTimeout(r, 900));
    const user = { email, name: email.split('@')[0] };
    localStorage.setItem('bikeiq_user', JSON.stringify(user));
    onLogin(user);
    onClose();
    setLoading(false);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9998,
      background: 'rgba(0,0,0,0.7)', display: 'flex',
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
              {isLogin ? 'Welcome back' : 'Create account'}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2 }}>
              {isLogin ? 'Sign in to BikeIQ' : 'Join BikeIQ — it\'s free'}
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)', fontSize: 20 }}>✕</button>
        </div>

        {/* Email */}
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block', marginBottom: 6 }}>Email</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px' }}>
            <Mail size={15} color="var(--text3)" />
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: 'var(--text)', fontSize: 14, fontFamily: 'inherit' }}
            />
          </div>
        </div>

        {/* Password */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block', marginBottom: 6 }}>Password</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px' }}>
            <Lock size={15} color="var(--text3)" />
            <input
              type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: 'var(--text)', fontSize: 14, fontFamily: 'inherit' }}
            />
            <button onClick={() => setShowPw(!showPw)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)', display: 'flex' }}>
              {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        {error && (
          <div style={{ background: 'rgba(255,82,82,0.1)', border: '1px solid rgba(255,82,82,0.3)', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: 'var(--red)', marginBottom: 12 }}>
            ⚠️ {error}
          </div>
        )}

        <button
          onClick={handleSubmit} disabled={loading}
          style={{
            width: '100%', padding: '13px', background: 'var(--accent)',
            color: '#000', fontWeight: 700, fontSize: 15, borderRadius: 12,
            border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1, fontFamily: 'inherit',
          }}
        >
          {loading ? '⏳ Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
        </button>

        <div style={{ textAlign: 'center', marginTop: 14, fontSize: 13, color: 'var(--text3)' }}>
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <span style={{ color: 'var(--accent)', cursor: 'pointer', fontWeight: 600 }}
            onClick={() => { setIsLogin(!isLogin); setError(''); }}>
            {isLogin ? 'Sign Up' : 'Sign In'}
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Main Header ────────────────────────────────────────────────────
export default function Header({ navigate, page, darkMode, setDarkMode }) {
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
  const [langOpen, setLangOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [lang, setLang] = useState(() => localStorage.getItem('bikeiq_lang') || 'en');
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('bikeiq_user')); } catch { return null; }
  });
  const [city, setCity] = useState(() => localStorage.getItem('bikeiq_city') || '');
  const [locating, setLocating] = useState(false);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast(t => ({ ...t, visible: false })), 2500);
  }, []);

  // Share
  const handleShare = useCallback(async () => {
    const url = window.location.href;
    const title = "BikeIQ — India's Smartest Bike Platform";
    const text = 'Search, compare and get AI insights on every bike and scooter in India.';
    if (navigator.share) {
      try { await navigator.share({ title, text, url }); }
      catch (err) { if (err.name !== 'AbortError') showToast('Could not share', 'error'); }
      return;
    }
    try {
      if (navigator.clipboard?.writeText) { await navigator.clipboard.writeText(url); }
      else {
        const el = document.createElement('textarea');
        el.value = url; el.style.position = 'fixed'; el.style.opacity = '0';
        document.body.appendChild(el); el.select();
        document.execCommand('copy'); document.body.removeChild(el);
      }
      showToast('Link copied to clipboard!', 'success');
    } catch { showToast('Could not copy link', 'error'); }
  }, [showToast]);

  // Location
  const detectCity = useCallback(() => {
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`);
          const data = await res.json();
          const detected = data.address?.city || data.address?.town || data.address?.state_district || 'India';
          setCity(detected);
          localStorage.setItem('bikeiq_city', detected);
          showToast(`📍 Location set to ${detected}`);
        } catch { showToast('Could not detect city', 'error'); }
        setLocating(false);
      },
      () => { showToast('Location access denied', 'error'); setLocating(false); }
    );
  }, [showToast]);

  // Language select
  const selectLang = (code) => {
    setLang(code);
    localStorage.setItem('bikeiq_lang', code);
    setLangOpen(false);
    const chosen = LANGUAGES.find(l => l.code === code);
    showToast(`Language set to ${chosen?.label}`);
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('bikeiq_user');
    setUser(null);
    setUserOpen(false);
    showToast('Signed out successfully');
  };

  const currentLang = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];
  const avatarLetter = user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U';

  return (
    <>
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

          {/* Location — desktop only */}
          <button
            className="icon-btn"
            onClick={detectCity}
            title={city ? `Location: ${city}` : 'Detect my city'}
            style={{ display: 'flex', alignItems: 'center', gap: 4, width: city ? 'auto' : 38, padding: city ? '0 10px' : undefined, fontSize: 12, color: city ? 'var(--accent)' : undefined }}
          >
            <MapPin size={15} />
            {city && <span style={{ fontSize: 11, fontWeight: 600, maxWidth: 60, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{locating ? '...' : city}</span>}
            {!city && locating && '...'}
          </button>

          {/* Language */}
          <div style={{ position: 'relative' }}>
            <button
              className="icon-btn"
              onClick={() => { setLangOpen(!langOpen); setUserOpen(false); }}
              title="Language"
              style={{ display: 'flex', alignItems: 'center', gap: 4, width: 'auto', padding: '0 10px', fontSize: 12 }}
            >
              <Globe size={15} />
              <span style={{ fontSize: 11, fontWeight: 700 }}>{currentLang.code.toUpperCase()}</span>
            </button>
            <Dropdown open={langOpen} onClose={() => setLangOpen(false)}>
              <div style={{ padding: '8px 0' }}>
                <div style={{ padding: '8px 16px 6px', fontSize: 10, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Select Language</div>
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
                    <span style={{ fontSize: 12, color: 'var(--text3)' }}>{l.label}</span>
                  </div>
                ))}
              </div>
            </Dropdown>
          </div>

          {/* Share */}
          <button className="icon-btn" onClick={handleShare} title="Share BikeIQ">
            <Share2 size={16} />
          </button>

          {/* Theme */}
          <button className="icon-btn" onClick={() => setDarkMode(!darkMode)} title="Toggle theme">
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* User / Login */}
          <div style={{ position: 'relative' }}>
            {user ? (
              <button
                className="icon-btn"
                onClick={() => { setUserOpen(!userOpen); setLangOpen(false); }}
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
                onClick={() => { setAuthOpen(true); setUserOpen(false); setLangOpen(false); }}
                title="Sign In"
                style={{ display: 'flex', alignItems: 'center', gap: 4, width: 'auto', padding: '0 10px', fontSize: 12 }}
              >
                <User size={15} />
                <span style={{ fontSize: 11, fontWeight: 700 }}>Login</span>
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
              </div>
              <div style={{ padding: '8px 0' }}>
                <div
                  onClick={handleLogout}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', cursor: 'pointer', fontSize: 14, color: 'var(--red)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg3)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <LogOut size={15} /> Sign Out
                </div>
              </div>
            </Dropdown>
          </div>
        </div>
      </header>

      <Toast message={toast.message} type={toast.type} visible={toast.visible} />
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} onLogin={(u) => { setUser(u); showToast(`Welcome, ${u.name}! 👋`); }} />
    </>
  );
}
