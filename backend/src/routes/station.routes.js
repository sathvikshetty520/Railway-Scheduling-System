const express = require('express');
const router = express.Router();
const {
  getAllStations,
  getStationByCode,
  createStation,
  updateStation,
  deleteStation,
  getStationPlatforms,
} = require('../controllers/station.controller');

router.get('/', getAllStations);
router.get('/:stationCode', getStationByCode);
router.get('/:stationCode/platforms', getStationPlatforms);
router.post('/', createStation);
router.put('/:stationCode', updateStation);
router.delete('/:stationCode', deleteStation);

module.exports = router;