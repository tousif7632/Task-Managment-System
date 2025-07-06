import { useState, useEffect } from 'react';
import { User } from '../types';
import api from '@/utils/api';

interface UserListProps {
  currentUser: User | null;
  onUserSelect: (user: User) => void;
  selectedUser: User | null;
}

export default function UserList({ currentUser, onUserSelect, selectedUser }: UserListProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!currentUser) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await api.get('/api/auth/users');
        // Filter out the current user from the list
        const otherUsers = response.data.filter((user: User) => user._id !== currentUser._id);
        setUsers(otherUsers);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentUser]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold mb-4 text-black">Team Members</h3>
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold mb-4 text-black">Team Members</h3>
        <div className="text-center py-4">
          <p className="text-red-500 text-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-4 text-black">Team Members</h3>
      <div className="space-y-2">
        {users.length === 0 ? (
          <p className="text-gray-500 text-sm">No other team members found</p>
        ) : (
          users.map((user) => (
            <div
              key={user._id}
              onClick={() => onUserSelect(user)}
              className={`p-3 rounded-lg cursor-pointer transition-colors ${
                selectedUser?._id === user._id
                  ? 'bg-blue-100 border-2 border-blue-300'
                  : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-black">{user.username}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 