import React from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Text, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useChat } from '../contexts/ChatContext';
import { formatDate, truncateText } from '../utils';

interface ChatListScreenProps {
  onClose: () => void;
}

const ChatListScreen: React.FC<ChatListScreenProps> = ({ onClose }) => {
  const { chats, currentChat, selectChat, createNewChat } = useChat();

  const handleSelectChat = (chatId: string) => {
    selectChat(chatId);
    onClose();
  };

  const handleNewChat = () => {
    createNewChat();
    onClose();
  };

  // Render each chat item
  const renderChatItem = ({ item }: { item: any }) => {
    const isSelected = currentChat?.id === item.id;
    const lastMessage = item.messages.length > 0 
      ? item.messages[item.messages.length - 1] 
      : null;
      
    const lastMessagePreview = lastMessage 
      ? truncateText(lastMessage.content, 40)
      : 'No messages yet';

    return (
      <TouchableOpacity 
        style={[styles.chatItem, isSelected && styles.selectedChatItem]} 
        onPress={() => handleSelectChat(item.id)}
      >
        <Text style={styles.chatTitle}>{truncateText(item.title, 25)}</Text>
        <Text style={styles.chatPreview}>{lastMessagePreview}</Text>
        <Text style={styles.chatTimestamp}>{formatDate(item.updatedAt)}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Conversations</Text>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={onClose}
          >
            <Icon name="close" size={24} color="#000000" />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          style={styles.newChatButton}
          onPress={handleNewChat}
        >
          <Icon name="add-circle-outline" size={24} color="#0084FF" />
          <Text style={styles.newChatText}>New Chat</Text>
        </TouchableOpacity>
        
        {chats.length > 0 ? (
          <FlatList
            data={chats}
            keyExtractor={(item) => item.id}
            renderItem={renderChatItem}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No conversations yet</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  newChatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  newChatText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#0084FF',
    fontWeight: '500',
  },
  chatItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  selectedChatItem: {
    backgroundColor: '#E9F5FF',
  },
  chatTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  chatPreview: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 4,
  },
  chatTimestamp: {
    fontSize: 12,
    color: '#8E8E93',
    alignSelf: 'flex-end',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#8E8E93',
  },
});

export default ChatListScreen;