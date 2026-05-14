-- Dashboard note for personal wedding planning reminders
ALTER TABLE wedding_profiles
  ADD COLUMN IF NOT EXISTS dashboard_note text DEFAULT '';
