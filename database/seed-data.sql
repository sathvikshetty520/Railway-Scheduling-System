-- ============================================================
-- Sample Data for Railway Network & Dynamic Train Scheduling System
-- ============================================================

-- STATIONS
INSERT INTO station (station_code, station_name, city, state) VALUES
('NDLS', 'New Delhi',        'New Delhi',  'Delhi'),
('BCT',  'Mumbai Central',   'Mumbai',     'Maharashtra'),
('MAS',  'Chennai Central',  'Chennai',    'Tamil Nadu'),
('HWH',  'Howrah Junction',  'Kolkata',    'West Bengal'),
('SBC',  'Bengaluru City',   'Bengaluru',  'Karnataka'),
('ADI',  'Ahmedabad Jn',     'Ahmedabad',  'Gujarat'),
('PUNE', 'Pune Junction',    'Pune',       'Maharashtra'),
('JP',   'Jaipur Junction',  'Jaipur',     'Rajasthan');

-- PLATFORMS
INSERT INTO platform (platform_number, platform_type, station_code) VALUES
('1', 'Standard',  'NDLS'),
('2', 'Standard',  'NDLS'),
('3', 'Elevated',  'NDLS'),
('1', 'Standard',  'BCT'),
('2', 'Elevated',  'BCT'),
('1', 'Standard',  'MAS'),
('2', 'Standard',  'MAS'),
('1', 'Standard',  'HWH'),
('1', 'Standard',  'SBC'),
('2', 'Elevated',  'SBC'),
('1', 'Standard',  'ADI'),
('1', 'Standard',  'PUNE'),
('1', 'Standard',  'JP');

-- TRAINS
INSERT INTO train (train_number, train_name, train_type, capacity, status) VALUES
('12951', 'Mumbai Rajdhani',       'Superfast', 1200, 'Active'),
('12301', 'Howrah Rajdhani',       'Superfast', 1100, 'Active'),
('12621', 'Tamil Nadu Express',    'Express',   1400, 'Active'),
('12628', 'Karnataka Express',     'Express',   1300, 'Delayed'),
('12009', 'Shatabdi Express',      'Superfast',  900, 'Active'),
('19011', 'Firozpur Janta Exp',    'Passenger',  800, 'Active'),
('12933', 'Karnavati Express',     'Superfast', 1000, 'Active');

-- ROUTES
INSERT INTO route (route_name, total_distance) VALUES
('Delhi - Mumbai Main Line',    1384.00),
('Delhi - Howrah Main Line',    1447.00),
('Chennai - Delhi Grand Trunk', 2180.00),
('Delhi - Bengaluru Line',      2444.00),
('Mumbai - Ahmedabad Line',      493.00);

-- TRAIN_ROUTE (M:N)
INSERT INTO train_route (train_number, route_id) VALUES
('12951', 1),
('12301', 2),
('12621', 3),
('12628', 4),
('12009', 1),
('19011', 1),
('12933', 5);

-- ROUTE_STATION (M:N, ordered)
-- Route 1: Delhi - Mumbai
INSERT INTO route_station (route_id, station_code, sequence_number, distance_from_origin) VALUES
(1, 'NDLS', 1,    0.00),
(1, 'JP',   2,  308.00),
(1, 'ADI',  3,  934.00),
(1, 'BCT',  4, 1384.00);

-- Route 2: Delhi - Howrah
INSERT INTO route_station (route_id, station_code, sequence_number, distance_from_origin) VALUES
(2, 'NDLS', 1,    0.00),
(2, 'HWH',  2, 1447.00);

-- Route 3: Chennai - Delhi
INSERT INTO route_station (route_id, station_code, sequence_number, distance_from_origin) VALUES
(3, 'MAS',  1,    0.00),
(3, 'SBC',  2,  362.00),
(3, 'NDLS', 3, 2180.00);

