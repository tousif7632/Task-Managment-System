export interface User {
  _id?: string;
  id?: string;
  username: string;
  email: string;
  role: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  createdBy: User | string;
  assignedTo?: User | string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  _id: string;
  sender: User | string;
  receiver: User | string;
  content: string;
  createdAt: string;
}