import React, { useEffect } from "react";
import { Task, ViewMode, Gantt } from "gantt-task-react";
import { ViewSwitcher } from "./components/view-switcher";
import "gantt-task-react/dist/index.css";
import { Task as TaskSchema } from "../../data/schema";
import { prepareGanttData } from "./helper";

interface Props {
  tasks: TaskSchema[];
}

const GanttChart: React.FC<Props> = ({ tasks }) => {
  let preparedTasks = prepareGanttData(tasks);
  const [view, setView] = React.useState<ViewMode>(ViewMode.Day);
  const [ganttTasks, setGanttTasks] = React.useState<Task[]>(preparedTasks);
  const [isChecked, setIsChecked] = React.useState(false);

  useEffect(() => {
    preparedTasks = prepareGanttData(tasks);
    setGanttTasks(preparedTasks);
  }, [tasks]);

  let columnWidth = 65;
  if (view === ViewMode.Year) {
    columnWidth = 350;
  } else if (view === ViewMode.Month) {
    columnWidth = 300;
  } else if (view === ViewMode.Week) {
    columnWidth = 250;
  }

  const handleTaskChange = (task: Task) => {
    let newTasks = ganttTasks.map((t) => (t.id === task.id ? task : t));
    if (task.project) {
      const [start, end] = [task.start, task.end];
      const project =
        newTasks[newTasks.findIndex((t) => t.id === task.project)];
      if (
        project.start.getTime() !== start.getTime() ||
        project.end.getTime() !== end.getTime()
      ) {
        const changedProject = { ...project, start, end };
        newTasks = newTasks.map((t) =>
          t.id === task.project ? changedProject : t
        );
      }
    }
    setGanttTasks(newTasks);
  };

  const handleTaskDelete = (task: Task) => {
    const conf = window.confirm("Are you sure about " + task.name + " ?");
    if (conf) {
      setGanttTasks(ganttTasks.filter((t) => t.id !== task.id));
    }
    return conf;
  };

  const handleProgressChange = async (task: Task) => {
    setGanttTasks(ganttTasks.map((t) => (t.id === task.id ? task : t)));
  };

  const handleDblClick = (task: Task) => {
    alert("On Double Click event Id:" + task.id);
  };

  const handleClick = (task: Task) => {
    console.log(task);
  };

  const handleSelect = (task: Task, isSelected: boolean) => {
    console.log(task.name + " has " + (isSelected ? "selected" : "unselected"));
  };

  const handleExpanderClick = (task: Task) => {
    setGanttTasks(ganttTasks.map((t) => (t.id === task.id ? task : t)));
  };

  return ganttTasks.length === 0 ? (
    <></>
  ) : (
    <div className="Wrapper">
      <ViewSwitcher
        onViewModeChange={(viewMode) => setView(viewMode)}
        onViewListChange={setIsChecked}
        isChecked={isChecked}
      />
      <Gantt
        tasks={ganttTasks.filter((task) => task.start !== null)}
        viewMode={view}
        onDateChange={handleTaskChange}
        onDelete={handleTaskDelete}
        onProgressChange={handleProgressChange}
        onDoubleClick={handleDblClick}
        onClick={handleClick}
        onSelect={handleSelect}
        onExpanderClick={handleExpanderClick}
        listCellWidth={isChecked ? "155px" : ""}
        ganttHeight={550}
        columnWidth={columnWidth}
      />
    </div>
  );
};

export default GanttChart;
