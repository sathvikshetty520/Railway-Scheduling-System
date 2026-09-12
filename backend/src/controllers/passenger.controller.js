const pool = require('../config/db');

// GET all passengers
const getAllPassengers = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM passenger ORDER BY passenger_id');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch passengers' });
  }
};

// GET single passenger by id
const getPassengerById = async (req, res) => {
  try {
    const { passengerId } = req.params;
    const result = await pool.query(
      'SELECT * FROM passenger WHERE passenger_id = $1',
      [passengerId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Passenger not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch passenger' });
  }
};

// POST create a new passenger
const createPassenger = async (req, res) => {
  try {
    const { first_name, last_name, phone, email } = req.body;
    const result = await pool.query(
      `INSERT INTO passenger (first_name, last_name, phone, email)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [first_name, last_name, phone, email]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

// PUT update an existing passenger
const updatePassenger = async (req, res) => {
  try {
    const { passengerId } = req.params;
    const { first_name, last_name, phone, email } = req.body;
    const result = await pool.query(
      `UPDATE passenger
       SET first_name = $1, last_name = $2, phone = $3, email = $4
       WHERE passenger_id = $5
       RETURNING *`,
      [first_name, last_name, phone, email, passengerId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Passenger not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

// DELETE a passenger
const deletePassenger = async (req, res) => {
  try {
    const { passengerId } = req.params;
    const result = await pool.query(
      'DELETE FROM passenger WHERE passenger_id = $1 RETURNING *',
      [passengerId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Passenger not found' });
    }
    res.json({ message: 'Passenger deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete passenger' });
  }
};

// GET all tickets booked by a passenger
const getPassengerTickets = async (req, res) => {
  try {
    const { passengerId } = req.params;
    const result = await pool.query(
      `SELECT tk.ticket_id, tk.train_number, t.train_name, tk.booking_date::text,
              tk.journey_date::text, tk.fare, tk.ticket_status
       FROM ticket tk
       JOIN train t ON t.train_number = tk.train_number
       WHERE tk.passenger_id = $1
       ORDER BY tk.journey_date`,
      [passengerId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch passenger tickets' });
  }
};

module.exports = {
  getAllPassengers,
  getPassengerById,
  createPassenger,
  updatePassenger,
  deletePassenger,
  getPassengerTickets,
};