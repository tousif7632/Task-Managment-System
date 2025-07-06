import { useState } from 'react';
import { format } from 'date-fns';
import { Task } from '../types';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

const priorityColors = {
  low: 'bg-green-100 text-green-800 border-green-200',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800',
};

export default function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`bg-white p-4 rounded-lg shadow ${isHovered ? 'ring-2 ring-blue-500' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex justify-between items-start text-black">
        <h3 className="font-medium text-black">{task.title}</h3>
        {isHovered && (
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(task)}
              className="text-blue-500 hover:text-blue-700"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(task)}
              className="text-red-500 hover:text-red-700"
            >
              Delete
            </button>
          </div>
        )}
      </div>
      {task.description && (
        <p className="mt-2 text-sm text-gray-600">{task.description}</p>
      )}
      <div className="mt-3 flex items-center justify-between">
        <span className={`text-xs px-2 py-1 rounded-full ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
        {task.dueDate && (
          <span className="text-xs text-gray-500">
            Due: {format(new Date(task.dueDate), 'MMM dd, yyyy')}
          </span>
        )}
      </div>
    </div>
  );
}