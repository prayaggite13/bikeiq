import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X, ChevronRight, Clock, Mic, MicOff } from 'lucide-react';
import { searchBikeInfo } from '../utils/gemini';
import BikeCard from '../components/BikeCard';

const ALL_SUGGESTIONS = [
  'Royal Enfield Classic 350', 'Royal Enfield Meteor 350', 'Royal Enfield Himalayan',
  'Royal Enfield Hunter 350', 'Royal Enfield Thunderbird', 'Royal Enfield Bullet 350',
  'Royal Enfield Guerrilla 450', 'Royal Enfield Bear 650',
  'Honda Activa 6G', 'Honda SP 125', 'Honda Shine', 'Honda CB350', 'Honda CB350RS',
  'Honda Hornet 2.0', 'Honda CB500F', 'Honda Africa Twin', 'Honda CB300R',
  'TVS Apache RTR 160', 'TVS Apache RTR 200', 'TVS Apache RR 310', 'TVS Ntorq 125',
  'TVS Jupiter 125', 'TVS Raider 125', 'TVS Ronin', 'TVS iQube Electric',
  'Hero Splendor Plus', 'Hero HF Deluxe', 'Hero Glamour', 'Hero Xtreme 160R',
  'Hero Xpulse 200', 'Hero Destini 125', 'Hero Maestro Edge', 'Hero Vida V2',
  'Bajaj Pulsar NS200', 'Bajaj Pulsar 150', 'Bajaj Pulsar N160', 'Bajaj Dominar 400',
  'Bajaj Avenger 220', 'Bajaj CT110', 'Bajaj Chetak Electric', 'Bajaj Pulsar NS400Z',
  'Yamaha R15 V4', 'Yamaha MT-15', 'Yamaha FZ-S V3', 'Yamaha Fascino 125',
  'Yamaha RayZR 125', 'Yamaha R3', 'Yamaha MT-03', 'Yamaha FZ 25',
  'KTM Duke 390', 'KTM Duke 200', 'KTM Duke 125', 'KTM RC 390', 'KTM RC 200',
  'KTM 390 Adventure', 'KTM 250 Adventure',
  'Ola S1 Pro', 'Ola S1 Air', 'Ola S1 X',
  'Ather 450X', 'Ather 450S', 'Ather Rizta',
  'Simple One', 'Revolt RV400', 'Bajaj Chetak',
  'BMW G 310 R', 'BMW G 310 GS', 'Kawasaki Ninja 300', 'Kawasaki Z400',
  'Triumph Speed 400', 'Triumph Scrambler 400', 'Jawa 42', 'Jawa Perak',
  'Suzuki Gixxer SF', 'Suzuki Gixxer 250', 'Suzuki Access 125',
  'Harley-Davidson X440', 'Harley-Davidson Iron 883',
];

const BRAND_COLOR = {
  'Royal Enfield': '#6b6b6b', 'Honda': '#cc0000', 'TVS': '#f9a825',
  'Hero': '#1565c0', 'Bajaj': '#e65100', 'Yamaha': '#1565c0',
  'KTM': '#e65100', 'Ola': '#1b5e20', 'Ather': '#1b5e20',
  'Simple': '#1b5e20', 'Revolt': '#1b5e20', 'BMW': '#1565c0',
  'Kawasaki': '#1b5e20', 'Triumph': '#cc0000', 'Jawa': '#cc0000',
  'Suzuki': '#1a1a1a', 'Harley-Davidson': '#e65100',
};

function getBrandColor(name) {
  for (const [brand, color] of Object.entries(BRAND_COLOR)) {
    if (name.startsWith(brand)) return color;
  }
  return 'var(--text3)';
}

function getBrandInitial(name) { return name[0].toUpperCase(); }

function HighlightMatch({ text, query }) {
  if (!query) return <span>{text}</span>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <span>{text}</span>;
  return (
    <span>
      {text.slice(0, idx)}
      <strong style={{ color: 'var(--accent)' }}>{text.slice(idx, idx + query.length)}</strong>
      {text.slice(idx + query.length)}
    </span>
  );
}

