const API_BASE = 'http://localhost:5000/api';

async function handleResponse(res) {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Request failed');
  }
  return data;
}

// TRAINS
export const getTrains = () => fetch(`${API_BASE}/trains`).then(handleResponse);
export const getTrain = (trainNumber) => fetch(`${API_BASE}/trains/${trainNumber}`).then(handleResponse);
export const createTrain = (data) =>
  fetch(`${API_BASE}/trains`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(handleResponse);
export const updateTrain = (trainNumber, data) =>
  fetch(`${API_BASE}/trains/${trainNumber}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(handleResponse);
export const deleteTrain = (trainNumber) =>
  fetch(`${API_BASE}/trains/${trainNumber}`, { method: 'DELETE' }).then(handleResponse);

// STATIONS
export const getStations = () => fetch(`${API_BASE}/stations`).then(handleResponse);
export const getStationPlatforms = (stationCode) =>
  fetch(`${API_BASE}/stations/${stationCode}/platforms`).then(handleResponse);

// ROUTES
export const getRoutes = () => fetch(`${API_BASE}/routes`).then(handleResponse);
export const getRouteStations = (routeId) => fetch(`${API_BASE}/routes/${routeId}/stations`).then(handleResponse);
export const getRouteTrains = (routeId) => fetch(`${API_BASE}/routes/${routeId}/trains`).then(handleResponse);

// SCHEDULES
export const getSchedules = (date) =>
  fetch(`${API_BASE}/schedules${date ? `?date=${date}` : ''}`).then(handleResponse);
export const getSchedulesByTrain = (trainNumber) =>
  fetch(`${API_BASE}/schedules/train/${trainNumber}`).then(handleResponse);

// PASSENGERS
export const getPassengers = () => fetch(`${API_BASE}/passengers`).then(handleResponse);
export const getPassengerTickets = (passengerId) =>
  fetch(`${API_BASE}/passengers/${passengerId}/tickets`).then(handleResponse);
export const createPassenger = (data) =>
  fetch(`${API_BASE}/passengers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(handleResponse);

// TICKETS
export const getTickets = () => fetch(`${API_BASE}/tickets`).then(handleResponse);
export const bookTicket = (data) =>
  fetch(`${API_BASE}/tickets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(handleResponse);
export const updateTicketStatus = (ticketId, ticket_status) =>
  fetch(`${API_BASE}/tickets/${ticketId}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ticket_status }),
  }).then(handleResponse);

// DELAYS
export const getDelays = () => fetch(`${API_BASE}/delays`).then(handleResponse);
export const recordDelay = (data) =>
  fetch(`${API_BASE}/delays`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(handleResponse);

// REPORTS
export const getDashboardSummary = () => fetch(`${API_BASE}/reports/dashboard-summary`).then(handleResponse);
export const getTrainsByDelayCount = () => fetch(`${API_BASE}/reports/trains-by-delay-count`).then(handleResponse);
export const getRevenuePerTrain = () => fetch(`${API_BASE}/reports/revenue-per-train`).then(handleResponse);
export const getLongestDelays = () => fetch(`${API_BASE}/reports/longest-delays`).then(handleResponse);