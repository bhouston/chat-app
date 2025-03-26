import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Chat, Message } from '../types';
import { generateId } from '../utils';
import { useAuth } from './AuthContext';

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

const STORAGE_KEY_PREFIX = 'chat_app_data_';

// Get user-specific storage key
const getUserStorageKey = (userId: string | undefined) => 
  userId ? `${STORAGE_KEY_PREFIX}${userId}` : STORAGE_KEY_PREFIX;

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load chats from storage on initial render or when user changes
  useEffect(() => {
    const loadChats = async () => {
      try {
        setIsLoading(true);
        const storageKey = getUserStorageKey(user?.id);
        const storedChats = await AsyncStorage.getItem(storageKey);
        
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
          setChats([]);
          setCurrentChat(null);
          // We'll create a new chat after loading completes
        }
      } catch (error) {
        console.error('Failed to load chats:', error);
        setChats([]);
        setCurrentChat(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadChats();
    } else {
      // Reset state when user is not logged in
      setChats([]);
      setCurrentChat(null);
      setIsLoading(false);
    }
  }, [user]);

  // Create initial chat if needed
  useEffect(() => {
    if (!isLoading && user && chats.length === 0) {
      createNewChat();
    }
  }, [isLoading, user, chats.length]);

  // Save chats to storage whenever they change
  useEffect(() => {
    const saveChats = async () => {
      if (!user) return; // Don't save if no user is logged in
      
      try {
        const storageKey = getUserStorageKey(user.id);
        await AsyncStorage.setItem(storageKey, JSON.stringify(chats));
      } catch (error) {
        console.error('Failed to save chats:', error);
      }
    };

    if (chats.length > 0) {
      saveChats();
    }
  }, [chats, user]);

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