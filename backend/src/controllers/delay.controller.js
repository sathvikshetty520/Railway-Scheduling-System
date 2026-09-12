const pool = require('../config/db');

// GET all delays
const getAllDelays = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT d.delay_id, d.train_number, t.train_name, d.station_code,
              s.station_name, d.delay_minutes, d.reason, d.recorded_time
       FROM delay d
       JOIN train t ON t.train_number = d.train_number
       JOIN station s ON s.station_code = d.station_code
       ORDER BY d.recorded_time DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch delays' });
  }
};

// GET single delay by id
const getDelayById = async (req, res) => {
  try {
    const { delayId } = req.params;
    const result = await pool.query(
      `SELECT d.delay_id, d.train_number, t.train_name, d.station_code,
              s.station_name, d.delay_minutes, d.reason, d.recorded_time
       FROM delay d
       JOIN train t ON t.train_number = d.train_number
       JOIN station s ON s.station_code = d.station_code
       WHERE d.delay_id = $1`,
      [delayId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Delay not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch delay' });
  }
};

// GET all delays for a specific train
const getDelaysByTrain = async (req, res) => {
  try {
    const { trainNumber } = req.params;
    const result = await pool.query(
      `SELECT d.delay_id, d.station_code, s.station_name, d.delay_minutes,
              d.reason, d.recorded_time
       FROM delay d
       JOIN station s ON s.station_code = d.station_code
       WHERE d.train_number = $1
       ORDER BY d.recorded_time DESC`,
      [trainNumber]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch train delays' });
  }
};

// POST record a new delay — uses record_delay_and_get_impact() so the
// delay is stored AND the affected schedules (with updated times) come
// back in one call. This is the core "dynamic scheduling" feature.
const recordDelay = async (req, res) => {
  try {
    const { train_number, station_code, delay_minutes, reason } = req.body;
    const result = await pool.query(
      `SELECT * FROM record_delay_and_get_impact($1, $2, $3, $4)`,
      [train_number, station_code, delay_minutes, reason]
    );

    const updatedTrain = await pool.query(
      'SELECT train_number, status FROM train WHERE train_number = $1',
      [train_number]
    );

    res.status(201).json({
      message: 'Delay recorded successfully',
      train_status: updatedTrain.rows[0],
      affected_schedules: result.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  getAllDelays,
  getDelayById,
  getDelaysByTrain,
  recordDelay,
};