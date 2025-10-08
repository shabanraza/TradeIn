import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCategories } from '../hooks/api/useCategories';
import { usePhoneBrands, usePhoneModels, usePhoneVariants } from '../hooks/api/usePhoneData';
import { colors, spacing, fontSize, borderRadius } from '../styles';

interface ProductCreationFormProps {
  onSubmit: (productData: any) => void;
  onCancel: () => void;
}

interface FormData {
  categoryId: string;
  phoneBrandId?: string;
  phoneModelId?: string;
  phoneVariantId?: string;
  name: string;
  description: string;
  price: string;
  condition: 'excellent' | 'good' | 'fair' | 'poor' | 'broken';
  images: string[];
  // Phone-specific fields
  storage?: string;
  ram?: string;
  color?: string;
  // New vs Used phone selection
  phoneType: 'new' | 'used' | 'refurbished';
}

const ProductCreationForm: React.FC<ProductCreationFormProps> = ({ onSubmit, onCancel }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    categoryId: '',
    phoneBrandId: '',
    phoneModelId: '',
    phoneVariantId: '',
    name: '',
    description: '',
    price: '',
    condition: 'good',
    images: [],
    storage: '',
    ram: '',
    color: '',
    phoneType: 'new',
  });

  const [isPhoneCategory, setIsPhoneCategory] = useState(false);

  // Fetch categories
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories();
  const categories = (categoriesData as any)?.categories || [];

  // Fetch phone brands (for phone categories)
  const { data: phoneBrands, isLoading: phoneBrandsLoading } = usePhoneBrands();

  // Fetch phone models when brand is selected
  const { data: phoneModels, isLoading: phoneModelsLoading } = usePhoneModels(
    formData.phoneBrandId
  );

  // Fetch phone variants when model is selected
  const { data: phoneVariants, isLoading: phoneVariantsLoading } = usePhoneVariants(
    formData.phoneModelId
  );

  // Check if selected category is a phone category
  useEffect(() => {
    if (formData.categoryId) {
      const selectedCategory = categories.find((cat: any) => cat.id === formData.categoryId);
      setIsPhoneCategory(selectedCategory?.name?.toLowerCase().includes('phone') || false);
    }
  }, [formData.categoryId, categories]);

  const handleCategorySelect = (categoryId: string) => {
    setFormData(prev => ({ 
      ...prev, 
      categoryId, 
      phoneBrandId: '', 
      phoneModelId: '', 
      phoneVariantId: '' 
    }));
    if (isPhoneCategory) {
      setStep(2); // Go to phone type selection
    } else {
      setStep(3); // Skip phone type for accessories
    }
  };

  const handlePhoneTypeSelect = (phoneType: 'new' | 'used' | 'refurbished') => {
    setFormData(prev => ({ ...prev, phoneType }));
    setStep(3);
  };

  const handlePhoneBrandSelect = (phoneBrandId: string) => {
    setFormData(prev => ({ 
      ...prev, 
      phoneBrandId, 
      phoneModelId: '', 
      phoneVariantId: '' 
    }));
    if (isPhoneCategory) {
      setStep(4);
    } else {
      setStep(5); // Skip model selection for accessories
    }
  };

  const handlePhoneModelSelect = (phoneModelId: string) => {
    setFormData(prev => ({ ...prev, phoneModelId, phoneVariantId: '' }));
    setStep(5);
  };

  const handlePhoneVariantSelect = (phoneVariantId: string) => {
    const selectedVariant = (phoneVariants as any)?.find((v: any) => v.id === phoneVariantId);
    setFormData(prev => ({ 
      ...prev, 
      phoneVariantId,
      storage: selectedVariant?.storage || '',
      ram: selectedVariant?.ram || '',
      color: selectedVariant?.color || '',
    }));
    setStep(6);
  };

  const handleNext = () => {
    if (step === 1 && !formData.categoryId) {
      Alert.alert('Error', 'Please select a category');
      return;
    }
    if (step === 2 && isPhoneCategory && !formData.phoneType) {
      Alert.alert('Error', 'Please select phone type');
      return;
    }
    if (step === 3 && !formData.phoneBrandId) {
      Alert.alert('Error', 'Please select a brand');
      return;
    }
    if (step === 4 && isPhoneCategory && !formData.phoneModelId) {
      Alert.alert('Error', 'Please select a model');
      return;
    }
    if (step === 5 && isPhoneCategory && !formData.phoneVariantId) {
      Alert.alert('Error', 'Please select a variant');
      return;
    }
    if (step === (isPhoneCategory ? 6 : 5)) {
      if (!formData.name.trim()) {
        Alert.alert('Error', 'Please enter product name');
        return;
      }
      if (!formData.price.trim()) {
        Alert.alert('Error', 'Please enter product price');
        return;
      }
      onSubmit(formData);
      return;
    }
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
    } else {
      onCancel();
    }
  };

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Select Category</Text>
      <Text style={styles.stepSubtitle}>Choose the type of product you want to list</Text>
      
      {categoriesLoading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : (
        <ScrollView style={styles.optionsContainer}>
          {categories.map((category: any) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.optionCard,
                formData.categoryId === category.id && styles.selectedOptionCard
              ]}
              onPress={() => handleCategorySelect(category.id)}
            >
              <Ionicons 
                name={category.name.toLowerCase().includes('phone') ? 'phone-portrait' : 'cube'} 
                size={24} 
                color={formData.categoryId === category.id ? colors.primary : colors.textSecondary} 
              />
              <Text style={[
                styles.optionText,
                formData.categoryId === category.id && styles.selectedOptionText
              ]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Phone Type</Text>
      <Text style={styles.stepSubtitle}>What type of phone are you listing?</Text>
      
      <ScrollView style={styles.optionsContainer}>
        <TouchableOpacity
          style={[
            styles.phoneTypeCard,
            formData.phoneType === 'new' && styles.selectedPhoneTypeCard
          ]}
          onPress={() => handlePhoneTypeSelect('new')}
        >
          <View style={styles.phoneTypeIcon}>
            <Ionicons name="sparkles" size={32} color={colors.success} />
          </View>
          <View style={styles.phoneTypeContent}>
            <Text style={[
              styles.phoneTypeTitle,
              formData.phoneType === 'new' && styles.selectedPhoneTypeTitle
            ]}>
              New Phone
            </Text>
            <Text style={styles.phoneTypeDescription}>
              Brand new, unopened, with full warranty
            </Text>
            <View style={styles.phoneTypeFeatures}>
              <Text style={styles.phoneTypeFeature}>✓ Original packaging</Text>
              <Text style={styles.phoneTypeFeature}>✓ Full warranty</Text>
              <Text style={styles.phoneTypeFeature}>✓ All accessories included</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.phoneTypeCard,
            formData.phoneType === 'used' && styles.selectedPhoneTypeCard
          ]}
          onPress={() => handlePhoneTypeSelect('used')}
        >
          <View style={styles.phoneTypeIcon}>
            <Ionicons name="phone-portrait" size={32} color={colors.warning} />
          </View>
          <View style={styles.phoneTypeContent}>
            <Text style={[
              styles.phoneTypeTitle,
              formData.phoneType === 'used' && styles.selectedPhoneTypeTitle
            ]}>
              Used Phone
            </Text>
            <Text style={styles.phoneTypeDescription}>
              Previously owned, good condition
            </Text>
            <View style={styles.phoneTypeFeatures}>
              <Text style={styles.phoneTypeFeature}>✓ Tested and working</Text>
              <Text style={styles.phoneTypeFeature}>✓ May have minor wear</Text>
              <Text style={styles.phoneTypeFeature}>✓ Accessories may vary</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.phoneTypeCard,
            formData.phoneType === 'refurbished' && styles.selectedPhoneTypeCard
          ]}
          onPress={() => handlePhoneTypeSelect('refurbished')}
        >
          <View style={styles.phoneTypeIcon}>
            <Ionicons name="construct" size={32} color={colors.primary} />
          </View>
          <View style={styles.phoneTypeContent}>
            <Text style={[
              styles.phoneTypeTitle,
              formData.phoneType === 'refurbished' && styles.selectedPhoneTypeTitle
            ]}>
              Refurbished Phone
            </Text>
            <Text style={styles.phoneTypeDescription}>
              Professionally restored to like-new condition
            </Text>
            <View style={styles.phoneTypeFeatures}>
              <Text style={styles.phoneTypeFeature}>✓ Professionally tested</Text>
              <Text style={styles.phoneTypeFeature}>✓ Like-new condition</Text>
              <Text style={styles.phoneTypeFeature}>✓ Limited warranty</Text>
            </View>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Select Brand</Text>
      <Text style={styles.stepSubtitle}>Choose the brand of your product</Text>
      
      {phoneBrandsLoading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : (
        <ScrollView style={styles.optionsContainer}>
          {(phoneBrands as any)?.map((brand: any) => (
            <TouchableOpacity
              key={brand.id}
              style={[
                styles.optionCard,
                formData.phoneBrandId === brand.id && styles.selectedOptionCard
              ]}
              onPress={() => handlePhoneBrandSelect(brand.id)}
            >
              <Text style={[
                styles.optionText,
                formData.phoneBrandId === brand.id && styles.selectedOptionText
              ]}>
                {brand.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );

  const renderStep4 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Select Model</Text>
      <Text style={styles.stepSubtitle}>Choose the specific model</Text>
      
      {phoneModelsLoading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : (
        <ScrollView style={styles.optionsContainer}>
          {(phoneModels as any)?.map((model: any) => (
            <TouchableOpacity
              key={model.id}
              style={[
                styles.optionCard,
                formData.phoneModelId === model.id && styles.selectedOptionCard
              ]}
              onPress={() => handlePhoneModelSelect(model.id)}
            >
              <Text style={[
                styles.optionText,
                formData.phoneModelId === model.id && styles.selectedOptionText
              ]}>
                {model.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );

  const renderStep5 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Select Variant</Text>
      <Text style={styles.stepSubtitle}>Choose storage, RAM, and color</Text>
      
      {phoneVariantsLoading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : (
        <ScrollView style={styles.optionsContainer}>
          {(phoneVariants as any)?.map((variant: any) => (
            <TouchableOpacity
              key={variant.id}
              style={[
                styles.optionCard,
                formData.phoneVariantId === variant.id && styles.selectedOptionCard
              ]}
              onPress={() => handlePhoneVariantSelect(variant.id)}
            >
              <View style={styles.variantInfo}>
                <Text style={[
                  styles.optionText,
                  formData.phoneVariantId === variant.id && styles.selectedOptionText
                ]}>
                  {variant.name}
                </Text>
                <View style={styles.variantSpecs}>
                  {variant.storage && <Text style={styles.variantSpec}>Storage: {variant.storage}</Text>}
                  {variant.ram && <Text style={styles.variantSpec}>RAM: {variant.ram}</Text>}
                  {variant.color && <Text style={styles.variantSpec}>Color: {variant.color}</Text>}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );

  const renderStep6 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Product Details</Text>
      <Text style={styles.stepSubtitle}>Enter the product information</Text>
      
      <ScrollView style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Product Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter product name"
            value={formData.name}
            onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe your product"
            value={formData.description}
            onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Price (₹) *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter price"
            value={formData.price}
            onChangeText={(text) => setFormData(prev => ({ ...prev, price: text }))}
            keyboardType="numeric"
          />
        </View>

        {/* Phone Type Display */}
        {isPhoneCategory && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Type</Text>
            <View style={styles.phoneTypeDisplay}>
              <Ionicons 
                name={
                  formData.phoneType === 'new' ? 'sparkles' : 
                  formData.phoneType === 'used' ? 'phone-portrait' : 'construct'
                } 
                size={20} 
                color={
                  formData.phoneType === 'new' ? colors.success : 
                  formData.phoneType === 'used' ? colors.warning : colors.primary
                } 
              />
              <Text style={styles.phoneTypeDisplayText}>
                {formData.phoneType.charAt(0).toUpperCase() + formData.phoneType.slice(1)} Phone
              </Text>
            </View>
          </View>
        )}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Condition *</Text>
          <View style={styles.conditionOptions}>
            {formData.phoneType === 'new' ? (
              // For new phones, only show excellent condition
              <TouchableOpacity
                style={[styles.conditionOption, styles.selectedConditionOption]}
                onPress={() => setFormData(prev => ({ ...prev, condition: 'excellent' }))}
              >
                <Text style={[styles.conditionText, styles.selectedConditionText]}>
                  Excellent (New)
                </Text>
              </TouchableOpacity>
            ) : (
              // For used/refurbished phones, show all conditions
              (['excellent', 'good', 'fair', 'poor', 'broken'] as const).map((condition) => (
                <TouchableOpacity
                  key={condition}
                  style={[
                    styles.conditionOption,
                    formData.condition === condition && styles.selectedConditionOption
                  ]}
                  onPress={() => setFormData(prev => ({ ...prev, condition }))}
                >
                  <Text style={[
                    styles.conditionText,
                    formData.condition === condition && styles.selectedConditionText
                  ]}>
                    {condition.charAt(0).toUpperCase() + condition.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );

  const renderCurrentStep = () => {
    switch (step) {
      case 1: return renderStep1();
      case 2: return isPhoneCategory ? renderStep2() : renderStep3();
      case 3: return renderStep3();
      case 4: return renderStep4();
      case 5: return renderStep5();
      case 6: return renderStep6();
      default: return renderStep1();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Product</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { 
            width: `${(step / (isPhoneCategory ? 6 : 5)) * 100}%` 
          }]} />
        </View>
        <Text style={styles.progressText}>
          Step {step} of {isPhoneCategory ? 6 : 5}
        </Text>
      </View>

      {renderCurrentStep()}

      <View style={styles.footer}>
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>
            {step === 4 ? 'Create Product' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
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
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: spacing.xs,
  },
  headerTitle: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: colors.text,
  },
  placeholder: {
    width: 40,
  },
  progressContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  progressText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  stepContainer: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  stepTitle: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  stepSubtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  optionsContainer: {
    flex: 1,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedOptionCard: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  optionText: {
    fontSize: fontSize.md,
    color: colors.text,
    marginLeft: spacing.sm,
  },
  selectedOptionText: {
    color: colors.primary,
    fontWeight: '600',
  },
  formContainer: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: fontSize.md,
    color: colors.text,
    backgroundColor: colors.surface,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  conditionOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  conditionOption: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  selectedConditionOption: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  conditionText: {
    fontSize: fontSize.sm,
    color: colors.text,
  },
  selectedConditionText: {
    color: colors.primary,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.sm,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: fontSize.md,
    color: colors.text,
    fontWeight: '600',
  },
  nextButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: fontSize.md,
    color: colors.background,
    fontWeight: '600',
  },
  variantInfo: {
    flex: 1,
  },
  variantSpecs: {
    marginTop: spacing.xs,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  variantSpec: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    backgroundColor: colors.border,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  phoneTypeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: colors.border,
  },
  selectedPhoneTypeCard: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  phoneTypeIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  phoneTypeContent: {
    flex: 1,
  },
  phoneTypeTitle: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  selectedPhoneTypeTitle: {
    color: colors.primary,
  },
  phoneTypeDescription: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  phoneTypeFeatures: {
    gap: spacing.xs,
  },
  phoneTypeFeature: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  phoneTypeDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.primary + '10',
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.primary + '30',
  },
  phoneTypeDisplayText: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: spacing.sm,
  },
});

export default ProductCreationForm;
