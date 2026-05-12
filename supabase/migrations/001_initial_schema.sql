-- wedding_profiles: one row per user
CREATE TABLE wedding_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  partner_one_name TEXT,
  partner_two_name TEXT,
  wedding_city TEXT,
  city_tier TEXT CHECK (city_tier IN ('A', 'B', 'C')),
  wedding_date DATE,
  total_budget BIGINT,
  guest_count INTEGER,
  wedding_style TEXT,
  event_type TEXT,
  planning_priority TEXT,
  readiness_score INTEGER,
  pressure_level TEXT,
  allocation_result JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE wedding_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own their profiles"
  ON wedding_profiles FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- simulations: snapshot per simulation run
CREATE TABLE simulations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  guest_count INTEGER,
  wedding_style TEXT,
  generated_score INTEGER,
  pressure_level TEXT,
  allocation_snapshot JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE simulations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own their simulations"
  ON simulations FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
