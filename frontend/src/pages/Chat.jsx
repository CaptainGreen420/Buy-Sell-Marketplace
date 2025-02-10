import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Send } from 'lucide-react';

const Chat = () => {
  const [messages, setMessages] = useState([
    {
      role: 'user',
      system: true,
      content: 'You are a support chatbot for a buy-sell website'
    },
    {
      role: 'model',
      content: 'Hello! How can I help you today with buying or selling items?'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
  
    const userMessage = {
      role: 'user',
      content: newMessage
    };
  
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsLoading(true);
  
    try {
      const token = localStorage.getItem('token');
  
      const response = await axios.post(
        'http://localhost:4000/api/user/chat',
        {
          message: newMessage,
          history: messages
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        }
      );
  
      setMessages(prev => [...prev, {
        role: 'model',
        content: response.data.message
      }]);
    } catch (error) {
      console.error('Server response data:', error.response?.data);
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'model',
        content: 'Sorry, I encountered an error. Please try again.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };
  

  const filteredMessages = messages.filter(m => m.system !== true);

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-screen min-h-[500px] max-h-[90vh] flex flex-col">
        <h2 className="text-2xl mb-4 text-center font-semibold">Chat Support</h2>
        
        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
          {filteredMessages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] p-3 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-800 p-3 rounded-lg">
                Typing...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:border-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !newMessage.trim()}
            className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 transition-colors"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
