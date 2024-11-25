interface Result {
  periodLength: number
  trainingDays: number
  success: boolean
  rating: number
  ratingDescription: string
  target: number
  average: number
}

export interface ExerciseValues {
  target: number
  daily_exercises: number[]
}

const parseArguments2 = (args: string[]): ExerciseValues => {
  if (args.length < 4) throw new Error('Not enough arguments');

  const target: number = Number(args[2]);
  const daily_exercises: number[] = args.slice(3).map((arg) => Number(arg));

  if (isNaN(target) || daily_exercises.some((e) => isNaN(e))) {
    throw new Error('Provided values were not numbers!');
  } else {
    return {
      target,
      daily_exercises
    };
  }
};

export const calculateExercises = (
  dailyExercises: number[],
  target: number
): Result => {
  if (target === 0) throw new Error('Target cannot be 0');

  const periodLength: number = dailyExercises.length;
  const trainingDays: number = dailyExercises.filter(
    (hours) => hours !== 0
  ).length;
  const totalTrainingHours: number = dailyExercises.reduce(
    (acc, value) => acc + value,
    0
  );
  const average: number = totalTrainingHours / periodLength;

  const percentReached: number = average / target;
  let success: boolean = true;
  let rating: number = 3;
  let ratingDescription: string = 'Great! Objective reached!';
  if (percentReached < 0.8) {
    rating = 1;
    ratingDescription = 'Not good... I know you can do better!';
    success = false;
  } else if (percentReached < 1) {
    rating = 2;
    ratingDescription = 'Almost there, a little more next time!';
    success = false;
  }

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average
  };
};

if (require.main === module) {
  try {
    const { target, daily_exercises } = parseArguments2(process.argv);
    console.log(calculateExercises(daily_exercises, target));
  } catch (error: unknown) {
    let errorMessage = 'Something bad happened.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    console.log(errorMessage);
  }
}