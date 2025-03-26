import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

interface LoadingIndicatorProps {
  text?: string;
  fullScreen?: boolean;
  transparent?: boolean;
  size?: 'small' | 'large';
  color?: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ 
  text = 'Loading...', 
  fullScreen = false,
  transparent = false,
  size = 'small',
  color = '#0084FF'
}) => {
  if (fullScreen) {
    return (
      <View style={[
        styles.fullScreenContainer, 
        transparent && styles.transparentBackground
      ]}>
        <View style={styles.loadingBox}>
          <ActivityIndicator size={size} color={color} />
          {text && <Text style={styles.loadingText}>{text}</Text>}
        </View>
      </View>
    );
  }
  
  return (
    <View style={[
      styles.container, 
      transparent && styles.transparentBackground
    ]}>
      <ActivityIndicator size={size} color={color} />
      {text && <Text style={styles.loadingText}>{text}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  fullScreenContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    zIndex: 1000,
  },
  transparentBackground: {
    backgroundColor: 'transparent',
  },
  loadingBox: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#8E8E93',
  },
});

export default LoadingIndicator;