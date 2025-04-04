import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  Text, 
  ActivityIndicator,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useChat as useChatContext } from '../contexts/ChatContext';
import { useChat as useChatHook } from '../hooks/useChat';
import { useApi } from '../contexts/ApiContext';
import MessageBubble from '../components/MessageBubble';
import MessageInput from '../components/MessageInput';
import { Message } from '../types';

interface ChatScreenProps {
  onOpenChatList: () => void;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ onOpenChatList }) => {
  const { currentChat, addMessage, createNewChat } = useChatContext();
  const [showApiSettings, setShowApiSettings] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const { isConfigured } = useApi();

  // Use our custom chat hook
  const { sendMessage, isLoading, error } = useChatHook({
    onError: (err) => {
      Alert.alert('Error', err.message);
    }
  });

  // Scroll to bottom when messages change
  useEffect(() => {
    if (currentChat?.messages.length && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [currentChat?.messages]);

  // Show error if API is not configured
  useEffect(() => {
    if (error) {
      Alert.alert('Error', error.message);
    }
  }, [error]);

  const handleSendMessage = async (content: string) => {
    if (!isConfigured) {
      Alert.alert(
        'API Key Required',
        'Please configure your Anthropic API key to send messages.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Configure', onPress: () => setShowApiSettings(true) }
        ]
      );
      return;
    }

    // Add user message
    addMessage(content, 'user');
    
    try {
      // Get all messages including the new user message
      const allMessages = [
        ...(currentChat?.messages || []),
        { id: 'temp', role: 'user' as const, content, timestamp: Date.now() }
      ];
      
      // Send request using our hook
      const assistantMessage = await sendMessage(content, allMessages.slice(0, -1));
      
      // Add assistant response if we got one
      if (assistantMessage) {
        addMessage(assistantMessage.content, 'assistant');
      }
    } catch (error) {
      console.error('Failed to get response:', error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={onOpenChatList}
          >
            <Icon name="menu" size={24} color="#000000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{currentChat?.title || 'New Chat'}</Text>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={createNewChat}
          >
            <Icon name="add" size={24} color="#000000" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.content}>
          {currentChat?.messages && currentChat.messages.length > 0 ? (
            <FlatList
              ref={flatListRef}
              data={currentChat.messages}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <MessageBubble message={item} />}
              contentContainerStyle={styles.messagesContainer}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Icon name="chatbubble-ellipses-outline" size={48} color="#8E8E93" />
              <Text style={styles.emptyText}>Start a conversation</Text>
            </View>
          )}
          
          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#0084FF" />
              <Text style={styles.loadingText}>Thinking...</Text>
            </View>
          )}
        </View>
        
        <MessageInput onSend={handleSendMessage} isLoading={isLoading} />
      </KeyboardAvoidingView>
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
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  messagesContainer: {
    padding: 8,
    paddingBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#8E8E93',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#8E8E93',
  },
});

export default ChatScreen;