import { z } from 'zod'

// Updated schema to match the new fields in the database
export const taskSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().nullable(),
  label: z.string().nullable(),
  status: z.string().nullable(),
  priority: z.string().nullable(),
  due_date: z.coerce.date().nullable(), // Converts string to Date object
  start_date: z.coerce.date().nullable(), // Converts string to Date object
  created_at: z.coerce.date().nullable(), // Converts string to Date object
  updated_at: z.coerce.date().nullable(), // Converts string to Date object
})

export type Task = z.infer<typeof taskSchema>
