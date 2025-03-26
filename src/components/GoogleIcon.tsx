import React from 'react';
import { View, StyleSheet } from 'react-native';

interface GoogleIconProps {
  size?: number;
}

const GoogleIcon: React.FC<GoogleIconProps> = ({ size = 24 }) => {
  const iconSize = size;
  const borderWidth = size * 0.08;
  const innerSize = size - 2 * borderWidth;

  return (
    <View style={[styles.container, { width: iconSize, height: iconSize }]}>
      <View style={[styles.iconBackground, { width: innerSize, height: innerSize }]}>
        <View style={[styles.iconCenter, { 
          width: innerSize * 0.5, 
          height: innerSize * 0.5,
          borderTopRightRadius: innerSize * 0.25,
          borderBottomRightRadius: innerSize * 0.25,
        }]} />
        
        <View style={[styles.iconTop, { 
          width: innerSize * 0.35, 
          height: innerSize * 0.35,
          top: innerSize * 0.1,
          right: innerSize * 0.1,
          borderTopRightRadius: innerSize * 0.175,
        }]} />
        
        <View style={[styles.iconBottom, { 
          width: innerSize * 0.35, 
          height: innerSize * 0.35,
          bottom: innerSize * 0.1,
          right: innerSize * 0.1,
          borderBottomRightRadius: innerSize * 0.175,
        }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBackground: {
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  iconCenter: {
    position: 'absolute',
    left: '25%',
    backgroundColor: '#4285F4',
  },
  iconTop: {
    position: 'absolute',
    backgroundColor: '#EA4335',
  },
  iconBottom: {
    position: 'absolute',
    backgroundColor: '#34A853',
  },
});

export default GoogleIcon;