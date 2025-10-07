import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCategories } from '@oldsellerapp/shared';
import { colors, spacing, fontSize, borderRadius } from '../styles';

interface CategoryListProps {
  onCategorySelect?: (categoryId: string) => void;
  selectedCategoryId?: string;
}

const CategoryList: React.FC<CategoryListProps> = ({
  onCategorySelect,
  selectedCategoryId,
}) => {
  const { data, isLoading, error } = useCategories();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={colors.primary} />
        <Text style={styles.loadingText}>Loading categories...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={24} color={colors.error} />
        <Text style={styles.errorText}>Failed to load categories</Text>
      </View>
    );
  }

  const categories = data?.categories || [];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContainer}
    >
      {categories.map((category) => (
        <TouchableOpacity
          key={category.id}
          style={[
            styles.categoryItem,
            selectedCategoryId === category.id && styles.selectedCategory,
          ]}
          onPress={() => onCategorySelect?.(category.id)}
        >
          <View style={styles.categoryIcon}>
            <Ionicons
              name="grid-outline"
              size={24}
              color={
                selectedCategoryId === category.id
                  ? colors.background
                  : colors.primary
              }
            />
          </View>
          <Text
            style={[
              styles.categoryName,
              selectedCategoryId === category.id && styles.selectedCategoryName,
            ]}
          >
            {category.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
  },
  loadingText: {
    marginLeft: spacing.sm,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
  },
  errorText: {
    marginLeft: spacing.sm,
    fontSize: fontSize.sm,
    color: colors.error,
  },
  scrollContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: spacing.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    minWidth: 80,
  },
  selectedCategory: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  categoryName: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  selectedCategoryName: {
    color: colors.background,
  },
});

export default CategoryList;
