const pool = require('../config/db');

// Number of trains passing through each station (via route_station + train_route)
const trainsPerStation = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT s.station_code, s.station_name, COUNT(DISTINCT tr.train_number) AS train_count
       FROM station s
       JOIN route_station rs ON rs.station_code = s.station_code
       JOIN train_route tr ON tr.route_id = rs.route_id
       GROUP BY s.station_code, s.station_name
       ORDER BY train_count DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate report' });
  }
};

// Number of tickets booked for each train
const ticketsPerTrain = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT t.train_number, t.train_name, COUNT(tk.ticket_id) AS ticket_count
       FROM train t
       LEFT JOIN ticket tk ON tk.train_number = t.train_number
       GROUP BY t.train_number, t.train_name
       ORDER BY ticket_count DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate report' });
  }
};

// Stations with the highest number of scheduled stops
const stationsBySchedule = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT s.station_code, s.station_name, COUNT(sc.schedule_id) AS schedule_count
       FROM station s
       LEFT JOIN schedule sc ON sc.station_code = s.station_code
       GROUP BY s.station_code, s.station_name
       ORDER BY schedule_count DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate report' });
  }
};

// Trains with the highest number of delays
const trainsByDelayCount = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT t.train_number, t.train_name, COUNT(d.delay_id) AS delay_count,
              COALESCE(SUM(d.delay_minutes), 0) AS total_delay_minutes
       FROM train t
       LEFT JOIN delay d ON d.train_number = t.train_number
       GROUP BY t.train_number, t.train_name
       HAVING COUNT(d.delay_id) > 0
       ORDER BY delay_count DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate report' });
  }
};

// Longest delays recorded
const longestDelays = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT d.delay_id, t.train_number, t.train_name, s.station_name,
              d.delay_minutes, d.reason, d.recorded_time
       FROM delay d
       JOIN train t ON t.train_number = d.train_number
       JOIN station s ON s.station_code = d.station_code
       ORDER BY d.delay_minutes DESC
       LIMIT 10`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate report' });
  }
};

// Total ticket revenue across the whole system
const totalRevenue = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT COALESCE(SUM(fare), 0) AS total_revenue
       FROM ticket
       WHERE ticket_status != 'Cancelled'`
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate report' });
  }
};

// Revenue broken down per train
const revenuePerTrain = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT t.train_number, t.train_name,
              COALESCE(SUM(tk.fare), 0) AS revenue,
              COUNT(tk.ticket_id) AS tickets_sold
       FROM train t
       LEFT JOIN ticket tk ON tk.train_number = t.train_number AND tk.ticket_status != 'Cancelled'
       GROUP BY t.train_number, t.train_name
       ORDER BY revenue DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate report' });
  }
};

// Dashboard summary — one call for key counts (handy for a React dashboard page)
const dashboardSummary = async (req, res) => {
  try {
    const [trains, stations, activeTrains, delayedTrains, ticketsToday, revenue] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM train'),
      pool.query('SELECT COUNT(*) FROM station'),
      pool.query("SELECT COUNT(*) FROM train WHERE status = 'Active'"),
      pool.query("SELECT COUNT(*) FROM train WHERE status = 'Delayed'"),
      pool.query('SELECT COUNT(*) FROM ticket WHERE booking_date = CURRENT_DATE'),
      pool.query("SELECT COALESCE(SUM(fare),0) AS total FROM ticket WHERE ticket_status != 'Cancelled'"),
    ]);

    res.json({
      total_trains: parseInt(trains.rows[0].count),
      total_stations: parseInt(stations.rows[0].count),
      active_trains: parseInt(activeTrains.rows[0].count),
      delayed_trains: parseInt(delayedTrains.rows[0].count),
      tickets_booked_today: parseInt(ticketsToday.rows[0].count),
      total_revenue: revenue.rows[0].total,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate dashboard summary' });
  }
};

module.exports = {
  trainsPerStation,
  ticketsPerTrain,
  stationsBySchedule,
  trainsByDelayCount,
  longestDelays,
  totalRevenue,
  revenuePerTrain,
  dashboardSummary,
};