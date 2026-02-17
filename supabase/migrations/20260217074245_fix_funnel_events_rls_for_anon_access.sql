/*
  # Fix RLS policies for unauthenticated access

  ## Changes
  - Update SELECT policy on `funnel_events` to allow anonymous (unauthenticated) users to read events
  - Update INSERT policy to allow anonymous users to insert events
  
  ## Rationale
  Since the application doesn't have authentication implemented yet, we need to allow
  anonymous access to funnel_events so the dashboard and widget can function properly.
  Once authentication is added, these policies should be updated to restrict access.
*/

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can read own account events" ON funnel_events;
DROP POLICY IF EXISTS "System can insert events" ON funnel_events;

-- Allow anonymous users to read all events (for demo/development)
CREATE POLICY "Allow anonymous read access"
  ON funnel_events
  FOR SELECT
  TO anon
  USING (true);

-- Allow anonymous users to insert events (for widget tracking)
CREATE POLICY "Allow anonymous insert access"
  ON funnel_events
  FOR INSERT
  TO anon
  WITH CHECK (true);
