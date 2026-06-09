import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
  const { user, refreshProfile } = useContext(AuthContext);
  const [adminStats, setAdminStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);

  useEffect(() => {
    refreshProfile();
  }, []);

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchAdminStats();
    }
  }, [user]);

  const fetchAdminStats = async () => {
    try {
      setStatsLoading(true);
      const res = await axios.get('/admin/analytics');
      if (res.data.success) {
        setAdminStats(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching admin statistics:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading Profile...</span>
        </div>
      </div>
    );
  }

  const isAdmin = user.role === 'admin';

  return (
    <div className="container py-5 fade-in-up">
      <div className="row g-4">
        {/* Profile Card */}
        <div className="col-md-5 col-lg-4">
          <div className="card glass-card border-0 p-4 text-center">
            <div className="position-relative d-inline-block mx-auto mb-3">
              <i className={`bi bi-person-circle ${isAdmin ? 'text-danger' : 'text-success'}`} style={{ fontSize: '100px' }}></i>
              {isAdmin && (
                <span className="position-absolute bottom-0 end-0 badge bg-danger rounded-pill px-2 py-1 small">
                  Admin
                </span>
              )}
            </div>
            <h3 className="text-dark mb-1">{user.name}</h3>
            <p className="text-muted small mb-3">{user.email}</p>
            <p className="text-secondary small mb-4">
              <i className="bi bi-calendar-check me-2"></i>
              Member since: {new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <div className="border-top pt-3 text-start">
              <p className="small text-muted mb-2">Account Actions</p>
              {isAdmin ? (
                <>
                  <Link to="/admin" className="btn btn-danger bg-danger bg-opacity-75 border-0 btn-sm w-100 mb-2 text-white">
                    <i className="bi bi-shield-lock me-2"></i>Access Admin Panel
                  </Link>
                  <Link to="/education" className="btn btn-eco-outline btn-sm w-100">
                    <i className="bi bi-journal-text me-2"></i>Manage Articles
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/calculator" className="btn btn-eco btn-sm w-100 mb-2">
                    New Carbon Log
                  </Link>
                  <Link to="/goals" className="btn btn-eco-outline btn-sm w-100">
                    View Reduction Goals
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Stats and Role Specific Summary */}
        <div className="col-md-7 col-lg-8">
          {isAdmin ? (
            /* Admin Statistics & Privileges */
            <>
              <div className="card glass-card border-0 p-4 mb-4 border-start border-danger border-4">
                <h4 className="text-dark mb-3">System Overview (Platform Stats)</h4>
                {statsLoading ? (
                  <div className="text-center py-3">
                    <div className="spinner-border text-danger spinner-border-sm" role="status"></div>
                  </div>
                ) : adminStats ? (
                  <div className="row g-3">
                    <div className="col-6 col-sm-4 text-center border-end">
                      <p className="text-muted small mb-1 fw-semibold text-uppercase">Total Users</p>
                      <h3 className="text-danger brand-font m-0">{adminStats.totalUsers}</h3>
                      <span className="text-muted small">registered</span>
                    </div>
                    <div className="col-6 col-sm-4 text-center border-end">
                      <p className="text-muted small mb-1 fw-semibold text-uppercase">Platform Avg</p>
                      <h3 className="text-danger brand-font m-0">{adminStats.averageCarbonScore} kg</h3>
                      <span className="text-muted small">CO2e per log</span>
                    </div>
                    <div className="col-12 col-sm-4 text-center">
                      <p className="text-muted small mb-1 fw-semibold text-uppercase">Total Logs</p>
                      <h3 className="text-danger brand-font m-0">{adminStats.totalLogs}</h3>
                      <span className="text-muted small">submitted</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted small m-0">No analytics data could be retrieved.</p>
                )}
              </div>

              <div className="card glass-card border-0 p-4">
                <h4 className="text-dark mb-3">Administrative Access Rights</h4>
                <div className="row g-3">
                  <div className="col-sm-6">
                    <div className="card border p-3 h-100 rounded-3 bg-light bg-opacity-50">
                      <div className="d-flex align-items-center gap-3">
                        <i className="bi bi-people-fill text-danger fs-3"></i>
                        <div>
                          <h6 className="fw-bold text-dark m-0 mb-1">User Management</h6>
                          <span className="text-success small fw-bold"><i className="bi bi-check-circle-fill me-1"></i>Access Granted</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="card border p-3 h-100 rounded-3 bg-light bg-opacity-50">
                      <div className="d-flex align-items-center gap-3">
                        <i className="bi bi-journal-plus text-danger fs-3"></i>
                        <div>
                          <h6 className="fw-bold text-dark m-0 mb-1">Educational Content CRUD</h6>
                          <span className="text-success small fw-bold"><i className="bi bi-check-circle-fill me-1"></i>Access Granted</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="card border p-3 h-100 rounded-3 bg-light bg-opacity-50">
                      <div className="d-flex align-items-center gap-3">
                        <i className="bi bi-graph-up-arrow text-danger fs-3"></i>
                        <div>
                          <h6 className="fw-bold text-dark m-0 mb-1">System Aggregations</h6>
                          <span className="text-success small fw-bold"><i className="bi bi-check-circle-fill me-1"></i>Access Granted</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="card border p-3 h-100 rounded-3 bg-light bg-opacity-50">
                      <div className="d-flex align-items-center gap-3">
                        <i className="bi bi-database-fill-check text-danger fs-3"></i>
                        <div>
                          <h6 className="fw-bold text-dark m-0 mb-1">Atlas Database Read/Write</h6>
                          <span className="text-success small fw-bold"><i className="bi bi-check-circle-fill me-1"></i>Access Granted</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* User Carbon Stats Summary & Badges */
            <>
              <div className="card glass-card border-0 p-4 mb-4">
                <h4 className="text-dark mb-3">Carbon Stats Summary</h4>
                <div className="row g-3">
                  <div className="col-6 col-sm-4 text-center border-end">
                    <p className="text-muted small mb-1 fw-semibold text-uppercase">Average Footprint</p>
                    <h3 className="text-success brand-font m-0">{user.carbonScore || 0}</h3>
                    <span className="text-muted small">kg CO2e/day</span>
                  </div>
                  <div className="col-6 col-sm-4 text-center border-end">
                    <p className="text-muted small mb-1 fw-semibold text-uppercase">Earned Badges</p>
                    <h3 className="text-success brand-font m-0">{user.badges?.length || 0}</h3>
                    <span className="text-muted small">unlocked</span>
                  </div>
                  <div className="col-12 col-sm-4 text-center">
                    <p className="text-muted small mb-1 fw-semibold text-uppercase">User Status</p>
                    <h3 className="text-success brand-font m-0 text-uppercase">Active</h3>
                    <span className="text-muted small">compliance level</span>
                  </div>
                </div>
              </div>

              <div className="card glass-card border-0 p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4 className="text-dark m-0">Your Earned Badges</h4>
                  <Link to="/rewards" className="text-success text-decoration-none small fw-bold">
                    View All Rewards <i className="bi bi-chevron-right"></i>
                  </Link>
                </div>

                {user.badges && user.badges.length > 0 ? (
                  <div className="row g-3">
                    {user.badges.map((b, index) => (
                      <div className="col-sm-6" key={index}>
                        <div className="card border p-3 h-100 rounded-3 bg-light bg-opacity-50">
                          <div className="d-flex align-items-center gap-3">
                            <div className="badge-icon bg-success bg-opacity-10 text-success p-2 rounded-circle fs-3 d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                              <i className={`bi ${b.badge?.icon || 'bi-award'}`}></i>
                            </div>
                            <div>
                              <h6 className="fw-bold text-dark m-0 mb-1">{b.badge?.name}</h6>
                              <p className="text-secondary small m-0" style={{ fontSize: '11px' }}>
                                Earned: {new Date(b.earnedAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted">
                    <i className="bi bi-award fs-1 d-block mb-2 text-secondary"></i>
                    No badges earned yet. Go log your first daily assessment in the Calculator!
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
