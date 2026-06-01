export function calculateOwnershipCost({ bike, dailyKm, years = 3, downPayment = 0, loanTenure = 24, fuelPrice = 106, electricityRate = 8 }) {
  const price = bike.basePrice || 100000;
  const loanAmount = price - downPayment;
  const monthlyRate = 0.09 / 12; // 9% annual interest
  const emi = loanAmount > 0
    ? Math.round((loanAmount * monthlyRate * Math.pow(1 + monthlyRate, loanTenure)) / (Math.pow(1 + monthlyRate, loanTenure) - 1))
    : 0;

  const totalKm = dailyKm * 365 * years;
  let fuelCost = 0;

  if (bike.fuelType === 'Electric' && bike.evSpecs) {
    const rangePerCharge = parseFloat(bike.evSpecs?.range?.realWorld) || 100;
    const chargesNeeded = totalKm / rangePerCharge;
    const costPerCharge = (parseFloat(bike.evSpecs?.batteryCapacity) || 3) * electricityRate;
    fuelCost = Math.round(chargesNeeded * costPerCharge);
  } else {
    const mileage = parseFloat(bike.mileage?.realWorld) || 45;
    fuelCost = Math.round((totalKm / mileage) * fuelPrice);
  }

  const insurance1stYear = bike.insuranceEstimate || 8000;
  const insuranceRenewal = Math.round(insurance1stYear * 0.6);
  const totalInsurance = insurance1stYear + (insuranceRenewal * (years - 1));

  const servicesPerYear = Math.floor((dailyKm * 365) / (parseFloat(bike.serviceInterval) || 3000));
  const totalServices = servicesPerYear * years;
  const serviceCost = totalServices * (bike.avgServiceCost || 1500);

  const tyreReplacement = totalKm > 25000 ? 4000 : 0;

  const totalCost = price + fuelCost + totalInsurance + serviceCost + tyreReplacement;
  const costPerKm = totalKm > 0 ? (totalCost / totalKm).toFixed(2) : 0;

  return {
    purchasePrice: price,
    emi,
    totalLoanCost: emi * loanTenure,
    fuelCost,
    totalInsurance,
    serviceCost,
    tyreReplacement,
    totalCost,
    costPerKm,
    totalKm,
    years
  };
}

export function calculateEVSavings(evBike, petrolBike, dailyKm, fuelPrice = 106, electricityRate = 8) {
  const evOwnership = calculateOwnershipCost({ bike: evBike, dailyKm, fuelPrice, electricityRate });
  const petrolOwnership = calculateOwnershipCost({ bike: petrolBike, dailyKm, fuelPrice });
  const savings = petrolOwnership.totalCost - evOwnership.totalCost;
  const monthlyFuelSavings = Math.round((petrolOwnership.fuelCost - evOwnership.fuelCost) / 36);
  const breakEven = savings > 0 ? Math.round((evBike.basePrice - petrolBike.basePrice) / (monthlyFuelSavings || 1)) : null;

  return { savings, monthlyFuelSavings, breakEven, evOwnership, petrolOwnership };
}

export function calculateSubsidy(bike) {
  if (bike.fuelType !== 'Electric') return { fameSubsidy: 0, stateSubsidy: {}, totalMax: 0 };
  const fameSubsidy = 10000; // FAME II per kWh capped
  const stateSubsidies = {
    Maharashtra: 5000,
    Delhi: 30000,
    Gujarat: 20000,
    Rajasthan: 2500,
    'Tamil Nadu': 15000,
    Karnataka: 0,
    'Uttar Pradesh': 0,
    'West Bengal': 0
  };
  const totalMax = fameSubsidy + Math.max(...Object.values(stateSubsidies));
  return { fameSubsidy, stateSubsidies, totalMax };
}

export function formatINR(amount) {
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
  return `₹${amount}`;
}
