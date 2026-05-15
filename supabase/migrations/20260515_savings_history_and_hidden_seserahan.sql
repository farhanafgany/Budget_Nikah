-- Savings input history and hidden default seserahan items
ALTER TABLE wedding_profiles
  ADD COLUMN IF NOT EXISTS savings_history jsonb DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS hidden_seserahan_item_ids jsonb DEFAULT '[]';
