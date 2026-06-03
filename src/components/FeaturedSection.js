import React, { useState } from 'react';
import { formatINR } from '../utils/calculator';
import { Zap, Fuel } from 'lucide-react';

const TABS = ['Trending', 'Popular', 'Electric', 'Upcoming'];

const BIKE_EMOJIS = {
  'Cruiser': '🏍️', 'Sport': '🏎️', 'Scooter': '🛵', 'Commuter': '🏍️',
  'Naked': '🏍️', 'Roadster': '🏍️', 'Adventure': '🏔️',
  'Electric Scooter': '⚡', 'Electric Bike': '⚡'
};

const BIKES_DATA = {
  Trending: [
    { name: 'Royal Enfield Classic 350', brand: 'Royal Enfield', price: 193000, type: 'Cruiser', fuelType: 'Petrol', mileage: '35-40 kmpl', rating: 4.5 },
    { name: 'Bajaj Pulsar N160', brand: 'Bajaj', price: 132000, type: 'Sport', fuelType: 'Petrol', mileage: '45 kmpl', rating: 4.3 },
    { name: 'TVS Apache RTR 160 4V', brand: 'TVS', price: 122000, type: 'Sport', fuelType: 'Petrol', mileage: '45 kmpl', rating: 4.4 },
    { name: 'Honda Activa 6G', brand: 'Honda', price: 75000, type: 'Scooter', fuelType: 'Petrol', mileage: '50 kmpl', rating: 4.3 },
    { name: 'Hero Splendor Plus', brand: 'Hero', price: 76000, type: 'Commuter', fuelType: 'Petrol', mileage: '60 kmpl', rating: 4.2 },
    { name: 'Yamaha R15 V4', brand: 'Yamaha', price: 181000, type: 'Sport', fuelType: 'Petrol', mileage: '40 kmpl', rating: 4.6 },
  ],
  Popular: [
    { name: 'Honda SP 125', brand: 'Honda', price: 89000, type: 'Commuter', fuelType: 'Petrol', mileage: '65 kmpl', rating: 4.3 },
    { name: 'Hero HF Deluxe', brand: 'Hero', price: 65000, type: 'Commuter', fuelType: 'Petrol', mileage: '65 kmpl', rating: 4.1 },
    { name: 'TVS Jupiter 125', brand: 'TVS', price: 82000, type: 'Scooter', fuelType: 'Petrol', mileage: '52 kmpl', rating: 4.2 },
    { name: 'Bajaj Pulsar 150', brand: 'Bajaj', price: 110000, type: 'Sport', fuelType: 'Petrol', mileage: '50 kmpl', rating: 4.2 },
    { name: 'Royal Enfield Hunter 350', brand: 'Royal Enfield', price: 149000, type: 'Roadster', fuelType: 'Petrol', mileage: '36 kmpl', rating: 4.4 },
    { name: 'KTM Duke 390', brand: 'KTM', price: 311000, type: 'Naked', fuelType: 'Petrol', mileage: '30 kmpl', rating: 4.5 },
  ],
  Electric: [
    { name: 'Ola S1 Pro', brand: 'Ola Electric', price: 129000, type: 'Electric Scooter', fuelType: 'Electric', range: '195 km', rating: 3.9 },
    { name: 'Ather 450X', brand: 'Ather', price: 138000, type: 'Electric Scooter', fuelType: 'Electric', range: '146 km', rating: 4.3 },
    { name: 'TVS iQube Electric', brand: 'TVS', price: 94000, type: 'Electric Scooter', fuelType: 'Electric', range: '100 km', rating: 4.1 },
    { name: 'Bajaj Chetak Electric', brand: 'Bajaj', price: 115000, type: 'Electric Scooter', fuelType: 'Electric', range: '113 km', rating: 4.0 },
    { name: 'Ather Rizta', brand: 'Ather', price: 110000, type: 'Electric Scooter', fuelType: 'Electric', range: '123 km', rating: 4.2 },
    { name: 'Simple One', brand: 'Simple Energy', price: 149000, type: 'Electric Scooter', fuelType: 'Electric', range: '212 km', rating: 4.0 },
  ],
  Upcoming: [
    { name: 'Honda Activa EV', brand: 'Honda', price: 120000, type: 'Electric Scooter', fuelType: 'Electric', range: '102 km', status: 'Launching Soon', rating: null },
    { name: 'Royal Enfield Classic 650', brand: 'Royal Enfield', price: 350000, type: 'Cruiser', fuelType: 'Petrol', mileage: '30 kmpl', status: 'Expected 2025', rating: null },
    { name: 'KTM Duke 250 2025', brand: 'KTM', price: 235000, type: 'Naked', fuelType: 'Petrol', mileage: '35 kmpl', status: 'Coming Soon', rating: null },
    { name: 'Bajaj Pulsar NS400Z', brand: 'Bajaj', price: 197000, type: 'Sport', fuelType: 'Petrol', mileage: '30 kmpl', status: 'Just Launched', rating: 4.3 },
    { name: 'Triumph Speed T4', brand: 'Triumph', price: 220000, type: 'Roadster', fuelType: 'Petrol', mileage: '35 kmpl', status: 'Just Launched', rating: 4.4 },
    { name: 'Hero Mavrick 440', brand: 'Hero', price: 210000, type: 'Roadster', fuelType: 'Petrol', mileage: '32 kmpl', status: 'Just Launched', rating: 4.2 },
  ],
};

