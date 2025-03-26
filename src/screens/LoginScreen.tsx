import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import Icon from 'react-native-vector-icons/Ionicons';
import GoogleIcon from '../components/GoogleIcon';

const LoginScreen: React.FC = () => {
  const { signInWithGoogle, isLoading } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Icon name="chatbubble-ellipses" size={80} color="#0084FF" />
        <Text style={styles.appTitle}>Chat App</Text>
      </View>

      <Text style={styles.welcomeText}>
        Welcome to Chat App
      </Text>
      
      <Text style={styles.descriptionText}>
        Chat with Claude using the Anthropic API. Sign in to sync your conversations across devices.
      </Text>

      <TouchableOpacity
        style={styles.googleButton}
        onPress={signInWithGoogle}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <>
            <View style={styles.googleIconContainer}>
              <GoogleIcon size={24} />
            </View>
            <Text style={styles.googleButtonText}>Sign in with Google</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#FFFFFF',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 16,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  descriptionText: {
    fontSize: 16,
    marginBottom: 48,
    textAlign: 'center',
    color: '#666666',
    lineHeight: 24,
  },
  googleButton: {
    flexDirection: 'row',
    backgroundColor: '#4285F4',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: 300,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  googleIconContainer: {
    width: 24,
    height: 24,
    marginRight: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  googleButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LoginScreen;