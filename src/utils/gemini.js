const GROQ_API_KEY = process.env.REACT_APP_GROQ_API_KEY;
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

async function callGroq(prompt, systemPrompt = '', temperature = 0.7, maxTokens = 1024, retries = 2) {
  try {
    const messages = [];
    if (systemPrompt) messages.push({ role: 'system', content: systemPrompt });
    messages.push({ role: 'user', content: prompt });

    const res = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages,
        temperature,
        max_tokens: maxTokens
      })
    });

    if (res.status === 429 && retries > 0) {
      // Rate limited — wait and retry
      await new Promise(r => setTimeout(r, 3000));
      return callGroq(prompt, systemPrompt, temperature, maxTokens, retries - 1);
    }

    const data = await res.json();
    return data?.choices?.[0]?.message?.content || '';
  } catch (err) {
    console.error('Groq error:', err);
    return '';
  }
}

export async function askGemini(prompt, systemContext = '') {
  const reply = await callGroq(prompt, systemContext);
  return reply || 'Sorry, I could not get a response. Please try again.';
}

export async function searchBikeInfo(bikeName) {
  const systemPrompt = `You are a bike data API. Always respond with valid JSON only. No markdown, no explanation, no extra text.`;
  
  const prompt = `Return detailed information about the "${bikeName}" available in India as a JSON object with this exact structure:
{
  "name": "Full bike name",
  "brand": "Brand name",
  "type": "Scooter/Commuter/Sport/Cruiser/Adventure/Electric",
  "fuelType": "Petrol/Electric",
  "launchYear": 2023,
  "status": "Available",
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
    {"name": "Deluxe", "price": 165000, "features": ["Digital console", "LED lights"]}
  ],
  "features": ["LED Headlight", "Digital Console", "USB Charging"],
  "safetyFeatures": ["ABS", "Engine Kill Switch", "Hazard Lights"],
  "pros": ["Fuel efficient", "Comfortable for city", "Low maintenance"],
  "cons": ["Average build quality", "Basic suspension"],
  "rivals": ["Honda Shine", "TVS Raider", "Bajaj Pulsar N150"],
  "serviceInterval": "3000 km or 3 months",
  "avgServiceCost": 1500,
  "insuranceEstimate": 8000,
  "commonIssues": ["Vibrations at high RPM"],
  "ownerRating": 4.1,
  "expertRating": 3.9,
  "totalReviews": 1240
}

If Electric vehicle, set evSpecs like:
"evSpecs": {
  "batteryCapacity": "3.04 kWh",
  "range": {"claimed": "146 km", "realWorld": "110-120 km"},
  "chargingTime": {"slow": "4.5 hours", "fast": "1.5 hours"},
  "topSpeed": "90 kmph",
  "chargingCost": 25
}
and set mileage to null.

Respond with ONLY the JSON object. No markdown. No explanation.`;

  try {
    const text = await callGroq(prompt, systemPrompt, 0.3, 2048);
    const clean = text.replace(/```json|```/g, '').trim();
    return JSON.parse(clean);
  } catch (err) {
    console.error('Parse error:', err);
    return null;
  }
}

export async function getCommuteRecommendations(dailyKm, roadType, budget, preference) {
  const systemPrompt = `You are a bike recommendation API. Always respond with valid JSON array only. No markdown, no explanation.`;
  
  const prompt = `Recommend 5 bikes available in India for:
- Daily commute: ${dailyKm} km
- Road type: ${roadType}
- Budget: Rs ${budget}
- Preference: ${preference}

Return ONLY a JSON array:
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
]`;

  try {
    const text = await callGroq(prompt, systemPrompt, 0.4, 1500);
    const clean = text.replace(/```json|```/g, '').trim();
    return JSON.parse(clean);
  } catch {
    return [];
  }
}

export async function comparebikes(bike1, bike2) {
  const systemPrompt = `You are a bike comparison API. Always respond with valid JSON only. No markdown, no explanation.`;
  
  const prompt = `Compare these two bikes for an Indian buyer:
Bike 1: ${bike1.name} (Rs ${bike1.basePrice}, ${bike1.fuelType})
Bike 2: ${bike2.name} (Rs ${bike2.basePrice}, ${bike2.fuelType})

Return ONLY this JSON:
{
  "winner": "bike name",
  "summary": "2-3 sentence overall verdict",
  "categories": {
    "value": {"winner": "bike name", "reason": "short reason"},
    "performance": {"winner": "bike name", "reason": "short reason"},
    "comfort": {"winner": "bike name", "reason": "short reason"},
    "mileage": {"winner": "bike name", "reason": "short reason"},
    "features": {"winner": "bike name", "reason": "short reason"},
    "maintenance": {"winner": "bike name", "reason": "short reason"}
  },
  "buyBike1If": "scenario where bike 1 is better",
  "buyBike2If": "scenario where bike 2 is better"
}`;

  try {
    const text = await callGroq(prompt, systemPrompt, 0.3, 1000);
    const clean = text.replace(/```json|```/g, '').trim();
    return JSON.parse(clean);
  } catch {
    return null;
  }
}
