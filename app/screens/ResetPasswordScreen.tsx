// src/screens/ResetPassword.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import axios from 'axios';

const ResetPassword = ({ route }) => {
  const [password, setPassword] = useState('');
  const { token } = route.params;

  const handleResetPassword = async () => {
    if (!password) {
      Alert.alert("Error", "Please enter a new password.");
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/user/resetpassword', { token, password });
      Alert.alert("Success", response.data.mes || "Password has been reset.");
    } catch (error) {
      Alert.alert("Error", error.response?.data?.mes || "Failed to reset password.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter new password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Reset Password" onPress={handleResetPassword} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16 },
  title: { fontSize: 20, marginBottom: 20 },
  input: { borderWidth: 1, padding: 10, marginBottom: 20, borderRadius: 5 },
});

export default ResetPassword;
