import { useEffect, useState } from 'react';
import { getPassengers, createPassenger, getPassengerTickets } from '../services/api';

const emptyForm = { first_name: '', last_name: '', phone: '', email: '' };

function Passengers() {
  const [passengers, setPassengers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [tickets, setTickets] = useState({});

  const loadPassengers = () => {
    getPassengers().then(setPassengers).catch((err) => setError(err.message));
  };

  useEffect(() => {
    loadPassengers();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await createPassenger(form);
      setForm(emptyForm);
      loadPassengers();
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleExpand = async (passengerId) => {
    if (expanded === passengerId) {
      setExpanded(null);
      return;
    }
    setExpanded(passengerId);
    if (!tickets[passengerId]) {
      try {
        const data = await getPassengerTickets(passengerId);
        setTickets((prev) => ({ ...prev, [passengerId]: data }));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  return (
    <div>
      <h1>Passengers</h1>
      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
        <input name="first_name" placeholder="First Name" value={form.first_name} onChange={handleChange} required />
        <input name="last_name" placeholder="Last Name" value={form.last_name} onChange={handleChange} required />
        <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} />
        <button type="submit">Add Passenger</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Tickets</th>
          </tr>
        </thead>
        <tbody>
          {passengers.map((p) => (
            <>
              <tr key={p.passenger_id}>
                <td>{p.first_name} {p.last_name}</td>
                <td>{p.phone}</td>
                <td>{p.email}</td>
                <td>
                  <button onClick={() => toggleExpand(p.passenger_id)}>
                    {expanded === p.passenger_id ? 'Hide' : 'View'}
                  </button>
                </td>
              </tr>
              {expanded === p.passenger_id && (
                <tr>
                  <td colSpan="4">
                    {tickets[p.passenger_id] ? (
                      tickets[p.passenger_id].length > 0 ? (
                        <ul>
                          {tickets[p.passenger_id].map((t) => (
                            <li key={t.ticket_id}>
                              {t.train_name} ({t.train_number}) — {t.journey_date} — ₹{t.fare} — {t.ticket_status}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>No tickets booked.</p>
                      )
                    ) : (
                      <p>Loading tickets...</p>
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

export default Passengers;