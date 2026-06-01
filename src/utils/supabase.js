import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Save a bike to watchlist
export async function saveToWatchlist(bike) {
  const id = `${bike.name}-${Date.now()}`;
  const { error } = await supabase.from('watchlist').insert([{ id, bike_data: bike, created_at: new Date().toISOString() }]);
  return !error;
}

// Get watchlist
export async function getWatchlist() {
  const { data, error } = await supabase.from('watchlist').select('*').order('created_at', { ascending: false });
  if (error) return [];
  return data;
}

// Remove from watchlist
export async function removeFromWatchlist(id) {
  const { error } = await supabase.from('watchlist').delete().eq('id', id);
  return !error;
}

// Save price alert
export async function savePriceAlert(email, bikeName) {
  const { error } = await supabase.from('price_alerts').insert([{ email, bike_name: bikeName, created_at: new Date().toISOString() }]);
  return !error;
}
