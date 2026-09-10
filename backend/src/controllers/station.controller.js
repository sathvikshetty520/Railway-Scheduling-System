const pool = require('../config/db');

// GET all stations
const getAllStations = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM station ORDER BY station_code');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch stations' });
  }
};

// GET single station by code
const getStationByCode = async (req, res) => {
  try {
    const { stationCode } = req.params;
    const result = await pool.query(
      'SELECT * FROM station WHERE station_code = $1',
      [stationCode]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Station not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch station' });
  }
};

// POST create a new station
const createStation = async (req, res) => {
  try {
    const { station_code, station_name, city, state } = req.body;
    const result = await pool.query(
      `INSERT INTO station (station_code, station_name, city, state)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [station_code, station_name, city, state]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

// PUT update an existing station
const updateStation = async (req, res) => {
  try {
    const { stationCode } = req.params;
    const { station_name, city, state } = req.body;
    const result = await pool.query(
      `UPDATE station
       SET station_name = $1, city = $2, state = $3
       WHERE station_code = $4
       RETURNING *`,
      [station_name, city, state, stationCode]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Station not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

// DELETE a station
const deleteStation = async (req, res) => {
  try {
    const { stationCode } = req.params;
    const result = await pool.query(
      'DELETE FROM station WHERE station_code = $1 RETURNING *',
      [stationCode]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Station not found' });
    }
    res.json({ message: 'Station deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete station' });
  }
};

// GET all platforms for a station
const getStationPlatforms = async (req, res) => {
  try {
    const { stationCode } = req.params;
    const result = await pool.query(
      'SELECT * FROM platform WHERE station_code = $1 ORDER BY platform_number',
      [stationCode]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch platforms' });
  }
};

module.exports = {
  getAllStations,
  getStationByCode,
  createStation,
  updateStation,
  deleteStation,
  getStationPlatforms,
};