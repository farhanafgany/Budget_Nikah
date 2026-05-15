-- Custom seserahan items added by each couple
ALTER TABLE wedding_profiles
  ADD COLUMN IF NOT EXISTS custom_seserahan_items jsonb DEFAULT '[]';
