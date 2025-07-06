import { useState, useRef, useEffect } from 'react';
import api from '@/utils/api';

interface Message {
  sender: 'user' | 'ai';
  content: string;
}

export default function AIChatBot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { sender: 'user' as const, content: input };
    setMessages((msgs) => [...msgs, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const res = await api.post('/api/chat/ai', { prompt: userMsg.content });
      setMessages((msgs) => [
        ...msgs,
        { sender: 'ai', content: res.data.reply },
      ]);
    } catch (err) {
      setMessages((msgs) => [
        ...msgs,
        { sender: 'ai', content: 'AI se jawab nahi mila. (No response from AI.)' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 bg-blue-600 text-white rounded-full w-14 h-14 shadow-lg flex items-center justify-center text-2xl z-50"
          aria-label="Open AI Chatbot"
        >
          🤖
        </button>
      )}
      {/* Chat window */}
      {open && (
        <div className="fixed bottom-6 right-6 w-80 bg-white rounded-lg shadow-lg flex flex-col z-50 border border-gray-200">
          <div className="flex items-center justify-between px-4 py-2 border-b">
            <span className="font-semibold text-black">AI Chatbot</span>
            <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-gray-700">✖</button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 h-72 bg-gray-50">
            {messages.length === 0 ? (
              <div className="text-gray-400 text-center mt-16">Start a conversation...</div>
            ) : (
              messages.map((msg, idx) => (
                <div key={idx} className={`mb-2 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`px-3 py-2 rounded-lg max-w-xs ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
                    {msg.content}
                  </div>
                </div>
              ))
            )}
            {loading && (
              <div className="mb-2 flex justify-start">
                <div className="px-3 py-2 rounded-lg max-w-xs bg-gray-200 text-black animate-pulse">AI is typing...</div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-2 border-t flex gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              className="flex-1 px-3 py-2 border rounded text-black"
              placeholder="Ask something..."
              disabled={loading}
            />
            <button
              onClick={handleSend}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              disabled={loading}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 