import express from 'express';
import bmiCalculator from './bmiCalculator';
import { calculateExercises, ExerciseValues } from './exerciseCalculator';

const app = express();
app.use(express.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  const height = req.query.height;
  const weight = req.query.weight;
  if (height === undefined || weight === undefined) {
    res.send({error: "malformatted parameters"});
  }

  try {
    const bmi = bmiCalculator.calculateBmi(
      Number(height),
      Number(weight)
    );
    res.send({
      weight,
      height,
      bmi
    });
  } catch (error: unknown) {
    let errorMessage = 'Something bad happened.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    res.send({error: errorMessage});
  }
});

app.post('/exercises', (req, res) => {
   
  const { daily_exercises, target } = req.body as ExerciseValues;

  if (!daily_exercises || !target ) {
    res.status(400).send({error: 'parameters missing'});
  }

  if (isNaN(target) || daily_exercises.some(d => isNaN(d))) {
    res.status(400).send({error: 'malformatted parameters'});
  }
  const result = calculateExercises(daily_exercises, target);
  res.send(result);
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
