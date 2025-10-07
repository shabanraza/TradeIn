import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Modal,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useProducts } from '@oldsellerapp/shared/src/hooks/api/useProducts';
import { colors, spacing, fontSize, borderRadius } from '../../styles';
import ProductCard from '../../components/ProductCard';

interface ProductListingScreenProps {
  navigation: any;
  route: {
    params: {
      categoryId?: string;
      categoryName?: string;
      filterType?: 'old' | 'refurbished' | 'new';
    };
  };
}

type SortOption = 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | 'date_desc';
type FilterOption = 'all' | 'old' | 'refurbished' | 'new';

const ProductListingScreen: React.FC<ProductListingScreenProps> = ({ navigation, route }) => {
  const { categoryId, categoryName, filterType } = route.params || {};
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('date_desc');
  const [filterBy, setFilterBy] = useState<FilterOption>(filterType || 'all');
  const [showSortModal, setShowSortModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);

  // Temporarily disable tab bar hiding to test scrolling
  // useFocusEffect(
  //   React.useCallback(() => {
  //     // Get the parent tab navigator
  //     const parent = navigation.getParent();
  //     if (parent) {
  //       parent.setOptions({
  //         tabBarStyle: { 
  //           display: 'none',
  //           height: 0,
  //           paddingBottom: 0,
  //           paddingTop: 0
  //         }
  //       });
  //     }

  //     // Show bottom tabs when leaving this screen
  //     return () => {
  //       if (parent) {
  //         parent.setOptions({
  //           tabBarStyle: { 
  //             display: 'flex',
  //             height: 70,
  //             paddingBottom: 10,
  //             paddingTop: 10
  //           }
  //         });
  //       }
  //     };
  //   }, [navigation])
  // );

  // Force re-render when tab bar is hidden to fix layout
  const [isTabBarHidden, setIsTabBarHidden] = useState(false);
  
  React.useEffect(() => {
    // Delay to ensure tab bar is hidden before updating layout
    const timer = setTimeout(() => {
      setIsTabBarHidden(true);
    }, 100);
    
    return () => {
      clearTimeout(timer);
      setIsTabBarHidden(false);
    };
  }, []);

  const { data: productsData, isLoading, error } = useProducts();

  const filteredAndSortedProducts = useMemo(() => {
    if (!productsData?.products) return [];

    let filtered = productsData.products;

    // Filter by category if specified
    if (categoryId) {
      filtered = filtered.filter(product => product.categoryId === categoryId);
    }

    // Filter by condition
    if (filterBy !== 'all') {
      const conditionMap = {
        'old': 'used',
        'refurbished': 'refurbished', 
        'new': 'new'
      };
      filtered = filtered.filter(product => 
        product.phoneType === conditionMap[filterBy]
      );
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price_asc':
          return parseFloat(a.price) - parseFloat(b.price);
        case 'price_desc':
          return parseFloat(b.price) - parseFloat(a.price);
        case 'name_asc':
          return a.name.localeCompare(b.name);
        case 'name_desc':
          return b.name.localeCompare(a.name);
        case 'date_desc':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return filtered;
  }, [productsData?.products, categoryId, filterBy, searchQuery, sortBy]);

  // Debug logging
  console.log('ProductListingScreen - productsData:', productsData);
  console.log('ProductListingScreen - filteredAndSortedProducts length:', filteredAndSortedProducts.length);
  console.log('ProductListingScreen - isTabBarHidden:', isTabBarHidden);
  console.log('ProductListingScreen - filteredAndSortedProducts:', filteredAndSortedProducts.slice(0, 3));

  const sortOptions = [
    { key: 'date_desc', label: 'Latest First' },
    { key: 'price_asc', label: 'Price: Low to High' },
    { key: 'price_desc', label: 'Price: High to Low' },
    { key: 'name_asc', label: 'Name: A to Z' },
    { key: 'name_desc', label: 'Name: Z to A' },
  ];

  const filterOptions = [
    { key: 'all', label: 'All Products' },
    { key: 'new', label: 'New Phones' },
    { key: 'refurbished', label: 'Refurbished' },
    { key: 'old', label: 'Old Phones' },
  ];

  const getSortLabel = (key: SortOption) => {
    return sortOptions.find(option => option.key === key)?.label || 'Latest First';
  };

  const getFilterLabel = (key: FilterOption) => {
    return filterOptions.find(option => option.key === key)?.label || 'All Products';
  };

  const renderProduct = ({ item }: { item: any }) => (
    <View style={styles.productItem}>
      <ProductCard
        product={item}
        onPress={() => navigation.navigate('ProductDetails', { product: item })}
        compact
      />
    </View>
  );

  const renderSortModal = () => (
    <Modal visible={showSortModal} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Sort By</Text>
            <TouchableOpacity onPress={() => setShowSortModal(false)}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalBody}>
            {sortOptions.map((option) => (
              <TouchableOpacity
                key={option.key}
                style={[
                  styles.modalOption,
                  sortBy === option.key && styles.modalOptionSelected
                ]}
                onPress={() => {
                  setSortBy(option.key as SortOption);
                  setShowSortModal(false);
                }}
              >
                <View style={styles.modalOptionContent}>
                  <Text style={[
                    styles.modalOptionText,
                    sortBy === option.key && styles.modalOptionTextSelected
                  ]}>
                    {option.label}
                  </Text>
                  {sortBy === option.key && (
                    <Ionicons name="checkmark-circle" size={20} color="#FF6B35" />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  const renderFilterModal = () => (
    <Modal visible={showFilterModal} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filter By</Text>
            <TouchableOpacity onPress={() => setShowFilterModal(false)}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalBody}>
            {filterOptions.map((option) => (
              <TouchableOpacity
                key={option.key}
                style={[
                  styles.modalOption,
                  filterBy === option.key && styles.modalOptionSelected
                ]}
                onPress={() => {
                  setFilterBy(option.key as FilterOption);
                  setShowFilterModal(false);
                }}
              >
                <View style={styles.modalOptionContent}>
                  <Text style={[
                    styles.modalOptionText,
                    filterBy === option.key && styles.modalOptionTextSelected
                  ]}>
                    {option.label}
                  </Text>
                  {filterBy === option.key && (
                    <Ionicons name="checkmark-circle" size={20} color="#FF6B35" />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading products...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color={colors.errorColor} />
          <Text style={styles.errorText}>Failed to load products</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => {}}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, isTabBarHidden && styles.containerWithoutTabs]}>
      {/* Header with Search */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        
        {/* Search Bar in Header */}
        <View style={[styles.headerSearchContainer, searchQuery ? styles.headerSearchContainerFocused : null]}>
          <Ionicons name="search" size={16} color={searchQuery ? '#FF6B35' : colors.textSecondary} />
          <TextInput
            style={styles.headerSearchInput}
            placeholder="Search products..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={colors.textSecondary}
            selectionColor="#FF6B35"
          />
        </View>
        
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.headerActionButton}
            onPress={() => setShowFilterModal(true)}
          >
            <Ionicons name="filter" size={20} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerActionButton}
            onPress={() => setShowSortModal(true)}
          >
            <Ionicons name="swap-vertical" size={20} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Active Filters & Results */}
      <View style={styles.resultsContainer}>
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsText}>
            {filteredAndSortedProducts.length} products found
          </Text>
          {(filterBy !== 'all' || sortBy !== 'date_desc') && (
            <TouchableOpacity 
              style={styles.clearFiltersButton}
              onPress={() => {
                setFilterBy('all');
                setSortBy('date_desc');
              }}
            >
              <Text style={styles.clearFiltersText}>Clear All</Text>
            </TouchableOpacity>
          )}
        </View>
        
        {/* Active Filter Chips */}
        <View style={styles.activeFiltersContainer}>
          {filterBy !== 'all' && (
            <View style={styles.filterChip}>
              <Text style={styles.filterChipText}>{getFilterLabel(filterBy)}</Text>
              <TouchableOpacity onPress={() => setFilterBy('all')}>
                <Ionicons name="close" size={14} color={colors.text} />
              </TouchableOpacity>
            </View>
          )}
          {sortBy !== 'date_desc' && (
            <View style={styles.filterChip}>
              <Text style={styles.filterChipText}>{getSortLabel(sortBy)}</Text>
              <TouchableOpacity onPress={() => setSortBy('date_desc')}>
                <Ionicons name="close" size={14} color={colors.text} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      {/* Products List - Single Column */}
      <FlatList
        data={filteredAndSortedProducts}
        renderItem={({ item }) => (
          <View style={styles.productItem}>
            <ProductCard
              product={{
                ...item,
                phoneType: item.phoneType || 'used',
                title: item.title || item.name,
                originalPrice: item.originalPrice || item.price,
                discountPrice: item.discountPrice || item.price,
                discountPercentage: item.discountPercentage || 0,
                retailer: item.retailer ? {
                  name: item.retailer.name || 'Unknown Retailer',
                  businessName: item.retailer.businessName,
                } : undefined,
              }}
              onPress={() => navigation.navigate('ProductDetails', { product: item })}
              compact
            />
          </View>
        )}
        keyExtractor={(item) => item.id}
        style={styles.productsListContainer}
        contentContainerStyle={styles.productsList}
        showsVerticalScrollIndicator={true}
        scrollEnabled={true}
        bounces={true}
        nestedScrollEnabled={true}
        removeClippedSubviews={false}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={10}
      />

      {/* Modals */}
      {renderSortModal()}
      {renderFilterModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  containerWithoutTabs: {
    paddingBottom: 0, // Remove any bottom padding when tabs are hidden
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderColor,
    gap: spacing.sm,
  },
  headerSearchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerSearchContainerFocused: {
    borderColor: '#FF6B35',
    borderWidth: 2,
    shadowColor: '#FF6B35',
    shadowOpacity: 0.2,
  },
  headerSearchInput: {
    flex: 1,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    fontSize: fontSize.sm,
    color: colors.text,
  },
  headerActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  headerActionButton: {
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.surfaceColor,
  },
  resultsContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  resultsText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  clearFiltersButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    backgroundColor: '#FF6B35',
    borderRadius: borderRadius.sm,
  },
  clearFiltersText: {
    fontSize: fontSize.xs,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  activeFiltersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    gap: spacing.xs,
  },
  filterChipText: {
    fontSize: fontSize.xs,
    color: colors.text,
    fontWeight: '500',
  },
  productsListContainer: {
    flex: 1,
    minHeight: 0, // Important for flex scrolling
  },
  productsList: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    flexGrow: 1, // Allow content to grow
  },
  productItem: {
    marginBottom: spacing.sm,
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  errorText: {
    fontSize: fontSize.md,
    color: colors.errorColor,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: spacing.lg,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
  },
  retryButtonText: {
    color: colors.background,
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderColor,
  },
  modalTitle: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: colors.text,
  },
  modalBody: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  modalOption: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderColor,
  },
  modalOptionSelected: {
    backgroundColor: '#FF6B3510',
  },
  modalOptionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalOptionText: {
    fontSize: fontSize.md,
    color: colors.text,
    flex: 1,
  },
  modalOptionTextSelected: {
    color: '#FF6B35',
    fontWeight: '600',
  },
});

export default ProductListingScreen;
