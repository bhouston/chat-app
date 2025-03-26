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
 * Sends a chat request to the Anthropic API
 * @param messages The conversation history
 * @returns The assistant's response
 */
export const sendChatRequest = async (messages: Message[]): Promise<string> => {
  try {
    // Format messages for Anthropic API
    const formattedMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content,
    }));

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