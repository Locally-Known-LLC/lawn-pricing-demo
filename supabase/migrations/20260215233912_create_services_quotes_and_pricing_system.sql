/*
  # Complete Quote and Pricing System

  ## Overview
  V1 implementation of:
  1. Services management with configurable pricing engine
  2. Quote lifecycle with deterministic state machine
  3. Optional deposit tracking

  ## New Tables

  ### `services`
  Core service offerings with flexible pricing configuration.
  
  **Fields:**
  - `id` (uuid, primary key)
  - `contractor_id` (uuid, references auth.users)
  - `name` (text) - Service name (e.g., "Lawn Mowing")
  - `description` (text, optional)
  - `status` (text) - draft or live
  - `pricing_model` (text) - tiered or base_per_sqft
  - `base_price` (numeric, nullable) - For base + per sqft model
  - `per_sqft_rate` (numeric, nullable) - Rate per square foot
  - `pricing_tiers` (jsonb) - Array of {min, max, price} objects
  - `minimum_price` (numeric) - Floor price protection
  - `recurring_adjustments` (jsonb) - {weekly: {type, value}, biweekly, monthly}
  - `addons` (jsonb) - Array of addon configurations
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `quotes`
  Quote lifecycle tracking with state machine.
  
  **States:**
  - draft: Internal only, before sending
  - sent: Sent to customer
  - viewed: Customer viewed the quote
  - accepted: Customer accepted (terminal if no deposit)
  - deposit_paid: Deposit payment confirmed (terminal)
  - expired: Quote expired (terminal)
  - cancelled: Manually cancelled (terminal)
  
  **Fields:**
  - `id` (uuid, primary key)
  - `contractor_id` (uuid, references auth.users)
  - `service_id` (uuid, references services)
  - `customer_name` (text)
  - `customer_email` (text)
  - `customer_phone` (text, optional)
  - `property_address` (text)
  - `square_footage` (numeric)
  - `calculated_price` (numeric) - System calculated price
  - `override_price` (numeric, nullable) - Manual adjustment
  - `override_reason` (text, nullable) - Why price was adjusted
  - `final_price` (numeric) - Actual quoted price
  - `recurring_frequency` (text, nullable) - weekly/biweekly/monthly
  - `deposit_required` (boolean)
  - `deposit_amount` (numeric, nullable)
  - `state` (text) - Current state in lifecycle
  - `sent_at` (timestamptz, nullable)
  - `viewed_at` (timestamptz, nullable)
  - `accepted_at` (timestamptz, nullable)
  - `deposit_paid_at` (timestamptz, nullable)
  - `expired_at` (timestamptz, nullable)
  - `cancelled_at` (timestamptz, nullable)
  - `expires_on` (timestamptz, nullable) - When quote will expire
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `deposits`
  Optional deposit payments linked to quotes.
  
  **Fields:**
  - `id` (uuid, primary key)
  - `quote_id` (uuid, references quotes)
  - `amount` (numeric)
  - `stripe_payment_intent_id` (text, nullable)
  - `status` (text) - pending/paid/failed
  - `paid_at` (timestamptz, nullable)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ## Security
  - RLS enabled on all tables
  - Contractors can only access their own data
  - All policies enforce authentication and ownership

  ## Important Notes
  1. State transitions are deterministic and one-way in V1
  2. Terminal states: deposit_paid, expired, cancelled
  3. No CRM, pipeline, or scheduling logic in V1
  4. Manual price overrides are tracked for transparency
  5. Pricing engine supports tiered or base+per-sqft models
*/

-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contractor_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'live')),
  pricing_model text DEFAULT 'tiered' CHECK (pricing_model IN ('tiered', 'base_per_sqft')),
  base_price numeric CHECK (base_price >= 0),
  per_sqft_rate numeric CHECK (per_sqft_rate >= 0),
  pricing_tiers jsonb DEFAULT '[]'::jsonb,
  minimum_price numeric DEFAULT 0 CHECK (minimum_price >= 0),
  recurring_adjustments jsonb DEFAULT '{}'::jsonb,
  addons jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create quotes table
