/**
 * Carbon Footprint Calculator Test Cases
 * Validates calculation outputs against predefined emissions scenarios
 */

const { calculateCarbonFootprint } = require('../utils/calculator');

const testCases = [
  {
    name: 'Vegan diet with minimal transit emissions',
    activity: {
      transportation: { carKm: 0, bikeKm: 5, transitKm: 2, flightHrs: 0 },
      energy: { electricityKwh: 2, lpgKg: 0, waterLitres: 50 },
      food: { dietType: 'vegan' },
      waste: { recyclingRate: 80, plasticUsage: 'low' }
    },
    expectedMax: 5.0, // should qualify for Carbon Saver badge
  },
  {
    name: 'Standard Mixed Diet with normal household utilities',
    activity: {
      transportation: { carKm: 15, bikeKm: 0, transitKm: 10, flightHrs: 0 },
      energy: { electricityKwh: 12, lpgKg: 0.3, waterLitres: 150 },
      food: { dietType: 'mixed' },
      waste: { recyclingRate: 30, plasticUsage: 'medium' }
    },
    expectedMin: 10.0,
    expectedMax: 20.0,
  },
  {
    name: 'High impact meat diet and flight travel log',
    activity: {
      transportation: { carKm: 60, bikeKm: 0, transitKm: 0, flightHrs: 3 },
      energy: { electricityKwh: 25, lpgKg: 1.0, waterLitres: 300 },
      food: { dietType: 'meat-heavy' },
      waste: { recyclingRate: 10, plasticUsage: 'high' }
    },
    expectedMin: 280.0, // heavy flight emissions (3 * 90 = 270)
  },
  {
    name: 'Electric vehicle comparison test',
    activity: {
      transportation: { carKm: 100, vehicleType: 'electric', bikeKm: 0, transitKm: 0, flightHrs: 0 },
      energy: { electricityKwh: 0, lpgKg: 0, waterLitres: 0 },
      food: { dietType: 'vegan' },
      waste: { recyclingRate: 100, plasticUsage: 'low' }
    },
    expectedMin: 6.0,
    expectedMax: 7.0,
  }
];

const runTests = () => {
  console.log('Running Carbon Calculator Formula Tests...');
  let failed = 0;

  testCases.forEach((tc, index) => {
    const score = calculateCarbonFootprint(tc.activity);
    console.log(`\nTest #${index + 1}: ${tc.name}`);
    console.log(`Calculated Footprint: ${score} kg CO2e/day`);

    let passed = true;
    if (tc.expectedMax !== undefined && score > tc.expectedMax) {
      console.error(`FAIL: Score ${score} exceeded expected maximum of ${tc.expectedMax}`);
      passed = false;
    }
    if (tc.expectedMin !== undefined && score < tc.expectedMin) {
      console.error(`FAIL: Score ${score} fell below expected minimum of ${tc.expectedMin}`);
      passed = false;
    }

    if (passed) {
      console.log('RESULT: PASSED ✓');
    } else {
      failed++;
    }
  });

  console.log(`\nTests Completed. Failed: ${failed}`);
  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
};

runTests();
