import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Rewards = () => {
  const { user, refreshProfile } = useContext(AuthContext);
  const [allBadges, setAllBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllBadges = async () => {
    try {
      setLoading(true);
      // Wait, we can fetch all badges from some public endpoint or write a fallback.
      // Let's create an endpoint in activities or user or write a simple route.
      // Or we can query user profile which populate badges, and fetch other badges.
      // Since the seeder writes the badges, let's look at the static badges definition
      // as a fallback if the API fails, or just fetch them.
      // Let's write a get request for all badges or use static arrays since they are standard.
      // Let's define the static badges array for instant render and match using user.badges!
      // This is fast and robust.
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    refreshProfile();
    setLoading(false);
  }, []);

  const staticBadges = [
    {
      name: 'Green Beginner',
      description: 'Earned by taking your very first step in environmental tracking!',
      criteria: 'Register an account and log your first daily activity assessment.',
      icon: 'bi-leaf',
    },
    {
      name: 'Carbon Saver',
      description: 'Awarded for maintaining an exceptionally low carbon footprint.',
      criteria: 'Submit any daily assessment with a score below 5.0 kg CO2e.',
      icon: 'bi-cloud-sun',
    },
    {
      name: 'Eco Warrior',
      description: 'Earned through persistence and consistency in habit tracking.',
      criteria: 'Log daily carbon footprint assessments for 5 or more days.',
      icon: 'bi-shield-check',
    },
    {
      name: 'Sustainability Champion',
      description: 'The highest honor for true ecological pioneers.',
      criteria: 'Log at least 10 assessments with an average carbon score under 8.0 kg CO2e.',
      icon: 'bi-trophy',
    },
  ];

  if (!user || loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <div className="spinner-border text-success" role="status"></div>
      </div>
    );
  }

  const earnedBadgeNames = user.badges?.map((b) => b.badge?.name || '') || [];

  return (
    <div className="container py-5 fade-in-up">
      <div className="text-center mb-5">
        <span className="badge bg-success bg-opacity-25 text-success border border-success border-opacity-50 px-3 py-2 rounded-pill mb-2 fw-bold">
          ACHIEVEMENTS
        </span>
        <h1 className="text-dark">Eco Rewards & Badges</h1>
        <p className="text-muted">Earn special badges by logging activities and sustaining low carbon emission scores.</p>
      </div>

      {/* Progress Cards */}
      <div className="row g-4 justify-content-center mb-5">
        <div className="col-md-8 text-center">
          <div className="card glass-card border-0 p-4">
            <h5 className="text-dark mb-2">Rewards Unlocked</h5>
            <h2 className="display-4 text-success brand-font mb-3">
              {earnedBadgeNames.length} / {staticBadges.length}
            </h2>
            <div className="progress progress-eco mx-auto mb-2" style={{ maxWidth: '400px' }}>
              <div
                className="progress-bar progress-bar-eco"
                role="progressbar"
                style={{ width: `${(earnedBadgeNames.length / staticBadges.length) * 100}%` }}
                aria-valuenow={(earnedBadgeNames.length / staticBadges.length) * 100}
                aria-valuemin="0"
                aria-valuemax="100"
              ></div>
            </div>
            <p className="text-secondary small m-0">
              {earnedBadgeNames.length === staticBadges.length
                ? 'Congratulations! You have unlocked all badges.'
                : 'Keep logging activities and lowering scores to unlock remaining achievements!'}
            </p>
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="row g-4">
        {staticBadges.map((badge, idx) => {
          const isEarned = earnedBadgeNames.includes(badge.name);
          const earnedInfo = user.badges?.find((b) => b.badge?.name === badge.name);

          return (
            <div className="col-md-6 col-lg-3" key={idx}>
              <div className={`card h-100 border-0 p-4 text-center rounded-4 shadow-sm ${isEarned ? 'bg-white badge-unlocked' : 'bg-light bg-opacity-70 badge-locked'}`}>
                <div className={`mx-auto mb-3 rounded-circle d-flex align-items-center justify-content-center ${isEarned ? 'bg-success bg-opacity-10 text-success' : 'bg-secondary bg-opacity-10 text-secondary'}`} style={{ width: '80px', height: '80px', fontSize: '35px' }}>
                  <i className={`bi ${badge.icon}`}></i>
                </div>
                <h5 className={`fw-bold mb-2 ${isEarned ? 'text-dark' : 'text-muted'}`}>{badge.name}</h5>
                <p className="text-secondary small mb-3" style={{ minHeight: '60px' }}>
                  {badge.description}
                </p>
                <div className="border-top pt-3 mt-auto">
                  <p className="small text-muted mb-0" style={{ fontSize: '11px' }}>
                    <strong>Criteria:</strong> {badge.criteria}
                  </p>
                  {isEarned && earnedInfo && (
                    <span className="badge bg-success bg-opacity-25 text-success rounded-pill mt-2 px-2 py-1 small" style={{ fontSize: '10px' }}>
                      Unlocked {new Date(earnedInfo.earnedAt).toLocaleDateString()}
                    </span>
                  )}
                  {!isEarned && (
                    <span className="badge bg-secondary bg-opacity-25 text-secondary rounded-pill mt-2 px-2 py-1 small" style={{ fontSize: '10px' }}>
                      Locked
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Rewards;
