import { Exercise, Workout } from "@/types";
import { exerciseSchema, workoutSchema, workoutsSchema } from "@/validation";

export const parseExercise = (exercise: Exercise | unknown) => exerciseSchema.safeParse(exercise);
export const parseWorkout = (workout: Workout | unknown) => workoutSchema.safeParse(workout);
export const parseWorkouts = (workouts: Workout[] | unknown) => workoutsSchema.safeParse(workouts);