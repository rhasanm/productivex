import { Task, TaskUpdate } from "../data/schema";
import { KanbanBoard } from "./KanbanBoard"

interface KanbanComponentProps {
    tasks: Task[],
    taskUpdateHandler: (task: TaskUpdate) => Promise<void>
}

const Kanban: React.FC<KanbanComponentProps> = ({ tasks, taskUpdateHandler }) => {
    return <KanbanBoard tasksState={tasks} taskUpdateHandler={taskUpdateHandler}/>
};
export default Kanban;