const BRAND_BIKES = {
  'hero': ['Hero Splendor Plus', 'Hero HF Deluxe', 'Hero Glamour', 'Hero Xtreme 160R', 'Hero Xpulse 200'],
  'honda': ['Honda Activa 6G', 'Honda SP 125', 'Honda Shine', 'Honda CB350', 'Honda Hornet 2.0'],
  'tvs': ['TVS Apache RTR 160', 'TVS Apache RTR 200', 'TVS Ntorq 125', 'TVS Jupiter 125', 'TVS Raider 125'],
  'bajaj': ['Bajaj Pulsar NS200', 'Bajaj Pulsar 150', 'Bajaj Dominar 400', 'Bajaj Avenger 220', 'Bajaj Chetak Electric'],
  'royal enfield': ['Royal Enfield Classic 350', 'Royal Enfield Meteor 350', 'Royal Enfield Himalayan', 'Royal Enfield Hunter 350', 'Royal Enfield Bullet 350'],
  'yamaha': ['Yamaha R15 V4', 'Yamaha MT-15', 'Yamaha FZ-S V3', 'Yamaha Fascino 125', 'Yamaha RayZR 125'],
  'ktm': ['KTM Duke 390', 'KTM Duke 200', 'KTM Duke 125', 'KTM RC 390', 'KTM 390 Adventure'],
  'ola': ['Ola S1 Pro', 'Ola S1 Air', 'Ola S1 X'],
  'ather': ['Ather 450X', 'Ather 450S', 'Ather Rizta'],
  'suzuki': ['Suzuki Gixxer SF', 'Suzuki Gixxer 250', 'Suzuki Access 125'],
  'kawasaki': ['Kawasaki Ninja 300', 'Kawasaki Z400', 'Kawasaki Ninja 650'],
  'bmw': ['BMW G 310 R', 'BMW G 310 GS', 'BMW F 900 R'],
  'triumph': ['Triumph Speed 400', 'Triumph Scrambler 400', 'Triumph Tiger Sport 660'],
  'jawa': ['Jawa 42', 'Jawa Perak', 'Jawa 350'],
  'simple energy': ['Simple One'],
  'revolt': ['Revolt RV400', 'Revolt RV300'],
  'harley-davidson': ['Harley-Davidson X440', 'Harley-Davidson Iron 883'],
};

function getBrandBikes(query) {
  const q = query.toLowerCase().trim();
  for (const [brand, bikes] of Object.entries(BRAND_BIKES)) {
    if (q === brand || q === brand + ' bike' || q === brand + ' bikes') {
      return { isBrand: true, brand, bikes };
    }
  }
  return { isBrand: false };
}

const MAX_RECENT = 6;
function getRecent() {
  try { return JSON.parse(localStorage.getItem('bikeiq_recent') || '[]'); } catch { return []; }
}
function saveRecent(query) {
  const prev = getRecent().filter(q => q !== query);
  localStorage.setItem('bikeiq_recent', JSON.stringify([query, ...prev].slice(0, MAX_RECENT)));
}

// ── Voice Search states
const VOICE_IDLE      = 'idle';
const VOICE_LISTENING = 'listening';
const VOICE_DONE      = 'done';
const VOICE_ERROR     = 'error';
const VOICE_UNSUPPORTED = 'unsupported';

// ── Mic button component ───────────────────────────────────────────────────
function MicButton({ voiceState, onStart, onStop }) {
  const isListening = voiceState === VOICE_LISTENING;
  const isUnsupported = voiceState === VOICE_UNSUPPORTED;

  if (isUnsupported) return null; // hide entirely if browser doesn't support

  return (
    <button
      onClick={isListening ? onStop : onStart}
      title={isListening ? 'Stop listening' : 'Search by voice'}
      style={{
        flexShrink: 0,
        width: 34, height: 34,
        borderRadius: '50%',
        border: 'none',
        cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.2s',
        background: isListening
          ? 'rgba(255,82,82,0.15)'
          : 'var(--bg3)',
        color: isListening ? 'var(--red)' : 'var(--text3)',
        // Pulse ring while listening
        boxShadow: isListening
          ? '0 0 0 3px rgba(255,82,82,0.2), 0 0 0 6px rgba(255,82,82,0.08)'
          : 'none',
        animation: isListening ? 'pulse 1s ease infinite' : 'none',
      }}
    >
      {isListening ? <MicOff size={15} /> : <Mic size={15} />}
    </button>
  );
}

