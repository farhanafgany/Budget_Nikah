-- Dashboard vendor payment tracker
ALTER TABLE wedding_profiles
  ADD COLUMN IF NOT EXISTS vendor_payments jsonb DEFAULT '[]';
