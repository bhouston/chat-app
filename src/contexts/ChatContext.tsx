import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Chat, Message } from '../types';
import { generateId } from '../utils';

interface ChatContextType {
  chats: Chat[];
  currentChat: Chat | null;
  isLoading: boolean;
  createNewChat: () => void;
  selectChat: (chatId: string) => void;
  addMessage: (content: string, role: 'user' | 'assistant') => void;
  updateChatTitle: (chatId: string, title: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const STORAGE_KEY = 'chat_app_data';

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load chats from storage on initial render
  useEffect(() => {
    const loadChats = async () => {
      try {
        const storedChats = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedChats) {
          const parsedChats = JSON.parse(storedChats) as Chat[];
          setChats(parsedChats);
          
          // Set the most recent chat as current if available
          if (parsedChats.length > 0) {
            const mostRecent = parsedChats.reduce((prev, current) => 
              current.updatedAt > prev.updatedAt ? current : prev
            );
            setCurrentChat(mostRecent);
          }
        } else {
          // Create a new chat if none exist
          createNewChat();
        }
      } catch (error) {
        console.error('Failed to load chats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadChats();
  }, []);

  // Save chats to storage whenever they change
  useEffect(() => {
    const saveChats = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
      } catch (error) {
        console.error('Failed to save chats:', error);
      }
    };

    if (chats.length > 0) {
      saveChats();
    }
  }, [chats]);

  const createNewChat = () => {
    const newChat: Chat = {
      id: generateId(),
      title: 'New Chat',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    setChats(prevChats => [newChat, ...prevChats]);
    setCurrentChat(newChat);
  };

  const selectChat = (chatId: string) => {
    const selected = chats.find(chat => chat.id === chatId);
    if (selected) {
      setCurrentChat(selected);
    }
  };

  const addMessage = (content: string, role: 'user' | 'assistant') => {
    if (!currentChat) return;

    const newMessage: Message = {
      id: generateId(),
      role,
      content,
      timestamp: Date.now(),
    };

    // Update the current chat with the new message
    const updatedChat: Chat = {
      ...currentChat,
      messages: [...currentChat.messages, newMessage],
      updatedAt: Date.now(),
      // Update title based on first user message if it's still the default
      title: currentChat.title === 'New Chat' && role === 'user' 
        ? content.substring(0, 30) + (content.length > 30 ? '...' : '')
        : currentChat.title,
    };

    // Update the chats array with the updated chat
    setChats(prevChats => 
      prevChats.map(chat => 
        chat.id === currentChat.id ? updatedChat : chat
      )
    );

    // Update the current chat
    setCurrentChat(updatedChat);
  };

  const updateChatTitle = (chatId: string, title: string) => {
    setChats(prevChats => 
      prevChats.map(chat => 
        chat.id === chatId ? { ...chat, title } : chat
      )
    );

    if (currentChat?.id === chatId) {
      setCurrentChat(prev => prev ? { ...prev, title } : null);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        chats,
        currentChat,
        isLoading,
        createNewChat,
        selectChat,
        addMessage,
        updateChatTitle,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};