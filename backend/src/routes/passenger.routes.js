const express = require('express');
const router = express.Router();
const {
  getAllPassengers,
  getPassengerById,
  createPassenger,
  updatePassenger,
  deletePassenger,
  getPassengerTickets,
} = require('../controllers/passenger.controller');

router.get('/', getAllPassengers);
router.get('/:passengerId', getPassengerById);
router.get('/:passengerId/tickets', getPassengerTickets);
router.post('/', createPassenger);
router.put('/:passengerId', updatePassenger);
router.delete('/:passengerId', deletePassenger);

module.exports = router;