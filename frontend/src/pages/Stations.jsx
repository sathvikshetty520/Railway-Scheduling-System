import { useEffect, useState } from 'react';
import { getStations, getStationPlatforms } from '../services/api';

function Stations() {
  const [stations, setStations] = useState([]);
  const [error, setError] = useState(null);
  const [platforms, setPlatforms] = useState({});
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    getStations().then(setStations).catch((err) => setError(err.message));
  }, []);

  const toggleExpand = async (stationCode) => {
    if (expanded === stationCode) {
      setExpanded(null);
      return;
    }
    setExpanded(stationCode);
    if (!platforms[stationCode]) {
      try {
        const data = await getStationPlatforms(stationCode);
        setPlatforms((prev) => ({ ...prev, [stationCode]: data }));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  return (
    <div>
      <h1>Stations</h1>
      {error && <p className="error">{error}</p>}

      <table>
        <thead>
          <tr>
            <th>Code</th>
            <th>Name</th>
            <th>City</th>
            <th>State</th>
            <th>Platforms</th>
          </tr>
        </thead>
        <tbody>
          {stations.map((station) => (
            <>
              <tr key={station.station_code}>
                <td>{station.station_code}</td>
                <td>{station.station_name}</td>
                <td>{station.city}</td>
                <td>{station.state}</td>
                <td>
                  <button onClick={() => toggleExpand(station.station_code)}>
                    {expanded === station.station_code ? 'Hide' : 'View'}
                  </button>
                </td>
              </tr>
              {expanded === station.station_code && (
                <tr>
                  <td colSpan="5">
                    {platforms[station.station_code] ? (
                      <ul>
                        {platforms[station.station_code].map((p) => (
                          <li key={p.platform_id}>
                            Platform {p.platform_number} ({p.platform_type})
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>Loading platforms...</p>
                    )}
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Stations;