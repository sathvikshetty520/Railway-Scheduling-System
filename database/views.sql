-- ============================================================
-- Views
-- ============================================================

-- Active Trains
CREATE OR REPLACE VIEW active_trains AS
SELECT train_number, train_name, train_type, capacity, status
FROM train
WHERE status = 'Active';

-- Today's Schedules
CREATE OR REPLACE VIEW todays_schedules AS
SELECT s.schedule_id, t.train_number, t.train_name, s.station_code,
       st.station_name, s.arrival_time, s.departure_time, s.platform_id
FROM schedule s
JOIN train t ON t.train_number = s.train_number
JOIN station st ON st.station_code = s.station_code
WHERE s.schedule_date = CURRENT_DATE;

-- Delayed Trains
CREATE OR REPLACE VIEW delayed_trains AS
SELECT t.train_number, t.train_name, d.station_code, s.station_name,
       d.delay_minutes, d.reason, d.recorded_time
FROM delay d
JOIN train t ON t.train_number = d.train_number
JOIN station s ON s.station_code = d.station_code
ORDER BY d.recorded_time DESC;

-- Passenger Ticket Details
CREATE OR REPLACE VIEW passenger_ticket_details AS
SELECT p.passenger_id, p.first_name, p.last_name, p.phone, p.email,
       tk.ticket_id, tk.train_number, tr.train_name, tk.journey_date,
       tk.fare, tk.ticket_status
FROM ticket tk
JOIN passenger p ON p.passenger_id = tk.passenger_id
JOIN train tr ON tr.train_number = tk.train_number;

-- Route Station Details (ordered stops per route)
CREATE OR REPLACE VIEW route_station_details AS
SELECT r.route_id, r.route_name, rs.sequence_number, rs.station_code,
       s.station_name, s.city, rs.distance_from_origin
FROM route_station rs
JOIN route r ON r.route_id = rs.route_id
JOIN station s ON s.station_code = rs.station_code
ORDER BY r.route_id, rs.sequence_number;

-- Station Schedule Details
CREATE OR REPLACE VIEW station_schedule_details AS
SELECT s.station_code, st.station_name, s.schedule_date, s.train_number,
       t.train_name, s.arrival_time, s.departure_time
FROM schedule s
JOIN station st ON st.station_code = s.station_code
JOIN train t ON t.train_number = s.train_number
ORDER BY st.station_code, s.schedule_date;