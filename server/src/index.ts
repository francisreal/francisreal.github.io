import 'dotenv/config';
import { app } from './app';

const port = Number(process.env.PORT || 4000);

app.listen(port, () => {
  // Place to attach Bevel/HealthKit webhook ingestion in future.
  console.log(`TempoCoach API running on :${port}`);
});
