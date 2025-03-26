import React, { useState } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { ChatProvider } from './contexts/ChatContext';
import { ApiProvider } from './contexts/ApiContext';
import ChatScreen from './screens/ChatScreen';
import ChatListScreen from './screens/ChatListScreen';
import ApiSettingsScreen from './screens/ApiSettingsScreen';
import { useApi } from './contexts/ApiContext';

// Component to check if API is configured
const ApiCheck: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isConfigured } = useApi();
  const [showSettings, setShowSettings] = useState(!isConfigured);

  // If API is not configured, show a prompt
  if (!isConfigured && !showSettings) {
    return (
      <View style={styles.apiPromptContainer}>
        <Text style={styles.apiPromptTitle}>API Key Required</Text>
        <Text style={styles.apiPromptText}>
          To use this app, you need to configure your Anthropic API key.
        </Text>
        <TouchableOpacity
          style={styles.apiPromptButton}
          onPress={() => setShowSettings(true)}
        >
          <Text style={styles.apiPromptButtonText}>Configure API Key</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <>
      {children}
      <Modal
        visible={showSettings}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <ApiSettingsScreen onClose={() => setShowSettings(false)} />
      </Modal>
    </>
  );
};

const App = () => {
  const [showChatList, setShowChatList] = useState(false);

  return (
    <SafeAreaProvider>
      <ApiProvider>
        <ChatProvider>
          <ApiCheck>
            <View style={styles.container}>
              <ChatScreen onOpenChatList={() => setShowChatList(true)} />
              
              <Modal
                visible={showChatList}
                animationType="slide"
                presentationStyle="pageSheet"
              >
                <ChatListScreen onClose={() => setShowChatList(false)} />
              </Modal>
            </View>
          </ApiCheck>
        </ChatProvider>
      </ApiProvider>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  apiPromptContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#FFFFFF',
  },
  apiPromptTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  apiPromptText: {
    fontSize: 16,
    marginBottom: 32,
    textAlign: 'center',
    color: '#666666',
  },
  apiPromptButton: {
    backgroundColor: '#0084FF',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  apiPromptButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default App;