const pool = require('../config/db');

// GET all routes
const getAllRoutes = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM route ORDER BY route_id');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch routes' });
  }
};

// GET single route by id
const getRouteById = async (req, res) => {
  try {
    const { routeId } = req.params;
    const result = await pool.query(
      'SELECT * FROM route WHERE route_id = $1',
      [routeId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Route not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch route' });
  }
};

// POST create a new route
const createRoute = async (req, res) => {
  try {
    const { route_name, total_distance } = req.body;
    const result = await pool.query(
      `INSERT INTO route (route_name, total_distance)
       VALUES ($1, $2)
       RETURNING *`,
      [route_name, total_distance]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

// PUT update an existing route
const updateRoute = async (req, res) => {
  try {
    const { routeId } = req.params;
    const { route_name, total_distance } = req.body;
    const result = await pool.query(
      `UPDATE route
       SET route_name = $1, total_distance = $2
       WHERE route_id = $3
       RETURNING *`,
      [route_name, total_distance, routeId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Route not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

// DELETE a route
const deleteRoute = async (req, res) => {
  try {
    const { routeId } = req.params;
    const result = await pool.query(
      'DELETE FROM route WHERE route_id = $1 RETURNING *',
      [routeId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Route not found' });
    }
    res.json({ message: 'Route deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete route' });
  }
};

// GET all stations on a route, in order (uses route_station junction)
const getRouteStations = async (req, res) => {
  try {
    const { routeId } = req.params;
    const result = await pool.query(
      `SELECT rs.sequence_number, s.station_code, s.station_name, s.city,
              rs.distance_from_origin
       FROM route_station rs
       JOIN station s ON s.station_code = rs.station_code
       WHERE rs.route_id = $1
       ORDER BY rs.sequence_number`,
      [routeId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch route stations' });
  }
};

// GET all trains operating on a route (uses train_route junction)
const getRouteTrains = async (req, res) => {
  try {
    const { routeId } = req.params;
    const result = await pool.query(
      `SELECT t.train_number, t.train_name, t.train_type, t.status
       FROM train_route tr
       JOIN train t ON t.train_number = tr.train_number
       WHERE tr.route_id = $1`,
      [routeId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch route trains' });
  }
};

// POST associate a station with a route (add to route_station)
const addStationToRoute = async (req, res) => {
  try {
    const { routeId } = req.params;
    const { station_code, sequence_number, distance_from_origin } = req.body;
    const result = await pool.query(
      `INSERT INTO route_station (route_id, station_code, sequence_number, distance_from_origin)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [routeId, station_code, sequence_number, distance_from_origin]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

// POST associate a train with a route (add to train_route)
const addTrainToRoute = async (req, res) => {
  try {
    const { routeId } = req.params;
    const { train_number } = req.body;
    const result = await pool.query(
      `INSERT INTO train_route (train_number, route_id)
       VALUES ($1, $2)
       RETURNING *`,
      [train_number, routeId]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  getAllRoutes,
  getRouteById,
  createRoute,
  updateRoute,
  deleteRoute,
  getRouteStations,
  getRouteTrains,
  addStationToRoute,
  addTrainToRoute,
};