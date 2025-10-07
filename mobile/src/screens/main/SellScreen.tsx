import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME_CONFIG } from '../../config';

const SellScreen: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    condition: '',
    category: '',
  });

  const conditions = [
    { id: 'excellent', label: 'Excellent' },
    { id: 'good', label: 'Good' },
    { id: 'fair', label: 'Fair' },
    { id: 'poor', label: 'Poor' },
  ];

  const categories = [
    { id: 'phones', label: 'Phones' },
    { id: 'tablets', label: 'Tablets' },
    { id: 'laptops', label: 'Laptops' },
    { id: 'accessories', label: 'Accessories' },
  ];

  const handleSubmit = () => {
    if (!formData.title || !formData.price || !formData.condition) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    Alert.alert('Success', 'Product listing created successfully!');
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Sell Product</Text>
        <Text style={styles.subtitle}>List your item for sale</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Product Title *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter product title"
            value={formData.title}
            onChangeText={(value) => updateFormData('title', value)}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe your product..."
            value={formData.description}
            onChangeText={(value) => updateFormData('description', value)}
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Price *</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              style={[styles.input, styles.priceInput]}
              placeholder="0.00"
              value={formData.price}
              onChangeText={(value) => updateFormData('price', value)}
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Condition *</Text>
          <View style={styles.optionsContainer}>
            {conditions.map((condition) => (
              <TouchableOpacity
                key={condition.id}
                style={[
                  styles.optionChip,
                  formData.condition === condition.id && styles.optionChipActive,
                ]}
                onPress={() => updateFormData('condition', condition.id)}
              >
                <Text
                  style={[
                    styles.optionChipText,
                    formData.condition === condition.id && styles.optionChipTextActive,
                  ]}
                >
                  {condition.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Category</Text>
          <View style={styles.optionsContainer}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.optionChip,
                  formData.category === category.id && styles.optionChipActive,
                ]}
                onPress={() => updateFormData('category', category.id)}
              >
                <Text
                  style={[
                    styles.optionChipText,
                    formData.category === category.id && styles.optionChipTextActive,
                  ]}
                >
                  {category.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.photoSection}>
          <Text style={styles.label}>Photos</Text>
          <TouchableOpacity style={styles.photoButton}>
            <Ionicons name="camera" size={24} color={THEME_CONFIG.primaryColor} />
            <Text style={styles.photoButtonText}>Add Photos</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>List Product</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME_CONFIG.backgroundColor,
  },
  header: {
    padding: 24,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: THEME_CONFIG.textColor,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: THEME_CONFIG.textSecondaryColor,
  },
  form: {
    padding: 24,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME_CONFIG.textColor,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: THEME_CONFIG.borderColor,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: THEME_CONFIG.surfaceColor,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME_CONFIG.borderColor,
    borderRadius: 12,
    backgroundColor: THEME_CONFIG.surfaceColor,
  },
  currencySymbol: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME_CONFIG.textColor,
    paddingHorizontal: 16,
  },
  priceInput: {
    flex: 1,
    borderWidth: 0,
    margin: 0,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: THEME_CONFIG.surfaceColor,
    borderWidth: 1,
    borderColor: THEME_CONFIG.borderColor,
  },
  optionChipActive: {
    backgroundColor: THEME_CONFIG.primaryColor,
    borderColor: THEME_CONFIG.primaryColor,
  },
  optionChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME_CONFIG.textColor,
  },
  optionChipTextActive: {
    color: 'white',
  },
  photoSection: {
    marginBottom: 32,
  },
  photoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: THEME_CONFIG.borderColor,
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingVertical: 24,
    backgroundColor: THEME_CONFIG.surfaceColor,
  },
  photoButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME_CONFIG.primaryColor,
    marginLeft: 8,
  },
  submitButton: {
    backgroundColor: THEME_CONFIG.primaryColor,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SellScreen;

