import React from 'react';

const RecommendationCard = ({ score }) => {
  let impactLevel = 'Low';
  let cardClass = 'border-success bg-success bg-opacity-10';
  let badgeColor = 'bg-success';
  let recommendations = [];

  if (score > 15) {
    impactLevel = 'High';
    cardClass = 'border-danger bg-danger bg-opacity-10';
    badgeColor = 'bg-danger';
    recommendations = [
      {
        icon: 'bi-bus-front',
        title: 'Adopt Transit or Carpool',
        desc: 'Your transport emissions are high. Utilizing subways, trains, buses, or carpooling cuts transportation carbon by 50%+'
      },
      {
        icon: 'bi-lightbulb-off',
        title: 'Energy Conservation',
        desc: 'Reduce electricity: switch off background devices, wash clothes in cold water, and transition completely to LED lighting.'
      },
      {
        icon: 'bi-egg-fried',
        title: 'Eat Plant-Forward',
        desc: 'Animal products produce high methane and land-use carbon. Substituting meat-heavy meals with vegan/vegetarian alternatives drops food footprint.'
      },
      {
        icon: 'bi-recycle',
        title: 'Strict Waste Sorting',
        desc: 'Separate paper, metals, glass, and plastic. Start organic composting to eliminate landfill methane.'
      }
    ];
  } else if (score >= 8) {
    impactLevel = 'Medium';
    cardClass = 'border-warning bg-warning bg-opacity-10';
    badgeColor = 'bg-warning text-dark';
    recommendations = [
      {
        icon: 'bi-plug',
        title: 'Energy Efficient Upgrades',
        desc: 'Switch to energy-efficient appliances (Energy Star rating) and configure smart home thermostat levels.'
      },
      {
        icon: 'bi-bag-check',
        title: 'Eco-conscious Shopping',
        desc: 'Avoid products with heavy plastic packaging. Prioritize locally sourced food products and purchase long-lasting items.'
      },
      {
        icon: 'bi-bicycle',
        title: 'Active Commuting',
        desc: 'For short trips under 3 kilometers, consider walking or riding a bicycle. It is healthy and produces zero emissions.'
      },
      {
        icon: 'bi-droplet-half',
        title: 'Water Management Habits',
        desc: 'Reduce warm water usage. Fit low-flow aerators on sinks, take shorter showers, and water gardens early in the morning.'
      }
    ];
  } else {
    impactLevel = 'Low';
    cardClass = 'border-success bg-success bg-opacity-10';
    badgeColor = 'bg-success';
    recommendations = [
      {
        icon: 'bi-tree',
        title: 'Advanced Composting & Zero-Waste',
        desc: 'You are doing great! Focus on complete zero-waste by shopping in bulk with glass jars and composing 100% of organic leftovers.'
      },
      {
        icon: 'bi-people',
        title: 'Join Community Eco-Challenges',
        desc: 'Multiply your impact by rallying others. Launch neighborhood cleanups, green challenges, or tree-planting campaigns.'
      },
      {
        icon: 'bi-sun',
        title: 'Invest in Solar/Renewables',
        desc: 'Consider household solar panel arrays, solar water heaters, or subscribing to local community solar projects.'
      },
      {
        icon: 'bi-chat-quote',
        title: 'Advocate & Share',
        desc: 'Promote carbon awareness. Write blogs, share your carbon-saving dashboard data, and guide others to reduce their carbon output.'
      }
    ];
  }

  return (
    <div className={`card border-1 rounded-4 p-4 ${cardClass}`}>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h4 className="m-0 text-dark">Personalized Recommendations</h4>
          <p className="text-muted small m-0">Based on your carbon footprint of {score} kg CO2e/day</p>
        </div>
        <span className={`badge ${badgeColor} px-3 py-2 fs-6 rounded-pill`}>
          {impactLevel} Carbon Impact
        </span>
      </div>

      <div className="row g-3">
        {recommendations.map((rec, index) => (
          <div className="col-md-6" key={index}>
            <div className="card h-100 border-0 bg-white p-3 rounded-3 shadow-sm">
              <div className="d-flex gap-3">
                <div className="text-success fs-3">
                  <i className={`bi ${rec.icon}`}></i>
                </div>
                <div>
                  <h6 className="fw-bold mb-1 text-dark">{rec.title}</h6>
                  <p className="text-secondary small m-0">{rec.desc}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendationCard;
