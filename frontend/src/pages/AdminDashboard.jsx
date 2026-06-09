import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [articles, setArticles] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [activeTab, setActiveTab] = useState('users'); // 'users', 'articles', 'analytics'
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ show: false, message: '', type: 'danger' });

  // Article Modal Form
  const [showModal, setShowModal] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [articleForm, setArticleForm] = useState({
    title: '',
    category: 'Climate Change',
    content: '',
    image: '',
    readingTime: 4,
  });

  const categories = ['Climate Change', 'Renewable Energy', 'Waste Reduction', 'Sustainable Living'];

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersRes, artRes, analRes] = await Promise.all([
        axios.get('/admin/users'),
        axios.get('/articles'), // GET /api/articles
        axios.get('/admin/analytics'),
      ]);

      if (usersRes.data.success) setUsers(usersRes.data.data);
      if (artRes.data.success) setArticles(artRes.data.data);
      if (analRes.data.success) setAnalytics(analRes.data.data);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      setAlert({ show: true, message: 'Authorization error fetching admin logs.', type: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // USER MANAGEMENT ACTIONS
  const handleToggleSuspend = async (userId, currentStatus) => {
    const nextStatus = currentStatus === 'suspended' ? 'active' : 'suspended';
    try {
      const res = await axios.put(`/admin/users/${userId}/status`, { status: nextStatus });
      if (res.data.success) {
        setUsers(users.map((u) => (u._id === userId ? { ...u, status: nextStatus } : u)));
        setAlert({ show: true, message: res.data.message, type: 'success' });
      }
    } catch (error) {
      setAlert({ show: true, message: error.response?.data?.message || 'Error updating status', type: 'danger' });
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to permanently delete this user? All activities and goals will be cleared.')) return;
    try {
      const res = await axios.delete(`/admin/users/${userId}`);
      if (res.data.success) {
        setUsers(users.filter((u) => u._id !== userId));
        setAlert({ show: true, message: res.data.message, type: 'success' });
      }
    } catch (error) {
      setAlert({ show: true, message: error.response?.data?.message || 'Error deleting user', type: 'danger' });
    }
  };

  // ARTICLE MANAGEMENT ACTIONS
  const handleArticleFormChange = (e) => {
    setArticleForm({
      ...articleForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleOpenCreateModal = () => {
    setEditingArticle(null);
    setArticleForm({
      title: '',
      category: 'Climate Change',
      content: '',
      image: '',
      readingTime: 4,
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (article) => {
    setEditingArticle(article);
    setArticleForm({
      title: article.title,
      category: article.category,
      content: article.content,
      image: article.image || '',
      readingTime: article.readingTime,
    });
    setShowModal(true);
  };

  const handleSaveArticle = async (e) => {
    e.preventDefault();
    try {
      if (editingArticle) {
        // Edit Mode
        const res = await axios.put(`/articles/${editingArticle._id}`, articleForm);
        if (res.data.success) {
          setArticles(articles.map((art) => (art._id === editingArticle._id ? res.data.data : art)));
          setAlert({ show: true, message: 'Article updated successfully!', type: 'success' });
        }
      } else {
        // Create Mode
        const res = await axios.post('/articles', articleForm);
        if (res.data.success) {
          setArticles([res.data.data, ...articles]);
          setAlert({ show: true, message: 'Article created successfully!', type: 'success' });
        }
      }
      setShowModal(false);
    } catch (error) {
      setAlert({ show: true, message: error.response?.data?.message || 'Error saving article', type: 'danger' });
    }
  };

  const handleDeleteArticle = async (articleId) => {
    if (!window.confirm('Delete this article from the educational resource center?')) return;
    try {
      const res = await axios.delete(`/articles/${articleId}`);
      if (res.data.success) {
        setArticles(articles.filter((art) => art._id !== articleId));
        setAlert({ show: true, message: res.data.message, type: 'success' });
      }
    } catch (error) {
      setAlert({ show: true, message: error.response?.data?.message || 'Error deleting article', type: 'danger' });
    }
  };

  return (
    <div className="container py-5 fade-in-up">
      <div className="text-center mb-5">
        <span className="badge bg-danger bg-opacity-25 text-danger border border-danger border-opacity-50 px-3 py-2 rounded-pill mb-2 fw-bold">
          ADMIN CONTROL CENTER
        </span>
        <h1 className="text-dark">EcoTrack Admin Dashboard</h1>
        <p className="text-muted">Manage platform users, educational resources, and review aggregated platform statistics.</p>
      </div>

      {alert.show && (
        <div className={`alert alert-${alert.type} alert-dismissible fade show small`} role="alert">
          {alert.message}
          <button type="button" className="btn-close" onClick={() => setAlert({ show: false, message: '' })}></button>
        </div>
      )}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status"></div>
        </div>
      ) : (
        <>
          {/* Analytics Overview Cards */}
          {analytics && (
            <div className="row g-4 mb-5">
              <div className="col-6 col-lg-3">
                <div className="card glass-card border-0 p-4 text-center">
                  <p className="text-muted small text-uppercase mb-1 fw-bold">Total Platform Users</p>
                  <h2 className="text-success brand-font m-0">{analytics.totalUsers}</h2>
                </div>
              </div>
              <div className="col-6 col-lg-3">
                <div className="card glass-card border-0 p-4 text-center">
                  <p className="text-muted small text-uppercase mb-1 fw-bold">Average Carbon Score</p>
                  <h2 className="text-success brand-font m-0">{analytics.averageCarbonScore} kg</h2>
                </div>
              </div>
              <div className="col-6 col-lg-3">
                <div className="card glass-card border-0 p-4 text-center">
                  <p className="text-muted small text-uppercase mb-1 fw-bold">Active Trackers</p>
                  <h2 className="text-success brand-font m-0">{analytics.activeUsers}</h2>
                </div>
              </div>
              <div className="col-6 col-lg-3">
                <div className="card glass-card border-0 p-4 text-center">
                  <p className="text-muted small text-uppercase mb-1 fw-bold">Total Logs Submitted</p>
                  <h2 className="text-success brand-font m-0">{analytics.totalLogs}</h2>
                </div>
              </div>
            </div>
          )}

          {/* Admin Navigation Tabs */}
          <div className="card glass-card border-0 mb-4">
            <div className="card-header bg-transparent border-0 d-flex p-0">
              <button
                className={`flex-grow-1 py-3 border-0 bg-transparent fw-bold ${activeTab === 'users' ? 'text-success border-bottom border-3 border-success' : 'text-muted'}`}
                onClick={() => setActiveTab('users')}
              >
                User Accounts ({users.length})
              </button>
              <button
                className={`flex-grow-1 py-3 border-0 bg-transparent fw-bold ${activeTab === 'articles' ? 'text-success border-bottom border-3 border-success' : 'text-muted'}`}
                onClick={() => setActiveTab('articles')}
              >
                Educational Hub ({articles.length})
              </button>
              <button
                className={`flex-grow-1 py-3 border-0 bg-transparent fw-bold ${activeTab === 'analytics' ? 'text-success border-bottom border-3 border-success' : 'text-muted'}`}
                onClick={() => setActiveTab('analytics')}
              >
                Detailed Statistics
              </button>
            </div>

            <div className="card-body p-4">
              {/* Tab 1: User Management */}
              {activeTab === 'users' && (
                <div className="table-responsive">
                  <table className="table align-middle table-hover small">
                    <thead className="table-light text-muted">
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Carbon Score</th>
                        <th>Badges</th>
                        <th>Status</th>
                        <th className="text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u._id}>
                          <td><strong>{u.name}</strong></td>
                          <td>{u.email}</td>
                          <td>
                            <span className={`badge ${u.role === 'admin' ? 'bg-danger bg-opacity-10 text-danger' : 'bg-primary bg-opacity-10 text-primary'} rounded-pill`}>
                              {u.role}
                            </span>
                          </td>
                          <td>{u.carbonScore ? `${u.carbonScore} kg` : 'None logged'}</td>
                          <td>{u.badges?.length || 0} earned</td>
                          <td>
                            <span className={`badge ${u.status === 'active' ? 'bg-success' : 'bg-warning'} rounded-pill`}>
                              {u.status}
                            </span>
                          </td>
                          <td className="text-end">
                            <button
                              className={`btn btn-sm ${u.status === 'suspended' ? 'btn-success' : 'btn-warning'} me-2`}
                              onClick={() => handleToggleSuspend(u._id, u.status)}
                            >
                              {u.status === 'suspended' ? 'Re-activate' : 'Suspend'}
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDeleteUser(u._id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Tab 2: Articles CRUD */}
              {activeTab === 'articles' && (
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="text-dark m-0">Manage Articles</h5>
                    <button className="btn btn-eco btn-sm" onClick={handleOpenCreateModal}>
                      <i className="bi bi-plus-circle me-1"></i> Add Article
                    </button>
                  </div>

                  <div className="table-responsive">
                    <table className="table align-middle table-hover small">
                      <thead className="table-light text-muted">
                        <tr>
                          <th>Title</th>
                          <th>Category</th>
                          <th>Read Time</th>
                          <th>Author</th>
                          <th className="text-end">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {articles.map((art) => (
                          <tr key={art._id}>
                            <td><strong>{art.title}</strong></td>
                            <td>
                              <span className="badge bg-success bg-opacity-10 text-success rounded-pill">
                                {art.category}
                              </span>
                            </td>
                            <td>{art.readingTime} min</td>
                            <td>{art.author}</td>
                            <td className="text-end">
                              <button
                                className="btn btn-sm btn-outline-secondary me-2"
                                onClick={() => handleOpenEditModal(art)}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDeleteArticle(art._id)}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Tab 3: Platform Analytics details */}
              {activeTab === 'analytics' && analytics && (
                <div className="row g-4">
                  <div className="col-md-6">
                    <div className="border rounded-4 p-4 bg-light bg-opacity-50">
                      <h5 className="text-dark mb-3">Top Contributors</h5>
                      <ol className="list-group list-group-numbered">
                        {analytics.topContributors?.map((tc, idx) => (
                          <li
                            key={idx}
                            className="list-group-item d-flex justify-content-between align-items-center bg-transparent border-0 border-bottom small px-0"
                          >
                            <div className="ms-2 me-auto">
                              <div className="fw-bold">{tc.name}</div>
                              <span className="text-muted">{tc.email}</span>
                            </div>
                            <span className="badge bg-success rounded-pill px-3 py-2">
                              Avg: {tc.carbonScore} kg
                            </span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="border rounded-4 p-4 bg-light bg-opacity-50">
                      <h5 className="text-dark mb-3">Community Baselines</h5>
                      <p className="text-secondary small">
                        The current global average carbon score is estimated around <strong>16.0 kg CO2e/day</strong>.
                      </p>
                      <ul className="list-group list-group-flush bg-transparent small">
                        <li className="list-group-item bg-transparent px-0 d-flex justify-content-between">
                          <span>Platform Average Emissions:</span>
                          <strong>{analytics.averageCarbonScore} kg/day</strong>
                        </li>
                        <li className="list-group-item bg-transparent px-0 d-flex justify-content-between">
                          <span>Total Platform reduction from baseline:</span>
                          <strong className="text-success">
                            {Math.max(0, Math.round(((16.0 - analytics.averageCarbonScore) / 16.0) * 100))}% Saved
                          </strong>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Modal for Article CRUD */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="modal-dialog modal-md modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow-lg">
              <form onSubmit={handleSaveArticle}>
                <div className="modal-header bg-dark text-white rounded-top-4">
                  <h5 className="modal-title">{editingArticle ? 'Edit Article' : 'Create Article'}</h5>
                  <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body p-4 bg-white">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-muted">Title</label>
                    <input
                      type="text"
                      name="title"
                      className="form-control form-control-eco"
                      value={articleForm.title}
                      onChange={handleArticleFormChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-muted">Category</label>
                    <select
                      name="category"
                      className="form-select form-control-eco"
                      value={articleForm.category}
                      onChange={handleArticleFormChange}
                    >
                      {categories.map((cat, idx) => (
                        <option key={idx} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-muted">Image URL</label>
                    <input
                      type="text"
                      name="image"
                      className="form-control form-control-eco"
                      placeholder="e.g. Unsplash URL"
                      value={articleForm.image}
                      onChange={handleArticleFormChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-muted">Reading Time (minutes)</label>
                    <input
                      type="number"
                      name="readingTime"
                      className="form-control form-control-eco"
                      min="1"
                      value={articleForm.readingTime}
                      onChange={handleArticleFormChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-muted">Content Text</label>
                    <textarea
                      name="content"
                      className="form-control form-control-eco"
                      rows="6"
                      value={articleForm.content}
                      onChange={handleArticleFormChange}
                      required
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer border-0 p-3 bg-light">
                  <button type="button" className="btn btn-secondary px-3" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-eco px-4">Save Article</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
