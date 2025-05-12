import React from 'react';
import { User, Send, Smile, Paperclip } from 'lucide-react';

const ChatApp = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Chats</h2>
          <button className="text-blue-500 hover:bg-blue-50 p-2 rounded-full">
            <User size={20} />
          </button>
        </div>
        
        {/* Chat List */}
        <div className="divide-y divide-gray-100">
          {[1, 2, 3, 4].map((chat) => (
            <div 
              key={chat} 
              className="p-4 hover:bg-gray-50 cursor-pointer flex items-center"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <User size={24} className="text-blue-500" />
              </div>
              <div>
                <h3 className="font-semibold">User {chat}</h3>
                <p className="text-gray-500 text-sm">Last message preview...</p>
              </div>
              <span className="ml-auto text-xs text-gray-400">12:34 PM</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 bg-white border-b border-gray-200 flex items-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
            <User size={24} className="text-blue-500" />
          </div>
          <div>
            <h2 className="font-semibold">John Doe</h2>
            <p className="text-green-500 text-xs">Online</p>
          </div>
        </div>
        
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Incoming Message */}
          <div className="flex">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
              <User size={20} className="text-blue-500" />
            </div>
            <div className="bg-white p-3 rounded-lg max-w-md shadow-sm">
              <p>Hey, how are you doing today?</p>
              <span className="text-xs text-gray-400 mt-1 block">12:30 PM</span>
            </div>
          </div>
          
          {/* Outgoing Message */}
          <div className="flex justify-end">
            <div className="bg-blue-500 text-white p-3 rounded-lg max-w-md">
              <p>I'm good, thanks for asking! How about you?</p>
              <span className="text-xs text-blue-200 mt-1 block text-right">12:31 PM</span>
            </div>
          </div>
        </div>
        
        {/* Message Input */}
        <div className="p-4 bg-white border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <button className="text-gray-500 hover:bg-gray-100 p-2 rounded-full">
              <Smile size={20} />
            </button>
            <button className="text-gray-500 hover:bg-gray-100 p-2 rounded-full">
              <Paperclip size={20} />
            </button>
            <input 
              type="text" 
              placeholder="Type a message..." 
              className="flex-1 p-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <button className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600">
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatApp;