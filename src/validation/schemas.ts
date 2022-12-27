import { Exercise } from '@/types';
import { z, ZodObject } from 'zod';

export const exerciseNameMax = 20;
export const workoutNameMax = 20;

export const exerciseSchema = z.object({
  name: z.string().max(exerciseNameMax),
  duration: z.number().positive()
});

export const workoutSchema = z.object({
  name: z.string().max(workoutNameMax),
  reps: z.number().positive().int(),
  exercises: z.array(exerciseSchema).nonempty()
});

export const workoutsSchema = z.record(workoutSchema);