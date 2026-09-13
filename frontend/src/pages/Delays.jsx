import { useEffect, useState } from 'react';
import { getDelays, recordDelay, getTrains, getStations } from '../services/api';

const emptyForm = { train_number: '', station_code: '', delay_minutes: '', reason: '' };

function Delays() {
  const [delays, setDelays] = useState([]);
  const [trains, setTrains] = useState([]);
  const [stations, setStations] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState(null);
  const [impact, setImpact] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadDelays = () => {
    setLoading(true);
    getDelays()
      .then(setDelays)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadDelays();
    getTrains().then(setTrains).catch((err) => setError(err.message));
    getStations().then(setStations).catch((err) => setError(err.message));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setImpact(null);
    try {
      const result = await recordDelay(form);
      setImpact(result);
      setForm(emptyForm);
      loadDelays();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1>Delays</h1>
      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
        <select name="train_number" value={form.train_number} onChange={handleChange} required>
          <option value="">Select Train</option>
          {trains.map((t) => (
            <option key={t.train_number} value={t.train_number}>
              {t.train_name} ({t.train_number})
            </option>
          ))}
        </select>
        <select name="station_code" value={form.station_code} onChange={handleChange} required>
          <option value="">Select Station</option>
          {stations.map((s) => (
            <option key={s.station_code} value={s.station_code}>
              {s.station_name}
            </option>
          ))}
        </select>
        <input
          name="delay_minutes"
          type="number"
          placeholder="Delay (minutes)"
          value={form.delay_minutes}
          onChange={handleChange}
          required
        />
        <input
          name="reason"
          placeholder="Reason"
          value={form.reason}
          onChange={handleChange}
        />
        <button type="submit">Record Delay</button>
      </form>

      {impact && (
        <div className="card" style={{ marginBottom: 24 }}>
          <p><strong>Delay recorded.</strong> Train {impact.train_status.train_number} is now <strong>{impact.train_status.status}</strong>.</p>
          <p><strong>Affected schedules:</strong></p>
          {impact.affected_schedules.length === 0 ? (
            <p>No upcoming schedules affected.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Station</th>
                  <th>Date</th>
                  <th>Arrival (orig → updated)</th>
                  <th>Departure (orig → updated)</th>
                </tr>
              </thead>
              <tbody>
                {impact.affected_schedules.map((s) => (
                  <tr key={s.schedule_id}>
                    <td>{s.station_code}</td>
                    <td>{s.schedule_date}</td>
                    <td>{s.original_arrival || '—'} → {s.updated_arrival || '—'}</td>
                    <td>{s.original_departure || '—'} → {s.updated_departure || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      <h2>Delay History</h2>
      {loading ? (
        <div className="loading-wrap"><span className="spinner"></span>Loading delays...</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Train</th>
              <th>Station</th>
              <th>Minutes</th>
              <th>Reason</th>
              <th>Recorded</th>
            </tr>
          </thead>
          <tbody>
            {delays.map((d) => (
              <tr key={d.delay_id}>
                <td>{d.train_name} ({d.train_number})</td>
                <td>{d.station_name}</td>
                <td>{d.delay_minutes}</td>
                <td>{d.reason}</td>
                <td>{new Date(d.recorded_time).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Delays;