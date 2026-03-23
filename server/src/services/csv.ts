import { parse } from 'csv-parse/sync';

export type HealthCsvRow = {
  date: string;
  steps?: string;
  exercise_minutes?: string;
  calories?: string;
  protein?: string;
  resting_hr?: string;
  weight_kg?: string;
  body_fat_pct?: string;
};

export const parseCsv = <T>(input: string): T[] => {
  return parse(input, {
    columns: true,
    skip_empty_lines: true,
    trim: true
  }) as T[];
};

export const sanitizeCsvBuffer = (buffer: Buffer) => {
  if (buffer.length > 2 * 1024 * 1024) {
    throw new Error('CSV exceeds 2MB limit');
  }
  return buffer.toString('utf8').replace(/\u0000/g, '');
};
