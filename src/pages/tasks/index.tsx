import { Layout } from "@/components/custom/layout";
import { DataTable } from "./components/data-table";
import { columns } from "./components/columns";
import { invoke } from "@tauri-apps/api";
import { useEffect, useState } from "react";
import { Task, TaskInput } from "./data/schema";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import TaskList from "./components/list";
import TaskForm from "./components/form";
import Kanban from "./components/kanban";

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    async function fetchTasks() {
      try {
        const fetchedTasks: Task[] = await invoke("get_tasks");
        setTasks(fetchedTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    }

    fetchTasks();
  }, []);

  const handleTaskComplete = async (taskId: number | null) => {
    if (taskId === null) return;
  
    try {
      await invoke("update_task_status", {
        payload: {
          task_id: taskId,
          new_status: "done",
        },
      });
  
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, status: "done" } : task
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
      label: title ? label : "general",
      priority: "low",
      due_date: null,
      start_date: null,
      updated_at: new Date().toISOString(),
      description: null,
    };

    try {
      const newTaskList: Task[] = await invoke("add_task", { task });
      setTasks(newTaskList);
    } catch (error) {
      console.log(error);
      console.error("Failed to add task:", error);
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
              <Kanban />
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
