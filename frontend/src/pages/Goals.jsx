import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ show: false, message: '', type: 'danger' });

  // New Goal Form
  const [formData, setFormData] = useState({
    title: '',
    targetReduction: 10,
    targetDate: '',
  });

  const [submitting, setSubmitting] = useState(false);

  // Load user goals
  const fetchGoals = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/goals');
      if (res.data.success) {
        setGoals(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching goals:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateGoal = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.targetDate) {
      setAlert({ show: true, message: 'Please provide all details.', type: 'danger' });
      return;
    }

    try {
      setSubmitting(true);
      setAlert({ show: false, message: '', type: 'danger' });
      const res = await axios.post('/goals', formData);
      if (res.data.success) {
        setGoals([res.data.data, ...goals]);
        setFormData({ title: '', targetReduction: 10, targetDate: '' });
        setAlert({ show: true, message: 'Goal added successfully!', type: 'success' });
      }
    } catch (error) {
      setAlert({ show: true, message: error.response?.data?.message || 'Error creating goal.', type: 'danger' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleProgressChange = async (goalId, newProgress) => {
    try {
      const res = await axios.put(`/goals/${goalId}`, { currentProgress: newProgress });
      if (res.data.success) {
        // Update local state
        setGoals(goals.map((g) => (g._id === goalId ? res.data.data : g)));
      }
    } catch (error) {
      console.error('Error updating goal progress:', error);
    }
  };

  const handleDeleteGoal = async (goalId) => {
    if (!window.confirm('Are you sure you want to remove this goal?')) return;
    try {
      const res = await axios.delete(`/goals/${goalId}`);
      if (res.data.success) {
        setGoals(goals.filter((g) => g._id !== goalId));
      }
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };

  return (
    <div className="container py-5 fade-in-up">
      <div className="text-center mb-5">
        <span className="badge bg-success bg-opacity-25 text-success border border-success border-opacity-50 px-3 py-2 rounded-pill mb-2 fw-bold">
          TARGET SETTING
        </span>
        <h1 className="text-dark">Sustainability Targets</h1>
        <p className="text-muted">Set specific carbon reduction milestones and watch your green progress grow.</p>
      </div>

      <div className="row g-4">
        {/* Create Goal Form */}
        <div className="col-md-5">
          <div className="card glass-card border-0 p-4 h-100">
            <h4 className="text-dark mb-3"><i className="bi bi-bullseye text-success me-2"></i> Add Reduction Goal</h4>
            {alert.show && (
              <div className={`alert alert-${alert.type} small`} role="alert">
                {alert.message}
              </div>
            )}
            <form onSubmit={handleCreateGoal}>
              <div className="mb-3">
                <label className="form-label small fw-semibold text-muted">Goal Title</label>
                <input
                  type="text"
                  name="title"
                  className="form-control form-control-eco"
                  placeholder="e.g. Reduce driving by 20%"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold text-muted">Target Carbon Reduction: {formData.targetReduction}%</label>
                <input
                  type="range"
                  name="targetReduction"
                  className="form-range"
                  min="5"
                  max="100"
                  step="5"
                  value={formData.targetReduction}
                  onChange={handleChange}
                />
                <div className="d-flex justify-content-between text-muted small">
                  <span>5% (Starter)</span>
                  <span>50% (Eco Active)</span>
                  <span>100% (Carbon Zero)</span>
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label small fw-semibold text-muted">Target Completion Date</label>
                <input
                  type="date"
                  name="targetDate"
                  className="form-control form-control-eco"
                  value={formData.targetDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" className="btn btn-eco w-100 py-3 shadow-sm" disabled={submitting}>
                {submitting ? 'Adding...' : 'Create Target'}
              </button>
            </form>
          </div>
        </div>

        {/* Goals List */}
        <div className="col-md-7">
          <div className="card glass-card border-0 p-4 h-100">
            <h4 className="text-dark mb-3"><i className="bi bi-list-task text-success me-2"></i> Your Goals</h4>
            
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-success" role="status"></div>
              </div>
            ) : goals.length > 0 ? (
              <div className="d-flex flex-column gap-3">
                {goals.map((g) => (
                  <div className="card border p-3 rounded-3 bg-light bg-opacity-50" key={g._id}>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <h6 className="fw-bold text-dark mb-1 d-flex align-items-center gap-2">
                          {g.title}
                          {g.status === 'completed' && (
                            <span className="badge bg-success small py-1 rounded-pill">Completed</span>
                          )}
                        </h6>
                        <p className="text-muted small m-0">
                          Target: <strong className="text-success">{g.targetReduction}% Reduction</strong> by {new Date(g.targetDate).toLocaleDateString()}
                        </p>
                      </div>
                      <button className="btn btn-link text-danger p-0" onClick={() => handleDeleteGoal(g._id)}>
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>

                    <div className="d-flex align-items-center gap-3">
                      <div className="flex-grow-1">
                        <div className="progress progress-eco mb-1">
                          <div
                            className="progress-bar progress-bar-eco"
                            role="progressbar"
                            style={{ width: `${g.currentProgress}%` }}
                            aria-valuenow={g.currentProgress}
                            aria-valuemin="0"
                            aria-valuemax="100"
                          ></div>
                        </div>
                        <div className="d-flex justify-content-between text-muted small" style={{ fontSize: '11px' }}>
                          <span>Progress: {g.currentProgress}%</span>
                          <span>{g.currentProgress >= 100 ? 'Milestone met!' : 'Active tracker'}</span>
                        </div>
                      </div>
                      {g.status !== 'completed' && (
                        <div style={{ width: '90px' }}>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            className="form-control form-control-sm text-center"
                            value={g.currentProgress}
                            onChange={(e) => handleProgressChange(g._id, parseInt(e.target.value) || 0)}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-5 text-muted">
                <i className="bi bi-clipboard-x fs-1 mb-2 text-secondary d-block"></i>
                No active goals. Set your first goal on the left to start saving emissions!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Goals;