// ── Voice status pill shown below search bar ───────────────────────────────
function VoicePill({ voiceState, transcript }) {
  if (voiceState === VOICE_IDLE || voiceState === VOICE_UNSUPPORTED) return null;

  const config = {
    [VOICE_LISTENING]: { bg: 'rgba(255,82,82,0.1)',  border: 'rgba(255,82,82,0.3)',  color: 'var(--red)',    text: '🎤 Listening... speak now' },
    [VOICE_DONE]:      { bg: 'rgba(0,230,118,0.1)',  border: 'rgba(0,230,118,0.3)',  color: 'var(--green)',  text: `✓ Heard: "${transcript}"` },
    [VOICE_ERROR]:     { bg: 'rgba(255,82,82,0.1)',  border: 'rgba(255,82,82,0.3)',  color: 'var(--red)',    text: '⚠️ Could not hear. Try again.' },
  }[voiceState] || {};

  return (
    <div style={{
      marginTop: 8,
      padding: '8px 14px',
      background: config.bg,
      border: `1px solid ${config.border}`,
      borderRadius: 20,
      fontSize: 12,
      color: config.color,
      fontWeight: 600,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      animation: 'fadeIn 0.2s ease',
    }}>
      {config.text}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────
export default function SearchPage({ navigate, selectedBike, toggleWatchlist, isWatchlisted, addToCompare }) {
  const [query, setQuery]             = useState('');
  const [results, setResults]         = useState([]);
  const [loading, setLoading]         = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError]             = useState('');
  const [searched, setSearched]       = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [brandMode, setBrandMode]     = useState(null);
  const [activeIdx, setActiveIdx]     = useState(-1);
  const [recentSearches, setRecentSearches] = useState(getRecent());

  // ── Voice state ──────────────────────────────────────────────────────────
  const [voiceState, setVoiceState]   = useState(VOICE_IDLE);
  const [transcript, setTranscript]   = useState('');
  const recognitionRef                = useRef(null);

  const inputRef    = useRef(null);
  const dropdownRef = useRef(null);

  // ── Check browser support + initialise SpeechRecognition ────────────────
  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setVoiceState(VOICE_UNSUPPORTED);
      return;
    }

    const recognition = new SR();
    recognition.lang          = 'en-IN'; // Indian English accent
    recognition.interimResults = true;   // show partial results live
    recognition.maxAlternatives = 3;
    recognition.continuous    = false;

    recognition.onstart = () => setVoiceState(VOICE_LISTENING);

    recognition.onresult = (e) => {
      // Collect best transcript across all results
      let final = '';
      let interim = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) final += t;
        else interim += t;
      }
      const heard = (final || interim).trim();
      setTranscript(heard);
      setQuery(heard); // update search bar live as user speaks
    };

    recognition.onend = () => {
      // Only auto-search if we got something
      setVoiceState(prev => {
        if (prev === VOICE_LISTENING) return VOICE_DONE;
        return prev;
      });
    };

    recognition.onerror = (e) => {
      if (e.error === 'no-speech' || e.error === 'audio-capture') {
        setVoiceState(VOICE_ERROR);
      } else if (e.error !== 'aborted') {
        setVoiceState(VOICE_ERROR);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      try { recognition.abort(); } catch {}
    };
  }, []);

  // ── When voice finishes and we have a transcript → auto search ───────────
  useEffect(() => {
    if (voiceState === VOICE_DONE && transcript.trim()) {
      // Small delay so user sees what was heard before search fires
      const timer = setTimeout(() => {
        triggerSearch(transcript.trim());
        // Reset pill after 2s
        setTimeout(() => setVoiceState(VOICE_IDLE), 2000);
      }, 600);
      return () => clearTimeout(timer);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [voiceState, transcript]);

  const startVoice = useCallback(() => {
    if (!recognitionRef.current) return;
    setTranscript('');
    setQuery('');
    setResults([]);
    setSearched(false);
    setError('');
    try {
      recognitionRef.current.start();
    } catch {
      // Already started — stop and restart
      recognitionRef.current.stop();
      setTimeout(() => recognitionRef.current.start(), 200);
    }
  }, []);

  const stopVoice = useCallback(() => {
    if (!recognitionRef.current) return;
    try { recognitionRef.current.stop(); } catch {}
    setVoiceState(VOICE_IDLE);
  }, []);

  // ── Auto-search from navigation ──────────────────────────────────────────
  useEffect(() => {
    if (selectedBike?.autoSearch && selectedBike?.query) {
      const q = selectedBike.query;
      setQuery(q);
      setLoading(true);
      setSearched(true);
      triggerSearch(q);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Close suggestions on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target) &&
          inputRef.current && !inputRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const triggerSearch = async (q) => {
    setShowSuggestions(false);
    setActiveIdx(-1);
    setError('');
    setResults([]);
    setBrandMode(null);
    saveRecent(q);
    setRecentSearches(getRecent());

    const { isBrand, brand, bikes } = getBrandBikes(q);

    if (isBrand) {
      setBrandMode(brand);
      setLoading(true);
      setSearched(true);
      const topBikes = bikes.slice(0, 3);
      const firstBike = await searchBikeInfo(topBikes[0]);
      if (firstBike) setResults([firstBike]);
      setLoading(false);
      setLoadingMore(true);
      for (let i = 1; i < topBikes.length; i++) {
        await new Promise(r => setTimeout(r, 1200));
        const bike = await searchBikeInfo(topBikes[i]);
        if (bike) setResults(prev => [...prev, bike]);
      }
      setLoadingMore(false);
    } else {
      setLoading(true);
      setSearched(true);
      const bike = await searchBikeInfo(q);
      if (bike) {
        setResults([bike]);
      } else {
        setError('Could not find info on this bike. Try a specific name like "Honda Activa 6G".');
      }
      setLoading(false);
    }
  };

  const handleSearch = () => { if (query.trim()) triggerSearch(query); };

  const handleInputChange = (val) => {
    setQuery(val);
    setActiveIdx(-1);
    if (val.length >= 1) {
      const filtered = ALL_SUGGESTIONS.filter(s => s.toLowerCase().includes(val.toLowerCase())).slice(0, 8);
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(recentSearches.length > 0);
    }
  };

  const handleFocus = () => {
    if (query.length >= 1 && suggestions.length > 0) setShowSuggestions(true);
    else if (query.length === 0 && recentSearches.length > 0) setShowSuggestions(true);
  };

  const handleSuggestionClick = (s) => {
    setQuery(s);
    setShowSuggestions(false);
    triggerSearch(s);
  };

  const clearRecent = () => {
    localStorage.removeItem('bikeiq_recent');
    setRecentSearches([]);
    setShowSuggestions(false);
  };

  const handleKeyDown = (e) => {
    const items = query.length === 0 ? recentSearches : suggestions;
    if (e.key === 'ArrowDown')  { e.preventDefault(); setActiveIdx(i => Math.min(i + 1, items.length - 1)); setShowSuggestions(true); }
    else if (e.key === 'ArrowUp')   { e.preventDefault(); setActiveIdx(i => Math.max(i - 1, -1)); }
    else if (e.key === 'Enter') { activeIdx >= 0 && items[activeIdx] ? handleSuggestionClick(items[activeIdx]) : handleSearch(); }
    else if (e.key === 'Escape') { setShowSuggestions(false); setActiveIdx(-1); }
  };

  const displayItems = query.length === 0 ? recentSearches : suggestions;
  const isRecent = query.length === 0;

  return (
    <div className="page">

      {/* ── Search bar ── */}
      <div style={{ position: 'relative', marginBottom: 4 }}>
        <div className="search-bar" style={{ borderColor: voiceState === VOICE_LISTENING ? 'var(--red)' : showSuggestions ? 'var(--accent)' : undefined, gap: 8 }}>
          <Search size={18} color="var(--text3)" />
          <input
            ref={inputRef}
            placeholder={voiceState === VOICE_LISTENING ? 'Listening...' : 'Search bike, brand, or model...'}
            value={query}
            onChange={e => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            autoFocus
            style={{ fontStyle: voiceState === VOICE_LISTENING ? 'italic' : 'normal' }}
          />
          {query && (
            <button className="icon-btn" style={{ width: 28, height: 28 }}
              onClick={() => {
                setQuery(''); setResults([]); setSearched(false);
                setBrandMode(null); setSuggestions([]);
                setShowSuggestions(recentSearches.length > 0);
                inputRef.current?.focus();
              }}>
              <X size={14} />
            </button>
          )}

          {/* Mic button — sits between clear and Go */}
          <MicButton
            voiceState={voiceState}
            onStart={startVoice}
            onStop={stopVoice}
          />

          <button className="btn btn-primary btn-sm" onClick={handleSearch} style={{ flexShrink: 0 }}>Go</button>
        </div>

        {/* Voice status pill */}
        <VoicePill voiceState={voiceState} transcript={transcript} />

        {/* Suggestions dropdown */}
        {showSuggestions && displayItems.length > 0 && (
          <div ref={dropdownRef} style={{
            position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 200,
            background: 'var(--bg2)', border: '1px solid var(--border)',
            borderRadius: 14, marginTop: 6, overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          }}>
            {isRecent && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 14px 4px' }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Recent Searches</span>
                <span onClick={clearRecent} style={{ fontSize: 11, color: 'var(--accent)', cursor: 'pointer', fontWeight: 600 }}>Clear</span>
              </div>
            )}
            {displayItems.map((s, i) => (
              <div key={i} onClick={() => handleSuggestionClick(s)}
                style={{
                  padding: '10px 14px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 10,
                  borderBottom: i < displayItems.length - 1 ? '1px solid var(--border)' : 'none',
                  background: activeIdx === i ? 'var(--bg3)' : 'transparent',
                  transition: 'background 0.1s',
                }}
                onMouseEnter={() => setActiveIdx(i)}
                onMouseLeave={() => setActiveIdx(-1)}
              >
                {isRecent ? (
                  <Clock size={13} color="var(--text3)" style={{ flexShrink: 0 }} />
                ) : (
                  <div style={{ width: 24, height: 24, borderRadius: 6, flexShrink: 0, background: getBrandColor(s), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: '#fff' }}>
                    {getBrandInitial(s)}
                  </div>
                )}
                <span style={{ flex: 1, fontSize: '0.88rem', color: 'var(--text)' }}>
                  {isRecent ? s : <HighlightMatch text={s} query={query} />}
                </span>
                <ChevronRight size={13} color="var(--text3)" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Brand mode header ── */}
      {brandMode && (
        <div style={{ marginBottom: 16, padding: '10px 14px', background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.15)', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--accent)', fontWeight: 600, textTransform: 'capitalize' }}>
            🏍️ Showing all {brandMode.charAt(0).toUpperCase() + brandMode.slice(1)} bikes
          </span>
          {loadingMore && <span style={{ fontSize: '0.72rem', color: 'var(--text3)' }}>Loading more...</span>}
        </div>
      )}

      {/* ── Loading ── */}
      {loading && (
        <div className="loading">
          <div className="spinner" />
          <div style={{ fontSize: '0.85rem' }}>
            {brandMode ? `Loading ${brandMode} bikes...` : 'Fetching bike data with AI...'}
          </div>
        </div>
      )}

      {/* ── Error ── */}
      {error && !loading && (
        <div className="empty">
          <div className="empty-icon">😕</div>
          <h3>Not Found</h3>
          <p>{error}</p>
        </div>
      )}

      {/* ── Results ── */}
      {results.length > 0 && !loading && (
        <div className="fade-in">
          <div className="section-title" style={{ fontSize: '1rem', marginBottom: 12 }}>
            {brandMode ? `${results.length} bikes found` : 'Search Result'}
            {loadingMore && <span style={{ fontSize: '0.72rem', color: 'var(--text3)', fontFamily: 'DM Sans', fontWeight: 400, marginLeft: 8 }}>loading more...</span>}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {results.map((bike, i) => (
              <BikeCard key={i} bike={bike} navigate={navigate}
                toggleWatchlist={toggleWatchlist} isWatchlisted={isWatchlisted} addToCompare={addToCompare} />
            ))}
          </div>
          {loadingMore && (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '20px 0', gap: 8, alignItems: 'center', color: 'var(--text3)', fontSize: '0.82rem' }}>
              <div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} />
              Loading more bikes...
            </div>
          )}
        </div>
      )}

      {/* ── Empty state ── */}
      {!searched && !loading && (
        <div>
          <div className="section-title" style={{ fontSize: '1rem', marginBottom: 10 }}>Popular Bikes</div>
          <div className="chip-row" style={{ flexWrap: 'wrap', gap: 8 }}>
            {ALL_SUGGESTIONS.slice(0, 20).map(s => (
              <span key={s} className="chip" onClick={() => { setQuery(s); triggerSearch(s); }}>{s}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
