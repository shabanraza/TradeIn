import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { colors, spacing, fontSize, borderRadius } from '../../styles';
import { RootStackParamList } from '../../types';

type AddProductScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AddProduct'>;

interface ProductData {
  name: string;
  brand: string;
  model: string;
  price: string;
  condition: string;
  description: string;
}

const AddProductScreen: React.FC = () => {
  const navigation = useNavigation<AddProductScreenNavigationProp>();
  const [productData, setProductData] = useState<ProductData>({
    name: '',
    brand: '',
    model: '',
    price: '',
    condition: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<ProductData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<ProductData> = {};
    
    if (!productData.name) newErrors.name = 'Product name is required';
    if (!productData.brand) newErrors.brand = 'Brand is required';
    if (!productData.model) newErrors.model = 'Model is required';
    if (!productData.price) newErrors.price = 'Price is required';
    if (!productData.condition) newErrors.condition = 'Condition is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      // TODO: Integrate with API
      console.log('Submitting product:', productData);
      Alert.alert('Success', 'Product added successfully!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Product</Text>
        <View style={styles.headerSpacer} />
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.title}>Add New Product</Text>
          <Text style={styles.subtitle}>Fill in the details to list your product</Text>
          
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Product Name *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g., iPhone 14 Pro"
                value={productData.name}
                onChangeText={(text) => setProductData({ ...productData, name: text })}
                placeholderTextColor={colors.placeholder}
              />
              {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Brand *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g., Apple, Samsung"
                value={productData.brand}
                onChangeText={(text) => setProductData({ ...productData, brand: text })}
                placeholderTextColor={colors.placeholder}
              />
              {errors.brand && <Text style={styles.errorText}>{errors.brand}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Model *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g., iPhone 14 Pro, Galaxy S23"
                value={productData.model}
                onChangeText={(text) => setProductData({ ...productData, model: text })}
                placeholderTextColor={colors.placeholder}
              />
              {errors.model && <Text style={styles.errorText}>{errors.model}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Price (₹) *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter price in rupees"
                value={productData.price}
                onChangeText={(text) => setProductData({ ...productData, price: text })}
                keyboardType="numeric"
                placeholderTextColor={colors.placeholder}
              />
              {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Condition *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g., New, Used, Refurbished"
                value={productData.condition}
                onChangeText={(text) => setProductData({ ...productData, condition: text })}
                placeholderTextColor={colors.placeholder}
              />
              {errors.condition && <Text style={styles.errorText}>{errors.condition}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                placeholder="Describe the product condition, features, etc."
                value={productData.description}
                onChangeText={(text) => setProductData({ ...productData, description: text })}
                multiline
                numberOfLines={4}
                placeholderTextColor={colors.placeholder}
              />
            </View>

            <TouchableOpacity 
              style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]} 
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Ionicons name="hourglass" size={20} color={colors.background} />
                  <Text style={styles.submitButtonText}>Adding Product...</Text>
                </>
              ) : (
                <>
                  <Ionicons name="add-circle" size={20} color={colors.background} />
                  <Text style={styles.submitButtonText}>Add Product</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: spacing.sm,
  },
  headerTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  form: {
    gap: spacing.lg,
  },
  inputContainer: {
    marginBottom: spacing.md,
  },
  inputLabel: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  textInput: {
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    fontSize: fontSize.md,
    color: colors.text,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  errorText: {
    fontSize: fontSize.sm,
    color: colors.error,
    marginTop: spacing.xs,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  submitButtonDisabled: {
    backgroundColor: colors.textSecondary,
  },
  submitButtonText: {
    fontSize: fontSize.md,
    color: colors.background,
    fontWeight: '600',
  },
});

export default AddProductScreen;
