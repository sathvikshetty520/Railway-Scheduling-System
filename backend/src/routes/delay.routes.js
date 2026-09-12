const express = require('express');
const router = express.Router();
const {
  getAllDelays,
  getDelayById,
  getDelaysByTrain,
  recordDelay,
} = require('../controllers/delay.controller');

router.get('/', getAllDelays);
router.get('/:delayId', getDelayById);
router.get('/train/:trainNumber', getDelaysByTrain);
router.post('/', recordDelay);

module.exports = router;