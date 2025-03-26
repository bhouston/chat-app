import { useState } from 'react';
import { Message } from '../types';
import { sendChatRequest } from '../services/anthropicService';
import { useApi } from '../contexts/ApiContext';

interface UseChatOptions {
  onMessageSent?: (message: Message) => void;
  onResponseReceived?: (message: Message) => void;
  onError?: (error: Error) => void;
}

export const useChat = (options: UseChatOptions = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { isConfigured } = useApi();

  const sendMessage = async (content: string, previousMessages: Message[] = []): Promise<Message | null> => {
    if (!isConfigured) {
      const apiError = new Error('API key not configured');
      setError(apiError);
      options.onError?.(apiError);
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Create user message
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content,
        timestamp: Date.now(),
      };

      // Notify about the sent message
      options.onMessageSent?.(userMessage);

      // Get all messages including the new user message
      const allMessages = [...previousMessages, userMessage];
      
      // Send request to Anthropic API
      const responseContent = await sendChatRequest(allMessages);
      
      // Create assistant message
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseContent,
        timestamp: Date.now(),
      };

      // Notify about the received response
      options.onResponseReceived?.(assistantMessage);

      return assistantMessage;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('An unknown error occurred');
      setError(error);
      options.onError?.(error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendMessage,
    isLoading,
    error,
  };
};