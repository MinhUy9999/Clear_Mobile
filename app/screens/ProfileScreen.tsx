import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../apiService/apiUser';
import { clearUser } from '../store/slices/userSlice';
import { RootState } from '../store/store';


const ProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.userData); // Access user from Redux store

  const handleLogoutPress = async () => {
    try {
      const response = await logoutUser();
      if (response.data.success) {
        Alert.alert('Success', 'You have been logged out.');
        dispatch(clearUser()); // Clear user from Redux store
        navigation.navigate('Login'); // Navigate to login screen
      } else {
        Alert.alert('Error', 'Logout failed. Please try again.');
      }
    } catch (error) {
      console.error('Logout error:', error.response || error.message);
      Alert.alert('Error', 'An error occurred while logging out. Please check your connection.');
    }
  };

  const handleLoginPress = () => {
    navigation.navigate('Login'); // Navigate to the login screen
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('./../../assets/images/logo.png')} // Replace with a local image if desired
        style={styles.avatar}
      />
      <Text style={styles.name}>{user ? user.firstname : 'Guest'}</Text>
      {user ? (
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogoutPress}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.loginButton} onPress={handleLoginPress}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  avatar: {
    width: '80%', 
    height: undefined, 
    aspectRatio: 1, 
    resizeMode: 'contain', 
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: '#FF4D4F',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ProfileScreen;
