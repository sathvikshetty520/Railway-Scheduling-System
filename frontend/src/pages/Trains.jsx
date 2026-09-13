import { useEffect, useState } from 'react';
import { getTrains, createTrain, updateTrain, deleteTrain } from '../services/api';
import ConfirmModal from '../components/ConfirmModal';

const emptyForm = { train_number: '', train_name: '', train_type: 'Express', capacity: '', status: 'Active' };

function Trains() {
  const [trains, setTrains] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmTarget, setConfirmTarget] = useState(null);

  const loadTrains = () => {
    setLoading(true);
    getTrains()
      .then(setTrains)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadTrains();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (editing) {
        await updateTrain(form.train_number, form);
      } else {
        await createTrain(form);
      }
      setForm(emptyForm);
      setEditing(false);
      loadTrains();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (train) => {
    setForm(train);
    setEditing(true);
  };

  const handleCancel = () => {
    setForm(emptyForm);
    setEditing(false);
  };

  const handleDeleteConfirmed = async () => {
    const trainNumber = confirmTarget;
    setConfirmTarget(null);
    try {
      await deleteTrain(trainNumber);
      loadTrains();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1>Trains</h1>
      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
        <input
          name="train_number"
          placeholder="Train Number"
          value={form.train_number}
          onChange={handleChange}
          disabled={editing}
          required
        />
        <input
          name="train_name"
          placeholder="Train Name"
          value={form.train_name}
          onChange={handleChange}
          required
        />
        <select name="train_type" value={form.train_type} onChange={handleChange}>
          <option>Express</option>
          <option>Superfast</option>
          <option>Passenger</option>
          <option>Suburban</option>
          <option>Freight</option>
        </select>
        <input
          name="capacity"
          type="number"
          placeholder="Capacity"
          value={form.capacity}
          onChange={handleChange}
          required
        />
        <select name="status" value={form.status} onChange={handleChange}>
          <option>Active</option>
          <option>Delayed</option>
          <option>Cancelled</option>
          <option>Maintenance</option>
        </select>
        <button type="submit">{editing ? 'Update Train' : 'Add Train'}</button>
        {editing && <button type="button" onClick={handleCancel}>Cancel</button>}
      </form>

      {loading ? (
        <div className="loading-wrap"><span className="spinner"></span>Loading trains...</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Train No.</th>
              <th>Name</th>
              <th>Type</th>
              <th>Capacity</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {trains.map((train) => (
              <tr key={train.train_number}>
                <td>{train.train_number}</td>
                <td>{train.train_name}</td>
                <td>{train.train_type}</td>
                <td>{train.capacity}</td>
                <td>{train.status}</td>
                <td>
                  <button onClick={() => handleEdit(train)}>Edit</button>
                  <button onClick={() => setConfirmTarget(train.train_number)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <ConfirmModal
        message={confirmTarget ? `Delete train ${confirmTarget}?` : null}
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setConfirmTarget(null)}
      />
    </div>
  );
}

export default Trains;