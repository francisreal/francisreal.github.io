import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/lib/auth';

const prisma = new PrismaClient();

const templates = [
  {
    code: 'A',
    name: 'Session A - Strength',
    exercises: [
      { name: 'Deadlift', equipment: 'barbell', sets: 3, reps: 5, restSec: 90, progressionIncrementKg: 2.5 },
      { name: 'Overhead Press', equipment: 'barbell', sets: 3, reps: 6, restSec: 75, progressionIncrementKg: 1.25 },
      { name: 'Bent-over Row', equipment: 'barbell', sets: 3, reps: 8, restSec: 60, progressionIncrementKg: 2.5 },
      { name: 'Goblet Squat', equipment: 'kettlebell', sets: 3, reps: 8, restSec: 60, progressionIncrementKg: 2.5 }
    ]
  },
  {
    code: 'B',
    name: 'Session B - Mobility & Conditioning',
    exercises: [
      { name: 'KB Swings', equipment: 'kettlebell', sets: 4, reps: 12, restSec: 45, progressionIncrementKg: 2.5 },
      { name: 'Tempo Push-ups', equipment: 'bodyweight', sets: 4, reps: 10, restSec: 45, progressionIncrementKg: 0 },
      { name: 'Split Squat', equipment: 'dumbbell', sets: 3, reps: 10, restSec: 60, progressionIncrementKg: 1.25 }
    ]
  },
  {
    code: 'C',
    name: 'Session C - Hypertrophy',
    exercises: [
      { name: 'Romanian Deadlift', equipment: 'barbell', sets: 4, reps: 8, restSec: 75, progressionIncrementKg: 2.5 },
      { name: 'Incline DB Press', equipment: 'dumbbell', sets: 4, reps: 10, restSec: 60, progressionIncrementKg: 1.25 },
      { name: 'Lat Pulldown', equipment: 'machine', sets: 4, reps: 10, restSec: 60, progressionIncrementKg: 2.5 }
    ]
  }
];

async function main() {
  const email = 'owner@tempocoach.local';
  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      hashedPassword: await hashPassword('password123'),
      sex: 'male',
      dob: '1990-01-01',
      heightCm: 172,
      startingWeight: 72.18,
      bodyFatPct: 26,
      commuteMiles: 0.5,
      nutritionTarget: { create: { calories: 2050, protein: 115 } }
    }
  });

  for (const template of templates) {
    await prisma.workoutTemplate.upsert({
      where: { code: template.code },
      update: { name: template.name },
      create: {
        code: template.code,
        name: template.name,
        exercises: { create: template.exercises }
      }
    });
  }

  for (let i = 0; i < 14; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    await prisma.metric.upsert({
      where: { userId_date: { userId: user.id, date } },
      update: {},
      create: {
        userId: user.id,
        date,
        steps: 4300 + i * 75,
        exerciseMinutes: 22 + (i % 5),
        calories: 2050 + (i % 3) * 50,
        protein: 115 + (i % 2) * 5,
        restingHr: 56 + (i % 2),
        weightKg: 72.18 - i * 0.03,
        bodyFatPct: 26 - i * 0.03
      }
    });
  }

  console.log('Seed complete');
}

main().finally(() => prisma.$disconnect());
