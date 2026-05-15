-- Midtrans Snap payment records for premium activation
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  order_id text NOT NULL UNIQUE,
  amount bigint NOT NULL,
  currency text NOT NULL DEFAULT 'IDR',
  product_name text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  transaction_status text,
  fraud_status text,
  payment_type text,
  transaction_id text,
  snap_token text,
  redirect_url text,
  raw_notification jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP POLICY IF EXISTS "Users can read own payments" ON payments;
CREATE POLICY "Users can read own payments"
  ON payments FOR SELECT
  USING (user_id = auth.uid());

-- Payment rows are created and updated only from trusted server routes.
-- Users can read their own payment history, but cannot mutate payment status
-- from the browser.

DROP TRIGGER IF EXISTS payments_set_updated_at ON payments;
CREATE TRIGGER payments_set_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();
