import { useEffect, useState } from 'react';
import { getTrainsByDelayCount, getRevenuePerTrain, getLongestDelays } from '../services/api';

function Reports() {
  const [delayStats, setDelayStats] = useState([]);
  const [revenue, setRevenue] = useState([]);
  const [longestDelays, setLongestDelays] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    getTrainsByDelayCount().then(setDelayStats).catch((err) => setError(err.message));
    getRevenuePerTrain().then(setRevenue).catch((err) => setError(err.message));
    getLongestDelays().then(setLongestDelays).catch((err) => setError(err.message));
  }, []);

  return (
    <div>
      <h1>Reports</h1>
      {error && <p className="error">{error}</p>}

      <h2>Revenue per Train</h2>
      <table>
        <thead>
          <tr>
            <th>Train</th>
            <th>Tickets Sold</th>
            <th>Revenue</th>
          </tr>
        </thead>
        <tbody>
          {revenue.map((r) => (
            <tr key={r.train_number}>
              <td>{r.train_name} ({r.train_number})</td>
              <td>{r.tickets_sold}</td>
              <td>₹{r.revenue}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={{ marginTop: 32 }}>Trains by Delay Count</h2>
      <table>
        <thead>
          <tr>
            <th>Train</th>
            <th>Delay Count</th>
            <th>Total Delay (minutes)</th>
          </tr>
        </thead>
        <tbody>
          {delayStats.map((d) => (
            <tr key={d.train_number}>
              <td>{d.train_name} ({d.train_number})</td>
              <td>{d.delay_count}</td>
              <td>{d.total_delay_minutes}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={{ marginTop: 32 }}>Longest Delays</h2>
      <table>
        <thead>
          <tr>
            <th>Train</th>
            <th>Station</th>
            <th>Minutes</th>
            <th>Reason</th>
          </tr>
        </thead>
        <tbody>
          {longestDelays.map((d) => (
            <tr key={d.delay_id}>
              <td>{d.train_name} ({d.train_number})</td>
              <td>{d.station_name}</td>
              <td>{d.delay_minutes}</td>
              <td>{d.reason}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Reports;