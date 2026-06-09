import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import RecommendationCard from '../components/RecommendationCard';

const Calculator = () => {
  const { refreshProfile } = useContext(AuthContext);
  const [step, setStep] = useState(1); // 1: Transport, 2: Energy, 3: Diet & Waste, 4: Results

  const [formData, setFormData] = useState({
    transportation: {
      carKm: 15,
      vehicleType: 'gasoline',
      bikeKm: 0,
      transitKm: 5,
      flightHrs: 0,
    },
    energy: {
      electricityKwh: 10,
      lpgKg: 0.5,
      waterLitres: 150,
    },
    food: {
      dietType: 'mixed',
    },
    waste: {
      recyclingRate: 30,
      plasticUsage: 'medium',
    },
    date: new Date().toISOString().split('T')[0], // Defaults to today
  });

  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: 'danger' });

  // Handle nested state updates
  const handleNestedChange = (section, field, value) => {
    // Force numbers for numerical fields except select inputs
    const parsedValue = 
      field === 'dietType' || field === 'plasticUsage' || field === 'vehicleType'
        ? value 
        : parseFloat(value) || 0;
    setFormData({
      ...formData,
      [section]: {
        ...formData[section],
        [field]: parsedValue,
      },
    });
  };

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    const todayStr = new Date().toISOString().split('T')[0];
    if (selectedDate > todayStr) {
      setAlert({ show: true, message: 'You cannot log a footprint for a future date.', type: 'danger' });
      return;
    }
    setFormData({
      ...formData,
      date: selectedDate,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setAlert({ show: false, message: '', type: 'danger' });

      const res = await axios.post('/activities', formData);
      if (res.data.success) {
        setResult(res.data.data);
        await refreshProfile(); // Refresh average carbonScore and badges
        setStep(4); // Move to results step
      }
    } catch (error) {
      setAlert({
        show: true,
        message: error.response?.data?.message || 'Error calculating carbon score. Try again.',
        type: 'danger',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  return (
    <div className="container py-5 fade-in-up" style={{ maxWidth: '800px' }}>
      <div className="text-center mb-4">
        <span className="badge bg-success bg-opacity-25 text-success border border-success border-opacity-50 px-3 py-2 rounded-pill mb-2 fw-bold">
          CARBON FOOTPRINT ASSESSMENT
        </span>
        <h1 className="text-dark">Daily Footprint Calculator</h1>
        <p className="text-muted">Enter details of your daily habits to evaluate your environmental impact.</p>
      </div>

      {/* Progress Indicator */}
      {step < 4 && (
        <div className="card glass-card border-0 p-4 mb-4">
          <div className="d-flex justify-content-between mb-2">
            <span className="small fw-semibold text-success">Step {step} of 3</span>
            <span className="small text-muted">{step === 1 ? 'Transportation' : step === 2 ? 'Home Energy' : 'Food & Waste'}</span>
          </div>
          <div className="progress progress-eco">
            <div
              className="progress-bar progress-bar-eco"
              role="progressbar"
              style={{ width: `${(step / 3) * 100}%` }}
              aria-valuenow={(step / 3) * 100}
              aria-valuemin="0"
              aria-valuemax="100"
            ></div>
          </div>
        </div>
      )}

      {alert.show && (
        <div className="alert alert-danger mb-4" role="alert">
          {alert.message}
        </div>
      )}

      {/* Step 1: Transportation */}
      {step === 1 && (
        <div className="card glass-card border-0 p-4 p-md-5">
          <h4 className="text-dark mb-4"><i className="bi bi-car-front text-success me-2"></i> Transportation</h4>
          <div className="row g-4">
            <div className="col-12 mb-3">
              <label className="form-label small fw-semibold text-muted">Assessment Log Date</label>
              <input
                type="date"
                className="form-control form-control-eco"
                value={formData.date}
                onChange={handleDateChange}
                max={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-semibold text-muted">Car Usage (km driven)</label>
              <input
                type="number"
                min="0"
                className="form-control form-control-eco"
                value={formData.transportation.carKm}
                onChange={(e) => handleNestedChange('transportation', 'carKm', e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-semibold text-muted">Car Fuel / Engine Type</label>
              <select
                className="form-select form-control-eco"
                value={formData.transportation.vehicleType}
                onChange={(e) => handleNestedChange('transportation', 'vehicleType', e.target.value)}
              >
                <option value="gasoline">Gasoline (Standard)</option>
                <option value="diesel">Diesel</option>
                <option value="hybrid">Hybrid</option>
                <option value="electric">Electric (EV)</option>
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-semibold text-muted">Bicycle Ride (km cycled)</label>
              <input
                type="number"
                min="0"
                className="form-control form-control-eco"
                value={formData.transportation.bikeKm}
                onChange={(e) => handleNestedChange('transportation', 'bikeKm', e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-semibold text-muted">Public Transit (bus/subway km)</label>
              <input
                type="number"
                min="0"
                className="form-control form-control-eco"
                value={formData.transportation.transitKm}
                onChange={(e) => handleNestedChange('transportation', 'transitKm', e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-semibold text-muted">Flight Duration (hours today)</label>
              <input
                type="number"
                min="0"
                className="form-control form-control-eco"
                value={formData.transportation.flightHrs}
                onChange={(e) => handleNestedChange('transportation', 'flightHrs', e.target.value)}
              />
            </div>
          </div>
          <div className="d-flex justify-content-end mt-4">
            <button className="btn btn-eco px-4" onClick={nextStep}>
              Next Step <i className="bi bi-arrow-right-short"></i>
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Home Energy */}
      {step === 2 && (
        <div className="card glass-card border-0 p-4 p-md-5">
          <h4 className="text-dark mb-4"><i className="bi bi-lightning-charge text-success me-2"></i> Household Energy & Resources</h4>
          <div className="row g-4">
            <div className="col-md-4">
              <label className="form-label small fw-semibold text-muted">Electricity Used (kWh)</label>
              <input
                type="number"
                min="0"
                step="0.1"
                className="form-control form-control-eco"
                value={formData.energy.electricityKwh}
                onChange={(e) => handleNestedChange('energy', 'electricityKwh', e.target.value)}
              />
              <span className="text-muted small">Daily equivalent (e.g. Monthly bill / 30)</span>
            </div>
            <div className="col-md-4">
              <label className="form-label small fw-semibold text-muted">Cooking Gas LPG (kg used)</label>
              <input
                type="number"
                min="0"
                step="0.05"
                className="form-control form-control-eco"
                value={formData.energy.lpgKg}
                onChange={(e) => handleNestedChange('energy', 'lpgKg', e.target.value)}
              />
              <span className="text-muted small">Standard cylinder is ~14kg</span>
            </div>
            <div className="col-md-4">
              <label className="form-label small fw-semibold text-muted">Water Consumption (litres)</label>
              <input
                type="number"
                min="0"
                className="form-control form-control-eco"
                value={formData.energy.waterLitres}
                onChange={(e) => handleNestedChange('energy', 'waterLitres', e.target.value)}
              />
              <span className="text-muted small">1 shower minute is ~10 litres</span>
            </div>
          </div>
          <div className="d-flex justify-content-between mt-5">
            <button className="btn btn-eco-outline px-4" onClick={prevStep}>
              <i className="bi bi-arrow-left-short"></i> Back
            </button>
            <button className="btn btn-eco px-4" onClick={nextStep}>
              Next Step <i className="bi bi-arrow-right-short"></i>
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Diet & Waste */}
      {step === 3 && (
        <div className="card glass-card border-0 p-4 p-md-5">
          <h4 className="text-dark mb-4"><i className="bi bi-trash text-success me-2"></i> Diet & Waste Profile</h4>
          <div className="row g-4">
            <div className="col-md-6">
              <label className="form-label small fw-semibold text-muted">Food Diet Profile</label>
              <select
                className="form-select form-control-eco"
                value={formData.food.dietType}
                onChange={(e) => handleNestedChange('food', 'dietType', e.target.value)}
              >
                <option value="vegan">Vegan (No animal products, lowest impact)</option>
                <option value="vegetarian">Vegetarian (Dairy/eggs, no meat)</option>
                <option value="mixed">Mixed (Moderate poultry/meat, standard)</option>
                <option value="meat-heavy">Meat-heavy (Frequent beef/pork/lamb)</option>
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-semibold text-muted">Plastic Packaging Consumption</label>
              <select
                className="form-select form-control-eco"
                value={formData.waste.plasticUsage}
                onChange={(e) => handleNestedChange('waste', 'plasticUsage', e.target.value)}
              >
                <option value="low">Low (Avoid plastic bags, buy cardboard/bulk)</option>
                <option value="medium">Medium (Standard retail packaging)</option>
                <option value="high">High (Takeout boxes, individual bottles)</option>
              </select>
            </div>
            <div className="col-12">
              <label className="form-label small fw-semibold text-muted">Waste Recycling Rate: {formData.waste.recyclingRate}%</label>
              <input
                type="range"
                className="form-range text-success"
                min="0"
                max="100"
                value={formData.waste.recyclingRate}
                onChange={(e) => handleNestedChange('waste', 'recyclingRate', e.target.value)}
              />
              <div className="d-flex justify-content-between text-muted small">
                <span>0% (Landfill all)</span>
                <span>50% (Sort bottles/cans)</span>
                <span>100% (Zero waste goal)</span>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-between mt-5">
            <button className="btn btn-eco-outline px-4" onClick={prevStep}>
              <i className="bi bi-arrow-left-short"></i> Back
            </button>
            <button
              className="btn btn-eco px-4"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Calculating...
                </>
              ) : (
                'Calculate Score'
              )}
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Results */}
      {step === 4 && result && (
        <div className="fade-in-up">
          <div className="card glass-card border-0 p-4 p-md-5 text-center mb-4">
            <div className="stat-icon stat-icon-green mx-auto mb-3" style={{ width: '80px', height: '80px', borderRadius: '50%', fontSize: '40px' }}>
              <i className="bi bi-cloud-check-fill text-success"></i>
            </div>
            <h2 className="text-dark">Calculation Successful!</h2>
            <p className="text-secondary mb-4">Emissions calculated for {new Date(result.date).toLocaleDateString()}</p>
            
            <div className="bg-light p-4 rounded-4 d-inline-block mx-auto mb-4 border" style={{ minWidth: '250px' }}>
              <p className="text-muted text-uppercase mb-1 small fw-bold">Today's Footprint</p>
              <h1 className="display-4 text-success brand-font m-0">{result.calculatedScore}</h1>
              <p className="text-muted m-0 small">kg CO2 equivalent</p>
            </div>

            <div className="mb-4">
              <h5 className="text-dark mb-2">Estimated Equivalents:</h5>
              <div className="row g-3 justify-content-center text-secondary small">
                <div className="col-auto px-3 py-2 border rounded-pill bg-white">
                  Weekly estimate: <strong>{(result.calculatedScore * 7).toFixed(1)} kg</strong>
                </div>
                <div className="col-auto px-3 py-2 border rounded-pill bg-white">
                  Monthly estimate: <strong>{(result.calculatedScore * 30).toFixed(1)} kg</strong>
                </div>
                <div className="col-auto px-3 py-2 border rounded-pill bg-white">
                  Yearly estimation: <strong>{(result.calculatedScore * 365 / 1000).toFixed(2)} Tons</strong>
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-center gap-3">
              <button className="btn btn-eco px-4" onClick={() => setStep(1)}>
                Log Another Day
              </button>
              <a href="/dashboard" className="btn btn-eco-outline px-4">
                Go to Dashboard
              </a>
            </div>
          </div>

          <RecommendationCard score={result.calculatedScore} />
        </div>
      )}
    </div>
  );
};

export default Calculator;
