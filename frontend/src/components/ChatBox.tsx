import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { sendMessage, addMessage, clearMessages, fetchMessages, updateMessage, deleteMessage } from '@/redux/slices/chatSlice';
import socket from '@/socket/client';
import { User, Message } from '../types';
import { format, isToday, isYesterday } from 'date-fns';
import { FaEdit, FaTrash } from 'react-icons/fa';

interface ChatBoxProps {
  currentUser: User | null;
  selectedUser: User | null;
}

export default function ChatBox({ currentUser, selectedUser }: ChatBoxProps) {
  const [message, setMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, loading } = useSelector((state: RootState) => state.chat);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (!currentUser || !selectedUser) {
      dispatch(clearMessages());
      return;
    }
    const userId = currentUser.id || currentUser._id;
    const otherUserId = selectedUser.id || selectedUser._id;
    if (!userId || !otherUserId) {
      dispatch(clearMessages());
      return;
    }
    dispatch(fetchMessages({ userId, otherUserId }));

    // Always set latest token before connecting
    const token = (typeof window !== 'undefined') ? localStorage.getItem('authToken') : null;
    socket.auth = { token };
    socket.connect();
    setIsConnected(true);
    socket.emit('joinRoom', { userId, otherUserId });
    console.log('joinRoom emitted:', { userId, otherUserId });

    // Always remove previous listener before adding new one
    socket.off('privateMessage');
    socket.on('privateMessage', (msg: Message) => {
      // Filter: Only add if the message is between currentUser and selectedUser
      const myId = String(currentUser?.id || currentUser?._id);
      const otherId = String(selectedUser?.id || selectedUser?._id);
      const senderId = typeof msg.sender === 'object' && msg.sender !== null ? String(msg.sender._id) : String(msg.sender);
      const receiverId = typeof msg.receiver === 'object' && msg.receiver !== null ? String(msg.receiver._id) : String(msg.receiver);
      if (
        (senderId === myId && receiverId === otherId) ||
        (senderId === otherId && receiverId === myId)
      ) {
        dispatch(addMessage(msg));
      }
    });

    // Typing indicator events
    socket.off('typing');
    socket.on('typing', ({ from }) => {
      if (from === selectedUser._id) setIsTyping(true);
    });
    socket.off('stopTyping');
    socket.on('stopTyping', ({ from }) => {
      if (from === selectedUser._id) setIsTyping(false);
    });

    socket.on('connect', () => setIsConnected(true));
    socket.on('disconnect', () => setIsConnected(false));
    return () => {
      socket.off('privateMessage');
      socket.off('typing');
      socket.off('stopTyping');
      socket.off('connect');
      socket.off('disconnect');
      socket.disconnect();
      setIsConnected(false);
    };
  }, [currentUser, selectedUser, dispatch]);

  useEffect(() => { scrollToBottom(); }, [messages, isTyping]);
  const scrollToBottom = () => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); };

  // Typing indicator logic
  useEffect(() => {
    if (!currentUser || !selectedUser) return;
    if (typing) {
      socket.emit('typing', { to: selectedUser._id, from: currentUser.id || currentUser._id });
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
      typingTimeout.current = setTimeout(() => {
        setTyping(false);
        socket.emit('stopTyping', { to: selectedUser._id, from: currentUser.id || currentUser._id });
      }, 1500);
    } else {
      socket.emit('stopTyping', { to: selectedUser._id, from: currentUser.id || currentUser._id });
    }
    // eslint-disable-next-line
  }, [typing]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('currentUser:', currentUser);
    console.log('selectedUser:', selectedUser);
    console.log('Sending message:', message);
    if (!message.trim() || !currentUser || !selectedUser || !currentUser.id || !selectedUser._id || !isConnected) return;
    setTyping(false);
    const newMessage = {
      sender: currentUser.id,
      receiver: selectedUser._id,
      content: message
    };
    dispatch(addMessage({ _id: 'optimistic-' + Date.now(), ...newMessage, createdAt: new Date().toISOString() }));
    socket.emit('privateMessage', newMessage);
    try { await dispatch(sendMessage(newMessage)); } catch (error) { console.error('Failed to save message:', error); }
    setMessage('');
  };

  // Edit message UI (no backend yet)
  const handleEdit = (msg: Message) => {
    setEditId(msg._id);
    setEditText(msg.content);
  };
  const handleEditSave = async (msg: Message) => {
    if (editText.trim() && msg._id) {
      try {
        console.log('Editing message:', msg._id, 'New content:', editText);
        await dispatch(updateMessage({ id: msg._id, content: editText }));
        console.log('Edit success');
      } catch (err) {
        console.error('Edit error:', err);
        alert('Edit failed!');
      }
    }
    setEditId(null);
  };
  const handleDelete = async (msg: Message) => {
    if (msg._id) {
      try {
        console.log('Deleting message:', msg._id);
        await dispatch(deleteMessage(msg._id));
        console.log('Delete success');
      } catch (err) {
        console.error('Delete error:', err);
        alert('Delete failed!');
      }
    }
  };

  if (!selectedUser) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <div className="h-64 flex items-center justify-center">
          <div className="text-center">
            <div className="text-gray-400 mb-2">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-gray-500">Select a team member to start chatting</p>
          </div>
        </div>
      </div>
    );
  }

  let lastDate = '';
  return (
    <div className="bg-white rounded-lg shadow p-4" style={{ background: 'linear-gradient(135deg, #ece9e6 0%, #ffffff 100%)' }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">
              {selectedUser.username.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h3 className="font-medium text-black">{selectedUser.username}</h3>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-xs text-gray-500">{isConnected ? 'Online' : 'Offline'}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="h-64 overflow-y-auto mb-4 border rounded-lg p-3" style={{ background: 'url(https://www.transparenttextures.com/patterns/cubes.png)' }}>
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-600">Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const senderId = typeof msg.sender === 'object' && msg.sender !== null ? msg.sender._id : msg.sender;
            const isOwnMessage = String(senderId) === String(currentUser?.id || currentUser?._id);
            const senderName =
              typeof msg.sender === 'object' && msg.sender !== null
                ? msg.sender.username
                : msg.sender === (currentUser?.id || currentUser?._id)
                  ? currentUser?.username
                  : msg.sender === (selectedUser?.id || selectedUser?._id)
                    ? selectedUser?.username
                    : 'User';
            const msgDate = new Date(msg.createdAt);
            const msgDateStr = msgDate.toDateString();
            let showDate = false;
            if (msgDateStr !== lastDate) { showDate = true; lastDate = msgDateStr; }
            let dateLabel = format(msgDate, 'dd-MM-yyyy');
            if (isToday(msgDate)) dateLabel = 'Today';
            else if (isYesterday(msgDate)) dateLabel = 'Yesterday';
            return (
              <div key={index}>
                {showDate && (
                  <div className="flex justify-center my-2">
                    <span className="bg-gray-300 text-gray-700 text-xs px-3 py-1 rounded-full">{dateLabel}</span>
                  </div>
                )}
                <div className={`mb-2 flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`inline-block px-4 py-2 rounded-lg max-w-xs break-words shadow relative ${
                      isOwnMessage
                        ? 'bg-blue-600 text-white ml-auto mr-0'
                        : 'bg-pink-500 text-white mr-auto ml-0'
                    }`}
                    style={{
                      borderBottomRightRadius: isOwnMessage ? 0 : undefined,
                      borderBottomLeftRadius: !isOwnMessage ? 0 : undefined,
                    }}
                  >
                    {/* Sender Name */}
                    <div className="text-xs font-semibold mb-1">
                      {senderName}
                    </div>
                    {/* Message Content or Edit Box */}
                    {editId === msg._id ? (
                      <div className="flex items-center">
                        <input
                          value={editText}
                          onChange={e => setEditText(e.target.value)}
                          className="flex-1 px-2 py-1 rounded border text-black"
                        />
                        <button onClick={() => handleEditSave(msg)} className="ml-2 text-green-700 text-xs">Save</button>
                        <button onClick={() => setEditId(null)} className="ml-1 text-red-700 text-xs">Cancel</button>
                      </div>
                    ) : (
                      <span>{msg.content}</span>
                    )}
                    {/* Time */}
                    <div className="text-xs text-gray-200 mt-1 text-right">
                      {format(msgDate, 'HH:mm')}
                    </div>
                    {/* Edit/Delete Buttons (only for own messages) */}
                    {isOwnMessage && editId !== msg._id && (
                      <div className="absolute top-1 right-1 flex space-x-1">
                        <button onClick={() => handleEdit(msg)} className="text-xs text-yellow-200 hover:text-yellow-400">
                          <FaEdit size={12} />
                        </button>
                        <button onClick={() => handleDelete(msg)} className="text-xs text-red-200 hover:text-red-400">
                          <FaTrash size={12} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        {isTyping && (
          <div className="mb-2 flex justify-start">
            <div className="px-3 py-2 rounded-lg max-w-xs bg-green-200 text-black animate-pulse">{selectedUser?.username} is typing...</div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="flex">
        <input
          type="text"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            setTyping(true);
          }}
          className="flex-1 border rounded-l-lg px-4 py-2 focus:outline-none text-black"
          placeholder="Type your message..."
          disabled={!isConnected}
        />
        <button
          type="submit"
          className={`px-4 py-2 rounded-r-lg ${
            isConnected && selectedUser && selectedUser._id
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          disabled={!isConnected || !selectedUser || !selectedUser._id}
        >
          Send
        </button>
      </form>
    </div>
  );
}