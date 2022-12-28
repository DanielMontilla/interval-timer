import { z } from 'zod';

export const workoutNameMax = 20;
export const exerciseNameMax = 20;

export const workoutNameSchema = z.string({ invalid_type_error: `must be a string`})
  .max(workoutNameMax, { message: `must be less than ${workoutNameMax}` })
  .min(1, { message: `can't be empty` });

export const repsSchema = z.number({invalid_type_error: `must be a number`})
  .positive({ message: `must be possitive` })
  .min(1, { message: `must have atleast 1` })
  .max(2048, { message: `must be less than 2049` })
  .int({ message: `must be a whole number` });

export const exerciseNameSchema = z.string({ invalid_type_error: `must be a string`})
  .max(exerciseNameMax, { message: `must be less than ${exerciseNameMax}` })
  .min(1, { message: `can't be empty`});
  
export const durationSchema = z.number({invalid_type_error: `must be a number`})
  .positive({ message: `must be possitive`});
  
export const exerciseSchema = z.object({
  name: exerciseNameSchema,
  duration: durationSchema
});

export const workoutSchema = z.object({
  name: workoutNameSchema,
  reps: repsSchema,
  exercises: z.array(exerciseSchema).nonempty()
});

export const workoutsSchema = z.record(workoutSchema);