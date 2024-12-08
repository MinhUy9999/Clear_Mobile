import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store'; // Import the RootState type from your Redux store
import { getAllServices, getOneService } from '../../apiService/apiService';
import { useNavigation } from '@react-navigation/native';

interface Service {
  _id: string;
  title: string;
  description: string[];
  thumb: string;
  price: number;
  category: string;
}

const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const user = useSelector((state: RootState) => state.user.userData); // Access user data from Redux store
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await getAllServices();
        setServices(response.data.service);
      } catch (error) {
        Alert.alert('Error', 'Failed to load services.');
        console.error('Failed to fetch services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleViewDetails = async (serviceId: string) => {
    try {
      const response = await getOneService(serviceId);
      const serviceData = response.data.service;
      navigation.navigate('ServiceDetails', { service: serviceData });
    } catch (error) {
      Alert.alert('Error', 'Unable to load service details.');
      console.error('Failed to load service details:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome, {user ? user.firstname : 'User'}</Text>
      <Text style={styles.header}>Available Services</Text>
      <FlatList
        data={services}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.serviceItem}
            onPress={() => handleViewDetails(item._id)}
          >
            <Image
              source={{
                uri: item.thumb.startsWith('http')
                  ? item.thumb
                  : `https://res.cloudinary.com/dmzwmqrz3/image/upload/v1732558993/cuahangdientu/${item.thumb}`,
              }}
              style={styles.thumbnail}
              resizeMode="cover"
            />
            <Text style={styles.title}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceItem: {
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  thumbnail: {
    width: '100%',
    height: 200,
    marginTop: 8,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
});

export default HomeScreen;
