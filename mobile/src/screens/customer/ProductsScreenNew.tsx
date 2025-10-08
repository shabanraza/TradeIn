import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME_CONFIG } from '../../config';
import LocationHeader from '../../components/LocationHeader';
import BannerCarousel from '../../components/BannerCarousel';
import CategoryList from '../../components/CategoryList';
import ProductList from '../../components/ProductList';
import { ApiProduct } from '../../hooks/api/useProducts';

const ProductsScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>();
  const [showAllProducts, setShowAllProducts] = useState(false);

  const handleProductPress = (product: ApiProduct) => {
    console.log('Product pressed:', product);
    // TODO: Navigate to product details
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategoryId(selectedCategoryId === categoryId ? undefined : categoryId);
  };

  return (
    <View style={styles.container}>
      {/* Location Header */}
      <LocationHeader />

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color={THEME_CONFIG.textSecondaryColor} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={THEME_CONFIG.textSecondaryColor}
          />
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Banner Carousel */}
        <BannerCarousel />

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <CategoryList
            onCategorySelect={handleCategorySelect}
            selectedCategoryId={selectedCategoryId}
          />
        </View>

        {/* Products List */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {selectedCategoryId ? 'Products' : 'All Products'}
            </Text>
            <TouchableOpacity 
              style={styles.viewAllButton}
              onPress={() => setShowAllProducts(!showAllProducts)}
            >
              <Text style={styles.viewAllText}>
                {showAllProducts ? 'Show Less' : 'View All'}
              </Text>
              <Ionicons name="chevron-forward" size={16} color={THEME_CONFIG.primaryColor} />
            </TouchableOpacity>
          </View>
          <ProductList
            categoryId={selectedCategoryId}
            search={searchQuery}
            limit={showAllProducts ? undefined : 6}
            onProductPress={handleProductPress}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME_CONFIG.backgroundColor,
  },
  scrollView: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: THEME_CONFIG.backgroundColor,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME_CONFIG.surfaceColor,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: THEME_CONFIG.borderColor,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: THEME_CONFIG.textColor,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: THEME_CONFIG.textColor,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: THEME_CONFIG.surfaceColor,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME_CONFIG.primaryColor,
    marginRight: 4,
  },
});

export default ProductsScreen;
