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
import { useNavigation } from '@react-navigation/native';
import { getAllServices, getOneService } from '../../apiService/apiService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute, RouteProp } from '@react-navigation/native';

interface Service {
  _id: string;
  title: string;
  description: string[];
  thumb: string;
  price: number;
  category: string;
}

interface User {
  firstname: string;
}

type RootStackParamList = {
  Home: { user?: User };
  CreateBooking: { screen: string; params: { service: any } };
};

const cleanDescription = (description: string) => {
  return description
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
};

const HomeScreen: React.FC = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'Home'>>();
  const navigation = useNavigation();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (route.params?.user) {
      setUser(route.params?.user);
    } else {
      const fetchUser = async () => {
        try {
          const userData = await AsyncStorage.getItem('user');
          if (userData) setUser(JSON.parse(userData));
        } catch (error) {
          console.error('Failed to load user data', error);
        }
      };
      fetchUser();
    }

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

  // const handleBookNow = async (serviceId: string) => {
  //   try {
  //     const response = await getOneService(serviceId);
  //     const serviceData = response.data.service;
  //     navigation.navigate('CreateBooking', { screen: 'CreateBooking', params: { service: serviceData } });
  //   } catch (error) {
  //     Alert.alert('Error', 'Unable to load service details.');
  //     console.error('Failed to load service details:', error);
  //   }
  // };
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
  bookButton: {
    backgroundColor: '#f0ad4e',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  descriptionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  descriptionList: {
    marginTop: 8,
  },
  descriptionItem: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
    lineHeight: 20,
  },
});

export default HomeScreen;
