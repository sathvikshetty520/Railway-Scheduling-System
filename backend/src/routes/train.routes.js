const express = require('express');
const router = express.Router();
const {
  getAllTrains,
  getTrainByNumber,
  createTrain,
  updateTrain,
  deleteTrain,
} = require('../controllers/train.controller');

router.get('/', getAllTrains);
router.get('/:trainNumber', getTrainByNumber);
router.post('/', createTrain);
router.put('/:trainNumber', updateTrain);
router.delete('/:trainNumber', deleteTrain);

module.exports = router;