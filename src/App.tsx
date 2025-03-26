import React, { useState } from 'react';
import { View, StyleSheet, Modal } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ChatProvider } from './contexts/ChatContext';
import ChatScreen from './screens/ChatScreen';
import ChatListScreen from './screens/ChatListScreen';

const App = () => {
  const [showChatList, setShowChatList] = useState(false);

  return (
    <SafeAreaProvider>
      <ChatProvider>
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
      </ChatProvider>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;