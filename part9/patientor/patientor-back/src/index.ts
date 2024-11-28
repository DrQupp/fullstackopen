import express from 'express';
import diagnosisRouter from './routes/diagnoses';
import patientRouter from './routes/patients';

import cors from 'cors';
import { Request } from 'express';

const app = express();
const allowedOrigins = ['http://localhost:5173'];

const options: cors.CorsOptions = {
  origin: allowedOrigins
};

app.use(cors<Request>(options));

app.use(express.json());

const PORT = 3001;

app.get('/api/ping', (_req, res) => {
  console.log('someone pinged here');
  res.send('pong');
});

app.use('/api/diagnoses', diagnosisRouter);
app.use('/api/patients', patientRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});