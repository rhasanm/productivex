import { z } from 'zod'

export const taskSchema = z.object({
  id: z.number().nullable(),
  title: z.string(),
  description: z.string().nullable(),
  label: z.string().nullable(),
  status: z.string().nullable(),
  priority: z.string().nullable(),
  due_date: z.string().datetime().nullable(),
  start_date: z.string().datetime().nullable(),
  created_at: z.string().datetime().nullable(),
  updated_at: z.string().datetime().nullable(),
});

export type Task = z.infer<typeof taskSchema>;
