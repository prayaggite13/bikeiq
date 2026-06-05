import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Search, Moon, Sun, Zap, Share2, Check, X, MapPin, Globe, User, LogOut, Eye, EyeOff } from 'lucide-react';

// ─── Toast ────────────────────────────────────────────────────────────────────
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

// ─── Language config ──────────────────────────────────────────────────────────
const LANGUAGES = [
  { code: 'en', label: 'English',    native: 'English'   },
  { code: 'hi', label: 'Hindi',      native: 'हिन्दी'    },
  { code: 'mr', label: 'Marathi',    native: 'मराठी'     },
  { code: 'te', label: 'Telugu',     native: 'తెలుగు'    },
  { code: 'ta', label: 'Tamil',      native: 'தமிழ்'     },
  { code: 'bn', label: 'Bengali',    native: 'বাংলা'     },
];

// ─── Auth Modal ───────────────────────────────────────────────────────────────
function AuthModal({ onClose, onLogin, darkMode }) {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const bg   = darkMode ? '#111' : '#fff';
  const text = darkMode ? '#f0f0f0' : '#111';
  const sub  = darkMode ? '#888' : '#666';
  const inputBg  = darkMode ? '#1e1e1e' : '#f5f5f5';
  const inputBdr = darkMode ? '#333' : '#ddd';
  const accent = '#00e676';

  const validate = () => {
    if (!email.includes('@') || !email.includes('.')) return 'Enter a valid email address.';
    if (password.length < 6) return 'Password must be at least 6 characters.';
    if (mode === 'signup' && password !== confirmPassword) return 'Passwords do not match.';
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const err = validate();
    if (err) { setError(err); return; }

    setLoading(true);

    // Simulate async auth (replace with real backend call)
    setTimeout(() => {
      setLoading(false);
      if (mode === 'signup') {
        // Store in localStorage (replace with real backend)
        const users = JSON.parse(localStorage.getItem('bikeiq_users') || '{}');
        if (users[email]) { setError('Account already exists. Please log in.'); return; }
        users[email] = { password };
        localStorage.setItem('bikeiq_users', JSON.stringify(users));
        onLogin({ email });
      } else {
        const users = JSON.parse(localStorage.getItem('bikeiq_users') || '{}');
        if (!users[email]) { setError('No account found. Please sign up first.'); return; }
        if (users[email].password !== password) { setError('Incorrect password.'); return; }
        onLogin({ email });
      }
    }, 600);
  };

  const inputStyle = {
    width: '100%',
    padding: '11px 14px',
    borderRadius: 10,
    border: `1.5px solid ${inputBdr}`,
    background: inputBg,
    color: text,
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border 0.2s',
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 8888,
      background: 'rgba(0,0,0,0.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '0 16px',
      backdropFilter: 'blur(4px)',
    }} onClick={onClose}>
      <div style={{
        background: bg,
        borderRadius: 20,
        padding: '32px 28px',
        width: '100%',
        maxWidth: 400,
        boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
        position: 'relative',
      }} onClick={e => e.stopPropagation()}>

        {/* Close */}
        <button onClick={onClose} style={{
          position: 'absolute', top: 16, right: 16,
          background: 'none', border: 'none', cursor: 'pointer',
          color: sub, padding: 4,
        }}><X size={20} /></button>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 8 }}>
          <span style={{ color: accent, fontSize: 22, fontWeight: 900, letterSpacing: '-0.5px' }}>
            <Zap size={18} style={{ verticalAlign: 'middle', marginRight: 4 }} fill={accent} />
            Bike<span style={{ color: text }}>IQ</span>
          </span>
        </div>

        {/* Mode toggle */}
        <div style={{
          display: 'flex', background: inputBg,
          borderRadius: 12, padding: 4, marginBottom: 24,
        }}>
          {['login', 'signup'].map(m => (
            <button key={m} onClick={() => { setMode(m); setError(''); }} style={{
              flex: 1, padding: '9px 0',
              borderRadius: 9, border: 'none', cursor: 'pointer',
              background: mode === m ? accent : 'transparent',
              color: mode === m ? '#000' : sub,
              fontWeight: 700, fontSize: 13,
              transition: 'all 0.2s',
            }}>
              {m === 'login' ? 'Log In' : 'Sign Up'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Email */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: sub, display: 'block', marginBottom: 6 }}>
              Email Address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          {/* Password */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: sub, display: 'block', marginBottom: 6 }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="Min. 6 characters"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                style={{ ...inputStyle, paddingRight: 40 }}
              />
              <button type="button" onClick={() => setShowPass(p => !p)} style={{
                position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer', color: sub, padding: 0,
              }}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Confirm Password (signup only) */}
          {mode === 'signup' && (
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: sub, display: 'block', marginBottom: 6 }}>
                Confirm Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                  style={{ ...inputStyle, paddingRight: 40 }}
                />
                <button type="button" onClick={() => setShowConfirm(p => !p)} style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: sub, padding: 0,
                }}>
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          )}

          {error && (
            <p style={{ color: '#ff5252', fontSize: 12, margin: 0, fontWeight: 600 }}>
              ⚠ {error}
            </p>
          )}

          <button type="submit" disabled={loading} style={{
            width: '100%',
            padding: '13px 0',
            background: loading ? '#555' : accent,
            color: '#000',
            border: 'none',
            borderRadius: 12,
            fontWeight: 800,
            fontSize: 15,
            cursor: loading ? 'not-allowed' : 'pointer',
            marginTop: 4,
            transition: 'background 0.2s',
          }}>
            {loading ? '...' : mode === 'login' ? 'Log In' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Language Dropdown ────────────────────────────────────────────────────────
function LangDropdown({ language, setLanguage, darkMode }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const bg    = darkMode ? '#1a1a1a' : '#fff';
  const text  = darkMode ? '#f0f0f0' : '#111';
  const hover = darkMode ? '#252525' : '#f5f5f5';
  const bdr   = darkMode ? '#333' : '#e0e0e0';

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        className="icon-btn"
        title="Language"
        onClick={() => setOpen(o => !o)}
        style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 700 }}
      >
        <Globe size={16} />
        <span style={{ fontSize: 11, fontWeight: 800 }}>{current.code.toUpperCase()}</span>
      </button>

      {open && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 8px)',
          right: 0,
          background: bg,
          border: `1.5px solid ${bdr}`,
          borderRadius: 12,
          padding: '6px 0',
          zIndex: 999,
          minWidth: 150,
          boxShadow: '0 12px 32px rgba(0,0,0,0.25)',
        }}>
          {LANGUAGES.map(lang => (
            <button
              key={lang.code}
              onClick={() => { setLanguage(lang.code); setOpen(false); }}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                width: '100%', padding: '9px 16px',
                background: language === lang.code ? hover : 'transparent',
                border: 'none', cursor: 'pointer', color: text,
                fontSize: 13, fontWeight: language === lang.code ? 700 : 400,
                textAlign: 'left',
              }}
            >
              <span>{lang.label}</span>
              <span style={{ fontSize: 12, opacity: 0.7 }}>{lang.native}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Location Display ─────────────────────────────────────────────────────────
function LocationPill({ darkMode }) {
  const [location, setLocation] = useState('Detecting…');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try geolocation → reverse geocode with a free API
    if (!navigator.geolocation) { setLocation('India'); setLoading(false); return; }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();
          const city =
            data.address?.city ||
            data.address?.town ||
            data.address?.village ||
            data.address?.county ||
            'India';
          setLocation(city);
        } catch {
          setLocation('India');
        } finally {
          setLoading(false);
        }
      },
      () => { setLocation('India'); setLoading(false); },
      { timeout: 5000 }
    );
  }, []);

  const color = darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
  const text  = darkMode ? '#aaa' : '#555';

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 4,
      background: color, borderRadius: 20, padding: '4px 10px',
      fontSize: 11, fontWeight: 600, color: text,
      whiteSpace: 'nowrap', maxWidth: 110, overflow: 'hidden',
    }}>
      <MapPin size={11} style={{ flexShrink: 0, color: '#00e676' }} />
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {loading ? '…' : location}
      </span>
    </div>
  );
}

