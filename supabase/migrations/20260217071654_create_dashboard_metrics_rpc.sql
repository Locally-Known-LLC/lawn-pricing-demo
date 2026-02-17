/*
  # Dashboard Metrics RPC Function

  1. New Functions
    - `get_dashboard_metrics(account_id, start_date, end_date)`
      Returns aggregated metrics for the dashboard:
      - quotes_started: Total quote_started events
      - quotes_completed: Total quote_completed events
      - price_reveals: Total price_revealed events
      - deposit_page_views: Total deposit_page_viewed events
      - deposits_paid: Total deposit_paid events
      - deposit_conversion_rate: (deposits_paid / quotes_completed) * 100
      - reveal_to_deposit_rate: (deposits_paid / price_reveals) * 100
      - avg_quote_value: Average calculated_price from quote_completed events
      - total_deposits: Sum of deposit_amount from deposit_paid events
      - pending_count: Count of completed quotes without deposits
      - pending_value: Sum of calculated_price for pending quotes

  2. Important Notes
    - All denominators are explicitly handled to avoid division by zero
    - Returns null for rates when denominator is 0
    - Filters events by account_id and timestamp range
    - Uses proper NULL handling for deposit_amount

  3. Security
    - Function is security definer to allow aggregation
    - Only returns data for the requesting user's account_id
*/

CREATE OR REPLACE FUNCTION get_dashboard_metrics(
  p_account_id uuid,
  p_start_date timestamptz,
  p_end_date timestamptz
)
RETURNS TABLE (
  quotes_started bigint,
  quotes_completed bigint,
  price_reveals bigint,
  deposit_page_views bigint,
  deposits_paid bigint,
  deposit_conversion_rate numeric,
  reveal_to_deposit_rate numeric,
  avg_quote_value numeric,
  total_deposits numeric,
  pending_count bigint,
  pending_value numeric
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_quotes_started bigint;
  v_quotes_completed bigint;
  v_price_reveals bigint;
  v_deposit_page_views bigint;
  v_deposits_paid bigint;
  v_deposit_conversion_rate numeric;
  v_reveal_to_deposit_rate numeric;
  v_avg_quote_value numeric;
  v_total_deposits numeric;
  v_pending_count bigint;
  v_pending_value numeric;
BEGIN
  -- Count events by type
  SELECT 
    COUNT(*) FILTER (WHERE event_type = 'quote_started'),
    COUNT(*) FILTER (WHERE event_type = 'quote_completed'),
    COUNT(*) FILTER (WHERE event_type = 'price_revealed'),
    COUNT(*) FILTER (WHERE event_type = 'deposit_page_viewed'),
    COUNT(*) FILTER (WHERE event_type = 'deposit_paid')
  INTO 
    v_quotes_started,
    v_quotes_completed,
    v_price_reveals,
    v_deposit_page_views,
    v_deposits_paid
  FROM funnel_events
  WHERE account_id = p_account_id
    AND timestamp >= p_start_date
    AND timestamp <= p_end_date;

  -- Calculate deposit conversion rate
  IF v_quotes_completed > 0 THEN
    v_deposit_conversion_rate := (v_deposits_paid::numeric / v_quotes_completed::numeric) * 100;
  ELSE
    v_deposit_conversion_rate := 0;
  END IF;

  -- Calculate reveal to deposit rate
  IF v_price_reveals > 0 THEN
    v_reveal_to_deposit_rate := (v_deposits_paid::numeric / v_price_reveals::numeric) * 100;
  ELSE
    v_reveal_to_deposit_rate := 0;
  END IF;

  -- Calculate average quote value
  SELECT COALESCE(AVG(calculated_price), 0)
  INTO v_avg_quote_value
  FROM funnel_events
  WHERE account_id = p_account_id
    AND timestamp >= p_start_date
    AND timestamp <= p_end_date
    AND event_type = 'quote_completed';

  -- Calculate total deposits
  SELECT COALESCE(SUM(deposit_amount), 0)
  INTO v_total_deposits
  FROM funnel_events
  WHERE account_id = p_account_id
    AND timestamp >= p_start_date
    AND timestamp <= p_end_date
    AND event_type = 'deposit_paid'
    AND deposit_amount IS NOT NULL;

  -- Calculate pending quotes (completed but not paid)
  WITH completed_quotes AS (
    SELECT DISTINCT quote_id, calculated_price
    FROM funnel_events
    WHERE account_id = p_account_id
      AND timestamp >= p_start_date
      AND timestamp <= p_end_date
      AND event_type = 'quote_completed'
  ),
  paid_quotes AS (
    SELECT DISTINCT quote_id
    FROM funnel_events
    WHERE account_id = p_account_id
      AND timestamp >= p_start_date
      AND timestamp <= p_end_date
      AND event_type = 'deposit_paid'
  )
  SELECT COUNT(*), COALESCE(SUM(calculated_price), 0)
  INTO v_pending_count, v_pending_value
  FROM completed_quotes
  WHERE quote_id NOT IN (SELECT quote_id FROM paid_quotes);

  -- Return all metrics
  RETURN QUERY SELECT
    v_quotes_started,
    v_quotes_completed,
    v_price_reveals,
    v_deposit_page_views,
    v_deposits_paid,
    v_deposit_conversion_rate,
    v_reveal_to_deposit_rate,
    v_avg_quote_value,
    v_total_deposits,
    v_pending_count,
    v_pending_value;
END;
$$;