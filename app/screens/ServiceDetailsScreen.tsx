import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

interface ServiceDetailsProps {
  route: {
    params: {
      service: {
        _id: string;
        title: string;
        thumb: string;
        price: number;
        description: string[];
      };
    };
  };
}

const cleanDescription = (description: string) => {
  return description
    .replace(/<[^>]+>/g, '') // Loại bỏ thẻ HTML
    .replace(/\s+/g, ' ') // Chuẩn hóa khoảng trắng
    .trim();
};

const ServiceDetailsScreen: React.FC<ServiceDetailsProps> = ({ route }) => {
  const navigation = useNavigation();
  const { service } = route.params;

  const handleBookNow = () => {
    navigation.navigate('CreateBooking', { service });
  };

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{
          uri: service.thumb.startsWith('http')
            ? service.thumb
            : `https://res.cloudinary.com/dmzwmqrz3/image/upload/v1732558993/cuahangdientu/${service.thumb}`,
        }}
        style={styles.thumbnail}
        resizeMode="cover"
      />
      <Text style={styles.title}>{service.title}</Text>
      <Text style={styles.price}>Price: {service.price.toLocaleString()} VND</Text>
      <Text style={styles.descriptionHeader}>Description:</Text>
      {service.description.map((desc, index) => (
        <Text key={index} style={styles.descriptionItem}>
          {cleanDescription(desc)}
        </Text>
      ))}
      <TouchableOpacity style={styles.bookButton} onPress={handleBookNow}>
        <Text style={styles.bookButtonText}>Book Now</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  thumbnail: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    textAlign: 'center',
  },
  price: {
    fontSize: 18,
    color: '#333',
    marginVertical: 8,
    textAlign: 'center',
  },
  descriptionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  descriptionItem: {
    fontSize: 16,
    color: '#555',
    marginVertical: 4,
  },
  bookButton: {
    backgroundColor: '#f0ad4e',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ServiceDetailsScreen;
