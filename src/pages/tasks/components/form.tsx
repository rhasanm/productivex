import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/custom/button";
import React from "react";

interface TaskFormProps {
  handleNewTask: (task: string) => void;
}

const formSchema = z.object({
  task: z.string().min(2, {
    message: "task must be at least 2 characters.",
  }),
});

const TaskForm: React.FC<TaskFormProps> = ({ handleNewTask }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      task: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    handleNewTask(values.task);

    form.setValue("task", "")
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="m-4 flex">
        <FormField
          control={form.control}
          name="task"
          render={({ field }) => (
            <FormItem className="flex-grow">
              <FormControl>
                <Input
                  className="border-gray-400 w-full"
                  placeholder="Add a task..."
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button className="ml-2 flex-shrink-0" type="submit">
          +ADD
        </Button>
      </form>
    </Form>
  );
};

export default TaskForm;
