import React, { useState, useMemo } from 'react';
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
import { useProducts } from '../../hooks/api/useProducts';
import { useCategories } from '../../hooks/api/useCategories';
import { colors, spacing, fontSize, borderRadius } from '../../styles';
import LocationHeader from '../../components/LocationHeader';
import BannerCarousel from '../../components/BannerCarousel';
import ProductCard from '../../components/ProductCard';
import LandingProductCard from '../../components/LandingProductCard';

interface ProductsScreenProps {
  navigation: any;
}

const ProductsScreen: React.FC<ProductsScreenProps> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: productsData, isLoading: productsLoading } = useProducts();
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories();

  // Debug logging
  React.useEffect(() => {
    if (productsData?.products) {
      console.log('Total products:', productsData.products.length);
      console.log('Product types:', productsData.products.map((p: any) => p.phoneType));
    }
  }, [productsData]);

  // Filter products by type
  const oldPhones = useMemo(() => {
    if (!productsData?.products) return [];
    const filtered = productsData.products.filter((product: any) => product.phoneType === 'used').slice(0, 3);
    console.log('Old phones found:', filtered.length);
    return filtered;
  }, [productsData?.products]);

  const refurbishedPhones = useMemo(() => {
    if (!productsData?.products) return [];
    const filtered = productsData.products.filter((product: any) => product.phoneType === 'refurbished').slice(0, 3);
    console.log('Refurbished phones found:', filtered.length);
    return filtered;
  }, [productsData?.products]);

  const newPhones = useMemo(() => {
    if (!productsData?.products) return [];
    const filtered = productsData.products.filter((product: any) => product.phoneType === 'new').slice(0, 3);
    console.log('New phones found:', filtered.length);
    return filtered;
  }, [productsData?.products]);

  const handleViewAll = (filterType: 'old' | 'refurbished' | 'new') => {
    navigation.navigate('ProductListing', { filterType });
  };

  const handleCategoryPress = (categoryId: string, categoryName: string) => {
    navigation.navigate('ProductListing', { categoryId, categoryName });
  };

  const handleProductPress = (product: any) => {
    navigation.navigate('ProductDetails', { product });
  };

  const renderProductSection = (
    title: string,
    products: any[],
    filterType: 'old' | 'refurbished' | 'new',
    icon: string,
    isFlashSale: boolean = false
  ) => {
    if (products.length === 0) return null;

    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleContainer}>
            {isFlashSale && (
              <View style={styles.flashSaleBadge}>
                <Text style={styles.flashSaleText}>FLASH SALE</Text>
              </View>
            )}
            <Ionicons name={icon as any} size={20} color={isFlashSale ? colors.error : colors.primary} />
            <Text style={[styles.sectionTitle, isFlashSale && styles.flashSaleTitle]}>{title}</Text>
          </View>
          <TouchableOpacity
            style={styles.viewAllButton}
            onPress={() => handleViewAll(filterType)}
          >
            <Text style={[styles.viewAllText, isFlashSale && styles.flashSaleViewAll]}>View All</Text>
            <Ionicons name="chevron-forward" size={16} color={isFlashSale ? colors.error : colors.primary} />
          </TouchableOpacity>
        </View>
        
        <FlatList
          data={products}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[styles.productsList, isFlashSale && styles.flashSaleList]}
          renderItem={({ item }) => (
            <LandingProductCard
              product={item}
              onPress={() => handleProductPress(item)}
            />
          )}
          keyExtractor={(item) => item.id}
        />
      </View>
    );
  };

  const renderCategoryItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.categoryItemHorizontal}
      onPress={() => handleCategoryPress(item.id, item.name)}
    >
      <View style={styles.categoryIconHorizontal}>
        <Ionicons name="phone-portrait" size={20} color={colors.primary} />
      </View>
      <Text style={styles.categoryNameHorizontal} numberOfLines={1}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  if (productsLoading || categoriesLoading) {
    return (
      <View style={styles.container}>
        <LocationHeader />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading products...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Location Header */}
      <LocationHeader />

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={colors.textSecondary}
          />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Banner Carousel */}
        <BannerCarousel />

        {/* Categories Section - Horizontal Scroll */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Ionicons name="grid" size={20} color={colors.primary} />
              <Text style={styles.sectionTitle}>Categories</Text>
            </View>
            <TouchableOpacity
              style={styles.viewAllButton}
              onPress={() => navigation.navigate('ProductListing')}
            >
              <Text style={styles.viewAllText}>View All</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={categoriesData?.categories || []}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesHorizontalList}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item.id}
          />
        </View>

        {/* Flash Sale Section */}
        {renderProductSection('Flash Sale', oldPhones, 'old', 'flash', true)}

        {/* Product Type Sections */}
        {renderProductSection('Old Phones', oldPhones, 'old', 'phone-portrait')}
        {renderProductSection('Refurbished Phones', refurbishedPhones, 'refurbished', 'refresh')}
        {renderProductSection('New Phones', newPhones, 'new', 'sparkles')}

        {/* All Products Section - Show if no specific sections have products */}
        {(oldPhones.length === 0 && refurbishedPhones.length === 0 && newPhones.length === 0) && productsData?.products && productsData.products.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <Ionicons name="bag" size={20} color={colors.primary} />
                <Text style={styles.sectionTitle}>All Products</Text>
              </View>
              <TouchableOpacity
                style={styles.viewAllButton}
                onPress={() => navigation.navigate('ProductListing')}
              >
                <Text style={styles.viewAllText}>View All</Text>
                <Ionicons name="chevron-forward" size={16} color={colors.primary} />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={productsData.products.slice(0, 6)}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.productsList}
              renderItem={({ item }) => (
                <View style={styles.productItem}>
                  <ProductCard
                    product={item}
                    onPress={() => handleProductPress(item)}
                    compact
                  />
                </View>
              )}
              keyExtractor={(item) => item.id}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    fontSize: fontSize.md,
    color: colors.text,
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: colors.text,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  viewAllText: {
    fontSize: fontSize.sm,
    color: colors.primary,
    fontWeight: '600',
  },
  productsList: {
    paddingHorizontal: spacing.md,
  },
  productItem: {
    width: 160,
    marginRight: spacing.sm,
  },
  categoriesHorizontalList: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  categoryItemHorizontal: {
    alignItems: 'center',
    backgroundColor: colors.surfaceColor,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginRight: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderColor,
    minWidth: 80,
  },
  categoryIconHorizontal: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  categoryNameHorizontal: {
    fontSize: fontSize.xs,
    color: colors.text,
    textAlign: 'center',
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  flashSaleBadge: {
    backgroundColor: colors.errorColor,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    marginRight: spacing.sm,
  },
  flashSaleText: {
    fontSize: fontSize.xs,
    color: colors.background,
    fontWeight: 'bold',
  },
  flashSaleTitle: {
    color: colors.errorColor,
  },
  flashSaleViewAll: {
    color: colors.errorColor,
  },
  flashSaleList: {
    paddingHorizontal: spacing.lg,
  },
  flashSaleItem: {
    width: 180,
    marginRight: spacing.md,
  },
});

export default ProductsScreen;