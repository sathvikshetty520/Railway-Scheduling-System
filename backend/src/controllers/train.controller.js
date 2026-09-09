const pool = require('../config/db');

// GET all trains
const getAllTrains = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM train ORDER BY train_number');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch trains' });
  }
};

// GET single train by train_number
const getTrainByNumber = async (req, res) => {
  try {
    const { trainNumber } = req.params;
    const result = await pool.query(
      'SELECT * FROM train WHERE train_number = $1',
      [trainNumber]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Train not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch train' });
  }
};

// POST create a new train
const createTrain = async (req, res) => {
  try {
    const { train_number, train_name, train_type, capacity, status } = req.body;
    const result = await pool.query(
      `INSERT INTO train (train_number, train_name, train_type, capacity, status)
       VALUES ($1, $2, $3, $4, COALESCE($5, 'Active'))
       RETURNING *`,
      [train_number, train_name, train_type, capacity, status]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

// PUT update an existing train
const updateTrain = async (req, res) => {
  try {
    const { trainNumber } = req.params;
    const { train_name, train_type, capacity, status } = req.body;
    const result = await pool.query(
      `UPDATE train
       SET train_name = $1, train_type = $2, capacity = $3, status = $4
       WHERE train_number = $5
       RETURNING *`,
      [train_name, train_type, capacity, status, trainNumber]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Train not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

// DELETE a train
const deleteTrain = async (req, res) => {
  try {
    const { trainNumber } = req.params;
    const result = await pool.query(
      'DELETE FROM train WHERE train_number = $1 RETURNING *',
      [trainNumber]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Train not found' });
    }
    res.json({ message: 'Train deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete train' });
  }
};

module.exports = {
  getAllTrains,
  getTrainByNumber,
  createTrain,
  updateTrain,
  deleteTrain,
};