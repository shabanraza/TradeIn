import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius } from '../../../../styles';
import { FormData, FormErrors, AgeOption, YesNoOption, ConditionOption, BatteryOption } from '../types';
import ImagePickerComponent from '../../../../components/ImagePicker';

interface PhoneDetailsScreenProps {
  formData: FormData;
  errors: FormErrors;
  ageOptions: AgeOption[];
  yesNoOptions: YesNoOption[];
  conditionOptions: ConditionOption[];
  batteryOptions: BatteryOption[];
  onFieldChange: (field: keyof FormData, value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const PhoneDetailsScreen: React.FC<PhoneDetailsScreenProps> = ({
  formData,
  errors,
  ageOptions,
  yesNoOptions,
  conditionOptions,
  batteryOptions,
  onFieldChange,
  onNext,
  onBack,
}) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Phone Details</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Form Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        keyboardShouldPersistTaps="handled"
        bounces={true}
      >
            {/* Model Name */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Model Name *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g., iPhone 14 Pro, Samsung Galaxy S23"
                value={formData.modelName}
                onChangeText={(text) => onFieldChange('modelName', text)}
                placeholderTextColor={colors.placeholder}
              />
              <Text style={styles.inputHint}>Enter the exact model name of your phone</Text>
              {errors.modelName && <Text style={styles.errorText}>{errors.modelName}</Text>}
            </View>

            {/* Phone Age */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>How old is your phone?</Text>
              <View style={styles.optionsContainer}>
                {ageOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.optionCard,
                      formData.age === option.value && styles.optionCardSelected
                    ]}
                    onPress={() => onFieldChange('age', option.value)}
                  >
                    <Text style={[
                      styles.optionText,
                      formData.age === option.value && styles.optionTextSelected
                    ]}>
                      {option.label}
                    </Text>
                    {formData.age === option.value && (
                      <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
              {errors.age && <Text style={styles.errorText}>{errors.age}</Text>}
            </View>

            {/* Has Bill */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Do you have the original bill?</Text>
              <View style={styles.yesNoContainer}>
                {yesNoOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.yesNoCard,
                      formData.hasBill === option.value && styles.yesNoCardSelected
                    ]}
                    onPress={() => onFieldChange('hasBill', option.value)}
                  >
                    <Text style={[
                      styles.yesNoText,
                      formData.hasBill === option.value && styles.yesNoTextSelected
                    ]}>
                      {option.label}
                    </Text>
                    {formData.hasBill === option.value && (
                      <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
              {errors.hasBill && <Text style={styles.errorText}>{errors.hasBill}</Text>}
            </View>

            {/* Has Box */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Do you have the original box?</Text>
              <View style={styles.yesNoContainer}>
                {yesNoOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.yesNoCard,
                      formData.hasBox === option.value && styles.yesNoCardSelected
                    ]}
                    onPress={() => onFieldChange('hasBox', option.value)}
                  >
                    <Text style={[
                      styles.yesNoText,
                      formData.hasBox === option.value && styles.yesNoTextSelected
                    ]}>
                      {option.label}
                    </Text>
                    {formData.hasBox === option.value && (
                      <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
              {errors.hasBox && <Text style={styles.errorText}>{errors.hasBox}</Text>}
            </View>

            {/* Screen Replacement */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Has the screen been replaced?</Text>
              <View style={styles.yesNoContainer}>
                {yesNoOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.yesNoCard,
                      formData.screenReplacement === option.value && styles.yesNoCardSelected
                    ]}
                    onPress={() => onFieldChange('screenReplacement', option.value)}
                  >
                    <Text style={[
                      styles.yesNoText,
                      formData.screenReplacement === option.value && styles.yesNoTextSelected
                    ]}>
                      {option.label}
                    </Text>
                    {formData.screenReplacement === option.value && (
                      <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
              {errors.screenReplacement && <Text style={styles.errorText}>{errors.screenReplacement}</Text>}
            </View>

            {/* Condition */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>What is the condition of your phone?</Text>
              <View style={styles.optionsContainer}>
                {conditionOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.optionCard,
                      formData.condition === option.value && styles.optionCardSelected
                    ]}
                    onPress={() => onFieldChange('condition', option.value)}
                  >
                    <Text style={[
                      styles.optionText,
                      formData.condition === option.value && styles.optionTextSelected
                    ]}>
                      {option.label}
                    </Text>
                    {formData.condition === option.value && (
                      <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
              {errors.condition && <Text style={styles.errorText}>{errors.condition}</Text>}
            </View>

            {/* Battery */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>How is the battery health?</Text>
              <View style={styles.optionsContainer}>
                {batteryOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.optionCard,
                      formData.battery === option.value && styles.optionCardSelected
                    ]}
                    onPress={() => onFieldChange('battery', option.value)}
                  >
                    <Text style={[
                      styles.optionText,
                      formData.battery === option.value && styles.optionTextSelected
                    ]}>
                      {option.label}
                    </Text>
                    {formData.battery === option.value && (
                      <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
              {errors.battery && <Text style={styles.errorText}>{errors.battery}</Text>}
            </View>

            {/* Phone Images */}
            <View style={styles.section}>
              <ImagePickerComponent
                images={formData.phoneImages || []}
                onImagesChange={(images) => onFieldChange('phoneImages', images as any)}
                maxImages={5}
                title="Upload Phone Images"
                error={errors.phoneImages}
              />
            </View>

            {/* Next Button */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.nextButton} onPress={onNext}>
                <Text style={styles.nextButtonText}>Next</Text>
                <Ionicons name="chevron-forward" size={20} color={colors.background} />
              </TouchableOpacity>
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
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderColor,
  },
  headerTitle: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: colors.text,
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl * 2,
  },
  inputContainer: {
    marginBottom: spacing.lg,
  },
  inputLabel: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  textInput: {
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    fontSize: fontSize.md,
    color: colors.text,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  inputHint: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  errorText: {
    fontSize: fontSize.sm,
    color: colors.error,
    marginTop: spacing.xs,
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
  optionsContainer: {
    gap: spacing.sm,
  },
  optionCard: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  optionCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  optionText: {
    fontSize: fontSize.md,
    color: colors.text,
    flex: 1,
  },
  optionTextSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
  yesNoContainer: {
    gap: spacing.sm,
  },
  yesNoCard: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  yesNoCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  yesNoText: {
    fontSize: fontSize.md,
    color: colors.text,
    flex: 1,
  },
  yesNoTextSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
  nextButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    gap: spacing.sm,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  nextButtonText: {
    color: colors.background,
    fontSize: fontSize.md,
    fontWeight: '600',
  },
});

export default PhoneDetailsScreen;
