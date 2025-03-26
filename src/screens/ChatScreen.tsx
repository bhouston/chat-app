import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  FlatList, 
  StyleSheet, 
  Modal,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { useChat as useChatContext } from '../contexts/ChatContext';
import { useChat as useChatHook } from '../hooks/useChat';
import { useApi } from '../contexts/ApiContext';
import ChatHeader from '../components/ChatHeader';
import MessageBubble from '../components/MessageBubble';
import MessageInput from '../components/MessageInput';
import EmptyState from '../components/EmptyState';
import LoadingIndicator from '../components/LoadingIndicator';
import ApiSettingsScreen from '../screens/ApiSettingsScreen';
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
        <ChatHeader 
          title={currentChat?.title || 'New Chat'}
          onOpenChatList={onOpenChatList}
          onNewChat={createNewChat}
          onOpenSettings={() => setShowApiSettings(true)}
        />
        
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
            <EmptyState 
              icon="chatbubble-ellipses-outline"
              title="Start a conversation"
              message="Type a message below to start chatting with Claude"
            />
          )}
          
          {isLoading && (
            <View style={styles.loadingOverlay}>
              <LoadingIndicator text="Thinking..." transparent />
            </View>
          )}
        </View>
        
        <MessageInput onSend={handleSendMessage} isLoading={isLoading} />
      </KeyboardAvoidingView>
      
      <Modal
        visible={showApiSettings}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <ApiSettingsScreen onClose={() => setShowApiSettings(false)} />
      </Modal>
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
  content: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  messagesContainer: {
    padding: 8,
    paddingBottom: 16,
  },
  loadingOverlay: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
});

export default ChatScreen;