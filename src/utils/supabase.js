import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ── helpers ───────────────────────────────────────────────────────────────────
async function getCurrentUserId() {
  const { data } = await supabase.auth.getUser();
  return data?.user?.id || null;
}

// ── Watchlist ─────────────────────────────────────────────────────────────────

// Save a bike — tied to the logged-in user
export async function saveToWatchlist(bike) {
  const userId = await getCurrentUserId();
  if (!userId) return false; // not logged in — App.js handles local state
  const id = `${userId}-${bike.name.replace(/\s+/g, '-')}`;
  const { error } = await supabase.from('watchlist').upsert([{
    id,
    user_id:    userId,
    bike_data:  bike,
    created_at: new Date().toISOString(),
  }]);
  return !error;
}

// Get watchlist for the current user only
export async function getWatchlist() {
  const userId = await getCurrentUserId();
  if (!userId) return [];
  const { data, error } = await supabase
    .from('watchlist')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) return [];
  return data.map(row => row.bike_data);
}

// Remove one bike from the current user's watchlist
export async function removeFromWatchlist(bikeName) {
  const userId = await getCurrentUserId();
  if (!userId) return false;
  const id = `${userId}-${bikeName.replace(/\s+/g, '-')}`;
  const { error } = await supabase.from('watchlist').delete().eq('id', id);
  return !error;
}

// Clear entire watchlist for current user
export async function clearWatchlist() {
  const userId = await getCurrentUserId();
  if (!userId) return false;
  const { error } = await supabase.from('watchlist').delete().eq('user_id', userId);
  return !error;
}

// ── Price alerts ──────────────────────────────────────────────────────────────
export async function savePriceAlert(email, bikeName) {
  const { error } = await supabase.from('price_alerts').insert([{
    email,
    bike_name:  bikeName,
    created_at: new Date().toISOString(),
  }]);
  return !error;
}
