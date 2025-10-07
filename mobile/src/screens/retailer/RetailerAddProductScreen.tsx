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
import { colors, spacing, fontSize, borderRadius } from '../../styles';
import LocationHeader from '../../components/LocationHeader';

interface ProductData {
  category: string;
  brand: string;
  model: string;
  condition: string;
  price: string;
  description: string;
  stock: string;
  warranty: string;
}

const categories = [
  { value: 'phones', label: 'Phones', icon: '📱' },
  { value: 'cases', label: 'Cases', icon: '🛡️' },
  { value: 'accessories', label: 'Accessories', icon: '🎧' },
  { value: 'chargers', label: 'Chargers', icon: '🔌' },
  { value: 'cables', label: 'Cables', icon: '🔗' },
];

const phoneBrands = [
  'Apple', 'Samsung', 'Google', 'OnePlus', 'Xiaomi', 'Huawei', 'Sony', 'LG', 'Motorola', 'Other'
];

const conditions = [
  { value: 'new', label: 'New', description: 'Brand new, never used' },
  { value: 'like-new', label: 'Like New', description: 'Minimal use, excellent condition' },
  { value: 'good', label: 'Good', description: 'Minor wear, works perfectly' },
  { value: 'fair', label: 'Fair', description: 'Some wear but functional' },
  { value: 'refurbished', label: 'Refurbished', description: 'Restored to working condition' },
];

const RetailerAddProductScreen: React.FC = () => {
  const [formData, setFormData] = useState<ProductData>({
    category: '',
    brand: '',
    model: '',
    condition: '',
    price: '',
    description: '',
    stock: '',
    warranty: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<ProductData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<ProductData> = {};
    
    if (!formData.category) newErrors.category = 'Please select a category';
    if (!formData.brand) newErrors.brand = 'Please select a brand';
    if (!formData.model) newErrors.model = 'Please enter model name';
    if (!formData.condition) newErrors.condition = 'Please select condition';
    if (!formData.price) newErrors.price = 'Please enter price';
    if (!formData.stock) newErrors.stock = 'Please enter stock quantity';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      // TODO: Integrate with API
      console.log('Submitting product:', formData);
      Alert.alert('Success', 'Product added successfully!');
      // Reset form
      setFormData({
        category: '',
        brand: '',
        model: '',
        condition: '',
        price: '',
        description: '',
        stock: '',
        warranty: '',
      });
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <LocationHeader />
      
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Add New Product</Text>
          <Text style={styles.subtitle}>List your products for customers to buy</Text>
        </View>

        <View style={styles.formContainer}>
          {/* Category Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Product Category *</Text>
            <View style={styles.categoriesGrid}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.value}
                  style={[
                    styles.categoryCard,
                    formData.category === category.value && styles.categoryCardSelected
                  ]}
                  onPress={() => setFormData({ ...formData, category: category.value })}
                >
                  <Text style={styles.categoryIcon}>{category.icon}</Text>
                  <Text style={[
                    styles.categoryText,
                    formData.category === category.value && styles.categoryTextSelected
                  ]}>
                    {category.label}
                  </Text>
                  {formData.category === category.value && (
                    <Ionicons name="checkmark-circle" size={16} color={colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
            {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}
          </View>

          {/* Brand Selection */}
          {formData.category === 'phones' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Phone Brand *</Text>
              <View style={styles.brandsGrid}>
                {phoneBrands.map((brand) => (
                  <TouchableOpacity
                    key={brand}
                    style={[
                      styles.brandCard,
                      formData.brand === brand && styles.brandCardSelected
                    ]}
                    onPress={() => setFormData({ ...formData, brand })}
                  >
                    <Text style={[
                      styles.brandText,
                      formData.brand === brand && styles.brandTextSelected
                    ]}>
                      {brand}
                    </Text>
                    {formData.brand === brand && (
                      <Ionicons name="checkmark-circle" size={16} color={colors.primary} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
              {errors.brand && <Text style={styles.errorText}>{errors.brand}</Text>}
            </View>
          )}

          {/* Model Name */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Model Name *</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter product model"
              value={formData.model}
              onChangeText={(text) => setFormData({ ...formData, model: text })}
            />
            {errors.model && <Text style={styles.errorText}>{errors.model}</Text>}
          </View>

          {/* Condition */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Condition *</Text>
            <View style={styles.conditionsContainer}>
              {conditions.map((condition) => (
                <TouchableOpacity
                  key={condition.value}
                  style={[
                    styles.conditionCard,
                    formData.condition === condition.value && styles.conditionCardSelected
                  ]}
                  onPress={() => setFormData({ ...formData, condition: condition.value })}
                >
                  <View style={styles.conditionContent}>
                    <Text style={[
                      styles.conditionLabel,
                      formData.condition === condition.value && styles.conditionLabelSelected
                    ]}>
                      {condition.label}
                    </Text>
                    <Text style={styles.conditionDescription}>{condition.description}</Text>
                  </View>
                  {formData.condition === condition.value && (
                    <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
            {errors.condition && <Text style={styles.errorText}>{errors.condition}</Text>}
          </View>

          {/* Price */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Price (₹) *</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter price in rupees"
              value={formData.price}
              onChangeText={(text) => setFormData({ ...formData, price: text })}
              keyboardType="numeric"
            />
            {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}
          </View>

          {/* Stock Quantity */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Stock Quantity *</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter available stock"
              value={formData.stock}
              onChangeText={(text) => setFormData({ ...formData, stock: text })}
              keyboardType="numeric"
            />
            {errors.stock && <Text style={styles.errorText}>{errors.stock}</Text>}
          </View>

          {/* Warranty */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Warranty (Optional)</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g., 6 months, 1 year"
              value={formData.warranty}
              onChangeText={(text) => setFormData({ ...formData, warranty: text })}
            />
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description (Optional)</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              placeholder="Describe your product..."
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
              multiline
              numberOfLines={4}
            />
          </View>

          {/* Submit Button */}
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
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.lg,
    alignItems: 'center',
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
  },
  formContainer: {
    padding: spacing.lg,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.md,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  categoryCard: {
    width: '48%',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: spacing.xs,
  },
  categoryText: {
    fontSize: fontSize.sm,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  categoryTextSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
  brandsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  brandCard: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minWidth: '30%',
  },
  brandCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  brandText: {
    fontSize: fontSize.sm,
    color: colors.text,
  },
  brandTextSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
  conditionsContainer: {
    gap: spacing.sm,
  },
  conditionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  conditionCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  conditionContent: {
    flex: 1,
  },
  conditionLabel: {
    fontSize: fontSize.md,
    color: colors.text,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  conditionLabelSelected: {
    color: colors.primary,
  },
  conditionDescription: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    fontSize: fontSize.md,
    color: colors.text,
    backgroundColor: colors.surface,
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
    padding: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    marginTop: spacing.lg,
  },
  submitButtonDisabled: {
    backgroundColor: colors.textSecondary,
  },
  submitButtonText: {
    fontSize: fontSize.md,
    color: colors.background,
    fontWeight: '600',
    marginLeft: spacing.xs,
  },
});

export default RetailerAddProductScreen;
