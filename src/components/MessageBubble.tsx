import React, { memo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Message } from '../types';
import { formatDate } from '../utils';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const [showTimestamp, setShowTimestamp] = React.useState(false);
  
  const toggleTimestamp = () => {
    setShowTimestamp(!showTimestamp);
  };
  
  return (
    <View style={[
      styles.container, 
      isUser ? styles.userContainer : styles.assistantContainer
    ]}>
      {!isUser && (
        <View style={styles.avatarContainer}>
          <Icon name="logo-electron" size={16} color="#FFFFFF" />
        </View>
      )}
      
      <View style={styles.bubbleWrapper}>
        <Pressable
          onPress={toggleTimestamp}
          style={({ pressed }) => [
            styles.bubble, 
            isUser ? styles.userBubble : styles.assistantBubble,
            pressed && styles.bubblePressed
          ]}
        >
          <Text style={[
            styles.messageText,
            isUser ? styles.userText : styles.assistantText
          ]}>
            {message.content}
          </Text>
        </Pressable>
        
        {showTimestamp && (
          <Text style={[
            styles.timestamp,
            isUser ? styles.userTimestamp : styles.assistantTimestamp
          ]}>
            {formatDate(message.timestamp)}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    maxWidth: '85%',
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  userContainer: {
    alignSelf: 'flex-end',
    marginRight: 12,
    marginLeft: 50,
  },
  assistantContainer: {
    alignSelf: 'flex-start',
    marginLeft: 12,
    marginRight: 50,
  },
  avatarContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#7C3AED',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginBottom: 18,
  },
  bubbleWrapper: {
    flex: 1,
  },
  bubble: {
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  bubblePressed: {
    opacity: 0.9,
  },
  userBubble: {
    backgroundColor: '#0084FF',
    borderTopRightRadius: 4,
  },
  assistantBubble: {
    backgroundColor: '#F2F2F7',
    borderTopLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: '#FFFFFF',
  },
  assistantText: {
    color: '#000000',
  },
  timestamp: {
    fontSize: 11,
    marginTop: 4,
    marginHorizontal: 4,
  },
  userTimestamp: {
    color: '#8E8E93',
    alignSelf: 'flex-end',
  },
  assistantTimestamp: {
    color: '#8E8E93',
    alignSelf: 'flex-start',
  },
});

export default memo(MessageBubble);