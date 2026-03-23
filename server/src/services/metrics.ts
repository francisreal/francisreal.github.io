import { Metric } from '@prisma/client';

const avg = (vals: number[]) => (vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0);

export const computeSummary = (metrics: Metric[], heightCm?: number | null) => {
  const steps = metrics.map((m) => m.steps ?? 0);
  const calories = metrics.map((m) => m.calories ?? 0);
  const protein = metrics.map((m) => m.protein ?? 0);
  const restingHr = metrics.map((m) => m.restingHr ?? 0);
  const weightEntries = metrics.filter((m) => m.weightKg != null).map((m) => m.weightKg as number);
  const bfEntries = metrics.filter((m) => m.bodyFatPct != null).map((m) => m.bodyFatPct as number);

  const latestWeight = weightEntries[weightEntries.length - 1] ?? 0;
  const latestBf = bfEntries[bfEntries.length - 1] ?? 0;
  const bmi = heightCm ? latestWeight / ((heightCm / 100) ** 2) : 0;
  const fatMass = latestWeight * (latestBf / 100);
  const leanMass = latestWeight - fatMass;
  const targetWeightAt18 = leanMass / 0.82;

  return {
    averages: {
      steps: Math.round(avg(steps)),
      calories: Math.round(avg(calories)),
      protein: Number(avg(protein).toFixed(1)),
      restingHr: Math.round(avg(restingHr))
    },
    body: {
      latestWeight,
      latestBf,
      bmi: Number(bmi.toFixed(2)),
      fatMass: Number(fatMass.toFixed(2)),
      leanMass: Number(leanMass.toFixed(2)),
      targetWeightAt18: Number(targetWeightAt18.toFixed(2))
    }
  };
};
