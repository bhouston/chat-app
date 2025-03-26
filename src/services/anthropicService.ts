import Anthropic from '@anthropic-ai/sdk';
import { Message } from '../types';

// TODO: Replace with a secure way to store the API key
// For now, this is a placeholder that will be replaced with the actual key
const ANTHROPIC_API_KEY = 'YOUR_ANTHROPIC_API_KEY';

// Initialize the Anthropic client
const anthropic = new Anthropic({
  apiKey: ANTHROPIC_API_KEY,
});

/**
 * Formats messages for the Anthropic API
 * @param messages Array of message objects
 * @returns Formatted messages for Anthropic API
 */
const formatMessagesForAnthropic = (messages: Message[]) => {
  return messages.map(msg => ({
    role: msg.role,
    content: msg.content,
  }));
};

/**
 * Sends a chat request to the Anthropic API
 * @param messages The conversation history
 * @returns The assistant's response
 */
export const sendChatRequest = async (messages: Message[]): Promise<string> => {
  try {
    // Format messages for Anthropic API
    const formattedMessages = formatMessagesForAnthropic(messages);

    // Send request to Anthropic
    const response = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 1024,
      messages: formattedMessages,
    });

    // Return the assistant's response
    return response.content[0].text;
  } catch (error) {
    console.error('Error sending chat request:', error);
    throw new Error('Failed to get response from Anthropic API');
  }
};

/**
 * Updates the Anthropic API key
 * @param apiKey The new API key
 */
export const updateApiKey = (apiKey: string) => {
  // In a real app, you would store this securely
  // For now, we're just updating the in-memory key
  anthropic.apiKey = apiKey;
};

/**
 * Validates an Anthropic API key by making a test request
 * @param apiKey The API key to validate
 * @returns True if the key is valid, false otherwise
 */
export const validateApiKey = async (apiKey: string): Promise<boolean> => {
  try {
    const testAnthropic = new Anthropic({
      apiKey: apiKey,
    });
    
    // Make a simple test request
    await testAnthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 10,
      messages: [{ role: 'user', content: 'Hello' }],
    });
    
    return true;
  } catch (error) {
    console.error('API key validation failed:', error);
    return false;
  }
};