const STATUS_COLORS = {
  'Launching Soon': { bg: 'rgba(255,215,64,0.9)', color: '#000' },
  'Expected 2025': { bg: 'rgba(179,136,255,0.9)', color: '#000' },
  'Coming Soon': { bg: 'rgba(255,107,53,0.9)', color: '#fff' },
  'Just Launched': { bg: 'rgba(0,212,255,0.9)', color: '#000' },
};

function BikeCard({ bike, navigate }) {
  const emoji = BIKE_EMOJIS[bike.type] || '🏍️';
  const statusStyle = bike.status ? STATUS_COLORS[bike.status] || { bg: 'rgba(0,212,255,0.9)', color: '#000' } : null;

  return (
    <div
      className="card"
      style={{ flexShrink: 0, width: 190, cursor: 'pointer', padding: 0, overflow: 'hidden', border: '1px solid var(--border)' }}
      onClick={() => navigate('search', { autoSearch: true, query: bike.name })}
    >
      {/* Visual top section */}
      <div style={{
        height: 110, background: 'linear-gradient(135deg, var(--bg3), var(--bg4))',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', fontSize: '3rem'
      }}>
        {emoji}

        {/* Status badge */}
        {bike.status && statusStyle && (
          <div style={{
            position: 'absolute', top: 8, left: 8,
            background: statusStyle.bg, color: statusStyle.color,
            fontSize: '0.58rem', fontWeight: 700, padding: '2px 7px',
            borderRadius: 4, letterSpacing: '0.04em', textTransform: 'uppercase'
          }}>
            {bike.status}
          </div>
        )}

        {/* Fuel badge */}
        <div style={{
          position: 'absolute', top: 8, right: 8,
          background: bike.fuelType === 'Electric' ? 'rgba(0,230,118,0.9)' : 'rgba(0,0,0,0.55)',
          color: bike.fuelType === 'Electric' ? '#000' : '#fff',
          fontSize: '0.58rem', fontWeight: 700, padding: '2px 7px',
          borderRadius: 4, display: 'flex', alignItems: 'center', gap: 3
        }}>
          {bike.fuelType === 'Electric' ? <><Zap size={9} />EV</> : <><Fuel size={9} />Petrol</>}
        </div>

        {/* Type tag bottom */}
        <div style={{
          position: 'absolute', bottom: 8, left: 8,
          background: 'rgba(0,0,0,0.5)', color: '#ccc',
          fontSize: '0.58rem', padding: '2px 7px', borderRadius: 4,
          textTransform: 'uppercase', letterSpacing: '0.04em'
        }}>
          {bike.type}
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: '10px 12px' }}>
        <div style={{ fontSize: '0.62rem', color: 'var(--text3)', marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {bike.brand}
        </div>
        <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '0.92rem', lineHeight: 1.2, marginBottom: 6, color: 'var(--text)' }}>
          {bike.name}
        </div>
        <div style={{ fontFamily: 'Rajdhani', fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent)', marginBottom: 4 }}>
          {formatINR(bike.price)}
          <span style={{ fontSize: '0.62rem', color: 'var(--text3)', fontFamily: 'DM Sans', fontWeight: 400, marginLeft: 3 }}>onwards</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '0.68rem', color: 'var(--text3)' }}>
            {bike.fuelType === 'Electric' ? `⚡ ${bike.range}` : `⛽ ${bike.mileage}`}
          </div>
          {bike.rating && (
            <div style={{ fontSize: '0.68rem', color: 'var(--yellow)' }}>★ {bike.rating}</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function FeaturedSection({ navigate }) {
  const [activeTab, setActiveTab] = useState('Trending');
  const bikes = BIKES_DATA[activeTab] || [];

  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '1.1rem', marginBottom: 12 }}>
        🏍️ Browse Bikes
      </div>
      <div className="tabs" style={{ marginBottom: 14 }}>
        {TABS.map(tab => (
          <button key={tab} className={`tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
            {tab === 'Electric' ? '⚡ ' : tab === 'Upcoming' ? '🚀 ' : ''}{tab}
          </button>
        ))}
      </div>
      <div className="scroll-row">
        {bikes.map((bike, i) => (
          <BikeCard key={i} bike={bike} navigate={navigate} />
        ))}
      </div>
    </div>
  );
}
