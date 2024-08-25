import { z } from 'zod'

// Updated schema to match the new fields in the database
export const taskSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().nullable(),
  label: z.string().nullable(),
  status: z.string().nullable(),
  priority: z.string().nullable(),
  due_date: z.string().datetime().nullable(),
  start_date: z.string().datetime().nullable(),
  created_at: z.string().datetime().nullable(),
  updated_at: z.string().datetime().nullable(),
})

export type Task = z.infer<typeof taskSchema>
