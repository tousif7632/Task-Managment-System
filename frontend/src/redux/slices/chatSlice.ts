import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/utils/api';
import { Message } from '../../types';

interface ChatState {
  messages: Message[];
  loading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  messages: [],
  loading: false,
  error: null,
};

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async (messageData: Omit<Message, '_id' | 'createdAt'>) => {
    const response = await api.post('/api/chat', messageData);
    return response.data;
  }
);

export const fetchMessages = createAsyncThunk(
  'chat/fetchMessages',
  async ({ userId, otherUserId }: { userId: string; otherUserId: string }) => {
    const response = await api.get(`/api/chat/${userId}/${otherUserId}`);
    return response.data;
  }
);

export const updateMessage = createAsyncThunk(
  'chat/updateMessage',
  async ({ id, content }: { id: string; content: string }) => {
    const response = await api.put(`/api/chat/${id}`, { content });
    return response.data;
  }
);

export const deleteMessage = createAsyncThunk(
  'chat/deleteMessage',
  async (id: string) => {
    await api.delete(`/api/chat/${id}`);
    return id;
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    clearMessages: (state) => {
      state.messages = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.messages.push(action.payload);
        state.error = null;
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to send message';
      })
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
        state.error = null;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch messages';
      })
      .addCase(updateMessage.fulfilled, (state, action) => {
        const idx = state.messages.findIndex(m => m._id === action.payload._id);
        if (idx !== -1) state.messages[idx] = action.payload;
      })
      .addCase(deleteMessage.fulfilled, (state, action) => {
        state.messages = state.messages.filter(m => m._id !== action.payload);
      });
  },
});

export const { addMessage, clearMessages } = chatSlice.actions;
export default chatSlice.reducer;