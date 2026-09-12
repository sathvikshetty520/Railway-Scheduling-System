const express = require('express');
const router = express.Router();
const {
  getAllTickets,
  getTicketById,
  bookTicket,
  updateTicketStatus,
  deleteTicket,
  getTrainRevenue,
} = require('../controllers/ticket.controller');

router.get('/', getAllTickets);
router.get('/:ticketId', getTicketById);
router.get('/revenue/:trainNumber', getTrainRevenue);
router.post('/', bookTicket);
router.put('/:ticketId/status', updateTicketStatus);
router.delete('/:ticketId', deleteTicket);

module.exports = router;