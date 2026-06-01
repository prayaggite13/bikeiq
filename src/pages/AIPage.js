import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Zap, RotateCcw } from 'lucide-react';
import { askGemini } from '../utils/gemini';

const SYSTEM_CONTEXT = `You are BikeIQ AI, India's most knowledgeable and friendly 2-wheeler expert. You have deep knowledge of every bike, scooter, EV, moped available in India — from budget commuters to premium superbikes.

You help users with:
- Bike recommendations based on budget, usage, preferences
- Spec comparisons and honest opinions
- Buying advice, negotiation tips, when to buy
- Maintenance tips, service intervals, common issues
- EV vs petrol trade-offs for Indian conditions
- Insurance, finance, EMI guidance
- Real-world ownership experiences

Rules:
- Always give specific, actionable advice for India
- Mention real prices in INR
- Be honest — if a bike has known issues, say so
- Use simple language, not overly technical
- Keep responses concise but complete`;

const QUICK_QUESTIONS = [
  'Best bike under ₹1.5 lakh for city commute?',
  'Ola S1 Pro vs Ather 450X — which is better?',
  'Royal Enfield for Ladakh trip — which model?',
  'Best mileage scooter in India 2025?',
  'Should I buy EV or petrol scooter in Mumbai?',
  'KTM Duke 390 pros and cons?',
];

export default function AIPage() {
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      text: "Hey! I'm BikeIQ AI 🏍️\n\nAsk me anything about bikes in India — recommendations, comparisons, buying tips, EV vs petrol, maintenance, or anything else. I've got you covered!"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async (text) => {
    const q = text || input.trim();
    if (!q || loading) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: q }]);
    setLoading(true);

    // Build conversation context
    const history = messages.slice(-6).map(m => `${m.role === 'user' ? 'User' : 'BikeIQ AI'}: ${m.text}`).join('\n');
    const fullPrompt = `${history}\nUser: ${q}\nBikeIQ AI:`;

    const reply = await askGemini(fullPrompt, SYSTEM_CONTEXT);
    setMessages(prev => [...prev, { role: 'ai', text: reply }]);
    setLoading(false);
  };

  const reset = () => {
    setMessages([{
      role: 'ai',
      text: "Chat cleared! Ask me anything about bikes in India 🏍️"
    }]);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 132px)' }}>
      {/* Header */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, background: 'rgba(0,212,255,0.1)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bot size={18} color="var(--accent)" />
          </div>
          <div>
            <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '1rem' }}>BikeIQ AI</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--green)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', display: 'inline-block' }} />
              Online · Powered by Gemini
            </div>
          </div>
        </div>
        <button className="icon-btn" onClick={reset} title="Clear chat">
          <RotateCcw size={15} />
        </button>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }} className="fade-in">
            {msg.role === 'ai' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <Zap size={12} color="var(--accent)" />
                <span style={{ fontSize: '0.68rem', color: 'var(--accent)', fontWeight: 600 }}>BikeIQ AI</span>
              </div>
            )}
            <div className={`chat-bubble ${msg.role}`} style={{ whiteSpace: 'pre-wrap' }}>
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ display: 'flex', gap: 4 }}>
              {[0, 1, 2].map(i => (
                <span key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)', animation: 'pulse 1.2s ease infinite', animationDelay: `${i * 0.2}s`, display: 'inline-block' }} />
              ))}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>BikeIQ AI is thinking...</span>
          </div>
        )}

        {/* Quick suggestions - show only at start */}
        {messages.length === 1 && (
          <div style={{ marginTop: 8 }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text3)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Quick questions</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {QUICK_QUESTIONS.map((q, i) => (
                <button
                  key={i}
                  className="btn btn-outline btn-sm"
                  style={{ justifyContent: 'flex-start', textAlign: 'left', fontSize: '0.78rem' }}
                  onClick={() => send(q)}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)', background: 'var(--bg)' }}>
        <div className="search-bar">
          <input
            placeholder="Ask anything about bikes..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
            disabled={loading}
          />
          <button
            className="btn btn-primary btn-sm"
            onClick={() => send()}
            disabled={loading || !input.trim()}
            style={{ padding: '8px 14px', opacity: loading || !input.trim() ? 0.5 : 1 }}
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
