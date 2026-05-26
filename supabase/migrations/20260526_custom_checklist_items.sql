-- Custom checklist items added by each couple (per-tab, with monthsBefore field)
ALTER TABLE wedding_profiles
  ADD COLUMN IF NOT EXISTS custom_checklist_items jsonb DEFAULT '[]';
