import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const { login, token, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [alert, setAlert] = useState({
    show: false,
    message: '',
    type: 'danger',
  });

  const [submitting, setSubmitting] = useState(false);

  // Redirect based on user role once authenticated
  useEffect(() => {
    if (token && user) {
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    }
  }, [token, user, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    if (!email || !password) {
      setAlert({
        show: true,
        message: 'Please fill in all fields',
        type: 'danger',
      });
      return;
    }

    try {
      setSubmitting(true);
      setAlert({ show: false, message: '', type: 'danger' });
      
      const res = await login(email, password);

      if (res.success) {
        setAlert({
          show: true,
          message: 'Login successful! Redirecting...',
          type: 'success',
        });
      } else {
        setAlert({
          show: true,
          message: res.message,
          type: 'danger',
        });
      }
    } catch (err) {
      setAlert({
        show: true,
        message: 'An unexpected error occurred. Please try again.',
        type: 'danger',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-5 my-5 d-flex justify-content-center align-items-center fade-in-up">
      <div className="card glass-card border-0 p-4 p-md-5" style={{ maxWidth: '500px', width: '100%' }}>
        <div className="text-center mb-4">
          <i className="bi bi-leaf-fill text-success fs-1"></i>
          <h2 className="text-dark mt-2">Welcome Back</h2>
          <p className="text-muted small">Log in to check your carbon metrics and goals</p>
        </div>

        {alert.show && (
          <div className={`alert alert-${alert.type} alert-dismissible fade show small`} role="alert">
            {alert.message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small fw-semibold text-muted">Email Address</label>
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0 text-muted">
                <i className="bi bi-envelope"></i>
              </span>
              <input
                type="email"
                name="email"
                className="form-control form-control-eco border-start-0 ps-0"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <div className="d-flex justify-content-between">
              <label className="form-label small fw-semibold text-muted">Password</label>
            </div>
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0 text-muted">
                <i className="bi bi-lock"></i>
              </span>
              <input
                type="password"
                name="password"
                className="form-control form-control-eco border-start-0 ps-0"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-eco w-100 py-3 shadow"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Logging in...
              </>
            ) : (
              'Log In'
            )}
          </button>
        </form>

        <hr className="my-4 text-muted" />

        <div className="text-center">
          <p className="text-muted small mb-0">
            Don't have an account?{' '}
            <Link to="/register" className="text-success fw-bold text-decoration-none">
              Register Here
            </Link>
          </p>
          <div className="mt-3 bg-light p-3 rounded-3 border">
            <p className="text-muted small mb-1 fw-bold">Demo Accounts:</p>
            <p className="text-secondary small mb-1">User: <code className="bg-white border">user@ecotrack.com</code> / <code className="bg-white border">User@123</code></p>
            <p className="text-secondary small mb-0">Admin: <code className="bg-white border">admin@ecotrack.com</code> / <code className="bg-white border">Admin@123</code></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
