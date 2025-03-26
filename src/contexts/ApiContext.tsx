import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiConfig } from '../types';
import { updateApiKey, validateApiKey } from '../services/anthropicService';

interface ApiContextType {
  apiConfig: ApiConfig;
  isConfigured: boolean;
  isValidating: boolean;
  validationError: string | null;
  updateConfig: (config: Partial<ApiConfig>) => Promise<boolean>;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

const API_CONFIG_KEY = 'chat_app_api_config';

const DEFAULT_CONFIG: ApiConfig = {
  apiKey: '',
  model: 'claude-3-opus-20240229',
};

export const ApiProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [apiConfig, setApiConfig] = useState<ApiConfig>(DEFAULT_CONFIG);
  const [isConfigured, setIsConfigured] = useState<boolean>(false);
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Load API configuration from storage on initial render
  useEffect(() => {
    const loadApiConfig = async () => {
      try {
        const storedConfig = await AsyncStorage.getItem(API_CONFIG_KEY);
        if (storedConfig) {
          const parsedConfig = JSON.parse(storedConfig) as ApiConfig;
          setApiConfig(parsedConfig);
          setIsConfigured(!!parsedConfig.apiKey);
          
          // Update the API key in the service
          if (parsedConfig.apiKey) {
            updateApiKey(parsedConfig.apiKey);
          }
        }
      } catch (error) {
        console.error('Failed to load API configuration:', error);
      }
    };

    loadApiConfig();
  }, []);

  const updateConfig = async (config: Partial<ApiConfig>): Promise<boolean> => {
    setIsValidating(true);
    setValidationError(null);
    
    try {
      const newConfig = { ...apiConfig, ...config };
      
      // Validate the API key if it's being updated
      if (config.apiKey && config.apiKey !== apiConfig.apiKey) {
        const isValid = await validateApiKey(config.apiKey);
        if (!isValid) {
          setValidationError('Invalid API key. Please check and try again.');
          setIsValidating(false);
          return false;
        }
        
        // Update the API key in the service
        updateApiKey(config.apiKey);
      }
      
      // Save the updated configuration
      await AsyncStorage.setItem(API_CONFIG_KEY, JSON.stringify(newConfig));
      
      // Update the state
      setApiConfig(newConfig);
      setIsConfigured(!!newConfig.apiKey);
      setIsValidating(false);
      
      return true;
    } catch (error) {
      console.error('Failed to update API configuration:', error);
      setValidationError('An error occurred while updating the configuration.');
      setIsValidating(false);
      return false;
    }
  };

  return (
    <ApiContext.Provider
      value={{
        apiConfig,
        isConfigured,
        isValidating,
        validationError,
        updateConfig,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = (): ApiContextType => {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
};