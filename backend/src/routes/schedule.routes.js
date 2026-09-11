const express = require('express');
const router = express.Router();
const {
  getAllSchedules,
  getScheduleById,
  getSchedulesByTrain,
  createSchedule,
  updateSchedule,
  deleteSchedule,
} = require('../controllers/schedule.controller');

router.get('/', getAllSchedules);
router.get('/:scheduleId', getScheduleById);
router.get('/train/:trainNumber', getSchedulesByTrain);
router.post('/', createSchedule);
router.put('/:scheduleId', updateSchedule);
router.delete('/:scheduleId', deleteSchedule);

module.exports = router;