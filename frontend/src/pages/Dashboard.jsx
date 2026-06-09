import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import 'chart.js/auto';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { AuthContext } from '../context/AuthContext';
import StatCard from '../components/StatCard';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [activities, setActivities] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('all'); // '7days', '30days', 'all'

  const fetchData = async () => {
    try {
      setLoading(true);
      const [actRes, goalRes] = await Promise.all([
        axios.get('/activities'),
        axios.get('/goals'),
      ]);

      if (actRes.data.success) {
        setActivities(actRes.data.data);
      }
      if (goalRes.data.success) {
        setGoals(goalRes.data.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '70vh' }}>
        <div className="spinner-border text-success" role="status"></div>
      </div>
    );
  }

  // Baseline reference for a normal average person (approx 16.0 kg CO2e/day)
  const baselineScore = 16.0;

  // Filter activities based on selected timeframe
  const getFilteredActivities = () => {
    if (timeframe === '7days') {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - 7);
      return activities.filter((act) => new Date(act.date) >= cutoff);
    }
    if (timeframe === '30days') {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - 30);
      return activities.filter((act) => new Date(act.date) >= cutoff);
    }
    return activities;
  };

  const filteredActivities = getFilteredActivities();

  // Key Calculations
  const latestLog = activities.length > 0 ? activities[0] : null;
  const currentFootprint = latestLog ? latestLog.calculatedScore : 0;
  
  // Average calculation based on filtered data
  const totalScore = filteredActivities.reduce((sum, act) => sum + act.calculatedScore, 0);
  const averageFootprint = filteredActivities.length > 0 ? parseFloat((totalScore / filteredActivities.length).toFixed(2)) : 0;

  // Reduction percentage compared to global average baseline
  const reductionPercentage = averageFootprint > 0 
    ? Math.max(0, Math.round(((baselineScore - averageFootprint) / baselineScore) * 100))
    : 0;

  const activeGoals = goals.filter((g) => g.status === 'active');
  const completedGoalsCount = goals.filter((g) => g.status === 'completed').length;

  // --- CHARTS PREPARATION ---
  
  // A. Bar Chart: Daily logs corresponding to timeframe
  const barLogs = [...filteredActivities].slice(0, timeframe === '7days' ? 7 : timeframe === '30days' ? 30 : 7).reverse();
  const barChartData = {
    labels: barLogs.map((log) => new Date(log.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })),
    datasets: [
      {
        label: 'Emissions (kg CO2e)',
        data: barLogs.map((log) => log.calculatedScore),
        backgroundColor: '#2d6a4f',
        borderRadius: 6,
      },
      {
        label: 'Eco Baseline Reference',
        data: barLogs.map(() => baselineScore),
        type: 'line',
        borderColor: '#ff914d',
        borderDash: [5, 5],
        fill: false,
        pointStyle: 'none',
      }
    ],
  };

  // B. Pie Chart: Latest Assessment Category Breakdown
  let pieChartData = null;
  if (latestLog) {
    let carFactor = 0.18;
    if (latestLog.transportation.vehicleType === 'electric') carFactor = 0.05;
    else if (latestLog.transportation.vehicleType === 'hybrid') carFactor = 0.10;
    else if (latestLog.transportation.vehicleType === 'diesel') carFactor = 0.20;

    const carE = (latestLog.transportation.carKm || 0) * carFactor;
    const transitE = (latestLog.transportation.transitKm || 0) * 0.05 + (latestLog.transportation.bikeKm || 0) * 0.005;
    const flightE = (latestLog.transportation.flightHrs || 0) * 90;
    const transportTotal = carE + transitE + flightE;

    const electricityE = (latestLog.energy.electricityKwh || 0) * 0.85;
    const lpgE = (latestLog.energy.lpgKg || 0) * 3;
    const waterE = (latestLog.energy.waterLitres || 0) * 0.0003;
    const energyTotal = electricityE + lpgE + waterE;

    let foodE = 4.0;
    if (latestLog.food.dietType === 'vegan') foodE = 1.5;
    else if (latestLog.food.dietType === 'vegetarian') foodE = 2.5;
    else if (latestLog.food.dietType === 'meat-heavy') foodE = 7.0;

    let wasteE = 1.0;
    if (latestLog.waste.plasticUsage === 'low') wasteE = 0.2;
    else if (latestLog.waste.plasticUsage === 'high') wasteE = 2.0;
    const recyclingD = (latestLog.waste.recyclingRate / 100) * 1.5;
    const wasteTotal = Math.max(0.1, wasteE - recyclingD);

    pieChartData = {
      labels: ['Transportation', 'Home Energy', 'Food Intake', 'Waste & Plastic'],
      datasets: [
        {
          data: [
            parseFloat(transportTotal.toFixed(2)),
            parseFloat(energyTotal.toFixed(2)),
            parseFloat(foodE.toFixed(2)),
            parseFloat(wasteTotal.toFixed(2)),
          ],
          backgroundColor: ['#1b4332', '#52b788', '#48cae4', '#ff914d'],
          borderWidth: 1,
        },
      ],
    };
  }

  // C. Line Chart: Historical trend progression for the timeframe
  const historicalLogs = [...filteredActivities].sort((a, b) => new Date(a.date) - new Date(b.date));
  const lineChartData = {
    labels: historicalLogs.map((log) => new Date(log.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })),
    datasets: [
      {
        label: 'Daily Footprint',
        data: historicalLogs.map((log) => log.calculatedScore),
        borderColor: '#0077b6',
        backgroundColor: 'rgba(0, 119, 182, 0.1)',
        tension: 0.3,
        fill: true,
        pointBackgroundColor: '#0077b6',
      },
    ],
  };

  return (
    <div className="container py-5 fade-in-up">
      {/* Welcome banner */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5">
        <div>
          <h1 className="text-dark mb-1">Hello, {user?.name || 'Explorer'}!</h1>
          <p className="text-muted m-0">Here's your environmental impact analysis and goals overview.</p>
        </div>
        <div className="mt-3 mt-md-0 d-flex gap-2 align-items-center">
          <select
            className="form-select border-success bg-white text-dark py-2 rounded-3"
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            style={{ width: '150px' }}
          >
            <option value="all">All Time</option>
            <option value="30days">Last 30 Days</option>
            <option value="7days">Last 7 Days</option>
          </select>
          <Link to="/calculator" className="btn btn-eco shadow-sm py-2">
            <i className="bi bi-plus-circle me-2"></i> Log Daily Footprint
          </Link>
        </div>
      </div>

      {activities.length === 0 ? (
        /* Empty Dashboard State */
        <div className="card glass-card border-0 p-5 text-center my-4">
          <i className="bi bi-bar-chart-line text-success display-1 mb-3"></i>
          <h3 className="text-dark">No Data Collected Yet</h3>
          <p className="text-secondary max-w-md mx-auto mb-4">
            Start logging your carbon variables. EcoTrack requires at least one daily assessment to generate score statistics, comparisons, and personalized recommendations.
          </p>
          <Link to="/calculator" className="btn btn-eco px-5 py-3">
            Start Your First Calculator Log
          </Link>
        </div>
      ) : (
        /* Active Dashboard State */
        <>
          {/* Stats Cards Row */}
          <div className="row g-4 mb-5">
            <div className="col-md-6 col-lg-3">
              <StatCard
                title="Latest Daily Footprint"
                value={`${currentFootprint} kg`}
                icon="bi-cloud-slash"
                iconColorClass="stat-icon-green"
                subtext="CO2e registered"
              />
            </div>
            <div className="col-md-6 col-lg-3">
              <StatCard
                title="Historical Average"
                value={`${averageFootprint} kg`}
                icon="bi-activity"
                iconColorClass="stat-icon-blue"
                subtext="CO2e per day logged"
              />
            </div>
            <div className="col-md-6 col-lg-3">
              <StatCard
                title="Baseline Reduction"
                value={`${reductionPercentage}%`}
                icon="bi-tree-fill"
                iconColorClass="stat-icon-green"
                trend="positive"
                subtext="versus global baseline"
              />
            </div>
            <div className="col-md-6 col-lg-3">
              <StatCard
                title="Goal Achievements"
                value={`${completedGoalsCount} Goals`}
                icon="bi-trophy-fill"
                iconColorClass="stat-icon-orange"
                subtext={`${activeGoals.length} targets currently active`}
              />
            </div>
          </div>

          {/* Charts Row */}
          <div className="row g-4 mb-5">
            <div className="col-lg-7">
              <div className="card glass-card border-0 p-4 h-100">
                <h5 className="text-dark mb-4">Daily Assessments (Last 7 Logs)</h5>
                <Bar data={barChartData} options={{ responsive: true, maintainAspectRatio: true }} />
              </div>
            </div>
            <div className="col-lg-5">
              <div className="card glass-card border-0 p-4 h-100">
                <h5 className="text-dark mb-4">Latest Category Breakdown</h5>
                {pieChartData && <Pie data={pieChartData} options={{ responsive: true, maintainAspectRatio: true }} />}
              </div>
            </div>
          </div>

          {/* Line Chart Historical Progression */}
          <div className="row mb-5">
            <div className="col-12">
              <div className="card glass-card border-0 p-4">
                <h5 className="text-dark mb-4">Footprint History Trend Progression</h5>
                <div style={{ height: '300px' }}>
                  <Line data={lineChartData} options={{ responsive: true, maintainAspectRatio: false }} />
                </div>
              </div>
            </div>
          </div>

          {/* Goals and Recommendations summary */}
          <div className="row g-4">
            {/* Active Goals list */}
            <div className="col-md-6">
              <div className="card glass-card border-0 p-4 h-100">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="text-dark m-0">Active Reduction Targets</h5>
                  <Link to="/goals" className="text-success text-decoration-none small fw-bold">
                    Manage Goals <i className="bi bi-chevron-right"></i>
                  </Link>
                </div>
                {activeGoals.length > 0 ? (
                  <div className="d-flex flex-column gap-3">
                    {activeGoals.slice(0, 3).map((g) => (
                      <div key={g._id} className="border-bottom pb-2">
                        <div className="d-flex justify-content-between mb-1 small text-dark">
                          <strong>{g.title}</strong>
                          <span>{g.currentProgress}%</span>
                        </div>
                        <div className="progress progress-eco">
                          <div
                            className="progress-bar progress-bar-eco"
                            role="progressbar"
                            style={{ width: `${g.currentProgress}%` }}
                            aria-valuenow={g.currentProgress}
                            aria-valuemin="0"
                            aria-valuemax="100"
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted small">
                    <i className="bi bi-plus-circle fs-3 d-block mb-1 text-secondary"></i>
                    No active targets. <Link to="/goals" className="text-success">Create one now</Link> to reduce footprint.
                  </div>
                )}
              </div>
            </div>

            {/* Earned Badges summary */}
            <div className="col-md-6">
              <div className="card glass-card border-0 p-4 h-100">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="text-dark m-0">Unlocked Eco-Badges</h5>
                  <Link to="/rewards" className="text-success text-decoration-none small fw-bold">
                    View Badges <i className="bi bi-chevron-right"></i>
                  </Link>
                </div>
                {user?.badges && user.badges.length > 0 ? (
                  <div className="d-flex flex-wrap gap-3">
                    {user.badges.slice(0, 4).map((b, idx) => (
                      <div
                        key={idx}
                        className="d-flex align-items-center gap-2 border rounded p-2 bg-light bg-opacity-70"
                        title={b.badge?.description}
                        style={{ flex: '1 1 calc(50% - 10px)' }}
                      >
                        <i className={`bi ${b.badge?.icon || 'bi-award'} text-success fs-4`}></i>
                        <span className="small text-dark fw-bold">{b.badge?.name}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted small">
                    No badges unlocked yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
