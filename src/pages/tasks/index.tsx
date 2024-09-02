import { Layout } from "@/components/custom/layout";
import { DataTable } from "./components/data-table";
import { columns } from "./components/columns";
import { invoke } from "@tauri-apps/api";
import { useEffect, useState } from "react";
import { Task, TaskInput, TaskUpdate } from "./data/schema";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import TaskList from "./components/list";
import TaskForm from "./components/form";
import Kanban from "./components/kanban";
import { toast } from "@/components/ui/use-toast";
import GanttChart from "./components/gantt/App";

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    async function fetchTasks() {
      try {
        const fetchedTasks: Task[] = await invoke("get_tasks");
        console.log(fetchedTasks)
        setTasks(fetchedTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    }

    fetchTasks();
  }, []);

  const handleTaskComplete = async (taskId: number | null) => {
    if (taskId === null) return;

    const due_date = new Date();

    try {
      await invoke("update_task", {
        payload: {
          task_id: taskId,
          status: "done",
          due_date: due_date,
        },
      });

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId
            ? { ...task, status: "done", due_date: due_date }
            : task
        )
      );
    } catch (error) {
      console.error("Failed to update task status:", error);
    }
  };

  const handleNewTask = async (newTask: string) => {
    const [label, title] = newTask.split(":").map((part) => part.trim());

    const task: TaskInput = {
      id: null,
      title: title ?? label,
      status: "todo",
      created_at: new Date().toISOString(),
      label: title ? label.toLowerCase() : "general",
      priority: "low",
      due_date: null,
      start_date: null,
      updated_at: null,
      description: null,
      progress: 0
    };

    try {
      const newTaskList: Task[] = await invoke("add_task", { task });
      setTasks(newTaskList);
    } catch (error) {
      console.log(error);
      console.error("Failed to add task:", error);
    }
  };

  const handleTaskUpdate = async (task: TaskUpdate) => {
    try {
      console.log("SDFSDFSD", task)
      const date = new Date();
      const taskUpdate: Partial<Task> = { id: task.id! };

      if (task.due_date) {
        await invoke("update_task", {
          payload: {
            id: task.id,
            due_date: task.due_date,
            start_date: task.start_date
          },
        });
        taskUpdate.due_date = task.due_date;
        taskUpdate.start_date = task.start_date
        toast({
          title: `Task updated to ${task.start_date}-${task.due_date}`,
          description: (
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
              <code className="text-white">
                {JSON.stringify(`${task.title} date updated`, null, 2)}
              </code>
            </pre>
          ),
          variant: "default",
          duration: 1000,
        });
      } else if (task.progress) {
        await invoke("update_task", {
          payload: {
            id: task.id,
            progress: task.progress,
          },
        });
        taskUpdate.progress = task.progress;
        toast({
          title: `Task progress updated to ${task.progress}`,
          description: (
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
              <code className="text-white">
                {JSON.stringify(`${task.title} progress updated`, null, 2)}
              </code>
            </pre>
          ),
          variant: "default",
          duration: 1000,
        });
      } else {
        console.log(task, date);

        await invoke("update_task_status", {
          payload: {
            task_id: task.id,
            new_status: task.status,
          },
        });

        if (task.status === "in-progress") {
          let dueDate: Date | null = task.due_date;
          if (!dueDate) {
            dueDate = new Date(date);
            dueDate.setDate(dueDate.getDate() + 7);
            taskUpdate.due_date = dueDate;
          }
          taskUpdate.start_date = date;

          await invoke("update_task", {
            payload: {
              id: task.id,
              start_date: taskUpdate.start_date,
              due_date: taskUpdate.due_date,
            },
          });
        }

        if (task.status === "done") {
          taskUpdate.due_date = date;

          await invoke("update_task", {
            payload: {
              id: task.id,
              due_date: taskUpdate.due_date,
            },
          });
        }

        if (task.status === "todo" || task.status === "backlog") {
          taskUpdate.start_date = null;
          taskUpdate.due_date = null;

          await invoke("update_task", {
            payload: {
              id: task.id,
              start_date: taskUpdate.start_date,
              due_date: taskUpdate.due_date,
            },
          });
        }
        toast({
          title: `Task status updated to ${task.status}`,
          description: (
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
              <code className="text-white">
                {JSON.stringify(`${task.title} status updated`, null, 2)}
              </code>
            </pre>
          ),
          variant: "default",
          duration: 1000,
        });
      }
      setTasks((prevTasks) =>
        prevTasks.map((t) => (t.id === task.id ? { ...t, ...taskUpdate } : t))
      );

    } catch (error) {
      console.error("Failed to update task status:", error);
    }
  };

  return (
    <Layout>
      <Layout.Body>
        <div className="mb-2 flex items-center justify-between space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Tasks</h2>
        </div>
        <Tabs orientation="vertical" defaultValue="list" className="space-y-4">
          <div className="w-full overflow-x-auto pb-2">
            <TabsList>
              <TabsTrigger value="list">List</TabsTrigger>
              <TabsTrigger value="gantt">Gantt</TabsTrigger>
              <TabsTrigger value="table">Table</TabsTrigger>
              <TabsTrigger value="kanban">Kanban</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="table" className="space-y-4">
            <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
              <DataTable data={tasks} columns={columns} />
            </div>
          </TabsContent>
          <TabsContent value="kanban" className="space-y-4">
            <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
              <Kanban tasks={tasks} taskUpdateHandler={handleTaskUpdate} />
            </div>
          </TabsContent>
          <TabsContent value="gantt" className="space-y-4">
            <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
              <GanttChart taskUpdateHandler={handleTaskUpdate} tasks={tasks} />
            </div>
          </TabsContent>
          <TabsContent value="list" className="space-y-4">
            <div className="w-full -mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
              <Card className="min-h-[650px] w-full">
                <TaskForm handleNewTask={handleNewTask} />
                <TaskList onTaskComplete={handleTaskComplete} tasks={tasks} />
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </Layout.Body>
    </Layout>
  );
}
