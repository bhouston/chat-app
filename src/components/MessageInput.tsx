import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator,
  Keyboard,
  Animated,
  Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface MessageInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSend, isLoading }) => {
  const [message, setMessage] = useState('');
  const [inputHeight, setInputHeight] = useState(40);
  const animatedHeight = useRef(new Animated.Value(56)).current;
  const inputRef = useRef<TextInput>(null);

  // Handle input height changes
  useEffect(() => {
    Animated.timing(animatedHeight, {
      toValue: Math.min(inputHeight + 16, 120),
      duration: 100,
      useNativeDriver: false,
    }).start();
  }, [inputHeight]);

  const handleSend = () => {
    if (message.trim() && !isLoading) {
      onSend(message.trim());
      setMessage('');
      setInputHeight(40);
      Keyboard.dismiss();
    }
  };
  
  const handleContentSizeChange = (event: any) => {
    setInputHeight(event.nativeEvent.contentSize.height);
  };

  return (
    <Animated.View style={[styles.container, { height: animatedHeight }]}>
      <View style={styles.inputContainer}>
        <TextInput
          ref={inputRef}
          style={[styles.input, { height: Math.min(inputHeight, 100) }]}
          placeholder="Type a message..."
          value={message}
          onChangeText={setMessage}
          onContentSizeChange={handleContentSizeChange}
          multiline
          maxLength={4000}
          editable={!isLoading}
          scrollEnabled={true}
        />
        {Platform.OS === 'ios' && (
          <TouchableOpacity 
            style={styles.keyboardDismiss} 
            onPress={() => Keyboard.dismiss()}
          >
            <Icon name="chevron-down" size={20} color="#8E8E93" />
          </TouchableOpacity>
        )}
      </View>
      
      <TouchableOpacity 
        style={[styles.sendButton, (!message.trim() || isLoading) && styles.disabledButton]} 
        onPress={handleSend}
        disabled={!message.trim() || isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Icon name="send" size={22} color="#FFFFFF" />
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    alignItems: 'center',
  },
  inputContainer: {
    flex: 1,
    position: 'relative',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    paddingRight: Platform.OS === 'ios' ? 40 : 16,
    fontSize: 16,
    backgroundColor: '#F5F5F5',
  },
  keyboardDismiss: {
    position: 'absolute',
    right: 8,
    top: '50%',
    marginTop: -15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#0084FF',
    borderRadius: 25,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  },
  disabledButton: {
    backgroundColor: '#B8B8B8',
  },
});

export default MessageInput;