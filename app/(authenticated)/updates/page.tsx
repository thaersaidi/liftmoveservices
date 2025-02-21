'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { MessageCircle, Info, X, CheckCircle, ArrowRightCircle, Eye, Maximize2, Minimize2, VenetianMask, PocketKnife, Book } from "lucide-react";
import { CreateChatWithExtension, FindAllExtensionForCurrentUser } from '@/features/extensions-page/extension-services/extension-service';
import { DisplayError } from '@/features/ui/error/display-error';
import { ChatPage } from '@/features/chat-page/chat-box';
import { FindAllChatMessagesForCurrentUser } from '@/features/chat-page/chat-services/chat-message-service';
import { FindChatThreadForCurrentUser, FindAllChatThreadForCurrentUser } from '@/features/chat-page/chat-services/chat-thread-service';
import { FindAllChatDocuments } from '@/features/chat-page/chat-services/chat-document-service';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { diagram, jsx, html, markdown } from './data';
import WelcomeSection from '@/features/custom/WelcomeSection';
import Editor from '@/features/custom/Editor';
import ChatBox from '@/features/custom/ChatBox';
import CodeBlock from '@/features/custom/CodeBlock';
import Sidebar from '@/features/custom/Sidebar';


export default function AgentsSwarmUp() {
  const [isChatboxOpen, setIsChatboxOpen] = useState(false);
  const [chatData, setChatData] = useState({
    messages: null,
    chatThread: null,
    chatDocuments: null,
    extensions: null,
  });
  const [errors, setErrors] = useState([]);
  const [chatId, setChatId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [markup, setMarkup] = useState(diagram);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isChatFullScreen, setIsChatFullScreen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('mermaid');
  const [customLanguage, setCustomLanguage] = useState('');

  const languageOptions = [
    { value: 'mermaid', label: 'Mermaid', defaultContent: diagram },
    { value: 'markdown', label: 'markdown', defaultContent: markdown },
    { value: 'html', label: 'HTML', defaultContent: html },
    { value: 'jsx', label: 'JSX', defaultContent: jsx },
  ];

  const components = useMemo(() => ({
    code: CodeBlock
  }), []);

  const fetchChatData = useCallback(async () => {
    if (!chatId) return;

    try {
      const [chatResponse, chatThreadResponse, allChatThreadResponse, docsResponse, extensionResponse] =
        await Promise.all([
          FindAllChatMessagesForCurrentUser(chatId),
          FindChatThreadForCurrentUser(chatId),
          FindAllChatThreadForCurrentUser(),
          FindAllChatDocuments(chatId),
          FindAllExtensionForCurrentUser(),
        ]);

      if (
        chatResponse.status === "OK" &&
        chatThreadResponse.status === "OK" &&
        docsResponse.status === "OK" &&
        extensionResponse.status === "OK"
      ) {
        setChatData({
          messages: chatResponse.response,
          chatThread: chatThreadResponse.response,
          chatDocuments: docsResponse.response,
          extensions: extensionResponse.response,
        });
      } else {
        const allErrors = [
          ...(chatResponse.errors || []),
          ...(chatThreadResponse.errors || []),
          ...(docsResponse.errors || []),
          ...(extensionResponse.errors || []),
        ];
        setErrors(allErrors);
      }
    } catch (error) {
      setErrors([{ message: "An unexpected error occurred" }]);
    }
  }, [chatId]);

  useEffect(() => {
    if (isChatboxOpen && chatId) {
      fetchChatData();
    }
  }, [isChatboxOpen, chatId, fetchChatData]);

  const toggleChatbox = useCallback(async () => {
    if (!isChatboxOpen) {
      if (!chatId) {
        setIsLoading(true);
        try {
          const defaultExtensionId = "Biqr1683McdFMJaRRXdnSyc1ifKAznkgfV2R";
          const allChats = await FindAllChatThreadForCurrentUser();
          
          const existingChat = allChats.response.find(chat => 
            chat.extension.includes(defaultExtensionId)
          );

          if (existingChat) {
            setChatId(existingChat.id);
          } else {
            const chat = await CreateChatWithExtension(defaultExtensionId);
            if (chat.status === "OK") {
              setChatId(chat.response.id);
            } else {
              setErrors(chat.errors);
            }
          }
          setIsChatboxOpen(true);
        } catch (error) {
          setErrors([{ message: "Failed to create or find a chat" }]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsChatboxOpen(true);
      }
    } else {
      setIsChatboxOpen(false);
    }
  }, [isChatboxOpen, chatId]);

  const handleLanguageChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = e.target.value;
    setSelectedLanguage(newLanguage);
    if (newLanguage !== 'custom') {
      const selectedOption = languageOptions.find(option => option.value === newLanguage);
      setMarkup(selectedOption?.defaultContent || '');
    }
  }, [languageOptions]);

  const handleCustomLanguageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomLanguage(e.target.value);
    setSelectedLanguage('custom');
  }, []);

  const handleMarkupChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMarkup(e.target.value);
  }, []);

  const toggleFullScreen = useCallback(() => {
    setIsFullScreen(prev => !prev);
  }, []);

  const toggleChatFullScreen = useCallback(() => {
    setIsChatFullScreen(prev => !prev);
  }, []);

  return (
    <div className="min-h-screen w-full bg-secondary/40 overflow-auto">
    <div className="p-4 md:p-8 mr-8  flex flex-col lg:flex-row ">
    <div className="w-full lg:w-1/2 lg:pr-4 mb-8 lg:mb-0">
        <WelcomeSection />
      </div>

      <Editor
        isFullScreen={isFullScreen}
        selectedLanguage={selectedLanguage}
        customLanguage={customLanguage}
        markup={markup}
        languageOptions={languageOptions}
        handleLanguageChange={handleLanguageChange}
        handleCustomLanguageChange={handleCustomLanguageChange}
        handleMarkupChange={handleMarkupChange}
        toggleFullScreen={toggleFullScreen}
        components={components}
      />

      <ChatBox
        isChatboxOpen={isChatboxOpen}
        toggleChatbox={toggleChatbox}
        isChatFullScreen={isChatFullScreen}
        toggleChatFullScreen={toggleChatFullScreen}
        errors={errors}
        chatData={chatData}
      />
    </div>
    </div>
  );
}