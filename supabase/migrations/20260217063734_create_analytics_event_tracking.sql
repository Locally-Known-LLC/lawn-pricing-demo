/*
  # Analytics Event Tracking System

  1. New Tables
    - `funnel_events`
      - `id` (uuid, primary key)
      - `account_id` (uuid, references accounts)
      - `quote_id` (uuid, references quotes)
      - `event_type` (text) - quote_started, quote_completed, price_revealed, deposit_page_viewed, deposit_paid
      - `timestamp` (timestamptz)
      - `device_type` (text) - mobile or desktop
      - `lawn_size` (integer) - square feet
      - `calculated_price` (decimal)
      - `deposit_percentage` (decimal)
      - `deposit_amount` (decimal, nullable)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `funnel_events` table
    - Add policy for authenticated users to read their own account events
    - Add policy for system to insert events

  3. Indexes
    - Index on account_id for fast filtering
    - Index on timestamp for time-range queries
    - Index on event_type for aggregation queries
*/

CREATE TABLE IF NOT EXISTS funnel_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id uuid NOT NULL,
  quote_id uuid NOT NULL,
  event_type text NOT NULL CHECK (event_type IN ('quote_started', 'quote_completed', 'price_revealed', 'deposit_page_viewed', 'deposit_paid')),
  timestamp timestamptz NOT NULL DEFAULT now(),
  device_type text NOT NULL CHECK (device_type IN ('mobile', 'desktop')),
  lawn_size integer NOT NULL,
  calculated_price decimal(10,2) NOT NULL,
  deposit_percentage decimal(5,2),
  deposit_amount decimal(10,2),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE funnel_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own account events"
  ON funnel_events
  FOR SELECT
  TO authenticated
  USING (account_id = auth.uid());

CREATE POLICY "System can insert events"
  ON funnel_events
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_funnel_events_account_id ON funnel_events(account_id);
CREATE INDEX IF NOT EXISTS idx_funnel_events_timestamp ON funnel_events(timestamp);
CREATE INDEX IF NOT EXISTS idx_funnel_events_event_type ON funnel_events(event_type);
CREATE INDEX IF NOT EXISTS idx_funnel_events_quote_id ON funnel_events(quote_id);
