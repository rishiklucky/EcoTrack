/**
 * Carbon Footprint Calculator Utility
 * Calculates carbon footprint in kg CO2e based on daily activities
 */

const calculateCarbonFootprint = (activity) => {
  const { transportation, energy, food, waste } = activity;

  // 1. Transportation
  let carFactor = 0.18; // default gasoline
  if (transportation.vehicleType === 'electric') carFactor = 0.05;
  else if (transportation.vehicleType === 'hybrid') carFactor = 0.10;
  else if (transportation.vehicleType === 'diesel') carFactor = 0.20;

  const carEmission = (transportation.carKm || 0) * carFactor;
  const bikeEmission = (transportation.bikeKm || 0) * 0.005; // trace 0.005 kg CO2e per km
  const transitEmission = (transportation.transitKm || 0) * 0.05; // 0.05 kg CO2e per km
  const flightEmission = (transportation.flightHrs || 0) * 90.0; // 90 kg CO2e per flight hour

  const transportTotal = carEmission + bikeEmission + transitEmission + flightEmission;

  // 2. Energy
  const electricityEmission = (energy.electricityKwh || 0) * 0.85; // 0.85 kg CO2e per kWh
  const lpgEmission = (energy.lpgKg || 0) * 3.0; // 3.0 kg CO2e per kg
  const waterEmission = (energy.waterLitres || 0) * 0.0003; // 0.0003 kg CO2e per litre

  const energyTotal = electricityEmission + lpgEmission + waterEmission;

  // 3. Food (Diet)
  let foodEmission = 4.0; // Mixed diet default (4.0 kg CO2e per day)
  if (food.dietType === 'vegan') foodEmission = 1.5;
  else if (food.dietType === 'vegetarian') foodEmission = 2.5;
  else if (food.dietType === 'meat-heavy') foodEmission = 7.0;

  // 4. Waste
  let wasteEmission = 1.0; // Medium plastic default
  if (waste.plasticUsage === 'low') wasteEmission = 0.2;
  else if (waste.plasticUsage === 'high') wasteEmission = 2.0;

  // Recycling deduction (reduces waste emissions up to 1.5 kg CO2e/day)
  const recyclingDeduction = ((waste.recyclingRate || 0) / 100) * 1.5;
  const wasteTotal = Math.max(0.1, wasteEmission - recyclingDeduction);

  // Grand Total
  const totalScore = transportTotal + energyTotal + foodEmission + wasteTotal;

  // Return formatted to 2 decimal places
  return parseFloat(totalScore.toFixed(2));
};

module.exports = { calculateCarbonFootprint };
