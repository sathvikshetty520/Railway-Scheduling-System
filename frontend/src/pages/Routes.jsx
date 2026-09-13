import { useEffect, useState } from 'react';
import { getRoutes, getRouteStations, getRouteTrains } from '../services/api';

function Routes() {
  const [routes, setRoutes] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [routeStations, setRouteStations] = useState({});
  const [routeTrains, setRouteTrains] = useState({});

  useEffect(() => {
    getRoutes()
      .then(setRoutes)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const toggleExpand = async (routeId) => {
    if (expanded === routeId) {
      setExpanded(null);
      return;
    }
    setExpanded(routeId);
    try {
      if (!routeStations[routeId]) {
        const stations = await getRouteStations(routeId);
        setRouteStations((prev) => ({ ...prev, [routeId]: stations }));
      }
      if (!routeTrains[routeId]) {
        const trains = await getRouteTrains(routeId);
        setRouteTrains((prev) => ({ ...prev, [routeId]: trains }));
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1>Routes</h1>
      {error && <p className="error">{error}</p>}

      {loading ? (
        <div className="loading-wrap"><span className="spinner"></span>Loading routes...</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Route</th>
              <th>Total Distance (km)</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {routes.map((route) => (
              <>
                <tr key={route.route_id}>
                  <td>{route.route_name}</td>
                  <td>{route.total_distance}</td>
                  <td>
                    <button onClick={() => toggleExpand(route.route_id)}>
                      {expanded === route.route_id ? 'Hide' : 'View'}
                    </button>
                  </td>
                </tr>
                {expanded === route.route_id && (
                  <tr>
                    <td colSpan="3">
                      <strong>Stations on this route:</strong>
                      {routeStations[route.route_id] ? (
                        <ol>
                          {routeStations[route.route_id].map((s) => (
                            <li key={s.station_code}>
                              {s.station_name} ({s.station_code}) — {s.distance_from_origin} km
                            </li>
                          ))}
                        </ol>
                      ) : (
                        <div className="loading-wrap"><span className="spinner"></span>Loading stations...</div>
                      )}

                      <strong>Trains operating on this route:</strong>
                      {routeTrains[route.route_id] ? (
                        routeTrains[route.route_id].length > 0 ? (
                          <ul>
                            {routeTrains[route.route_id].map((t) => (
                              <li key={t.train_number}>
                                {t.train_name} ({t.train_number}) — {t.status}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p>No trains assigned.</p>
                        )
                      ) : (
                        <div className="loading-wrap"><span className="spinner"></span>Loading trains...</div>
                      )}
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Routes;