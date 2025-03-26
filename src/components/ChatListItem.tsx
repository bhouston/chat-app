import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Chat } from '../types';
import { formatDate, truncateText } from '../utils';

interface ChatListItemProps {
  chat: Chat;
  onSelect: (chatId: string) => void;
  isSelected: boolean;
}

const ChatListItem: React.FC<ChatListItemProps> = ({ chat, onSelect, isSelected }) => {
  const lastMessage = chat.messages.length > 0 
    ? chat.messages[chat.messages.length - 1] 
    : null;
    
  const lastMessagePreview = lastMessage 
    ? truncateText(lastMessage.content, 40)
    : 'No messages yet';

  return (
    <TouchableOpacity 
      style={[styles.container, isSelected && styles.selectedContainer]} 
      onPress={() => onSelect(chat.id)}
    >
      <Text style={styles.title}>{truncateText(chat.title, 25)}</Text>
      <Text style={styles.preview}>{lastMessagePreview}</Text>
      <Text style={styles.timestamp}>{formatDate(chat.updatedAt)}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
    backgroundColor: '#FFFFFF',
  },
  selectedContainer: {
    backgroundColor: '#E9F5FF',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#000000',
  },
  preview: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 12,
    color: '#8E8E93',
    alignSelf: 'flex-end',
  },
});

export default ChatListItem;