-- Default checklist items hidden by each couple
ALTER TABLE wedding_profiles
  ADD COLUMN IF NOT EXISTS hidden_checklist_item_ids text[] DEFAULT '{}';
