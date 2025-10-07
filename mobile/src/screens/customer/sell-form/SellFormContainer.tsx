import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../types';
import BrandSelectionScreen from './screens/BrandSelectionScreen';
import PhoneDetailsScreen from './screens/PhoneDetailsScreen';
import ContactInfoScreen from './screens/ContactInfoScreen';
import { FormData, FormErrors, SellFormStep, BrandOption, AgeOption, YesNoOption, ConditionOption, BatteryOption } from './types';
import { useAuth } from '../../../contexts/AuthContext';

type SellFormScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;

const ageOptions: AgeOption[] = [
  { label: '0-6 Months', value: '0-6' },
  { label: '6-12 Months', value: '6-12' },
  { label: '1-2 Years', value: '1-2' },
  { label: '2+ Years', value: '2+' },
];

const yesNoOptions: YesNoOption[] = [
  { label: 'Yes', value: 'yes' },
  { label: 'No', value: 'no' },
];

const conditionOptions: ConditionOption[] = [
  { label: 'Excellent (Like New)', value: 'excellent' },
  { label: 'Good (Minor Wear)', value: 'good' },
  { label: 'Fair (Visible Wear)', value: 'fair' },
  { label: 'Poor (Damaged)', value: 'poor' },
];

const batteryOptions: BatteryOption[] = [
  { label: '80-100%', value: '80-100' },
  { label: '60-80%', value: '60-80' },
  { label: 'Below 60%', value: 'below 60' },
];

const brandOptions: BrandOption[] = [
  { name: 'Apple', icon: 'logo-apple', color: '#000000' },
  { name: 'Samsung', icon: 'phone-portrait', color: '#1428A0' },
  { name: 'Google', icon: 'logo-google', color: '#4285F4' },
  { name: 'OnePlus', icon: 'phone-portrait', color: '#F5010C' },
  { name: 'Xiaomi', icon: 'phone-portrait', color: '#FF6900' },
  { name: 'Huawei', icon: 'phone-portrait', color: '#FF0000' },
  { name: 'Sony', icon: 'phone-portrait', color: '#000000' },
  { name: 'LG', icon: 'phone-portrait', color: '#A50034' },
  { name: 'Motorola', icon: 'phone-portrait', color: '#5C92FA' },
  { name: 'Other', icon: 'ellipsis-horizontal', color: '#6B7280' }
];

const SellFormContainer: React.FC = () => {
  const navigation = useNavigation<SellFormScreenNavigationProp>();
  const { isAuthenticated } = useAuth();

  const [formData, setFormData] = useState<FormData>({
    brand: '',
    model: '',
    modelName: '',
    age: '',
    hasBill: '',
    billImage: '',
    hasBox: '',
    screenReplacement: '',
    condition: '',
    battery: '',
    phoneImages: [],
    name: '',
    phone: '',
    city: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [currentStep, setCurrentStep] = useState(1);
  const [currentScreen, setCurrentScreen] = useState<SellFormStep>('brand-selection');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    console.log('Current Screen:', currentScreen);
    console.log('Current Step:', currentStep);
  }, [currentScreen, currentStep]);

  const validateStep = (step: number) => {
    let newErrors: FormErrors = {};
    let isValid = true;

    switch (step) {
      case 1: // Phone Details
        if (!formData.modelName) {
          newErrors.modelName = 'Model Name is required';
          isValid = false;
        }
        if (!formData.age) {
          newErrors.age = 'Phone age is required';
          isValid = false;
        }
        if (!formData.hasBill) {
          newErrors.hasBill = 'Original bill information is required';
          isValid = false;
        }
        if (!formData.hasBox) {
          newErrors.hasBox = 'Original box information is required';
          isValid = false;
        }
        if (!formData.screenReplacement) {
          newErrors.screenReplacement = 'Screen replacement information is required';
          isValid = false;
        }
        if (!formData.condition) {
          newErrors.condition = 'Phone condition is required';
          isValid = false;
        }
        if (!formData.battery) {
          newErrors.battery = 'Battery health is required';
          isValid = false;
        }
        break;
      case 2: // Contact Info
        if (!formData.name) {
          newErrors.name = 'Your name is required';
          isValid = false;
        }
        if (!formData.phone) {
          newErrors.phone = 'Phone number is required';
          isValid = false;
        } else if (!/^\d{10}$/.test(formData.phone)) {
          newErrors.phone = 'Please enter a valid 10-digit phone number';
          isValid = false;
        }
        if (!formData.city) {
          newErrors.city = 'City is required';
          isValid = false;
        }
        break;
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleNext = () => {
    if (currentScreen === 'details' && !validateStep(1)) {
      return;
    }
    if (currentScreen === 'contact' && !validateStep(2)) {
      return;
    }

    if (currentScreen === 'details') {
      setCurrentScreen('contact');
      setCurrentStep(2);
    }
  };

  const handlePrevious = () => {
    if (currentScreen === 'contact') {
      setCurrentScreen('details');
      setCurrentStep(1);
    } else if (currentScreen === 'details') {
      setCurrentScreen('brand-selection');
      setCurrentStep(0); // Back to brand selection
    }
  };

  const handleFieldChange = (field: keyof FormData, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleBrandSelect = (brand: string) => {
    setFormData({ ...formData, brand });
    setCurrentScreen('details');
    setCurrentStep(1);
  };

  const handleSubmit = async () => {
    if (!validateStep(2)) { // Validate contact info before submission
      return;
    }

    if (!isAuthenticated) {
      Alert.alert('Login Required', 'Please login to submit your phone details.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate API call
      console.log('Submitting form data:', formData);
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate network delay
      Alert.alert('Success', 'Your phone details have been submitted!');
      // Navigate to My Listings (assuming it's part of the Main stack)
      navigation.navigate('Main'); // Navigate to main screen
    } catch (error) {
      console.error('Submission error:', error);
      Alert.alert('Error', 'Failed to submit your details. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  switch (currentScreen) {
    case 'brand-selection':
      return (
        <BrandSelectionScreen
          brands={brandOptions}
          onBrandSelect={handleBrandSelect}
          onBack={() => navigation.goBack()}
        />
      );
    case 'details':
      return (
        <PhoneDetailsScreen
          formData={formData}
          errors={errors}
          ageOptions={ageOptions}
          yesNoOptions={yesNoOptions}
          conditionOptions={conditionOptions}
          batteryOptions={batteryOptions}
          onFieldChange={handleFieldChange}
          onNext={handleNext}
          onBack={handlePrevious}
        />
      );
    case 'contact':
      return (
        <ContactInfoScreen
          formData={formData}
          errors={errors}
          onFieldChange={handleFieldChange}
          onSubmit={handleSubmit}
          onBack={handlePrevious}
          isSubmitting={isSubmitting}
        />
      );
    default:
      return (
        <BrandSelectionScreen
          brands={brandOptions}
          onBrandSelect={handleBrandSelect}
          onBack={() => navigation.goBack()}
        />
      );
  }
};

export default SellFormContainer;
