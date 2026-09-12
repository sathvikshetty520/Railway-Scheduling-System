import { useEffect, useState } from 'react';
import { getTickets, bookTicket, updateTicketStatus, getPassengers, getTrains } from '../services/api';

const emptyForm = { passenger_id: '', train_number: '', journey_date: '', fare: '' };

function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [passengers, setPassengers] = useState([]);
  const [trains, setTrains] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const loadTickets = () => {
    getTickets().then(setTickets).catch((err) => setError(err.message));
  };

  useEffect(() => {
    loadTickets();
    getPassengers().then(setPassengers).catch((err) => setError(err.message));
    getTrains().then(setTrains).catch((err) => setError(err.message));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      const newTicket = await bookTicket(form);
      setSuccess(`Ticket #${newTicket.ticket_id} booked successfully.`);
      setForm(emptyForm);
      loadTickets();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancel = async (ticketId) => {
    if (!window.confirm('Cancel this ticket?')) return;
    try {
      await updateTicketStatus(ticketId, 'Cancelled');
      loadTickets();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1>Tickets</h1>
      {error && <p className="error">{error}</p>}
      {success && <p style={{ color: '#16a34a' }}>{success}</p>}

      <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
        <select name="passenger_id" value={form.passenger_id} onChange={handleChange} required>
          <option value="">Select Passenger</option>
          {passengers.map((p) => (
            <option key={p.passenger_id} value={p.passenger_id}>
              {p.first_name} {p.last_name}
            </option>
          ))}
        </select>
        <select name="train_number" value={form.train_number} onChange={handleChange} required>
          <option value="">Select Train</option>
          {trains.map((t) => (
            <option key={t.train_number} value={t.train_number}>
              {t.train_name} ({t.train_number})
            </option>
          ))}
        </select>
        <input
          name="journey_date"
          type="date"
          value={form.journey_date}
          onChange={handleChange}
          required
        />
        <input
          name="fare"
          type="number"
          step="0.01"
          placeholder="Fare"
          value={form.fare}
          onChange={handleChange}
          required
        />
        <button type="submit">Book Ticket</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Ticket ID</th>
            <th>Passenger</th>
            <th>Train</th>
            <th>Journey Date</th>
            <th>Fare</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((t) => (
            <tr key={t.ticket_id}>
              <td>{t.ticket_id}</td>
              <td>{t.first_name} {t.last_name}</td>
              <td>{t.train_name} ({t.train_number})</td>
              <td>{t.journey_date}</td>
              <td>₹{t.fare}</td>
              <td>{t.ticket_status}</td>
              <td>
                {t.ticket_status !== 'Cancelled' && (
                  <button onClick={() => handleCancel(t.ticket_id)}>Cancel</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Tickets;