exports.calculateRisk = (symptoms) => {

  let score = 0;

  if (symptoms.includes("Fever")) score += 2;
  if (symptoms.includes("Swelling")) score += 2;
  if (symptoms.includes("Redness")) score += 2;
  if (symptoms.includes("Pain")) score += 1;
  if (symptoms.includes("Breathing difficulty")) score += 4;

  if (score <= 2) return "Low";
  if (score <= 5) return "Intermediate";

  return "Severe";
};