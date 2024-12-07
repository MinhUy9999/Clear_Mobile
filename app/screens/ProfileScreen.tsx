// screens/ProfileScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation();

  const handleLoginPress = () => {
    navigation.navigate("Login"); // Make sure "Login" matches the route name in your navigator
  };

  return (
    <View style={styles.container}>
      <Image 
         source={require('./../../assets/images/profile.jpg')}  // Replace with a local image if desired
        style={styles.avatar}
      />
      <Text style={styles.name}>Guest</Text>
      <TouchableOpacity style={styles.loginButton} onPress={handleLoginPress}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>
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
    width: 100,
    height: 100,
    borderRadius: 50, // Circular shape
    marginBottom: 20,
    backgroundColor: '#ddd', // Placeholder color if no image is provided
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
});

export default ProfileScreen;
