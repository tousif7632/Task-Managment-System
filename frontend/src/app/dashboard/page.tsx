'use client';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState, AppDispatch } from '@/redux/store';
import { logoutUser } from '@/redux/slices/userSlice';
import { fetchTasks, updateTask, createTask, deleteTask } from '@/redux/slices/taskSlice';
import TaskColumn from '@/components/TaskColumn';
import TaskModal from '@/components/TaskModal';
import ChatBox from '@/components/ChatBox';
import UserList from '@/components/UserList';
import Navbar from '@/components/Navbar';
import { Task, User } from '@/types';
import api from '@/utils/api';
import AIChatBot from '@/components/AIChatBot';

export default function DashboardPage() {
  const [showModal, setShowModal] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { user, isAuthenticated, loading } = useSelector((state: RootState) => state.user);
  const { tasks, loading: tasksLoading, error: tasksError } = useSelector((state: RootState) => state.tasks);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  useEffect(() => {
    // Set initialized after a short delay to allow auth initialization
    const timer = setTimeout(() => {
      setIsInitialized(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Only redirect if we're initialized and not authenticated
    if (isInitialized && !isAuthenticated && !loading) {
      router.push('/login');
      return;
    }

    // Only fetch tasks if authenticated
    if (isAuthenticated) {
      dispatch(fetchTasks());
    }
  }, [dispatch, isAuthenticated, loading, isInitialized, router]);

  const handleLogout = async () => {
    try {
      // Call backend logout endpoint
      await api.post('/api/auth/logout');
    } catch (error) {
      // Continue with logout even if backend call fails
      console.error('Logout error:', error);
    } finally {
      // Clear frontend state and redirect
      dispatch(logoutUser());
      router.push('/login');
    }
  };

  const handleCreateTask = () => {
    setCurrentTask(null);
    setShowModal(true);
  };

  const handleEditTask = (task: Task) => {
    setCurrentTask(task);
    setShowModal(true);
  };

  const handleDeleteTask = (task: Task) => {
    dispatch(deleteTask(task._id));
  };

  // Filter tasks by search term
  const filteredTasks = tasks.filter(task => {
    const term = searchTerm.toLowerCase();
    return (
      task.title.toLowerCase().includes(term) ||
      (task.description && task.description.toLowerCase().includes(term))
    );
  });

  // Show loading while initializing or if not authenticated
  if (!isInitialized || loading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar user={user} onLogout={handleLogout} />
      
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">My Tasks</h2>
          <button
            onClick={handleCreateTask}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Create Task
          </button>
        </div>
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full md:w-1/2 px-3 py-2 border rounded-lg text-black"
          />
        </div>

        {tasksLoading ? (
          <div className="text-center py-8 text-black">Loading tasks...</div>
        ) : tasksError ? (
          <div className="text-center py-8">
            <div className="text-red-500 mb-4">{tasksError}</div>
            <button
              onClick={() => dispatch(fetchTasks())}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-black">
            <TaskColumn
              status="todo"
              tasks={filteredTasks}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
            />
            <TaskColumn
              status="in-progress"
              tasks={filteredTasks}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
            />
            <TaskColumn
              status="completed"
              tasks={filteredTasks}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
            />
          </div>
        )}

        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4 text-black">Team Chat</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <UserList
                currentUser={user}
                selectedUser={selectedUser}
                onUserSelect={setSelectedUser}
              />
            </div>
            <div className="lg:col-span-2">
              <ChatBox currentUser={user} selectedUser={selectedUser} />
            </div>
          </div>
        </div>
      </main>

      {showModal && (
        <TaskModal
          task={currentTask}
          onClose={() => setShowModal(false)}
          loading={tasksLoading}
          onSubmit={(taskData) => {
            if (currentTask) {
              // Update existing task
              dispatch(updateTask({ id: currentTask._id, ...taskData }));
            } else {
              // Create new task
              dispatch(createTask(taskData));
            }
            setShowModal(false);
          }}
        />
      )}
      <AIChatBot />
    </div>
  );
}