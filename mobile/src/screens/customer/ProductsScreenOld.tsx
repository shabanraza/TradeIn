import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME_CONFIG } from '../../config';
import LocationHeader from '../../components/LocationHeader';
import BannerCarousel from '../../components/BannerCarousel';
import CategoryList from '../../components/CategoryList';
import ProductList from '../../components/ProductList';
import { Product } from '../../hooks/api/useProducts';

const ProductsScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>();
  const [showAllProducts, setShowAllProducts] = useState(false);

  const handleProductPress = (product: Product) => {
    console.log('Product pressed:', product);
    // TODO: Navigate to product details
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategoryId(selectedCategoryId === categoryId ? undefined : categoryId);
  };

  const topSellingPhones = [
    { id: '1', name: 'iPhone 14 Pro', price: '₹89,999', rating: '4.8' },
    { id: '2', name: 'Samsung S23', price: '₹79,999', rating: '4.7' },
    { id: '3', name: 'OnePlus 11', price: '₹59,999', rating: '4.6' },
    { id: '4', name: 'Google Pixel 7', price: '₹49,999', rating: '4.5' },
  ];

  const newPhones = [
    { id: '1', name: 'iPhone 15 Pro', price: '₹1,29,999', rating: '4.9' },
    { id: '2', name: 'Samsung S24', price: '₹99,999', rating: '4.8' },
    { id: '3', name: 'OnePlus 12', price: '₹69,999', rating: '4.7' },
  ];

  const refurbishedPhones = [
    { id: '1', name: 'iPhone 13 Pro', price: '₹69,999', rating: '4.5' },
    { id: '2', name: 'Samsung S22', price: '₹59,999', rating: '4.4' },
    { id: '3', name: 'OnePlus 10 Pro', price: '₹39,999', rating: '4.3' },
  ];

  const priceRanges = [
    { id: '1', label: 'Under ₹10,000', count: '25' },
    { id: '2', label: '₹10,000 - ₹14,000', count: '18' },
    { id: '3', label: '₹14,000 - ₹19,000', count: '32' },
    { id: '4', label: 'Above ₹20,000', count: '45' },
  ];

  const renderProductCard = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.productCard}>
      <View style={styles.productImage}>
        <Ionicons name="image-outline" size={40} color={THEME_CONFIG.textSecondaryColor} />
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productTitle} numberOfLines={2}>
          Sample Product Title
        </Text>
        <Text style={styles.productPrice}>$299.99</Text>
        <View style={styles.productMeta}>
          <Text style={styles.productCondition}>Good</Text>
          <Text style={styles.productLocation}>New York</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <LocationHeader />
      
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search" size={20} color={THEME_CONFIG.textSecondaryColor} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search products..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={THEME_CONFIG.textSecondaryColor}
            />
          </View>
        </View>

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

        {/* New Phones */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>New Phones</Text>
            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>View All</Text>
              <Ionicons name="chevron-forward" size={16} color={THEME_CONFIG.primaryColor} />
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.productsContainer}>
            {newPhones.map((phone) => (
              <TouchableOpacity key={phone.id} style={styles.productCard}>
                <View style={styles.productImage}>
                  <Ionicons name="phone-portrait-outline" size={40} color={THEME_CONFIG.textSecondaryColor} />
                </View>
                <View style={styles.productInfo}>
                  <Text style={styles.productTitle} numberOfLines={2}>{phone.name}</Text>
                  <Text style={styles.productPrice}>{phone.price}</Text>
                  <Text style={styles.productRating}>⭐ {phone.rating}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Refurbished Phones */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Refurbished Phones</Text>
            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>View All</Text>
              <Ionicons name="chevron-forward" size={16} color={THEME_CONFIG.primaryColor} />
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.productsContainer}>
            {refurbishedPhones.map((phone) => (
              <TouchableOpacity key={phone.id} style={styles.productCard}>
                <View style={styles.productImage}>
                  <Ionicons name="phone-portrait-outline" size={40} color={THEME_CONFIG.textSecondaryColor} />
                </View>
                <View style={styles.productInfo}>
                  <Text style={styles.productTitle} numberOfLines={2}>{phone.name}</Text>
                  <Text style={styles.productPrice}>{phone.price}</Text>
                  <Text style={styles.productRating}>⭐ {phone.rating}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Shop by Price */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shop by Price</Text>
          <View style={styles.priceGrid}>
            {priceRanges.map((price) => (
              <TouchableOpacity key={price.id} style={styles.priceCard}>
                <Text style={styles.priceText}>{price.label}</Text>
                <Text style={styles.priceSubtext}>{price.count} phones</Text>
              </TouchableOpacity>
            ))}
          </View>
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
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // Extra padding for bottom navigation
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: THEME_CONFIG.textColor,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 14,
    color: THEME_CONFIG.primaryColor,
    fontWeight: '600',
    marginRight: 4,
  },
  searchContainer: {
    paddingHorizontal: 24,
    marginBottom: 16,
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
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: THEME_CONFIG.textColor,
  },
  categoriesContainer: {
    marginBottom: 8,
  },
  categoryCard: {
    alignItems: 'center',
    backgroundColor: THEME_CONFIG.surfaceColor,
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    borderWidth: 1,
    borderColor: THEME_CONFIG.borderColor,
    minWidth: 80,
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME_CONFIG.textColor,
    textAlign: 'center',
  },
  productsContainer: {
    marginBottom: 8,
  },
  productCard: {
    width: 160,
    backgroundColor: THEME_CONFIG.surfaceColor,
    borderRadius: 12,
    marginRight: 12,
    borderWidth: 1,
    borderColor: THEME_CONFIG.borderColor,
    overflow: 'hidden',
  },
  productImage: {
    height: 120,
    backgroundColor: THEME_CONFIG.borderColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productInfo: {
    padding: 12,
  },
  productTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME_CONFIG.textColor,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: THEME_CONFIG.primaryColor,
    marginBottom: 8,
  },
  productMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  productCondition: {
    fontSize: 12,
    color: THEME_CONFIG.textSecondaryColor,
  },
  productLocation: {
    fontSize: 12,
    color: THEME_CONFIG.textSecondaryColor,
  },
  productRating: {
    fontSize: 12,
    color: THEME_CONFIG.textSecondaryColor,
    marginTop: 4,
  },
  priceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  priceCard: {
    width: '48%',
    backgroundColor: THEME_CONFIG.surfaceColor,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: THEME_CONFIG.borderColor,
    alignItems: 'center',
  },
  priceText: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME_CONFIG.textColor,
    marginBottom: 4,
    textAlign: 'center',
  },
  priceSubtext: {
    fontSize: 12,
    color: THEME_CONFIG.textSecondaryColor,
  },
});

export default ProductsScreen;

