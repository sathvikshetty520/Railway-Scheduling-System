-- ============================================================
-- Stored Procedures / Functions
-- ============================================================

-- 1. Book a ticket inside a transaction: validates train + passenger,
--    then inserts. Raises an exception (auto-rollback) on failure.
CREATE OR REPLACE FUNCTION book_ticket(
    p_passenger_id  INTEGER,
    p_train_number  VARCHAR,
    p_journey_date  DATE,
    p_fare          NUMERIC
) RETURNS INTEGER AS $$
DECLARE
    v_ticket_id     INTEGER;
    v_train_exists  BOOLEAN;
    v_passenger_exists BOOLEAN;
BEGIN
    SELECT EXISTS(SELECT 1 FROM train WHERE train_number = p_train_number)
        INTO v_train_exists;
    IF NOT v_train_exists THEN
        RAISE EXCEPTION 'Train % does not exist', p_train_number;
    END IF;

    SELECT EXISTS(SELECT 1 FROM passenger WHERE passenger_id = p_passenger_id)
        INTO v_passenger_exists;
    IF NOT v_passenger_exists THEN
        RAISE EXCEPTION 'Passenger % does not exist', p_passenger_id;
    END IF;

    INSERT INTO ticket (passenger_id, train_number, journey_date, fare, ticket_status)
    VALUES (p_passenger_id, p_train_number, p_journey_date, p_fare, 'Confirmed')
    RETURNING ticket_id INTO v_ticket_id;

    RETURN v_ticket_id;
END;
$$ LANGUAGE plpgsql;


-- 2. Record a delay and return the affected schedules for that train
--    (implements the "dynamic scheduling" workflow: delay -> affected schedule)
CREATE OR REPLACE FUNCTION record_delay_and_get_impact(
    p_train_number  VARCHAR,
    p_station_code  VARCHAR,
    p_delay_minutes INTEGER,
    p_reason        VARCHAR
) RETURNS TABLE (
    schedule_id     INTEGER,
    station_code    VARCHAR,
    schedule_date   DATE,
    original_arrival TIME,
    updated_arrival TIME,
    original_departure TIME,
    updated_departure TIME
) AS $$
BEGIN
    -- Store the delay (trigger will auto-update train status)
    INSERT INTO delay (train_number, station_code, delay_minutes, reason)
    VALUES (p_train_number, p_station_code, p_delay_minutes, p_reason);

    -- Return every remaining schedule entry for this train, today onward,
    -- with the delay minutes applied to arrival/departure times
    RETURN QUERY
    SELECT s.schedule_id,
           s.station_code,
           s.schedule_date,
           s.arrival_time                                            AS original_arrival,
           (s.arrival_time + (p_delay_minutes || ' minutes')::INTERVAL)::TIME AS updated_arrival,
           s.departure_time                                          AS original_departure,
           (s.departure_time + (p_delay_minutes || ' minutes')::INTERVAL)::TIME AS updated_departure
    FROM schedule s
    WHERE s.train_number = p_train_number
      AND s.schedule_date >= CURRENT_DATE
    ORDER BY s.schedule_date, COALESCE(s.departure_time, s.arrival_time);
END;
$$ LANGUAGE plpgsql;


-- 3. Total ticket revenue for a given train
CREATE OR REPLACE FUNCTION total_revenue_for_train(p_train_number VARCHAR)
RETURNS NUMERIC AS $$
    SELECT COALESCE(SUM(fare), 0)
    FROM ticket
    WHERE train_number = p_train_number
      AND ticket_status != 'Cancelled';
$$ LANGUAGE sql;