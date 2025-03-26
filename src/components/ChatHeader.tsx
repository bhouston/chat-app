import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface ChatHeaderProps {
  title: string;
  onOpenChatList: () => void;
  onNewChat: () => void;
  onOpenSettings?: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ 
  title, 
  onOpenChatList, 
  onNewChat,
  onOpenSettings 
}) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity 
        style={styles.headerButton}
        onPress={onOpenChatList}
      >
        <Icon name="menu" size={24} color="#000000" />
      </TouchableOpacity>
      
      <Text style={styles.headerTitle}>{title}</Text>
      
      <View style={styles.headerActions}>
        {onOpenSettings && (
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={onOpenSettings}
          >
            <Icon name="settings-outline" size={22} color="#000000" />
          </TouchableOpacity>
        )}
        
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={onNewChat}
        >
          <Icon name="add" size={24} color="#000000" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default ChatHeader;