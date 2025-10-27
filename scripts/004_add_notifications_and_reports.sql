-- Add notifications system
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('info', 'warning', 'error', 'success')),
  read BOOLEAN DEFAULT false,
  link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add reports table
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('threat', 'audit', 'incident', 'analytics')),
  format TEXT NOT NULL CHECK (format IN ('pdf', 'csv', 'json')),
  status TEXT NOT NULL DEFAULT 'generating' CHECK (status IN ('generating', 'completed', 'failed')),
  file_url TEXT,
  data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add wallet screening table
CREATE TABLE IF NOT EXISTS wallet_screenings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  wallet_address TEXT NOT NULL,
  blockchain TEXT NOT NULL,
  risk_score INTEGER NOT NULL CHECK (risk_score >= 0 AND risk_score <= 100),
  risk_level TEXT NOT NULL CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
  flags JSONB DEFAULT '[]'::jsonb,
  sanctions_match BOOLEAN DEFAULT false,
  exposure_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add transaction monitoring table
CREATE TABLE IF NOT EXISTS transaction_monitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  addresses TEXT[] NOT NULL,
  blockchain TEXT NOT NULL,
  alert_threshold DECIMAL,
  active BOOLEAN DEFAULT true,
  last_checked TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add detected transactions table
CREATE TABLE IF NOT EXISTS detected_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  monitor_id UUID REFERENCES transaction_monitors(id) ON DELETE CASCADE,
  tx_hash TEXT NOT NULL,
  from_address TEXT NOT NULL,
  to_address TEXT NOT NULL,
  amount DECIMAL NOT NULL,
  blockchain TEXT NOT NULL,
  risk_score INTEGER,
  flagged BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_reports_user_id ON reports(user_id);
CREATE INDEX IF NOT EXISTS idx_wallet_screenings_user_id ON wallet_screenings(user_id);
CREATE INDEX IF NOT EXISTS idx_wallet_screenings_address ON wallet_screenings(wallet_address);
CREATE INDEX IF NOT EXISTS idx_transaction_monitors_user_id ON transaction_monitors(user_id);
CREATE INDEX IF NOT EXISTS idx_detected_transactions_monitor_id ON detected_transactions(monitor_id);

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_screenings ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_monitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE detected_transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for notifications
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own notifications" ON notifications FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for reports
CREATE POLICY "Users can view own reports" ON reports FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own reports" ON reports FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own reports" ON reports FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for wallet screenings
CREATE POLICY "Users can view own wallet screenings" ON wallet_screenings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create wallet screenings" ON wallet_screenings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own wallet screenings" ON wallet_screenings FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for transaction monitors
CREATE POLICY "Users can view own monitors" ON transaction_monitors FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create monitors" ON transaction_monitors FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own monitors" ON transaction_monitors FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own monitors" ON transaction_monitors FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for detected transactions
CREATE POLICY "Users can view transactions from own monitors" ON detected_transactions 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM transaction_monitors 
      WHERE transaction_monitors.id = detected_transactions.monitor_id 
      AND transaction_monitors.user_id = auth.uid()
    )
  );
