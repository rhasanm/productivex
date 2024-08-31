import React from "react";
import { Task } from "../data/schema";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";

interface TaskListProps {
  tasks: Task[];
  onTaskComplete: (taskId: number | null) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onTaskComplete }) => {
  return (
    <ul className="space-y-4">
      <ScrollArea className="h-[550px]">
        {tasks.filter(task => task.status !== 'done').map((task) => (
          <li
            key={task.id}
            className="flex items-center justify-between p-4 rounded shadow-sm"
          >
            <div className="flex items-center">
              <Checkbox
                checked={task.status === "done"}
                onCheckedChange={() => onTaskComplete(task.id)}
                className={`mr-3 h-4 w-4 md:h-4 md:w-4 lg:h-4 lg:w-4 rounded-full border-gray-300 
                  text-indigo-600 focus:ring-indigo-500`}
              />
              <div>
                <h3 className="text-sm font-bold">{task.title}</h3>
                <div className="text-xs text-gray-600">
                  <Badge variant="secondary" className="mr-2">{task.label}</Badge>
                  <span className="mr-2">Status: {task.status}</span>
                  <span>Priority: {task.priority}</span>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ScrollArea>
    </ul>
  );
};

export default TaskList;
