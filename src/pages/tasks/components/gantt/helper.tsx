// import { Task } from "../../dist/types/public-types";

import { Task as GanttTask } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import { Task as TaskSchema } from "../../data/schema"; // Adjust the path as needed

const mapStatusToProgress = (status: TaskSchema["status"]): number => {
  switch (status) {
    case "todo":
      return 0;
    case "in-progress":
      return 50;
    case "done":
      return 100;
    case "backlog":
      return 0;
    default:
      return 0;
  }
};

const getTaskType = (_task: TaskSchema): GanttTask["type"] => {
  // if (!task.due_date) {
  //   return 'milestone';
  // }
  return "task";
};

// const getBackgroundColor = (status: TaskSchema['status']): string => {
//   switch (status) {
//     case 'todo':
//       return '#d3d3d3';
//     case 'in-progress':
//       return '#ffbb54';
//     case 'done':
//       return '#00ff00';
//     case 'backlog':
//       return '#ff0000';
//     default:
//       return '#ffffff';
//   }
// };

export const prepareGanttData = (tasks: TaskSchema[]): GanttTask[] => {
  // return initTasks()

  return tasks
    .filter((task) => task.start_date !== null)
    .map((task) => {
      const taskType = getTaskType(task);
      const startDate = new Date(task.start_date!);
      const endDate = task.due_date
        ? new Date(task.due_date)
        : new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000);

      return {
        id: task.id.toString(),
        name: task.title,
        type: taskType,
        start: startDate,
        end: endDate,
        progress: mapStatusToProgress(task.status),
        dependencies: [], // task.dependencies ? task.dependencies.map(dep => dep.toString()) : [],
        isDisabled: task.status === "backlog",
        // styles: {
        //   backgroundColor: getBackgroundColor(task.status),
        //   progressColor: getBackgroundColor(task.status),
        // },
      };
    });
};

type Task = {
  start: Date;
  end: Date;
  name: string;
  id: string;
  progress: number;
  type: "task" | "milestone" | "project";
  project?: string;
  dependencies?: string[];
  hideChildren?: boolean;
  displayOrder?: number;
  isDisabled?: boolean;
};

// export function initTasks() {
//   const currentDate = new Date();
//   const tasks: Task[] = [
//     {
//       start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
//       end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
//       name: "Some Project",
//       id: "ProjectSample",
//       progress: 25,
//       type: "project",
//       hideChildren: false,
//       displayOrder: 1,
//     },
//     {
//       start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
//       end: new Date(
//         currentDate.getFullYear(),
//         currentDate.getMonth(),
//         2,
//         12,
//         28
//       ),
//       name: "Idea",
//       id: "Task 0",
//       progress: 45,
//       type: "task",
//       project: "ProjectSample",
//       displayOrder: 2,
//     },
//     {
//       start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 2),
//       end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 4, 0, 0),
//       name: "Research",
//       id: "Task 1",
//       progress: 25,
//       dependencies: ["Task 0"],
//       type: "task",
//       project: "ProjectSample",
//       displayOrder: 3,
//     },
//     {
//       start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 4),
//       end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8, 0, 0),
//       name: "Discussion with team",
//       id: "Task 2",
//       progress: 10,
//       dependencies: ["Task 1"],
//       type: "task",
//       project: "ProjectSample",
//       displayOrder: 4,
//     },
//     {
//       start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8),
//       end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 9, 0, 0),
//       name: "Developing",
//       id: "Task 3",
//       progress: 2,
//       dependencies: ["Task 2"],
//       type: "task",
//       project: "ProjectSample",
//       displayOrder: 5,
//     },
//     {
//       start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8),
//       end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 10),
//       name: "Review",
//       id: "Task 4",
//       type: "task",
//       progress: 70,
//       dependencies: ["Task 2"],
//       project: "ProjectSample",
//       displayOrder: 6,
//     },
//     {
//       start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
//       end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
//       name: "Release",
//       id: "Task 6",
//       progress: currentDate.getMonth(),
//       type: "milestone",
//       dependencies: ["Task 4"],
//       project: "ProjectSample",
//       displayOrder: 7,
//     },
//     {
//       start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 18),
//       end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 19),
//       name: "Party Time",
//       id: "Task 9",
//       progress: 0,
//       isDisabled: true,
//       type: "task",
//     },
//   ];
//   return tasks;
// }

export function getStartEndDateForProject(tasks: Task[], projectId: string) {
  const projectTasks = tasks.filter((t) => t.project === projectId);
  let start = projectTasks[0].start;
  let end = projectTasks[0].end;

  for (let i = 0; i < projectTasks.length; i++) {
    const task = projectTasks[i];
    if (start.getTime() > task.start.getTime()) {
      start = task.start;
    }
    if (end.getTime() < task.end.getTime()) {
      end = task.end;
    }
  }
  return [start, end];
}
