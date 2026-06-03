import React, { useState } from 'react';
import { formatINR } from '../utils/calculator';
import { Zap, Fuel } from 'lucide-react';

const TABS = ['Trending', 'Popular', 'Electric', 'Upcoming'];

const BIKES_DATA = {
  Trending: [
    { name: 'Royal Enfield Classic 350', brand: 'Royal Enfield', price: 193000, type: 'Cruiser', fuelType: 'Petrol', mileage: '35-40 kmpl', img: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/44686/classic-350-right-side-view.jpeg' },
    { name: 'Bajaj Pulsar N160', brand: 'Bajaj', price: 132000, type: 'Sport', fuelType: 'Petrol', mileage: '45 kmpl', img: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/130593/pulsar-n160-right-side-view.jpeg' },
    { name: 'TVS Apache RTR 160 4V', brand: 'TVS', price: 122000, type: 'Sport', fuelType: 'Petrol', mileage: '45 kmpl', img: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/54351/apache-rtr-160-4v-right-side-view.jpeg' },
    { name: 'Honda Activa 6G', brand: 'Honda', price: 75000, type: 'Scooter', fuelType: 'Petrol', mileage: '50 kmpl', img: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/106753/activa-6g-right-side-view.jpeg' },
    { name: 'Hero Splendor Plus', brand: 'Hero', price: 76000, type: 'Commuter', fuelType: 'Petrol', mileage: '60 kmpl', img: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/41197/splendor-plus-right-side-view.jpeg' },
    { name: 'Yamaha R15 V4', brand: 'Yamaha', price: 181000, type: 'Sport', fuelType: 'Petrol', mileage: '40 kmpl', img: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/152463/r15-v4-right-side-view.jpeg' },
  ],
  Popular: [
    { name: 'Honda SP 125', brand: 'Honda', price: 89000, type: 'Commuter', fuelType: 'Petrol', mileage: '65 kmpl', img: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/34877/sp-125-right-side-view.jpeg' },
    { name: 'Hero HF Deluxe', brand: 'Hero', price: 65000, type: 'Commuter', fuelType: 'Petrol', mileage: '65 kmpl', img: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/41228/hf-deluxe-right-side-view.jpeg' },
    { name: 'TVS Jupiter 125', brand: 'TVS', price: 82000, type: 'Scooter', fuelType: 'Petrol', mileage: '52 kmpl', img: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/130804/jupiter-125-right-side-view.jpeg' },
    { name: 'Bajaj Pulsar 150', brand: 'Bajaj', price: 110000, type: 'Sport', fuelType: 'Petrol', mileage: '50 kmpl', img: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/43482/pulsar-150-right-side-view.jpeg' },
    { name: 'Royal Enfield Hunter 350', brand: 'Royal Enfield', price: 149000, type: 'Roadster', fuelType: 'Petrol', mileage: '36 kmpl', img: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/159751/hunter-350-right-side-view.jpeg' },
    { name: 'KTM Duke 390', brand: 'KTM', price: 311000, type: 'Naked', fuelType: 'Petrol', mileage: '30 kmpl', img: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/58249/duke-390-right-side-view.jpeg' },
  ],
  Electric: [
    { name: 'Ola S1 Pro', brand: 'Ola Electric', price: 129000, type: 'Electric Scooter', fuelType: 'Electric', range: '195 km', img: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/130713/s1-pro-right-side-view.jpeg' },
    { name: 'Ather 450X', brand: 'Ather', price: 138000, type: 'Electric Scooter', fuelType: 'Electric', range: '146 km', img: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/100721/450x-right-side-view.jpeg' },
    { name: 'TVS iQube Electric', brand: 'TVS', price: 94000, type: 'Electric Scooter', fuelType: 'Electric', range: '100 km', img: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/100771/iqube-electric-right-side-view.jpeg' },
    { name: 'Bajaj Chetak Electric', brand: 'Bajaj', price: 115000, type: 'Electric Scooter', fuelType: 'Electric', range: '113 km', img: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/86501/chetak-right-side-view.jpeg' },
    { name: 'Ather Rizta', brand: 'Ather', price: 110000, type: 'Electric Scooter', fuelType: 'Electric', range: '123 km', img: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/175729/rizta-right-side-view.jpeg' },
    { name: 'Simple One', brand: 'Simple Energy', price: 149000, type: 'Electric Scooter', fuelType: 'Electric', range: '212 km', img: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/130897/one-right-side-view.jpeg' },
  ],
  Upcoming: [
    { name: 'Honda Activa EV', brand: 'Honda', price: 120000, type: 'Electric Scooter', fuelType: 'Electric', range: '102 km', img: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/175539/activa-e-right-side-view.jpeg', status: 'Launching Soon' },
    { name: 'Royal Enfield Classic 650', brand: 'Royal Enfield', price: 350000, type: 'Cruiser', fuelType: 'Petrol', mileage: '30 kmpl', img: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/44686/classic-350-right-side-view.jpeg', status: 'Expected 2025' },
    { name: 'KTM Duke 250 2025', brand: 'KTM', price: 235000, type: 'Naked', fuelType: 'Petrol', mileage: '35 kmpl', img: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/58249/duke-390-right-side-view.jpeg', status: 'Coming Soon' },
    { name: 'Bajaj Pulsar NS400Z', brand: 'Bajaj', price: 197000, type: 'Sport', fuelType: 'Petrol', mileage: '30 kmpl', img: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/43482/pulsar-150-right-side-view.jpeg', status: 'Launched' },
    { name: 'Triumph Speed T4', brand: 'Triumph', price: 220000, type: 'Roadster', fuelType: 'Petrol', mileage: '35 kmpl', img: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/159751/hunter-350-right-side-view.jpeg', status: 'Launched' },
    { name: 'Hero Mavrick 440', brand: 'Hero', price: 210000, type: 'Roadster', fuelType: 'Petrol', mileage: '32 kmpl', img: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/41197/splendor-plus-right-side-view.jpeg', status: 'Launched' },
  ],
};

export default function FeaturedSection({ navigate }) {
  const [activeTab, setActiveTab] = useState('Trending');

  const bikes = BIKES_DATA[activeTab] || [];

  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '1.1rem', marginBottom: 12 }}>
        🏍️ Browse Bikes
      </div>

      {/* Tabs */}
      <div className="tabs" style={{ marginBottom: 14 }}>
        {TABS.map(tab => (
          <button
            key={tab}
            className={`tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'Electric' ? '⚡ ' : ''}{tab}
          </button>
        ))}
      </div>

      {/* Bike cards */}
      <div className="scroll-row">
        {bikes.map((bike, i) => (
          <div
            key={i}
            className="card"
            style={{ flexShrink: 0, width: 200, cursor: 'pointer', padding: 0, overflow: 'hidden' }}
            onClick={() => navigate('search', { autoSearch: true, query: bike.name })}
          >
            {/* Bike image */}
            <div style={{ position: 'relative', background: 'var(--bg3)', height: 120, overflow: 'hidden' }}>
              <img
                src={bike.img}
                alt={bike.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={e => {
                  e.target.style.display = 'none';
                  e.target.parentElement.style.display = 'flex';
                  e.target.parentElement.style.alignItems = 'center';
                  e.target.parentElement.style.justifyContent = 'center';
                  e.target.parentElement.innerHTML = '<span style="font-size:2.5rem">🏍️</span>';
                }}
              />
              {/* Status badge for upcoming */}
              {bike.status && (
                <div style={{
                  position: 'absolute', top: 8, left: 8,
                  background: bike.status === 'Launched' ? 'rgba(0,212,255,0.9)' : 'rgba(255,215,64,0.9)',
                  color: bike.status === 'Launched' ? '#000' : '#000',
                  fontSize: '0.6rem', fontWeight: 700, padding: '2px 7px',
                  borderRadius: 4, letterSpacing: '0.04em', textTransform: 'uppercase'
                }}>
                  {bike.status}
                </div>
              )}
              {/* Fuel type badge */}
              <div style={{
                position: 'absolute', top: 8, right: 8,
                background: bike.fuelType === 'Electric' ? 'rgba(0,230,118,0.9)' : 'rgba(0,0,0,0.6)',
                color: bike.fuelType === 'Electric' ? '#000' : '#fff',
                fontSize: '0.6rem', fontWeight: 700, padding: '2px 7px',
                borderRadius: 4, display: 'flex', alignItems: 'center', gap: 3
              }}>
                {bike.fuelType === 'Electric' ? <><Zap size={9} />EV</> : <><Fuel size={9} />Petrol</>}
              </div>
            </div>

            {/* Bike info */}
            <div style={{ padding: '10px 12px' }}>
              <div style={{ fontSize: '0.65rem', color: 'var(--text3)', marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{bike.brand}</div>
              <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '0.95rem', lineHeight: 1.2, marginBottom: 6 }}>{bike.name}</div>
              <div style={{ fontFamily: 'Rajdhani', fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent)', marginBottom: 4 }}>
                {formatINR(bike.price)}
                <span style={{ fontSize: '0.65rem', color: 'var(--text3)', fontFamily: 'DM Sans', fontWeight: 400, marginLeft: 3 }}>onwards</span>
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text3)' }}>
                {bike.fuelType === 'Electric' ? `⚡ ${bike.range} range` : `⛽ ${bike.mileage}`}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
