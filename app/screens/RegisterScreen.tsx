// screens/RegisterScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Alert,
} from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { registerUser } from '../../apiService/apiUser';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const RegisterScreen = ({ navigation }: { navigation: NavigationProp<any> }) => {
  const [email, setEmail] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const handleRegister = async () => {
    if (!email || !firstname || !lastname || !password || !mobile || !confirmPassword) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      const response = await registerUser({ email, password, firstname, lastname, mobile });
      setLoading(false);
      Alert.alert('Success', 'Registration successful. Go to login.', [
        { text: 'OK', onPress: () => navigation.navigate('Login') },
      ]);
    } catch (error) {
      setLoading(false);
      Alert.alert('Registration failed', error.response?.data?.mes || 'Something went wrong');
    }
  };

  return (
    <ImageBackground
      source={require('./../../assets/images/loginbg.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <ImageBackground source={require('./../../assets/images/bg1.jpg')} style={styles.logo} />
        </View>

        {/* Tabs for Sign In and Sign Up */}
        <View style={styles.tabContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.inactiveTab}>
            <Text style={styles.inactiveTabText}>Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.activeTab}>
            <Text style={styles.activeTabText}>Sign Up</Text>
          </TouchableOpacity>
        </View>

        {/* Form Inputs */}
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="First name"
          placeholderTextColor="#888"
          value={firstname}
          onChangeText={setFirstname}
        />
        <TextInput
          style={styles.input}
          placeholder="Last name"
          placeholderTextColor="#888"
          value={lastname}
          onChangeText={setLastname}
        />
        <TextInput
          style={styles.input}
          placeholder="Mobile"
          placeholderTextColor="#888"
          value={mobile}
          onChangeText={setMobile}
          keyboardType="phone-pad"
        />

        {/* Password Input with Eye Icon */}
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            placeholderTextColor="#888"
            secureTextEntry={!passwordVisible}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
            <Icon name={passwordVisible ? 'eye' : 'eye-off'} size={24} color="#888" />
          </TouchableOpacity>
        </View>

        {/* Confirm Password Input with Eye Icon */}
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Confirm Password"
            placeholderTextColor="#888"
            secureTextEntry={!confirmPasswordVisible}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
            <Icon name={confirmPasswordVisible ? 'eye' : 'eye-off'} size={24} color="#888" />
          </TouchableOpacity>
        </View>

        {/* Sign Up Button */}
        <TouchableOpacity style={styles.signUpButton} onPress={handleRegister} disabled={loading}>
          <Text style={styles.signUpButtonText}>{loading ? 'Registering...' : 'Sign Up'}</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  logoContainer: {
    marginBottom: 30,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  activeTab: {
    marginLeft: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#3366FF',
  },
  inactiveTab: {
    marginRight: 20,
  },
  activeTabText: {
    fontSize: 18,
    color: '#3366FF',
  },
  inactiveTabText: {
    fontSize: 18,
    color: '#888',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  passwordInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
  signUpButton: {
    backgroundColor: '#3366FF',
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 20,
    elevation: 3,
  },
  signUpButtonText: {
    color: '#FFF',
    fontSize: 18,
  },
});

export default RegisterScreen;
