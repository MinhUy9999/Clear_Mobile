// CreateBookingScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { createBooking } from '../../apiService/apiBooking';
import {
  fetchDistricts,
  fetchWards,
  fetchAddressSuggestions,
  getHotDistricts,
} from '../../apiService/apiMap';
import { Calendar } from 'react-native-calendars';

// Define the Service type
type Service = {
  _id: string;
  title: string;
  price: number;
  description: string[];
  thumb: string;
  category: string;
};

// Define the route parameters
type RouteParams = {
  service: Service;
};

// Define the HotDistrict type
type HotDistrict = {
  name: string;
  percentage: number;
};

// Define the AddressSuggestion type
type AddressSuggestion = {
  description: string;
  place_id: string;
};

// Define the District and Ward types
type District = {
  code: string;
  name: string;
  // Add other fields if necessary
};

type Ward = {
  code: string;
  name: string;
  // Add other fields if necessary
};

const CreateBookingScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<{ params: RouteParams }, 'params'>>();
  const service = route.params?.service;

  if (!service) {
    return <Text>Service not found</Text>;
  }

  // State variables
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [districtName, setDistrictName] = useState(''); // Store district name
  const [districtCode, setDistrictCode] = useState(''); // Store district code
  const [wardName, setWardName] = useState(''); // Store ward name
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [timeSlot, setTimeSlot] = useState('08:00');
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [percentage, setPercentage] = useState(0);
  const [totalPrice, setTotalPrice] = useState<number>(service.price);
  const [hotDistricts, setHotDistricts] = useState<HotDistrict[]>([]);
  const [districtList, setDistrictList] = useState<District[]>([]);
  const [wardList, setWardList] = useState<Ward[]>([]);
  const [addressSuggestions, setAddressSuggestions] = useState<AddressSuggestion[]>([]);
  const [notification, setNotification] = useState('');

  /**
   * Fetch hot districts and all districts on component mount
   */
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch hot districts
        const hotDistrictsResponse = await getHotDistricts();
        if (Array.isArray(hotDistrictsResponse)) {
          setHotDistricts(hotDistrictsResponse);
        } else {
          console.error('Invalid hot districts data:', hotDistrictsResponse);
          setHotDistricts([]);
        }

        // Fetch all districts
        const districtsResponse = await fetchDistricts();
        if (Array.isArray(districtsResponse)) {
          setDistrictList(districtsResponse);
        } else {
          console.error('Invalid district data:', districtsResponse);
          setDistrictList([]);
        }
      } catch (error) {
        console.error('Error fetching initial data:', error);
        setHotDistricts([]);
        setDistrictList([]);
      }
    };

    fetchInitialData();
  }, []);

  /**
   * Fetch wards whenever a district is selected
   */
  useEffect(() => {
    if (districtCode) { // Use districtCode for fetching wards
      const fetchWardData = async () => {
        try {
          const wards = await fetchWards(districtCode); // Use districtCode
          if (Array.isArray(wards)) {
            setWardList(wards);
            // Reset ward selection when district changes
            setWardName('');
          } else {
            console.error('Invalid ward data:', wards);
            setWardList([]);
          }
        } catch (error) {
          console.error('Error fetching wards:', error);
          setWardList([]);
        }
      };

      fetchWardData();
    } else {
      // If no district is selected, clear wards
      setWardList([]);
      setWardName('');
    }
  }, [districtCode]);

  /**
   * Update percentage and notification when district or hotDistricts change
   */
  useEffect(() => {
    if (districtName && districtList.length > 0) {
      // Check if the selected district is a hot district
      const hotDistrict = hotDistricts.find((hd) => hd.name === districtName);

      if (hotDistrict) {
        setPercentage(hotDistrict.percentage);
        setNotification(
          `Giá tăng ${hotDistrict.percentage}% vì bạn chọn quận nóng ${hotDistrict.name}.`,
        );
      } else {
        setPercentage(0);
        setNotification('');
      }
    } else {
      setPercentage(0);
      setNotification('');
    }
  }, [districtName, hotDistricts]);

  /**
   * Update total price whenever quantity or percentage changes
   */
  useEffect(() => {
    const basePrice = service.price;
    const updatedPrice = basePrice * (1 + percentage / 100);
    setTotalPrice(updatedPrice * quantity);
  }, [quantity, percentage, service.price]);

  /**
   * Handle booking creation
   */
  const handleCreateBooking = async () => {
    // Validate required fields
    if (
      !customerName ||
      !email ||
      !phoneNumber ||
      !address ||
      !districtName ||
      !wardName
    ) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin.');
      return;
    }

    try {
      const bookingData = {
        service: service._id,
        customerName,
        email,
        phoneNumber,
        address,
        district: districtName,
        ward: wardName,
        date: date.toISOString().split('T')[0],
        timeSlot,
        quantity,
        notes,
        totalPrice,
      };

      const response = await createBooking(bookingData);
      console.log('Booking success:', response);
      Alert.alert('Thành công', 'Đặt lịch của bạn đã được tạo thành công!');
      navigation.goBack();
    } catch (error) {
      console.error('Error creating booking:', error);
      Alert.alert(
        'Lỗi',
        'Có lỗi xảy ra khi tạo lịch hẹn. Vui lòng thử lại sau.',
      );
    }
  };

  /**
   * Handle address input changes and fetch suggestions
   */
  const handleAddressChange = async (input: string) => {
    setAddress(input);
    if (input.length < 3) {
      setAddressSuggestions([]);
      return;
    }

    try {
      const suggestions = await fetchAddressSuggestions(input);
      if (Array.isArray(suggestions)) {
        setAddressSuggestions(suggestions);
      } else {
        console.error('Invalid address suggestions data:', suggestions);
        setAddressSuggestions([]);
      }
    } catch (error) {
      console.error('Error fetching address suggestions:', error);
      setAddressSuggestions([]);
    }
  };

  /**
   * Handle selecting an address suggestion
   */
  const handleSelectAddress = (selectedAddress: string) => {
    setAddress(selectedAddress);
    setAddressSuggestions([]);
  };

  /**
   * Handle date selection from the calendar
   */
  const handleDateChange = (day: any) => {
    setDate(new Date(day.dateString));
    setShowDatePicker(false);
  };

  /**
   * Generate available time slots based on the selected date and current time
   */
  const getAvailableTimeSlots = () => {
    const now = new Date();
    const selectedDate = date;

    const startHour = 7; // 7:00 AM
    const endHour = 18; // 6:00 PM

    const availableSlots: string[] = [];
    for (let hour = startHour; hour <= endHour; hour += 2) {
      const timeString = `${hour < 10 ? '0' + hour : hour}:00`;
      availableSlots.push(timeString);
    }

    if (selectedDate.toDateString() === now.toDateString()) {
      // If selected date is today, filter out past time slots
      return availableSlots.filter((slot) => {
        const [hours, minutes] = slot.split(':').map(Number);
        const slotTime = new Date(now);
        slotTime.setHours(hours, minutes, 0, 0);
        return slotTime > now;
      });
    } else {
      return availableSlots;
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{service.title}</Text>
      <TextInput
        placeholder="Họ và tên"
        value={customerName}
        onChangeText={setCustomerName}
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Số điện thoại"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        style={styles.input}
      />
      <TextInput
        placeholder="Địa chỉ"
        value={address}
        onChangeText={handleAddressChange}
        style={styles.input}
      />
      {addressSuggestions.length > 0 && (
        <View style={styles.suggestions}>
          {addressSuggestions.map((suggestion) => (
            <TouchableOpacity
              key={suggestion.place_id}
              onPress={() => handleSelectAddress(suggestion.description)}
            >
              <Text>{suggestion.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <Picker
        selectedValue={districtName}
        onValueChange={(itemValue, itemIndex) => {
          setDistrictName(itemValue);
          const selectedDistrict = districtList.find((d) => d.name === itemValue);
          if (selectedDistrict) setDistrictCode(selectedDistrict.code); // Set district code
        }}>
        <Picker.Item label="Select District" value="" />
        {districtList.map((district) => (
          <Picker.Item key={district.code} label={district.name} value={district.name} />
        ))}
      </Picker>
      <Picker
        selectedValue={wardName}
        onValueChange={(itemValue) => setWardName(itemValue)}>
        <Picker.Item label="Select Ward" value="" />
        {wardList.map((ward) => (
          <Picker.Item key={ward.code} label={ward.name} value={ward.name} />
        ))}
      </Picker>

      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
        <Text>{date.toLocaleDateString()}</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <Calendar
          markedDates={{
            [date.toISOString().split('T')[0]]: { selected: true, selectedColor: 'blue' },
          }}
          onDayPress={handleDateChange}
        />
      )}

      <Picker
        selectedValue={timeSlot}
        onValueChange={setTimeSlot}
        style={styles.picker}
      >
        {getAvailableTimeSlots().map((slot, index) => (
          <Picker.Item key={index} label={slot} value={slot} />
        ))}
      </Picker>

      <TextInput
        placeholder="Số lượng"
        value={String(quantity)}
        onChangeText={(text) => setQuantity(Number(text))}
        style={styles.input}
        keyboardType="numeric"
      />

      <TextInput
        placeholder="Ghi chú"
        value={notes}
        onChangeText={setNotes}
        style={styles.input}
        multiline
      />

      <Text>{notification}</Text>
      <Text>Total Price: {totalPrice} VND</Text>

      <TouchableOpacity onPress={handleCreateBooking} style={styles.button}>
        <Text style={styles.buttonText}>Đặt lịch</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  picker: {
    height: 50,
    marginBottom: 12,
  },
  suggestions: {
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
    padding: 8,
    borderRadius: 4,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 14,
    borderRadius: 4,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default CreateBookingScreen;
          