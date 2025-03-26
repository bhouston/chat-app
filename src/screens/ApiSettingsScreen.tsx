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
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useApi } from '../contexts/ApiContext';

interface ApiSettingsScreenProps {
  onClose: () => void;
}

const ApiSettingsScreen: React.FC<ApiSettingsScreenProps> = ({ onClose }) => {
  const { apiConfig, isValidating, validationError, updateConfig } = useApi();
  const [apiKey, setApiKey] = useState(apiConfig.apiKey || '');
  const [model, setModel] = useState(apiConfig.model || 'claude-3-opus-20240229');

  const handleSave = async () => {
    const success = await updateConfig({ apiKey, model });
    if (success) {
      Alert.alert('Success', 'API configuration saved successfully');
      onClose();
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
          <Text style={styles.headerTitle}>API Settings</Text>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={onClose}
          >
            <Icon name="close" size={24} color="#000000" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Anthropic API Key</Text>
            <TextInput
              style={styles.input}
              value={apiKey}
              onChangeText={setApiKey}
              placeholder="Enter your Anthropic API key"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Text style={styles.helpText}>
              You can get an API key from the Anthropic Console at console.anthropic.com
            </Text>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Model</Text>
            <TextInput
              style={styles.input}
              value={model}
              onChangeText={setModel}
              placeholder="claude-3-opus-20240229"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Text style={styles.helpText}>
              Available models: claude-3-opus-20240229, claude-3-sonnet-20240229, claude-3-haiku-20240307
            </Text>
          </View>

          {validationError && (
            <Text style={styles.errorText}>{validationError}</Text>
          )}

          <TouchableOpacity
            style={[styles.saveButton, (!apiKey || isValidating) && styles.disabledButton]}
            onPress={handleSave}
            disabled={!apiKey || isValidating}
          >
            {isValidating ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.saveButtonText}>Save Configuration</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
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
  content: {
    flex: 1,
    padding: 16,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#000000',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#F5F5F5',
  },
  helpText: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#FF3B30',
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: '#0084FF',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  disabledButton: {
    backgroundColor: '#B8B8B8',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ApiSettingsScreen;