-- BudgetNikah v2 — new columns for dashboard features
ALTER TABLE wedding_profiles
  ADD COLUMN IF NOT EXISTS savings_collected bigint  DEFAULT 0,
  ADD COLUMN IF NOT EXISTS savings_target    bigint  DEFAULT 0,
  ADD COLUMN IF NOT EXISTS checklist_checked jsonb   DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS seserahan_checked jsonb   DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS is_premium        boolean DEFAULT false;
