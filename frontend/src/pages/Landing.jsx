import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Landing = () => {
  const { token } = useContext(AuthContext);

  return (
    <div className="fade-in-up">
      {/* Hero Section */}
      <section className="hero-section text-center text-md-start">
        <div className="container py-5">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <span className="badge bg-success bg-opacity-25 text-success border border-success border-opacity-50 px-3 py-2 rounded-pill mb-3 fw-bold">
                🌱 LEADING CARBON AWARENESS
              </span>
              <h1 className="display-3 fw-extrabold text-white mb-3 leading-tight brand-font">
                Track, Reduce, and offset Your Carbon Footprint
              </h1>
              <p className="lead text-light opacity-90 mb-4 fs-5">
                Calculate your daily environmental impact, establish custom reduction goals, earn unique eco-rewards, and master sustainable habits with EcoTrack.
              </p>
              <div className="d-flex flex-wrap gap-3 justify-content-center justify-content-md-start">
                {token ? (
                  <Link to="/dashboard" className="btn btn-eco btn-lg px-4 fs-6 py-3 shadow-lg">
                    Go to Dashboard <i className="bi bi-arrow-right-short fs-5 align-middle"></i>
                  </Link>
                ) : (
                  <>
                    <Link to="/register" className="btn btn-eco btn-lg px-4 fs-6 py-3 shadow-lg">
                      Get Started Free <i className="bi bi-arrow-right-short fs-5 align-middle"></i>
                    </Link>
                    <Link to="/login" className="btn btn-outline-light btn-lg px-4 fs-6 py-3 border-2">
                      Access Account
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="col-lg-6 text-center">
              <div className="position-relative d-inline-block">
                <div className="blob-bg position-absolute top-50 start-50 translate-middle pointer-events-none"></div>
                <img
                  src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=800"
                  alt="Nature landscape"
                  className="img-fluid rounded-5 shadow-2xl position-relative z-2 border border-white border-opacity-10"
                  style={{ maxWidth: '100%', height: '400px', objectFit: 'cover' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="container py-5 my-5">
        <div className="text-center mb-5">
          <h2 className="display-5 text-dark">Why Track with EcoTrack?</h2>
          <p className="text-muted lead max-w-2xl mx-auto">
            Small daily adjustments aggregate into immense environmental achievements. EcoTrack gives you all the tools.
          </p>
        </div>

        <div className="row g-4 justify-content-center">
          <div className="col-md-4">
            <div className="card glass-card h-100 border-0 p-4">
              <div className="stat-icon stat-icon-green">
                <i className="bi bi-calculator-fill"></i>
              </div>
              <h4 className="card-title text-dark">Precision Calculator</h4>
              <p className="card-text text-secondary small">
                Evaluate details across daily transportation, household power consumption, dietary profiles, and recycling behaviors.
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card glass-card h-100 border-0 p-4">
              <div className="stat-icon stat-icon-blue">
                <i className="bi bi-graph-up-arrow"></i>
              </div>
              <h4 className="card-title text-dark">Habit Analytics</h4>
              <p className="card-text text-secondary small">
                Track historical progress using beautiful charts. Compare weekly patterns and break down sources of emissions.
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card glass-card h-100 border-0 p-4">
              <div className="stat-icon stat-icon-orange">
                <i className="bi bi-trophy-fill"></i>
              </div>
              <h4 className="card-title text-dark">Gamified Badges</h4>
              <p className="card-text text-secondary small">
                Stay motivated by unlocking achievements. Earn badges from Green Beginner to Sustainability Champion.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="bg-success bg-opacity-10 py-5 my-5">
        <div className="container py-4 text-center">
          <div className="row g-4 justify-content-center">
            <div className="col-6 col-md-3">
              <h2 className="display-4 fw-extrabold text-success m-0 brand-font">15K+</h2>
              <p className="text-muted small m-0 fw-bold">Active Members</p>
            </div>
            <div className="col-6 col-md-3">
              <h2 className="display-4 fw-extrabold text-success m-0 brand-font">200 Tons</h2>
              <p className="text-muted small m-0 fw-bold">CO2e Reduced</p>
            </div>
            <div className="col-6 col-md-3">
              <h2 className="display-4 fw-extrabold text-success m-0 brand-font">50K+</h2>
              <p className="text-muted small m-0 fw-bold">Daily Logs Entered</p>
            </div>
            <div className="col-6 col-md-3">
              <h2 className="display-4 fw-extrabold text-success m-0 brand-font">4.8 ★</h2>
              <p className="text-muted small m-0 fw-bold">User Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="container py-5 text-center my-5">
        <div className="card border-0 bg-dark text-white rounded-5 p-5 shadow-lg overflow-hidden position-relative">
          <div className="position-absolute top-0 start-0 w-100 h-100 bg-gradient opacity-10 pointer-events-none"></div>
          <div className="position-relative z-2 py-4">
            <h2 className="display-5 mb-3 brand-font text-white">Join the Green Movement Today</h2>
            <p className="lead text-light text-opacity-80 max-w-xl mx-auto mb-4">
              Reduce carbon output, build greener habits, and earn rewards alongside thousands of ecological pioneers.
            </p>
            <Link to={token ? "/calculator" : "/register"} className="btn btn-eco btn-lg px-5 py-3">
              Start Calculating Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;

const localStyle = `
.blob-bg {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(82, 183, 136, 0.3) 0%, rgba(0, 0, 0, 0) 70%);
  filter: blur(40px);
}
`;
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.appendChild(document.createTextNode(localStyle));
  document.head.appendChild(style);
}
