import { z } from 'zod';

export const taskInputSchema = z.object({
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
  progress: z.number().min(0).max(100).nullable(),
});

export const taskSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().nullable(),
  label: z.string(),
  status: z.enum(['todo', 'in-progress', 'done', 'backlog']),
  priority: z.string().nullable(),
  due_date: z.coerce.date().nullable(),
  start_date: z.coerce.date().nullable(),
  created_at: z.coerce.date().nullable(),
  updated_at: z.coerce.date().nullable(),
  progress: z.number().min(0).max(100).nullable(),
});

export const taskUpdateSchema = z.object({
  id: z.number().nullable(),
  title: z.string().nullable(),
  description: z.string().nullable(),
  label: z.string().nullable(),
  status: z.string().nullable(),
  priority: z.string().nullable(),
  due_date: z.coerce.date().nullable(),
  start_date: z.coerce.date().nullable(),
  created_at: z.coerce.date().nullable(),
  updated_at: z.coerce.date().nullable(),
  progress: z.number().min(0).max(100).nullable(),
});

export type Task = z.infer<typeof taskSchema>;
export type TaskInput = z.infer<typeof taskInputSchema>;
export type TaskUpdate = z.infer<typeof taskUpdateSchema>;