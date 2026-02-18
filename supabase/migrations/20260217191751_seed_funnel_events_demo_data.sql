/*
  # Seed Demo Funnel Events

  Inserts 90 days of realistic funnel event data for the demo account
  (account_id = 00000000-0000-0000-0000-000000000000).

  ## Funnel Conversion Rates
  - quote_started → quote_completed: ~70%
  - quote_completed → price_revealed: ~80%
  - price_revealed → deposit_page_viewed: ~60%
  - deposit_page_viewed → deposit_paid: ~55%

  ## Data Shape
  - 300 quote journeys spread across 90 days
  - Volume weighted toward recent dates (more activity in last 30 days)
  - 60% mobile, 40% desktop
  - Lawn sizes: 500–8000 sqft
  - Pricing: $40–$295 based on lawn size
  - Deposit %: 20%, 25%, or 30%

  ## Notes
  - Only inserts if fewer than 50 events exist for this account (idempotent guard)
  - Each quote's events are timestamped sequentially (minutes apart)
*/

DO $$
DECLARE
  v_quote_id uuid;
  v_event_time timestamptz;
  v_lawn_sq integer;
  v_calc_price decimal(10,2);
  v_dep_pct decimal(5,2);
  v_dep_amt decimal(10,2);
  v_is_mobile boolean;
  v_days_ago integer;
  v_account_id uuid := '00000000-0000-0000-0000-000000000000';
  i integer;
  v_existing_count integer;
BEGIN
  SELECT COUNT(*) INTO v_existing_count
  FROM funnel_events
  WHERE account_id = v_account_id;

  IF v_existing_count >= 50 THEN
    RAISE NOTICE 'Demo data already exists (% events). Skipping seed.', v_existing_count;
    RETURN;
  END IF;

  FOR i IN 1..300 LOOP
    v_quote_id := gen_random_uuid();

    -- Weight more events toward recent dates: 60% in last 30d, 40% in 31-90d
    IF random() < 0.60 THEN
      v_days_ago := floor(random() * 30)::integer;
    ELSE
      v_days_ago := 30 + floor(random() * 60)::integer;
    END IF;

    -- Random time of day weighted toward business hours (8am-8pm)
    v_event_time := (now() - (v_days_ago || ' days')::interval)
                    ::date
                    + (floor(random() * 43200 + 28800) || ' seconds')::interval;

    v_lawn_sq := (floor(random() * 7500) + 500)::integer;

    -- Tiered pricing by lawn size
    v_calc_price := CASE
      WHEN v_lawn_sq < 2000 THEN round((v_lawn_sq * 0.035 + 30)::decimal, 2)
      WHEN v_lawn_sq < 5000 THEN round((v_lawn_sq * 0.030 + 40)::decimal, 2)
      ELSE                       round((v_lawn_sq * 0.025 + 55)::decimal, 2)
    END;

    v_is_mobile := random() < 0.60;

    -- quote_started (all)
    INSERT INTO funnel_events (account_id, quote_id, event_type, timestamp, device_type, lawn_size, calculated_price, deposit_percentage, deposit_amount)
    VALUES (v_account_id, v_quote_id, 'quote_started', v_event_time,
            CASE WHEN v_is_mobile THEN 'mobile' ELSE 'desktop' END,
            v_lawn_sq, v_calc_price, NULL, NULL);

    -- quote_completed (70%)
    IF random() < 0.70 THEN
      INSERT INTO funnel_events (account_id, quote_id, event_type, timestamp, device_type, lawn_size, calculated_price, deposit_percentage, deposit_amount)
      VALUES (v_account_id, v_quote_id, 'quote_completed', v_event_time + interval '3 minutes',
              CASE WHEN v_is_mobile THEN 'mobile' ELSE 'desktop' END,
              v_lawn_sq, v_calc_price, NULL, NULL);

      -- price_revealed (80% of completed)
      IF random() < 0.80 THEN
        INSERT INTO funnel_events (account_id, quote_id, event_type, timestamp, device_type, lawn_size, calculated_price, deposit_percentage, deposit_amount)
        VALUES (v_account_id, v_quote_id, 'price_revealed', v_event_time + interval '4 minutes',
                CASE WHEN v_is_mobile THEN 'mobile' ELSE 'desktop' END,
                v_lawn_sq, v_calc_price, NULL, NULL);

        -- deposit_page_viewed (60% of price reveals)
        IF random() < 0.60 THEN
          v_dep_pct := (ARRAY[20.00, 25.00, 30.00])[floor(random() * 3 + 1)::integer];
          v_dep_amt := round((v_calc_price * v_dep_pct / 100.0)::decimal, 2);

          INSERT INTO funnel_events (account_id, quote_id, event_type, timestamp, device_type, lawn_size, calculated_price, deposit_percentage, deposit_amount)
          VALUES (v_account_id, v_quote_id, 'deposit_page_viewed', v_event_time + interval '5 minutes',
                  CASE WHEN v_is_mobile THEN 'mobile' ELSE 'desktop' END,
                  v_lawn_sq, v_calc_price, v_dep_pct, NULL);

          -- deposit_paid (55% of deposit page views)
          IF random() < 0.55 THEN
            INSERT INTO funnel_events (account_id, quote_id, event_type, timestamp, device_type, lawn_size, calculated_price, deposit_percentage, deposit_amount)
            VALUES (v_account_id, v_quote_id, 'deposit_paid', v_event_time + interval '7 minutes',
                    CASE WHEN v_is_mobile THEN 'mobile' ELSE 'desktop' END,
                    v_lawn_sq, v_calc_price, v_dep_pct, v_dep_amt);
          END IF;
        END IF;
      END IF;
    END IF;
  END LOOP;

  RAISE NOTICE 'Demo seed complete.';
END $$;
