import React from 'react';
import { MessageCircle, Minimize2, Maximize2, X } from "lucide-react";
import { DisplayError } from '@/features/ui/error/display-error';
import { ChatPage } from '@/features/chat-page/chat-box';

const ChatBox = ({
  isChatboxOpen,
  toggleChatbox,
  isChatFullScreen,
  toggleChatFullScreen,
  errors,
  chatData,
}) => {
  return (
    <>
      {/* Chatbox Button */}
      <button
        onClick={toggleChatbox}
        className="fixed bottom-4 right-4 bg-foreground/80 text-background p-3 rounded-full shadow-lg hover:bg-foreground/60 transition-colors duration-200 flex items-center z-50"
      >
        <MessageCircle size={24} />
      </button>

      {/* Chatbox */}
      {isChatboxOpen && (
        <div 
          style={{ 
            transition: 'all 0.3s ease-in-out',
            transform: 'translateX(0)',
            backgroundColor: isChatFullScreen ? 'hsl(var(--secondary))' : 'hsl(var(--secondary))',
            right: isChatFullScreen ? '0' : '1rem',
            bottom: isChatFullScreen ? '0' : '5rem',
            width: isChatFullScreen ? '96%' : '44vh',
            height: isChatFullScreen ? '100%' : '75vh',
          }}
          className={`fixed rounded-lg shadow-xl overflow-hidden z-50 ${
            isChatFullScreen ? '' : 'border-2 border-[#2a4c65]'
          }`}
        >
          <div className="overflow-auto" style={{ height: isChatFullScreen ? '80vh' : '60vh',
            width: isChatFullScreen ? '' : '42vh'
          }}>
            {errors.length > 0 ? (
              <DisplayError errors={errors} />
            ) : chatData.messages ? (
              <ChatPage
                messages={chatData.messages}
                chatThread={chatData.chatThread}
                chatDocuments={chatData.chatDocuments}
                extensions={chatData.extensions}
              />
            ) : (
              <p className="p-4">Loading...</p>
            )}
          </div>
          <button
            onClick={toggleChatFullScreen}
            className="absolute top-1 right-1 text-gray-500 hover:text-primary"
          >
            {isChatFullScreen ? <Minimize2 size={20} /> : <Maximize2 size={12} />}
          </button>
          {isChatFullScreen &&  
          <button
            onClick={toggleChatbox}
            className="absolute top-8 right-1 text-gray-500 hover:text-primary"
          >
            <X size={20} /> 
          </button>}
        </div>
      )}
    </>
  );
};

export default ChatBox;
