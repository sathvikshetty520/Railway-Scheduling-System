import { useEffect, useState } from 'react';
import { getSchedules } from '../services/api';

function Schedules() {
  const [schedules, setSchedules] = useState([]);
  const [dateFilter, setDateFilter] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadSchedules = (date) => {
    setLoading(true);
    getSchedules(date)
      .then(setSchedules)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadSchedules();
  }, []);

  const handleFilter = (e) => {
    e.preventDefault();
    loadSchedules(dateFilter || undefined);
  };

  const handleClear = () => {
    setDateFilter('');
    loadSchedules();
  };

  return (
    <div>
      <h1>Schedules</h1>
      {error && <p className="error">{error}</p>}

      <form onSubmit={handleFilter} style={{ marginBottom: 20 }}>
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        />
        <button type="submit">Filter</button>
        <button type="button" onClick={handleClear}>Clear</button>
      </form>

      {loading ? (
        <div className="loading-wrap"><span className="spinner"></span>Loading schedules...</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Train</th>
              <th>Station</th>
              <th>Date</th>
              <th>Arrival</th>
              <th>Departure</th>
            </tr>
          </thead>
          <tbody>
            {schedules.map((s) => (
              <tr key={s.schedule_id}>
                <td>{s.train_name} ({s.train_number})</td>
                <td>{s.station_name}</td>
                <td>{s.schedule_date}</td>
                <td>{s.arrival_time || '—'}</td>
                <td>{s.departure_time || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Schedules;