CREATE TABLE IF NOT EXISTS quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contractor_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  service_id uuid REFERENCES services(id) ON DELETE SET NULL,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text,
  property_address text NOT NULL,
  square_footage numeric NOT NULL CHECK (square_footage > 0),
  calculated_price numeric NOT NULL CHECK (calculated_price >= 0),
  override_price numeric CHECK (override_price >= 0),
  override_reason text,
  final_price numeric NOT NULL CHECK (final_price >= 0),
  recurring_frequency text CHECK (recurring_frequency IN ('weekly', 'biweekly', 'monthly')),
  deposit_required boolean DEFAULT false,
  deposit_amount numeric CHECK (deposit_amount >= 0),
  state text NOT NULL DEFAULT 'draft' CHECK (state IN ('draft', 'sent', 'viewed', 'accepted', 'deposit_paid', 'expired', 'cancelled')),
  sent_at timestamptz,
  viewed_at timestamptz,
  accepted_at timestamptz,
  deposit_paid_at timestamptz,
  expired_at timestamptz,
  cancelled_at timestamptz,
  expires_on timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create deposits table
CREATE TABLE IF NOT EXISTS deposits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id uuid REFERENCES quotes(id) ON DELETE CASCADE NOT NULL,
  amount numeric NOT NULL CHECK (amount > 0),
  stripe_payment_intent_id text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed')),
  paid_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_services_contractor_id ON services(contractor_id);
CREATE INDEX IF NOT EXISTS idx_services_status ON services(status);
CREATE INDEX IF NOT EXISTS idx_quotes_contractor_id ON quotes(contractor_id);
CREATE INDEX IF NOT EXISTS idx_quotes_state ON quotes(state);
CREATE INDEX IF NOT EXISTS idx_quotes_expires_on ON quotes(expires_on) WHERE state IN ('sent', 'viewed');
CREATE INDEX IF NOT EXISTS idx_deposits_quote_id ON deposits(quote_id);
CREATE INDEX IF NOT EXISTS idx_deposits_status ON deposits(status);

-- Enable RLS
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE deposits ENABLE ROW LEVEL SECURITY;

-- RLS Policies for services

CREATE POLICY "Contractors can view own services"
  ON services FOR SELECT
  TO authenticated
  USING (auth.uid() = contractor_id);

CREATE POLICY "Contractors can create own services"
  ON services FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = contractor_id);

CREATE POLICY "Contractors can update own services"
  ON services FOR UPDATE
  TO authenticated
  USING (auth.uid() = contractor_id)
  WITH CHECK (auth.uid() = contractor_id);

CREATE POLICY "Contractors can delete own services"
  ON services FOR DELETE
  TO authenticated
  USING (auth.uid() = contractor_id);

-- RLS Policies for quotes

CREATE POLICY "Contractors can view own quotes"
  ON quotes FOR SELECT
  TO authenticated
  USING (auth.uid() = contractor_id);

CREATE POLICY "Contractors can create own quotes"
  ON quotes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = contractor_id);

CREATE POLICY "Contractors can update own quotes"
  ON quotes FOR UPDATE
  TO authenticated
  USING (auth.uid() = contractor_id)
  WITH CHECK (auth.uid() = contractor_id);

CREATE POLICY "Contractors can delete own quotes"
  ON quotes FOR DELETE
  TO authenticated
  USING (auth.uid() = contractor_id);

-- RLS Policies for deposits

CREATE POLICY "Contractors can view own quote deposits"
  ON deposits FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM quotes
      WHERE quotes.id = deposits.quote_id
      AND quotes.contractor_id = auth.uid()
    )
  );

CREATE POLICY "Contractors can create deposits for own quotes"
  ON deposits FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM quotes
      WHERE quotes.id = deposits.quote_id
      AND quotes.contractor_id = auth.uid()
    )
  );

CREATE POLICY "Contractors can update own quote deposits"
  ON deposits FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM quotes
      WHERE quotes.id = deposits.quote_id
      AND quotes.contractor_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM quotes
      WHERE quotes.id = deposits.quote_id
      AND quotes.contractor_id = auth.uid()
    )
  );

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON services
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quotes_updated_at
  BEFORE UPDATE ON quotes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_deposits_updated_at
  BEFORE UPDATE ON deposits
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();