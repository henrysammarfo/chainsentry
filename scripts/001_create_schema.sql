-- Create profiles table for user management
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  company text,
  role text default 'user',
  avatar_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create threats table for phishing and malicious URL tracking
create table if not exists public.threats (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  url text not null,
  threat_type text not null, -- 'phishing', 'malware', 'scam', 'suspicious'
  risk_score integer not null check (risk_score >= 0 and risk_score <= 100),
  status text default 'active', -- 'active', 'resolved', 'false_positive'
  detected_at timestamp with time zone default now(),
  resolved_at timestamp with time zone,
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default now()
);

-- Create smart_contract_audits table
create table if not exists public.smart_contract_audits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  contract_address text not null,
  contract_code text not null,
  blockchain text not null, -- 'ethereum', 'bsc', 'polygon', etc.
  audit_status text default 'pending', -- 'pending', 'in_progress', 'completed', 'failed'
  risk_level text, -- 'critical', 'high', 'medium', 'low', 'safe'
  vulnerabilities jsonb default '[]'::jsonb,
  recommendations jsonb default '[]'::jsonb,
  audit_score integer,
  created_at timestamp with time zone default now(),
  completed_at timestamp with time zone
);

-- Create incidents table for security incident tracking
create table if not exists public.incidents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  description text,
  severity text not null, -- 'critical', 'high', 'medium', 'low'
  status text default 'open', -- 'open', 'investigating', 'resolved', 'closed'
  incident_type text not null, -- 'phishing', 'contract_exploit', 'unauthorized_access', etc.
  affected_assets jsonb default '[]'::jsonb,
  assigned_to uuid references auth.users(id),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  resolved_at timestamp with time zone
);

-- Create monitoring_alerts table for real-time alerts
create table if not exists public.monitoring_alerts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  alert_type text not null, -- 'transaction', 'contract', 'wallet', 'network'
  severity text not null,
  message text not null,
  source text not null, -- blockchain address, contract, etc.
  metadata jsonb default '{}'::jsonb,
  is_read boolean default false,
  created_at timestamp with time zone default now()
);

-- Create api_integrations table for managing external API keys
create table if not exists public.api_integrations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  provider text not null, -- 'chainalysis', 'etherscan', 'alchemy', etc.
  api_key text not null,
  is_active boolean default true,
  last_used_at timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create analytics_events table for tracking platform usage
create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  event_type text not null,
  event_data jsonb default '{}'::jsonb,
  created_at timestamp with time zone default now()
);

-- Enable Row Level Security on all tables
alter table public.profiles enable row level security;
alter table public.threats enable row level security;
alter table public.smart_contract_audits enable row level security;
alter table public.incidents enable row level security;
alter table public.monitoring_alerts enable row level security;
alter table public.api_integrations enable row level security;
alter table public.analytics_events enable row level security;

-- Profiles policies
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Threats policies
create policy "Users can view their own threats"
  on public.threats for select
  using (auth.uid() = user_id);

create policy "Users can insert their own threats"
  on public.threats for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own threats"
  on public.threats for update
  using (auth.uid() = user_id);

create policy "Users can delete their own threats"
  on public.threats for delete
  using (auth.uid() = user_id);

-- Smart contract audits policies
create policy "Users can view their own audits"
  on public.smart_contract_audits for select
  using (auth.uid() = user_id);

create policy "Users can insert their own audits"
  on public.smart_contract_audits for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own audits"
  on public.smart_contract_audits for update
  using (auth.uid() = user_id);

-- Incidents policies
create policy "Users can view their own incidents"
  on public.incidents for select
  using (auth.uid() = user_id or auth.uid() = assigned_to);

create policy "Users can insert their own incidents"
  on public.incidents for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own incidents"
  on public.incidents for update
  using (auth.uid() = user_id or auth.uid() = assigned_to);

-- Monitoring alerts policies
create policy "Users can view their own alerts"
  on public.monitoring_alerts for select
  using (auth.uid() = user_id);

create policy "Users can insert their own alerts"
  on public.monitoring_alerts for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own alerts"
  on public.monitoring_alerts for update
  using (auth.uid() = user_id);

create policy "Users can delete their own alerts"
  on public.monitoring_alerts for delete
  using (auth.uid() = user_id);

-- API integrations policies
create policy "Users can view their own integrations"
  on public.api_integrations for select
  using (auth.uid() = user_id);

create policy "Users can insert their own integrations"
  on public.api_integrations for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own integrations"
  on public.api_integrations for update
  using (auth.uid() = user_id);

create policy "Users can delete their own integrations"
  on public.api_integrations for delete
  using (auth.uid() = user_id);

-- Analytics events policies
create policy "Users can view their own analytics"
  on public.analytics_events for select
  using (auth.uid() = user_id);

create policy "Users can insert their own analytics"
  on public.analytics_events for insert
  with check (auth.uid() = user_id);