// ─── User Menu ────────────────────────────────────────────────────────────────
function UserMenu({ user, onLogout, darkMode }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const bg   = darkMode ? '#1a1a1a' : '#fff';
  const text = darkMode ? '#f0f0f0' : '#111';
  const bdr  = darkMode ? '#333' : '#e0e0e0';
  const sub  = darkMode ? '#888' : '#666';

  const initials = user.email ? user.email[0].toUpperCase() : '?';

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button onClick={() => setOpen(o => !o)} style={{
        width: 32, height: 32,
        borderRadius: '50%',
        background: '#00e676',
        color: '#000',
        border: 'none',
        fontWeight: 900,
        fontSize: 13,
        cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {initials}
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 8px)', right: 0,
          background: bg, border: `1.5px solid ${bdr}`,
          borderRadius: 12, padding: '12px 16px',
          zIndex: 999, minWidth: 180,
          boxShadow: '0 12px 32px rgba(0,0,0,0.25)',
        }}>
          <p style={{ fontSize: 11, color: sub, margin: '0 0 4px 0', fontWeight: 600 }}>Signed in as</p>
          <p style={{ fontSize: 13, color: text, margin: '0 0 12px 0', fontWeight: 700, wordBreak: 'break-all' }}>
            {user.email}
          </p>
          <button onClick={() => { onLogout(); setOpen(false); }} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            width: '100%', padding: '9px 0',
            background: 'rgba(255,82,82,0.12)', border: 'none',
            borderRadius: 8, cursor: 'pointer',
            color: '#ff5252', fontSize: 13, fontWeight: 700,
          }}>
            <LogOut size={14} /> Log Out
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Main Header ──────────────────────────────────────────────────────────────
export default function Header({
  navigate, page, darkMode, setDarkMode,
  language, setLanguage,
}) {
  const [toast, setToast]     = useState({ visible: false, message: '', type: 'success' });
  const [showAuth, setShowAuth] = useState(false);
  const [user, setUser]       = useState(() => {
    try { return JSON.parse(localStorage.getItem('bikeiq_user') || 'null'); } catch { return null; }
  });

  const showToast = useCallback((message, type = 'success') => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast(t => ({ ...t, visible: false })), 2500);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('bikeiq_user', JSON.stringify(userData));
    setShowAuth(false);
    showToast(`Welcome, ${userData.email.split('@')[0]}!`, 'success');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('bikeiq_user');
    showToast('Logged out successfully', 'success');
  };

  const handleShare = useCallback(async () => {
    const url   = window.location.href;
    const title = "BikeIQ — India's Smartest Bike Platform";
    const text  = 'Search, compare and get AI insights on every bike and scooter in India.';
    if (navigator.share) {
      try { await navigator.share({ title, text, url }); }
      catch (err) { if (err.name !== 'AbortError') showToast('Could not share', 'error'); }
      return;
    }
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const el = document.createElement('textarea');
        el.value = url; el.style.cssText = 'position:fixed;opacity:0';
        document.body.appendChild(el); el.select(); document.execCommand('copy');
        document.body.removeChild(el);
      }
      showToast('Link copied to clipboard!', 'success');
    } catch { showToast('Could not copy link', 'error'); }
  }, [showToast]);

  return (
    <>
      <header className="header">
        {/* Logo */}
        <div className="header-logo" onClick={() => navigate('home')}>
          <Zap size={20} fill="currentColor" />
          Bike<span>IQ</span>
        </div>

        {/* Location pill — hide on very small screens via className if needed */}
        <LocationPill darkMode={darkMode} />

        {/* Right actions */}
        <div className="header-actions">
          <LangDropdown language={language} setLanguage={setLanguage} darkMode={darkMode} />

          <button className="icon-btn" onClick={() => navigate('search')} title="Search">
            <Search size={16} />
          </button>
          <button className="icon-btn" onClick={handleShare} title="Share BikeIQ">
            <Share2 size={16} />
          </button>
          <button className="icon-btn" onClick={() => setDarkMode(!darkMode)} title="Toggle theme">
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* Auth */}
          {user ? (
            <UserMenu user={user} onLogout={handleLogout} darkMode={darkMode} />
          ) : (
            <button
              onClick={() => setShowAuth(true)}
              style={{
                padding: '6px 14px',
                background: '#00e676',
                color: '#000',
                border: 'none',
                borderRadius: 20,
                fontWeight: 800,
                fontSize: 12,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                display: 'flex', alignItems: 'center', gap: 5,
              }}
            >
              <User size={13} />
              Login
            </button>
          )}
        </div>
      </header>

      {showAuth && (
        <AuthModal
          darkMode={darkMode}
          onClose={() => setShowAuth(false)}
          onLogin={handleLogin}
        />
      )}

      <Toast message={toast.message} type={toast.type} visible={toast.visible} />
    </>
  );
}
