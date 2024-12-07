import React, { useRef } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Swiper from 'react-native-swiper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

interface SlideProps {
  image: any;
  title: string;
  subtitle: string;
  description: string;
}

type RootStackParamList = {
  Onboarding: undefined;
  Home: undefined;
};

const slides: SlideProps[] = [
  {
    image: require('./../../assets/images/bg1.jpg'),
    title: 'Efficient',
    subtitle: 'A Reliable Service',
    description: 'Discover a network of trusted professionals ready to tackle any task, ensuring your home is always in tip-top shape.',
  },
  {
    image: require('./../../assets/images/bg2.jpg'),
    title: 'Enjoy the convenience of',
    subtitle: 'CONVENIENCE',
    description: 'Access home services whenever and wherever you need them. From routine maintenance to emergency repairs, we’ve got you covered.',
  },
  {
    image: require('./../../assets/images/bg3.jpg'),
    title: 'Premium Home Assistance',
    subtitle: 'PROVIDA PRO',
    description: 'Let us handle the chores, so you can focus on what matters most.',
  },
];

const OnboardingScreen: React.FC = () => {
  const swiperRef = useRef<Swiper>(null);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Onboarding'>>();

  const handleNext = () => {
    swiperRef.current?.scrollBy(1);
  };

  const handleSkip = () => {
    navigation.navigate('Main');
  };

  return (
    <Swiper
      ref={swiperRef}
      style={styles.wrapper}
      showsButtons={false}
      dot={<View style={styles.dot} />}
      activeDot={<View style={styles.activeDot} />}
      loop={false}
    >
      {slides.map((slide, index) => (
        <View key={index} style={styles.slide}>
          <Image source={slide.image} style={styles.image} />
          <Text style={styles.title}>{slide.title}</Text>
          <Text style={styles.subtitle}>{slide.subtitle}</Text>
          <Text style={styles.description}>{slide.description}</Text>
          <ButtonContainer onNext={handleNext} onSkip={handleSkip} />
        </View>
      ))}
    </Swiper>
  );
};

interface ButtonContainerProps {
  onNext: () => void;
  onSkip: () => void;
}

const ButtonContainer: React.FC<ButtonContainerProps> = ({ onNext, onSkip }) => (
  <View style={styles.buttonContainer}>
    <TouchableOpacity style={styles.nextButton} onPress={onNext}>
      <Text style={styles.buttonText}>Next</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.skipButton} onPress={onSkip}>
      <Text style={styles.buttonText}>Skip</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  wrapper: {},
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  image: {
    width: 150,
    height: 300,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: 'blue',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  nextButton: {
    backgroundColor: 'blue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginRight: 10,
  },
  skipButton: {
    backgroundColor: 'gray',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  dot: {
    backgroundColor: 'gray',
    width: 8,
    height: 8,
    borderRadius: 4,
    margin: 3,
  },
  activeDot: {
    backgroundColor: 'blue',
    width: 8,
    height: 8,
    borderRadius: 4,
    margin: 3,
  },
});

export default OnboardingScreen;
