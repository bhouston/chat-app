import React, { useState } from 'react';
import { 
  TouchableOpacity, 
  Image, 
  StyleSheet, 
  View, 
  Text, 
  Modal,
  Alert
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import Icon from 'react-native-vector-icons/Ionicons';

interface UserProfileButtonProps {
  onPress?: () => void;
}

const UserProfileButton: React.FC<UserProfileButtonProps> = ({ onPress }) => {
  const { user, signOut } = useAuth();
  const [showProfileModal, setShowProfileModal] = useState(false);

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      setShowProfileModal(true);
    }
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              setShowProfileModal(false);
            } catch (error) {
              console.error('Failed to sign out:', error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <>
      <TouchableOpacity style={styles.container} onPress={handlePress}>
        {user?.photoURL ? (
          <Image
            source={{ uri: user.photoURL }}
            style={styles.profileImage}
          />
        ) : (
          <View style={styles.profileImagePlaceholder}>
            <Text style={styles.profileInitial}>
              {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
            </Text>
          </View>
        )}
      </TouchableOpacity>

      <Modal
        visible={showProfileModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowProfileModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowProfileModal(false)}
        >
          <View style={styles.modalContainer}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowProfileModal(false)}
            >
              <Icon name="close" size={24} color="#333333" />
            </TouchableOpacity>

            <View style={styles.profileHeader}>
              {user?.photoURL ? (
                <Image
                  source={{ uri: user.photoURL }}
                  style={styles.largeProfileImage}
                />
              ) : (
                <View style={styles.largeProfileImagePlaceholder}>
                  <Text style={styles.largeProfileInitial}>
                    {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                  </Text>
                </View>
              )}
              <Text style={styles.displayName}>{user?.displayName || 'User'}</Text>
              <Text style={styles.email}>{user?.email || ''}</Text>
            </View>

            <TouchableOpacity
              style={styles.signOutButton}
              onPress={handleSignOut}
            >
              <Icon name="log-out-outline" size={20} color="#FF3B30" />
              <Text style={styles.signOutText}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 40,
    height: 40,
  },
  profileImagePlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0084FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 40,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 8,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  largeProfileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
  },
  largeProfileImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#0084FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  largeProfileInitial: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  displayName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
    color: '#666666',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  signOutText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default UserProfileButton;