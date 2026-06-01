const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

export async function askGemini(prompt, systemContext = '') {
  const fullPrompt = systemContext ? `${systemContext}\n\n${prompt}` : prompt;
  try {
    const res = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: fullPrompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 1024 }
      })
    });
    const data = await res.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not get a response.';
  } catch (err) {
    return 'Error connecting to AI. Please try again.';
  }
}

export async function searchBikeInfo(bikeName) {
  const prompt = `You are BikeIQ, India's smartest 2-wheeler expert. Provide detailed information about the "${bikeName}" available in India.

Return ONLY a valid JSON object with this exact structure:
{
  "name": "Full bike name",
  "brand": "Brand name",
  "type": "Scooter/Commuter/Sport/Cruiser/Adventure/Electric",
  "fuelType": "Petrol/Electric/Hybrid",
  "launchYear": 2023,
  "status": "Available/Upcoming/Discontinued",
  "tagline": "Short catchy description",
  "basePrice": 150000,
  "topPrice": 180000,
  "cityPrices": {
    "Mumbai": 165000,
    "Delhi": 162000,
    "Bangalore": 164000,
    "Chennai": 163000,
    "Pune": 161000,
    "Hyderabad": 163000,
    "Kolkata": 160000,
    "Ahmedabad": 158000
  },
  "specs": {
    "engine": "149cc Single Cylinder",
    "power": "12.5 bhp",
    "torque": "11 Nm",
    "transmission": "5-speed Manual",
    "fuelCapacity": "12L",
    "weight": "142 kg",
    "seatHeight": "795mm",
    "groundClearance": "165mm",
    "wheelbase": "1345mm",
    "brakes": "Disc/Drum",
    "abs": true,
    "suspension": "Telescopic / Mono-shock"
  },
  "evSpecs": null,
  "mileage": {
    "claimed": "50 kmpl",
    "realWorld": "42-46 kmpl"
  },
  "colors": ["Red", "Blue", "Black", "White"],
  "variants": [
    {"name": "STD", "price": 150000, "features": ["Basic instrument cluster"]},
    {"name": "Deluxe", "price": 165000, "features": ["Digital console", "LED lights"]},
    {"name": "ABS", "price": 180000, "features": ["ABS", "All Deluxe features"]}
  ],
  "features": ["LED Headlight", "Digital Console", "USB Charging", "Side Stand Indicator"],
  "safetyFeatures": ["ABS", "Engine Kill Switch", "Hazard Lights"],
  "pros": ["Fuel efficient", "Comfortable for city", "Low maintenance"],
  "cons": ["Average build quality", "Basic suspension"],
  "rivals": ["Honda Shine", "TVS Raider", "Bajaj Pulsar N150"],
  "serviceInterval": "3000 km or 3 months",
  "avgServiceCost": 1500,
  "insuranceEstimate": 8000,
  "commonIssues": ["Vibrations at high RPM", "Occasional starting issues in cold weather"],
  "ownerRating": 4.1,
  "expertRating": 3.9,
  "totalReviews": 1240
}

If this is an Electric vehicle, fill evSpecs like:
"evSpecs": {
  "batteryCapacity": "3.04 kWh",
  "range": {"claimed": "146 km", "realWorld": "110-120 km"},
  "chargingTime": {"slow": "4.5 hours", "fast": "1.5 hours"},
  "topSpeed": "90 kmph",
  "chargingCost": 25
}
and set fuelCapacity to null and mileage to null.

Return ONLY the JSON. No markdown, no explanation.`;

  try {
    const res = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 2048 }
      })
    });
    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const clean = text.replace(/```json|```/g, '').trim();
    return JSON.parse(clean);
  } catch (err) {
    return null;
  }
}

export async function getCommuteRecommendations(dailyKm, roadType, budget, preference) {
  const prompt = `You are BikeIQ, India's smartest 2-wheeler advisor. A user is looking for the best bike for their needs.

User Profile:
- Daily commute: ${dailyKm} km
- Road type: ${roadType}
- Budget: ₹${budget.toLocaleString('en-IN')}
- Preference: ${preference}

Recommend exactly 5 bikes available in India that best fit this profile. Return ONLY a valid JSON array:
[
  {
    "rank": 1,
    "name": "Honda Activa 6G",
    "brand": "Honda",
    "type": "Scooter",
    "price": 75000,
    "fitScore": 94,
    "mileage": "50 kmpl",
    "whyFit": "Perfect city scooter, easy to ride, great resale value",
    "pros": ["Smooth ride", "Low maintenance", "Wide service network"],
    "cons": ["Not great on highways"]
  }
]
Return ONLY the JSON array. No markdown.`;

  try {
    const res = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.4, maxOutputTokens: 1500 }
      })
    });
    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '[]';
    const clean = text.replace(/```json|```/g, '').trim();
    return JSON.parse(clean);
  } catch {
    return [];
  }
}

export async function comparebikes(bike1, bike2) {
  const prompt = `You are BikeIQ. Compare these two bikes for an Indian buyer and give a detailed verdict.

Bike 1: ${JSON.stringify(bike1)}
Bike 2: ${JSON.stringify(bike2)}

Return ONLY a valid JSON object:
{
  "winner": "Bike name",
  "summary": "2-3 sentence overall verdict",
  "categories": {
    "value": {"winner": "bike name", "reason": "short reason"},
    "performance": {"winner": "bike name", "reason": "short reason"},
    "comfort": {"winner": "bike name", "reason": "short reason"},
    "mileage": {"winner": "bike name", "reason": "short reason"},
    "features": {"winner": "bike name", "reason": "short reason"},
    "maintenance": {"winner": "bike name", "reason": "short reason"}
  },
  "buyBike1If": "scenario where bike 1 is better choice",
  "buyBike2If": "scenario where bike 2 is better choice"
}
Return ONLY the JSON.`;

  try {
    const res = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 1000 }
      })
    });
    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    const clean = text.replace(/```json|```/g, '').trim();
    return JSON.parse(clean);
  } catch {
    return null;
  }
}
