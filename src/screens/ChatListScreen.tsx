import React from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Text, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useChat } from '../contexts/ChatContext';
import { formatDate, truncateText } from '../utils';
import ChatListItem from '../components/ChatListItem';

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
            renderItem={({ item }) => (
              <ChatListItem 
                chat={item} 
                onSelect={handleSelectChat} 
                isSelected={currentChat?.id === item.id}
              />
            )}
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