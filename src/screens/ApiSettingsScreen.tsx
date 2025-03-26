import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useApi } from '../contexts/ApiContext';

interface ApiSettingsScreenProps {
  onClose: () => void;
}

const ApiSettingsScreen: React.FC<ApiSettingsScreenProps> = ({ onClose }) => {
  const { apiConfig, updateConfig, isValidating, validationError } = useApi();
  const [apiKey, setApiKey] = useState(apiConfig.apiKey);
  const [model, setModel] = useState(apiConfig.model);

  const handleSave = async () => {
    if (!apiKey.trim()) {
      Alert.alert('Error', 'API key is required');
      return;
    }

    const success = await updateConfig({
      apiKey,
      model,
    });

    if (success) {
      Alert.alert('Success', 'API settings saved successfully', [
        { text: 'OK', onPress: onClose }
      ]);
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
            style={styles.closeButton}
            onPress={onClose}
          >
            <Icon name="close" size={24} color="#000000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>API Settings</Text>
          <View style={styles.headerRight} />
        </View>
        
        <View style={styles.content}>
          <Text style={styles.label}>Anthropic API Key</Text>
          <TextInput
            style={styles.input}
            value={apiKey}
            onChangeText={setApiKey}
            placeholder="Enter your Anthropic API key"
            placeholderTextColor="#8E8E93"
            secureTextEntry
            autoCapitalize="none"
          />
          
          <Text style={styles.label}>Model</Text>
          <TextInput
            style={styles.input}
            value={model}
            onChangeText={setModel}
            placeholder="claude-3-opus-20240229"
            placeholderTextColor="#8E8E93"
            autoCapitalize="none"
          />
          
          {validationError && (
            <Text style={styles.errorText}>{validationError}</Text>
          )}
          
          <Text style={styles.infoText}>
            You can get an API key from the Anthropic dashboard at 
            https://console.anthropic.com
          </Text>
          
          <TouchableOpacity 
            style={styles.saveButton}
            onPress={handleSave}
            disabled={isValidating}
          >
            {isValidating ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.saveButtonText}>Save Settings</Text>
            )}
          </TouchableOpacity>
        </View>
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
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#F5F5F5',
  },
  saveButton: {
    backgroundColor: '#0084FF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 32,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: '#FF3B30',
    marginTop: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 16,
    lineHeight: 20,
  },
});

export default ApiSettingsScreen;