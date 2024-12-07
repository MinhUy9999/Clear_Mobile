import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAllServices, getOneService } from '../../apiService/apiService';

interface Service {
  _id: string;
  title: string;
  description: string[];
  thumb: string;
  price: number;
  category: string;
}

const cleanDescription = (description: string) => {
  return description
    .replace(/<[^>]+>/g, '') // Strip HTML tags
    .replace(/\s+/g, ' ') // Normalize white space
    .trim();
};

const BookingScreen: React.FC = () => {
  const navigation = useNavigation();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await getAllServices();
        setServices(response.data.service);
      } catch (error) {
        console.error('Không thể tải danh sách dịch vụ:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const handleBookNow = async (serviceId: string) => {
    try {
      const response = await getOneService(serviceId);
      const serviceData = response.data.service;
      navigation.navigate('CreateBooking', { service: serviceData });
    } catch (error) {
      console.error('Không thể tải chi tiết dịch vụ:', error);
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
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Available Services</Text>
     <FlatList
        data={services}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const imageUrl = item.thumb.startsWith('http')
            ? item.thumb
            : `https://res.cloudinary.com/dmzwmqrz3/image/upload/v1732558993/cuahangdientu/${item.thumb}`;

          return (
            <View style={styles.serviceItem}>
              <TouchableOpacity onPress={() => handleBookNow(item._id)}>
                <Text style={styles.title}>{item.title}</Text>
                <Text>Category: {item.category}</Text>
                <Text>Price: {item.price.toLocaleString()} VND</Text>
                <Text style={styles.descriptionHeader}>Describe:</Text>
                <View style={styles.descriptionList}>
                  {(item.description || []).map((desc, index) => (
                    <Text
                      key={index}
                      style={styles.descriptionItem}
                      numberOfLines={3} // Limit lines for better UI
                    >
                      {cleanDescription(desc)}
                    </Text>
                  ))}
                </View>
                <Image
                  source={{ uri: imageUrl }}
                  style={styles.thumbnail}
                  resizeMode="cover"
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.bookButton}
                onPress={() => handleBookNow(item._id)}
              >
                <Text style={styles.bookButtonText}>Book Now</Text>
              </TouchableOpacity>
            </View>
          );
        }}
      />
      
    </SafeAreaView>
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
    marginTop: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: 16,
  },
  serviceItem: {
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
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

export default BookingScreen;
