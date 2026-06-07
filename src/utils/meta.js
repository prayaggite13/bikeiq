// src/utils/meta.js
// Call setMeta() on any page to update browser title + description

export function setMeta(title, description) {
  // Title
  document.title = title + ' — BikeIQ';

  // Description
  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
    metaDesc = document.createElement('meta');
    metaDesc.name = 'description';
    document.head.appendChild(metaDesc);
  }
  metaDesc.content = description;

  // OG tags
  const setOG = (prop, val) => {
    let el = document.querySelector(`meta[property="${prop}"]`);
    if (!el) { el = document.createElement('meta'); el.setAttribute('property', prop); document.head.appendChild(el); }
    el.content = val;
  };
  setOG('og:title', title);
  setOG('og:description', description);
  setOG('og:url', window.location.href);
}

export function resetMeta() {
  document.title = "BikeIQ — India's Smartest Bike Platform";
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.content = "Search, compare and get AI insights on every bike and scooter in India. Real specs, city-wise prices, EV analysis.";
}
