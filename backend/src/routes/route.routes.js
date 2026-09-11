const express = require('express');
const router = express.Router();
const {
  getAllRoutes,
  getRouteById,
  createRoute,
  updateRoute,
  deleteRoute,
  getRouteStations,
  getRouteTrains,
  addStationToRoute,
  addTrainToRoute,
} = require('../controllers/route.controller');

router.get('/', getAllRoutes);
router.get('/:routeId', getRouteById);
router.get('/:routeId/stations', getRouteStations);
router.get('/:routeId/trains', getRouteTrains);
router.post('/', createRoute);
router.post('/:routeId/stations', addStationToRoute);
router.post('/:routeId/trains', addTrainToRoute);
router.put('/:routeId', updateRoute);
router.delete('/:routeId', deleteRoute);

module.exports = router;