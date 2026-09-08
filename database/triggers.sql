-- ============================================================
-- Triggers
-- ============================================================

-- 1. Auto-update train status to 'Delayed' when a delay is recorded
CREATE OR REPLACE FUNCTION fn_mark_train_delayed()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE train
    SET status = 'Delayed'
    WHERE train_number = NEW.train_number
      AND status = 'Active';
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_mark_train_delayed
AFTER INSERT ON delay
FOR EACH ROW
EXECUTE FUNCTION fn_mark_train_delayed();


-- 2. Validate ticket booking dates: journey_date cannot be before booking_date
CREATE OR REPLACE FUNCTION fn_validate_ticket_dates()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.journey_date < NEW.booking_date THEN
        RAISE EXCEPTION 'journey_date (%) cannot be earlier than booking_date (%)',
            NEW.journey_date, NEW.booking_date;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_validate_ticket_dates
BEFORE INSERT OR UPDATE ON ticket
FOR EACH ROW
EXECUTE FUNCTION fn_validate_ticket_dates();


-- 3. Prevent invalid fare values (defense in depth alongside CHECK constraint)
CREATE OR REPLACE FUNCTION fn_validate_fare()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.fare IS NULL OR NEW.fare <= 0 THEN
        RAISE EXCEPTION 'Invalid fare value: %', NEW.fare;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_validate_fare
BEFORE INSERT OR UPDATE ON ticket
FOR EACH ROW
EXECUTE FUNCTION fn_validate_fare();


-- 4. Audit log for train status changes
CREATE TABLE IF NOT EXISTS train_status_audit (
    audit_id      SERIAL PRIMARY KEY,
    train_number  VARCHAR(10) NOT NULL,
    old_status    VARCHAR(20),
    new_status    VARCHAR(20),
    changed_at    TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION fn_audit_train_status()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        INSERT INTO train_status_audit (train_number, old_status, new_status)
        VALUES (NEW.train_number, OLD.status, NEW.status);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_audit_train_status
AFTER UPDATE ON train
FOR EACH ROW
EXECUTE FUNCTION fn_audit_train_status();