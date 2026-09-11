const pool = require('../config/db');

// GET all schedules (optionally filter by date via ?date=YYYY-MM-DD)
const getAllSchedules = async (req, res) => {
  try {
    const { date } = req.query;
    let result;
    if (date) {
      result = await pool.query(
        `SELECT s.schedule_id, s.train_number, s.station_code, s.platform_id,
                s.schedule_date::text AS schedule_date, s.arrival_time, s.departure_time,
                t.train_name, st.station_name
         FROM schedule s
         JOIN train t ON t.train_number = s.train_number
         JOIN station st ON st.station_code = s.station_code
         WHERE s.schedule_date = $1
         ORDER BY s.schedule_date, COALESCE(s.departure_time, s.arrival_time)`,
        [date]
      );
    } else {
      result = await pool.query(
        `SELECT s.schedule_id, s.train_number, s.station_code, s.platform_id,
                s.schedule_date::text AS schedule_date, s.arrival_time, s.departure_time,
                t.train_name, st.station_name
         FROM schedule s
         JOIN train t ON t.train_number = s.train_number
         JOIN station st ON st.station_code = s.station_code
         ORDER BY s.schedule_date, COALESCE(s.departure_time, s.arrival_time)`
      );
    }
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch schedules' });
  }
};

// GET single schedule by id
const getScheduleById = async (req, res) => {
  try {
    const { scheduleId } = req.params;
    const result = await pool.query(
      `SELECT s.schedule_id, s.train_number, s.station_code, s.platform_id,
              s.schedule_date::text AS schedule_date, s.arrival_time, s.departure_time,
              t.train_name, st.station_name
       FROM schedule s
       JOIN train t ON t.train_number = s.train_number
       JOIN station st ON st.station_code = s.station_code
       WHERE s.schedule_id = $1`,
      [scheduleId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Schedule not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch schedule' });
  }
};

// GET all schedules for a specific train
const getSchedulesByTrain = async (req, res) => {
  try {
    const { trainNumber } = req.params;
    const result = await pool.query(
      `SELECT s.schedule_id, s.train_number, s.station_code, s.platform_id,
              s.schedule_date::text AS schedule_date, s.arrival_time, s.departure_time,
              st.station_name
       FROM schedule s
       JOIN station st ON st.station_code = s.station_code
       WHERE s.train_number = $1
       ORDER BY s.schedule_date, COALESCE(s.departure_time, s.arrival_time)`,
      [trainNumber]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch train schedules' });
  }
};

// POST create a new schedule entry
const createSchedule = async (req, res) => {
  try {
    const { train_number, station_code, platform_id, schedule_date, arrival_time, departure_time } = req.body;
    const result = await pool.query(
      `INSERT INTO schedule (train_number, station_code, platform_id, schedule_date, arrival_time, departure_time)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [train_number, station_code, platform_id, schedule_date, arrival_time, departure_time]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

// PUT update an existing schedule entry
const updateSchedule = async (req, res) => {
  try {
    const { scheduleId } = req.params;
    const { platform_id, schedule_date, arrival_time, departure_time } = req.body;
    const result = await pool.query(
      `UPDATE schedule
       SET platform_id = $1, schedule_date = $2, arrival_time = $3, departure_time = $4
       WHERE schedule_id = $5
       RETURNING *`,
      [platform_id, schedule_date, arrival_time, departure_time, scheduleId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Schedule not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

// DELETE a schedule entry
const deleteSchedule = async (req, res) => {
  try {
    const { scheduleId } = req.params;
    const result = await pool.query(
      'DELETE FROM schedule WHERE schedule_id = $1 RETURNING *',
      [scheduleId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Schedule not found' });
    }
    res.json({ message: 'Schedule deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete schedule' });
  }
};

module.exports = {
  getAllSchedules,
  getScheduleById,
  getSchedulesByTrain,
  createSchedule,
  updateSchedule,
  deleteSchedule,
};