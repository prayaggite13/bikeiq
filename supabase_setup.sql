-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)

-- Watchlist table
create table if not exists watchlist (
  id text primary key,
  bike_data jsonb not null,
  created_at timestamptz default now()
);

-- Price alerts table
create table if not exists price_alerts (
  id uuid default gen_random_uuid() primary key,
  email text not null,
  bike_name text not null,
  created_at timestamptz default now()
);

-- Enable Row Level Security (allow public read/write for this project)
alter table watchlist enable row level security;
alter table price_alerts enable row level security;

-- Policies (allow all for anon users - fine for personal project)
create policy "Allow all watchlist" on watchlist for all using (true) with check (true);
create policy "Allow all price_alerts" on price_alerts for all using (true) with check (true);
