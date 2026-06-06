import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Search, Moon, Sun, Zap, Share2, Check, X, Globe, User, LogOut, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../utils/supabase';
import { useLang, useUser } from '../context/AppContext';

const LANGUAGES = [
  { code: 'en', native: 'English' },
  { code: 'hi', native: 'हिंदी'   },
];

// ── Toast ─────────────────────────────────────────────────────────────────────
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

// ── Click-outside dropdown ────────────────────────────────────────────────────
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
      borderRadius: 16, minWidth: 200, boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
      overflow: 'hidden', animation: 'fadeIn 0.15s ease',
    }}>
      {children}
    </div>
  );
}

// ── Auth Modal — real Supabase auth ───────────────────────────────────────────
function AuthModal({ open, onClose, onLogin, t }) {
  const [isLogin, setIsLogin]     = useState(true);
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showPw, setShowPw]       = useState(false);
  const [error, setError]         = useState('');
  const [loading, setLoading]     = useState(false);

  useEffect(() => {
    if (!open) { setEmail(''); setPassword(''); setConfirmPw(''); setError(''); setLoading(false); }
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
        const { data, error: authErr } = await supabase.auth.signInWithPassword({ email, password });
        if (authErr) {
          setError(authErr.message?.toLowerCase().includes('invalid') ? t('invalidCredentials') : t('authError'));
          setLoading(false); return;
        }
        const u = data.user;
        onLogin({ id: u.id, email: u.email, name: u.user_metadata?.name || u.email.split('@')[0] });
        onClose();
      } else {
        const { data, error: authErr } = await supabase.auth.signUp({
          email, password, options: { data: { name: email.split('@')[0] } },
        });
        if (authErr) {
          setError(authErr.message?.toLowerCase().includes('already') ? t('emailExists') : t('authError'));
          setLoading(false); return;
        }
        if (data.session) {
          const u = data.user;
          onLogin({ id: u.id, email: u.email, name: u.user_metadata?.name || u.email.split('@')[0] });
          onClose();
        } else {
          setError('✅ Check your email to confirm, then sign in.');
        }
      }
    } catch { setError(t('authError')); }
    setLoading(false);
  };

  const isSuccess = error.startsWith('✅');

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9998, background: 'rgba(0,0,0,0.75)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
    }} onClick={onClose}>
      <div style={{
        background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 20,
        padding: 24, width: '100%', maxWidth: 360,
        boxShadow: '0 20px 60px rgba(0,0,0,0.6)', animation: 'slideUp 0.2s ease',
      }} onClick={e => e.stopPropagation()}>

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
            <input type="email" value={email} onChange={e => { setEmail(e.target.value); setError(''); }}
              placeholder={t('emailPlaceholder')}
              style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: 'var(--text)', fontSize: 14, fontFamily: 'inherit' }} />
          </div>
        </div>

        {/* Password */}
        <div style={{ marginBottom: isLogin ? 16 : 12 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block', marginBottom: 6 }}>{t('password')}</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px' }}>
            <Lock size={15} color="var(--text3)" />
            <input type={showPw ? 'text' : 'password'} value={password}
              onChange={e => { setPassword(e.target.value); setError(''); }}
              placeholder={t('passwordPlaceholder')}
              onKeyDown={e => e.key === 'Enter' && isLogin && handleSubmit()}
              style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: 'var(--text)', fontSize: 14, fontFamily: 'inherit' }} />
            <button onClick={() => setShowPw(!showPw)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)', display: 'flex' }}>
              {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        {/* Confirm Password (Sign Up only) */}
        {!isLogin && (
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block', marginBottom: 6 }}>{t('confirmPassword')}</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px' }}>
              <Lock size={15} color="var(--text3)" />
              <input type={showPw ? 'text' : 'password'} value={confirmPw}
                onChange={e => { setConfirmPw(e.target.value); setError(''); }}
                placeholder={t('passwordPlaceholder')}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: 'var(--text)', fontSize: 14, fontFamily: 'inherit' }} />
            </div>
          </div>
        )}

        {error && (
          <div style={{
            background: isSuccess ? 'rgba(0,230,118,0.1)' : 'rgba(255,82,82,0.1)',
            border: `1px solid ${isSuccess ? 'rgba(0,230,118,0.3)' : 'rgba(255,82,82,0.3)'}`,
            borderRadius: 8, padding: '8px 12px', fontSize: 12,
            color: isSuccess ? 'var(--green)' : 'var(--red)', marginBottom: 12,
          }}>{error}</div>
        )}

        <button onClick={handleSubmit} disabled={loading} style={{
          width: '100%', padding: 13, background: 'var(--accent)', color: '#000',
          fontWeight: 700, fontSize: 15, borderRadius: 12, border: 'none',
          cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, fontFamily: 'inherit',
        }}>
          {loading ? `⏳ ${t('pleaseWait')}` : (isLogin ? t('signIn') : t('createAccount'))}
        </button>

        <div style={{ textAlign: 'center', marginTop: 14, fontSize: 13, color: 'var(--text3)' }}>
          {isLogin ? t('noAccount') : t('haveAccount')}{' '}
          <span style={{ color: 'var(--accent)', cursor: 'pointer', fontWeight: 600 }}
            onClick={() => { setIsLogin(!isLogin); setError(''); setPassword(''); setConfirmPw(''); }}>
            {isLogin ? t('signUp') : t('signIn')}
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Main Header ───────────────────────────────────────────────────────────────
export default function Header({ navigate, darkMode, setDarkMode }) {
  const { lang, setLang, t } = useLang();
  const { user, setUser }    = useUser();

  const [toast, setToast]     = useState({ visible: false, message: '', type: 'success' });
  const [langOpen, setLangOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast(p => ({ ...p, visible: false })), 2500);
  }, []);

  const handleShare = useCallback(async () => {
    try {
      if (navigator.share) { await navigator.share({ title: 'BikeIQ', url: window.location.href }); return; }
      await navigator.clipboard.writeText(window.location.href);
      showToast(t('linkCopied'));
    } catch {}
  }, [showToast, t]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setUserOpen(false);
    showToast(t('signedOut'));
  };

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

          {/* Language EN / HI */}
          <div style={{ position: 'relative' }}>
            <button
              className="icon-btn"
              onClick={() => { setLangOpen(!langOpen); setUserOpen(false); }}
              style={{ display: 'flex', alignItems: 'center', gap: 4, width: 'auto', padding: '0 10px' }}
              title={t('selectLanguage')}
            >
              <Globe size={15} />
              <span style={{ fontSize: 11, fontWeight: 700 }}>{lang.toUpperCase()}</span>
            </button>
            <Dropdown open={langOpen} onClose={() => setLangOpen(false)}>
              <div style={{ padding: '8px 0' }}>
                <div style={{ padding: '8px 16px 6px', fontSize: 10, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                  {t('selectLanguage')}
                </div>
                {LANGUAGES.map(l => (
                  <div key={l.code} onClick={() => { setLang(l.code); setLangOpen(false); showToast(l.native); }}
                    style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '11px 16px', cursor: 'pointer', fontSize: 14,
                      background: lang === l.code ? 'rgba(0,212,255,0.08)' : 'transparent',
                      color: lang === l.code ? 'var(--accent)' : 'var(--text)',
                      fontWeight: lang === l.code ? 700 : 400,
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg3)'}
                    onMouseLeave={e => e.currentTarget.style.background = lang === l.code ? 'rgba(0,212,255,0.08)' : 'transparent'}
                  >
                    <span>{l.native}</span>
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
              <button className="icon-btn"
                onClick={() => { setUserOpen(!userOpen); setLangOpen(false); }}
                style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--accent)', color: '#000', fontWeight: 800, fontSize: 14, border: 'none', cursor: 'pointer', fontFamily: 'Rajdhani,sans-serif' }}
                title={user.name || user.email}
              >
                {avatarLetter}
              </button>
            ) : (
              <button className="icon-btn"
                onClick={() => { setAuthOpen(true); setLangOpen(false); }}
                style={{ display: 'flex', alignItems: 'center', gap: 4, width: 'auto', padding: '0 10px' }}
                title={t('signIn')}
              >
                <User size={15} />
                <span style={{ fontSize: 11, fontWeight: 700 }}>{t('login')}</span>
              </button>
            )}

            <Dropdown open={userOpen} onClose={() => setUserOpen(false)}>
              <div style={{ padding: 16, borderBottom: '1px solid var(--border)' }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--accent)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 18, marginBottom: 8, fontFamily: 'Rajdhani,sans-serif' }}>
                  {avatarLetter}
                </div>
                <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>{user?.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2 }}>{user?.email}</div>
              </div>
              <div style={{ padding: '8px 0' }}>
                <div onClick={handleLogout}
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
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} t={t}
        onLogin={(u) => { setUser(u); showToast(`${t('welcome')}, ${u.name}! 👋`); }} />
    </>
  );
}
