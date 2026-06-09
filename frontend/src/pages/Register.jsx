import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const { register, token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [alert, setAlert] = useState({
    show: false,
    message: '',
    type: 'danger',
  });

  const [submitting, setSubmitting] = useState(false);

  // If already logged in, redirect
  useEffect(() => {
    if (token) {
      navigate('/dashboard');
    }
  }, [token, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = formData;

    if (!name || !email || !password || !confirmPassword) {
      setAlert({
        show: true,
        message: 'Please fill in all fields',
        type: 'danger',
      });
      return;
    }

    if (password !== confirmPassword) {
      setAlert({
        show: true,
        message: 'Passwords do not match',
        type: 'danger',
      });
      return;
    }

    if (password.length < 6) {
      setAlert({
        show: true,
        message: 'Password must be at least 6 characters long',
        type: 'danger',
      });
      return;
    }

    try {
      setSubmitting(true);
      setAlert({ show: false, message: '', type: 'danger' });

      const res = await register(name, email, password);

      if (res.success) {
        setAlert({
          show: true,
          message: 'Account created successfully! Awarded "Green Beginner" badge. Redirecting...',
          type: 'success',
        });
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
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
      <div className="card glass-card border-0 p-4 p-md-5" style={{ maxWidth: '550px', width: '100%' }}>
        <div className="text-center mb-4">
          <i className="bi bi-person-plus text-success fs-1"></i>
          <h2 className="text-dark mt-2">Join EcoTrack</h2>
          <p className="text-muted small">Create an account to start measuring your daily footprint</p>
        </div>

        {alert.show && (
          <div className={`alert alert-${alert.type} alert-dismissible fade show small`} role="alert">
            {alert.message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small fw-semibold text-muted">Full Name</label>
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0 text-muted">
                <i className="bi bi-person"></i>
              </span>
              <input
                type="text"
                name="name"
                className="form-control form-control-eco border-start-0 ps-0"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

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

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label small fw-semibold text-muted">Password</label>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0 text-muted">
                  <i className="bi bi-lock"></i>
                </span>
                <input
                  type="password"
                  name="password"
                  className="form-control form-control-eco border-start-0 ps-0"
                  placeholder="Min 6 chars"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="col-md-6 mb-4">
              <label className="form-label small fw-semibold text-muted">Confirm Password</label>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0 text-muted">
                  <i className="bi bi-lock-check"></i>
                </span>
                <input
                  type="password"
                  name="confirmPassword"
                  className="form-control form-control-eco border-start-0 ps-0"
                  placeholder="Retype password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
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
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <hr className="my-4 text-muted" />

        <div className="text-center">
          <p className="text-muted small mb-0">
            Already have an account?{' '}
            <Link to="/login" className="text-success fw-bold text-decoration-none">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
