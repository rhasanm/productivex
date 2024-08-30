import { Task } from "../data/schema";
import { KanbanBoard } from "./KanbanBoard"

interface KanbanComponentProps {
    tasks: Task[],
    taskStatusUpdateHandler: (task: Task, tasks: Task[]) => Promise<void>
}

const Kanban: React.FC<KanbanComponentProps> = ({ tasks, taskStatusUpdateHandler }) => {
    return <KanbanBoard tasksState={tasks} taskStatusUpdateHandler={taskStatusUpdateHandler}/>
};
export default Kanban;
