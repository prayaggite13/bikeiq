import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Search, Moon, Sun, Zap, Share2, Check, X, Globe, User, LogOut, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../utils/supabase';
import { useLang } from '../utils/LanguageContext';

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

// ── Dropdown ───────────────────────────────────────────────────────
function Dropdown({ open, onClose, children }) {
  const ref = useRef();
  useEffect(() => {
    if (!open) return;
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div ref={ref} style={{
      position: 'absolute', top: 46, right: 0, zIndex: 2000,
      background: 'var(--bg2)', border: '1px solid var(--border)',
      borderRadius: 16, minWidth: 220, boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
      overflow: 'hidden', animation: 'fadeIn 0.15s ease',
    }}>
      {children}
    </div>
  );
}

// ── Auth Modal ─────────────────────────────────────────────────────
function AuthModal({ open, onClose, onLogin, showToast }) {
  const { t } = useLang();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) { setEmail(''); setPassword(''); setError(''); setIsLogin(true); }
  }, [open]);

  if (!open) return null;

  const validate = () => {
    if (!email.includes('@') || !email.includes('.')) return t('invalidEmail');
    if (password.length < 6) return t('shortPassword');
    return '';
  };

  const handleSubmit = async () => {
    const err = validate();
    if (err) { setError(err); return; }
    setLoading(true); setError('');

    if (isLogin) {
      // Sign in with Supabase
      const { data, error: authErr } = await supabase.auth.signInWithPassword({ email, password });
      if (authErr) {
        setError(t('wrongCredentials'));
        setLoading(false); return;
      }
      const user = { email: data.user.email, name: data.user.email.split('@')[0], id: data.user.id };
      onLogin(user);
      showToast(`${t('welcome')}, ${user.name}! 👋`);
      onClose();
    } else {
      // Sign up with Supabase
      const { data, error: authErr } = await supabase.auth.signUp({ email, password });
      if (authErr) {
        if (authErr.message?.includes('already')) setError(t('emailExists'));
        else setError(t('authError'));
        setLoading(false); return;
      }
      if (data.user) {
        const user = { email: data.user.email, name: data.user.email.split('@')[0], id: data.user.id };
        onLogin(user);
        showToast(`${t('welcome')}, ${user.name}! 👋`);
        onClose();
      } else {
        // Email confirmation required
        setError('');
        showToast('Check your email to confirm your account.');
        onClose();
      }
    }
    setLoading(false);
  };

  const inputStyle = {
    flex: 1, background: 'none', border: 'none', outline: 'none',
    color: 'var(--text)', fontSize: 14, fontFamily: 'inherit',
  };
  const wrapStyle = {
    display: 'flex', alignItems: 'center', gap: 10,
    background: 'var(--bg3)', border: '1px solid var(--border)',
    borderRadius: 10, padding: '10px 14px',
  };

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

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 22 }}>
          <div>
            <div style={{ fontFamily: 'Rajdhani,sans-serif', fontSize: 22, fontWeight: 800, color: 'var(--text)' }}>
              {isLogin ? t('welcomeBack') : t('createAccount')}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 3 }}>
              {isLogin ? t('signInTo') : t('joinBikeIQ')}
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)', fontSize: 20, lineHeight: 1 }}>✕</button>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block', marginBottom: 6 }}>{t('email')}</label>
          <div style={wrapStyle}>
            <Mail size={15} color="var(--text3)" />
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com" style={inputStyle} />
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block', marginBottom: 6 }}>{t('password')}</label>
          <div style={wrapStyle}>
            <Lock size={15} color="var(--text3)" />
            <input type={showPw ? 'text' : 'password'} value={password}
              onChange={e => setPassword(e.target.value)} placeholder="••••••••"
              onKeyDown={e => e.key === 'Enter' && handleSubmit()} style={inputStyle} />
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

        <button onClick={handleSubmit} disabled={loading} style={{
          width: '100%', padding: 13, background: 'var(--accent)', color: '#000',
          fontWeight: 700, fontSize: 15, borderRadius: 12, border: 'none',
          cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, fontFamily: 'inherit',
        }}>
          {loading ? t('pleaseWait') : (isLogin ? t('signIn') : t('signUp'))}
        </button>

        <div style={{ textAlign: 'center', marginTop: 14, fontSize: 13, color: 'var(--text3)' }}>
          {isLogin ? t('noAccount') : t('haveAccount')}{' '}
          <span style={{ color: 'var(--accent)', cursor: 'pointer', fontWeight: 600 }}
            onClick={() => { setIsLogin(!isLogin); setError(''); }}>
            {isLogin ? t('signUp') : t('signIn')}
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Main Header ────────────────────────────────────────────────────
export default function Header({ navigate, page, darkMode, setDarkMode }) {
  const { lang, setLang, t } = useLang();
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
  const [langOpen, setLangOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [user, setUser] = useState(null);

  // Restore session on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({ email: session.user.email, name: session.user.email.split('@')[0], id: session.user.id });
      }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({ email: session.user.email, name: session.user.email.split('@')[0], id: session.user.id });
      } else {
        setUser(null);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast(x => ({ ...x, visible: false })), 2500);
  }, []);

  const handleShare = useCallback(async () => {
    const url = window.location.href;
    const title = "BikeIQ — India's Smartest Bike Platform";
    const text = 'Search, compare and get AI insights on every bike and scooter in India.';
    if (navigator.share) {
      try { await navigator.share({ title, text, url }); }
      catch (err) { if (err.name !== 'AbortError') showToast(t('couldNotCopy'), 'error'); }
      return;
    }
    try {
      if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(url);
      else {
        const el = document.createElement('textarea');
        el.value = url; el.style.position = 'fixed'; el.style.opacity = '0';
        document.body.appendChild(el); el.select(); document.execCommand('copy'); document.body.removeChild(el);
      }
      showToast(t('linkCopied'), 'success');
    } catch { showToast(t('couldNotCopy'), 'error'); }
  }, [showToast, t]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null); setUserOpen(false);
    showToast(t('signedOut'));
  };

  const avatarLetter = user?.name?.[0]?.toUpperCase() || 'U';

  const langBtnStyle = {
    display: 'flex', alignItems: 'center', gap: 4,
    width: 'auto', padding: '0 8px', fontSize: 12,
    background: 'var(--bg3)', border: '1px solid var(--border)',
    borderRadius: 10, height: 38, cursor: 'pointer', color: 'var(--text2)',
  };

  return (
    <>
      <header className="header">
        <div className="header-logo" onClick={() => navigate('home')}>
          <Zap size={20} fill="currentColor" />
          Bike<span>IQ</span>
        </div>

        <div className="header-actions">
          <button className="icon-btn" onClick={() => navigate('search')} title={t('search')}>
            <Search size={16} />
          </button>

          {/* Language selector */}
          <div style={{ position: 'relative' }}>
            <button style={langBtnStyle} onClick={() => { setLangOpen(!langOpen); setUserOpen(false); }} title={t('language')}>
              <Globe size={14} />
              <span style={{ fontWeight: 700, fontSize: 11 }}>{lang === 'hi' ? 'हिं' : 'EN'}</span>
            </button>
            <Dropdown open={langOpen} onClose={() => setLangOpen(false)}>
              <div style={{ padding: '6px 0' }}>
                <div style={{ padding: '8px 16px 6px', fontSize: 10, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                  {t('language')}
                </div>
                {[{ code: 'en', label: 'English', native: 'English' }, { code: 'hi', label: 'Hindi', native: 'हिंदी' }].map(l => (
                  <div key={l.code} onClick={() => { setLang(l.code); setLangOpen(false); showToast(l.code === 'hi' ? 'भाषा हिंदी में बदली ✓' : 'Language set to English ✓'); }}
                    style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '11px 16px', cursor: 'pointer', fontSize: 14,
                      background: lang === l.code ? 'rgba(0,212,255,0.08)' : 'transparent',
                      color: lang === l.code ? 'var(--accent)' : 'var(--text)',
                      fontWeight: lang === l.code ? 700 : 400,
                    }}>
                    <span>{l.native}</span>
                    {lang === l.code && <Check size={14} color="var(--accent)" />}
                  </div>
                ))}
              </div>
            </Dropdown>
          </div>

          <button className="icon-btn" onClick={handleShare} title={t('share')}>
            <Share2 size={16} />
          </button>

          <button className="icon-btn" onClick={() => setDarkMode(!darkMode)} title="Toggle theme">
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* User / Login */}
          <div style={{ position: 'relative' }}>
            {user ? (
              <button onClick={() => { setUserOpen(!userOpen); setLangOpen(false); }}
                style={{
                  width: 34, height: 34, borderRadius: '50%',
                  background: 'var(--accent)', color: '#000',
                  fontWeight: 800, fontSize: 14, border: 'none', cursor: 'pointer',
                  fontFamily: 'Rajdhani,sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                {avatarLetter}
              </button>
            ) : (
              <button onClick={() => { setAuthOpen(true); setLangOpen(false); setUserOpen(false); }}
                style={{ ...langBtnStyle, color: 'var(--accent)', borderColor: 'rgba(0,212,255,0.3)', background: 'rgba(0,212,255,0.06)' }}>
                <User size={14} />
                <span style={{ fontWeight: 700, fontSize: 11 }}>{t('login')}</span>
              </button>
            )}

            <Dropdown open={userOpen} onClose={() => setUserOpen(false)}>
              <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--accent)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 16, fontFamily: 'Rajdhani,sans-serif', flexShrink: 0 }}>
                  {avatarLetter}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>{user?.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>{user?.email}</div>
                </div>
              </div>
              <div style={{ padding: '6px 0' }}>
                <div onClick={handleLogout}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 16px', cursor: 'pointer', fontSize: 14, color: 'var(--red)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg3)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <LogOut size={14} /> {t('signout')}
                </div>
              </div>
            </Dropdown>
          </div>
        </div>
      </header>

      <Toast message={toast.message} type={toast.type} visible={toast.visible} />
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} onLogin={setUser} showToast={showToast} />
    </>
  );
}
