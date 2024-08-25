import React from "react";
import { Task } from "../data/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/custom/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TaskListProps {
  tasks: Task[];
  onTaskComplete: (taskId: number|null) => void; // Function to handle task completion
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onTaskComplete }) => {
  return (
    <ul className="ml-6 space-y-4">
      <ScrollArea className="h-[550px] w-[1025px]">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="max-w-[1028px] min-w-[1028px] flex items-center justify-between p-4 rounded shadow-sm"
          >
            <div>
              <h3 className="text-lg font-bold">{task.title}</h3>
              <div className="text-sm text-gray-600">
                <Badge className="mr-2">{task.label}</Badge>
                <span className="mr-2">Status: {task.status}</span>
                <span>Priority: {task.priority}</span>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => onTaskComplete(task.id)}
              className={`ml-4 ${
                task.status === "done" ? "text-green-600" : ""
              }`}
            >
              {task.status === "done" ? "Completed" : "Mark as Done"}
            </Button>
          </li>
        ))}
      </ScrollArea>
    </ul>
  );
};

export default TaskList;