-- Route 4: Delhi - Bengaluru
INSERT INTO route_station (route_id, station_code, sequence_number, distance_from_origin) VALUES
(4, 'NDLS', 1,    0.00),
(4, 'PUNE', 2, 1550.00),
(4, 'SBC',  3, 2444.00);

-- Route 5: Mumbai - Ahmedabad
INSERT INTO route_station (route_id, station_code, sequence_number, distance_from_origin) VALUES
(5, 'BCT',  1,   0.00),
(5, 'ADI',  2, 493.00);

-- SCHEDULES (today and tomorrow)
INSERT INTO schedule (train_number, station_code, platform_id, schedule_date, arrival_time, departure_time) VALUES
('12951', 'NDLS', 2, CURRENT_DATE, NULL,      '16:00:00'),
('12951', 'JP',   NULL, CURRENT_DATE, '19:30:00', '19:35:00'),
('12951', 'ADI',  NULL, CURRENT_DATE, '23:45:00', '23:50:00'),
('12951', 'BCT',  4, CURRENT_DATE, '08:15:00', NULL),

('12301', 'NDLS', 1, CURRENT_DATE, NULL,      '17:00:00'),
('12301', 'HWH',  1, CURRENT_DATE + 1, '10:05:00', NULL),

('12621', 'MAS',  1, CURRENT_DATE, NULL,      '07:15:00'),
('12621', 'SBC',  1, CURRENT_DATE, '11:00:00', '11:10:00'),
('12621', 'NDLS', 3, CURRENT_DATE + 1, '21:30:00', NULL),

('12628', 'NDLS', 2, CURRENT_DATE, NULL,      '20:15:00'),
('12628', 'PUNE', 1, CURRENT_DATE + 1, '09:00:00', '09:10:00'),
('12628', 'SBC',  2, CURRENT_DATE + 1, '18:20:00', NULL),

('12009', 'NDLS', 1, CURRENT_DATE, NULL,      '06:00:00'),
('12009', 'JP',   NULL, CURRENT_DATE, '10:40:00', NULL);

-- PASSENGERS
INSERT INTO passenger (first_name, last_name, phone, email) VALUES
('Arjun',  'Mehta',    '9876543210', 'arjun.mehta@example.com'),
('Priya',  'Sharma',   '9876500011', 'priya.sharma@example.com'),
('Rohan',  'Verma',    '9876500022', 'rohan.verma@example.com'),
('Sneha',  'Iyer',     '9876500033', 'sneha.iyer@example.com'),
('Kabir',  'Khan',     '9876500044', 'kabir.khan@example.com'),
('Anita',  'Rao',      '9876500055', 'anita.rao@example.com');

-- TICKETS
INSERT INTO ticket (passenger_id, train_number, booking_date, journey_date, fare, ticket_status) VALUES
(1, '12951', CURRENT_DATE - 5, CURRENT_DATE,     2450.00, 'Confirmed'),
(2, '12951', CURRENT_DATE - 3, CURRENT_DATE,     2450.00, 'Confirmed'),
(3, '12301', CURRENT_DATE - 7, CURRENT_DATE + 1, 3100.00, 'Confirmed'),
(4, '12621', CURRENT_DATE - 2, CURRENT_DATE,     1875.00, 'Waitlisted'),
(5, '12628', CURRENT_DATE - 1, CURRENT_DATE,     1650.00, 'Confirmed'),
(6, '12009', CURRENT_DATE - 4, CURRENT_DATE,      950.00, 'Cancelled'),
(1, '12628', CURRENT_DATE - 6, CURRENT_DATE + 1, 1650.00, 'Confirmed');

-- DELAYS
INSERT INTO delay (train_number, station_code, delay_minutes, reason, recorded_time) VALUES
('12628', 'NDLS', 45, 'Signal failure',        NOW() - INTERVAL '3 hours'),
('12628', 'PUNE', 30, 'Late arrival of rake',   NOW() - INTERVAL '1 hour'),
('12009', 'NDLS', 15, 'Heavy fog',              NOW() - INTERVAL '5 hours');