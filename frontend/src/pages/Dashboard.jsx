import { useEffect, useState } from 'react';
import { getDashboardSummary } from '../services/api';

function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getDashboardSummary()
      .then(setSummary)
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <p className="error">Error: {error}</p>;
  if (!summary) {
    return <div className="loading-wrap"><span className="spinner"></span>Loading dashboard...</div>;
  }

  const cards = [
    { label: 'Total Trains', value: summary.total_trains },
    { label: 'Total Stations', value: summary.total_stations },
    { label: 'Active Trains', value: summary.active_trains },
    { label: 'Delayed Trains', value: summary.delayed_trains },
    { label: 'Tickets Booked Today', value: summary.tickets_booked_today },
    { label: 'Total Revenue', value: `₹${summary.total_revenue}` },
  ];

  return (
    <div>
      <h1>Dashboard</h1>
      <div className="card-grid">
        {cards.map((card) => (
          <div className="card" key={card.label}>
            <p className="card-label">{card.label}</p>
            <p className="card-value">{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;