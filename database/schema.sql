-- ============================================================
-- Railway Network & Dynamic Train Scheduling System
-- Relational Schema (PostgreSQL) — 3NF
-- ============================================================

DROP TABLE IF EXISTS delay CASCADE;
DROP TABLE IF EXISTS ticket CASCADE;
DROP TABLE IF EXISTS passenger CASCADE;
DROP TABLE IF EXISTS schedule CASCADE;
DROP TABLE IF EXISTS platform CASCADE;
DROP TABLE IF EXISTS route_station CASCADE;
DROP TABLE IF EXISTS train_route CASCADE;
DROP TABLE IF EXISTS route CASCADE;
DROP TABLE IF EXISTS station CASCADE;
DROP TABLE IF EXISTS train CASCADE;

-- ============================================================
-- TRAIN
-- ============================================================
CREATE TABLE train (
    train_number    VARCHAR(10)   PRIMARY KEY,
    train_name      VARCHAR(100)  NOT NULL,
    train_type      VARCHAR(30)   NOT NULL CHECK (train_type IN
                        ('Express', 'Superfast', 'Passenger', 'Suburban', 'Freight')),
    capacity        INTEGER       NOT NULL CHECK (capacity > 0),
    status          VARCHAR(20)   NOT NULL DEFAULT 'Active' CHECK (status IN
                        ('Active', 'Delayed', 'Cancelled', 'Maintenance')),
    created_at      TIMESTAMP     NOT NULL DEFAULT NOW()
);

-- ============================================================
-- STATION
-- ============================================================
CREATE TABLE station (
    station_code    VARCHAR(10)   PRIMARY KEY,
    station_name    VARCHAR(100)  NOT NULL,
    city            VARCHAR(60)   NOT NULL,
    state           VARCHAR(60)   NOT NULL
);

-- ============================================================
-- ROUTE
-- ============================================================
CREATE TABLE route (
    route_id        SERIAL        PRIMARY KEY,
    route_name      VARCHAR(100)  NOT NULL,
    total_distance  NUMERIC(8,2)  NOT NULL CHECK (total_distance > 0)
);

-- ============================================================
-- TRAIN — OPERATES — ROUTE (M:N junction)
-- ============================================================
CREATE TABLE train_route (
    train_number    VARCHAR(10)   NOT NULL REFERENCES train(train_number) ON DELETE CASCADE,
    route_id        INTEGER       NOT NULL REFERENCES route(route_id) ON DELETE CASCADE,
    PRIMARY KEY (train_number, route_id)
);

-- ============================================================
-- ROUTE — PASSES_THROUGH — STATION (M:N junction, ordered)
-- sequence_number gives the stop order of a station on a route
-- ============================================================
CREATE TABLE route_station (
    route_id        INTEGER       NOT NULL REFERENCES route(route_id) ON DELETE CASCADE,
    station_code    VARCHAR(10)   NOT NULL REFERENCES station(station_code) ON DELETE CASCADE,
    sequence_number INTEGER       NOT NULL CHECK (sequence_number > 0),
    distance_from_origin NUMERIC(8,2) CHECK (distance_from_origin >= 0),
    PRIMARY KEY (route_id, station_code),
    UNIQUE (route_id, sequence_number)
);

-- ============================================================
-- PLATFORM — STATION HAS PLATFORM (1:N)
-- ============================================================
CREATE TABLE platform (
    platform_id     SERIAL        PRIMARY KEY,
    platform_number VARCHAR(10)   NOT NULL,
    platform_type   VARCHAR(30)   NOT NULL,
    station_code    VARCHAR(10)   NOT NULL REFERENCES station(station_code) ON DELETE CASCADE,
    UNIQUE (station_code, platform_number)
);

-- ============================================================
-- SCHEDULE — TRAIN HAS SCHEDULE (1:N), SCHEDULE AT STATION (N:1)
-- A schedule row = one train's stop at one station on a given date
-- ============================================================
CREATE TABLE schedule (
    schedule_id     SERIAL        PRIMARY KEY,
    train_number    VARCHAR(10)   NOT NULL REFERENCES train(train_number) ON DELETE CASCADE,
    station_code    VARCHAR(10)   NOT NULL REFERENCES station(station_code) ON DELETE CASCADE,
    platform_id     INTEGER       REFERENCES platform(platform_id) ON DELETE SET NULL,
    schedule_date   DATE          NOT NULL,
    arrival_time    TIME,
    departure_time  TIME,
    CHECK (arrival_time IS NOT NULL OR departure_time IS NOT NULL)
);

CREATE INDEX idx_schedule_train ON schedule(train_number);
CREATE INDEX idx_schedule_station ON schedule(station_code);
CREATE INDEX idx_schedule_date ON schedule(schedule_date);

-- ============================================================
-- PASSENGER
-- ============================================================
CREATE TABLE passenger (
    passenger_id    SERIAL        PRIMARY KEY,
    first_name      VARCHAR(60)   NOT NULL,
    last_name       VARCHAR(60)   NOT NULL,
    phone           VARCHAR(15)   NOT NULL,
    email           VARCHAR(100)  UNIQUE
);

-- ============================================================
-- TICKET — PASSENGER BOOKS TICKET (1:N), TICKET FOR TRAIN (N:1)
-- ============================================================
CREATE TABLE ticket (
    ticket_id       SERIAL        PRIMARY KEY,
    passenger_id    INTEGER       NOT NULL REFERENCES passenger(passenger_id) ON DELETE CASCADE,
    train_number    VARCHAR(10)   NOT NULL REFERENCES train(train_number) ON DELETE CASCADE,
    booking_date    DATE          NOT NULL DEFAULT CURRENT_DATE,
    journey_date    DATE          NOT NULL,
    fare            NUMERIC(10,2) NOT NULL CHECK (fare > 0),
    ticket_status   VARCHAR(20)   NOT NULL DEFAULT 'Confirmed' CHECK (ticket_status IN
                        ('Confirmed', 'Waitlisted', 'Cancelled')),
    CHECK (journey_date >= booking_date)
);

CREATE INDEX idx_ticket_passenger ON ticket(passenger_id);
CREATE INDEX idx_ticket_train ON ticket(train_number);

-- ============================================================
-- DELAY — TRAIN EXPERIENCES DELAY (1:N), DELAY OCCURS_AT STATION (N:1)
-- ============================================================
CREATE TABLE delay (
    delay_id        SERIAL        PRIMARY KEY,
    train_number    VARCHAR(10)   NOT NULL REFERENCES train(train_number) ON DELETE CASCADE,
    station_code    VARCHAR(10)   NOT NULL REFERENCES station(station_code) ON DELETE CASCADE,
    delay_minutes   INTEGER       NOT NULL CHECK (delay_minutes > 0),
    reason          VARCHAR(200),
    recorded_time   TIMESTAMP     NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_delay_train ON delay(train_number);
CREATE INDEX idx_delay_station ON delay(station_code);