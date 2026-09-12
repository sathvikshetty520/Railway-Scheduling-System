const pool = require('../config/db');

// GET all tickets
const getAllTickets = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT tk.ticket_id, tk.passenger_id, p.first_name, p.last_name,
              tk.train_number, t.train_name, tk.booking_date::text,
              tk.journey_date::text, tk.fare, tk.ticket_status
       FROM ticket tk
       JOIN passenger p ON p.passenger_id = tk.passenger_id
       JOIN train t ON t.train_number = tk.train_number
       ORDER BY tk.ticket_id`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
};

// GET single ticket by id
const getTicketById = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const result = await pool.query(
      `SELECT tk.ticket_id, tk.passenger_id, p.first_name, p.last_name,
              tk.train_number, t.train_name, tk.booking_date::text,
              tk.journey_date::text, tk.fare, tk.ticket_status
       FROM ticket tk
       JOIN passenger p ON p.passenger_id = tk.passenger_id
       JOIN train t ON t.train_number = tk.train_number
       WHERE tk.ticket_id = $1`,
      [ticketId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch ticket' });
  }
};

// POST book a new ticket — uses the book_ticket() DB function so the
// validation + insert runs as a single safe transaction
const bookTicket = async (req, res) => {
  try {
    const { passenger_id, train_number, journey_date, fare } = req.body;
    const result = await pool.query(
      'SELECT book_ticket($1, $2, $3, $4) AS ticket_id',
      [passenger_id, train_number, journey_date, fare]
    );
    const ticketId = result.rows[0].ticket_id;

    const ticket = await pool.query(
      `SELECT ticket_id, passenger_id, train_number, booking_date::text,
              journey_date::text, fare, ticket_status
       FROM ticket WHERE ticket_id = $1`,
      [ticketId]
    );
    res.status(201).json(ticket.rows[0]);
  } catch (err) {
    console.error(err);
    // book_ticket() raises a clear exception message for bad train/passenger IDs
    res.status(400).json({ error: err.message });
  }
};

// PUT update ticket status (e.g. cancel a ticket)
const updateTicketStatus = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { ticket_status } = req.body;
    const result = await pool.query(
      `UPDATE ticket
       SET ticket_status = $1
       WHERE ticket_id = $2
       RETURNING ticket_id, passenger_id, train_number, booking_date::text,
                 journey_date::text, fare, ticket_status`,
      [ticket_status, ticketId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

// DELETE a ticket
const deleteTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const result = await pool.query(
      'DELETE FROM ticket WHERE ticket_id = $1 RETURNING *',
      [ticketId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    res.json({ message: 'Ticket deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete ticket' });
  }
};

// GET total revenue for a train — uses the total_revenue_for_train() DB function
const getTrainRevenue = async (req, res) => {
  try {
    const { trainNumber } = req.params;
    const result = await pool.query(
      'SELECT total_revenue_for_train($1) AS total_revenue',
      [trainNumber]
    );
    res.json({ train_number: trainNumber, total_revenue: result.rows[0].total_revenue });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to calculate revenue' });
  }
};

module.exports = {
  getAllTickets,
  getTicketById,
  bookTicket,
  updateTicketStatus,
  deleteTicket,
  getTrainRevenue,
};