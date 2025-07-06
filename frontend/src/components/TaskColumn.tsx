import TaskCard from './TaskCard';
import { Task } from '../types';

interface TaskColumnProps {
  status: 'todo' | 'in-progress' | 'completed';
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

const statusTitles = {
  todo: 'To Do',
  'in-progress': 'In Progress',
  completed: 'Completed'
};

export default function TaskColumn({ status, tasks, onEdit, onDelete }: TaskColumnProps) {
  const filteredTasks = tasks.filter(task => task.status === status);

  return (
    <div className="flex-1 bg-gray-100 rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-4">{statusTitles[status]}</h2>
      <div className="space-y-4">
        {filteredTasks.map(task => (
          <TaskCard 
            key={task._id} 
            task={task} 
            onEdit={onEdit} 
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}