import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius } from '../../styles';
import LocationHeader from '../../components/LocationHeader';

interface Product {
  id: string;
  category: string;
  brand: string;
  model: string;
  condition: string;
  price: string;
  stock: string;
  warranty: string;
  description: string;
  status: 'active' | 'inactive' | 'sold';
  createdAt: string;
}

const RetailerListingsScreen: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'active' | 'inactive' | 'sold'>('all');
  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      category: 'phones',
      brand: 'Apple',
      model: 'iPhone 14 Pro',
      condition: 'like-new',
      price: '₹89,999',
      stock: '5',
      warranty: '6 months',
      description: 'Excellent condition iPhone 14 Pro',
      status: 'active',
      createdAt: '2024-01-15',
    },
    {
      id: '2',
      category: 'phones',
      brand: 'Samsung',
      model: 'Galaxy S23',
      condition: 'good',
      price: '₹79,999',
      stock: '3',
      warranty: '1 year',
      description: 'Good condition Samsung Galaxy S23',
      status: 'active',
      createdAt: '2024-01-14',
    },
    {
      id: '3',
      category: 'accessories',
      brand: 'Apple',
      model: 'AirPods Pro',
      condition: 'new',
      price: '₹19,999',
      stock: '10',
      warranty: '1 year',
      description: 'Brand new AirPods Pro',
      status: 'sold',
      createdAt: '2024-01-13',
    },
  ]);

  const filters = [
    { value: 'all', label: 'All Products', count: products.length },
    { value: 'active', label: 'Active', count: products.filter(p => p.status === 'active').length },
    { value: 'inactive', label: 'Inactive', count: products.filter(p => p.status === 'inactive').length },
    { value: 'sold', label: 'Sold', count: products.filter(p => p.status === 'sold').length },
  ];

  const filteredProducts = products.filter(product => {
    if (selectedFilter === 'all') return true;
    return product.status === selectedFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return colors.success;
      case 'inactive': return colors.warning;
      case 'sold': return colors.textSecondary;
      default: return colors.textSecondary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return 'checkmark-circle';
      case 'inactive': return 'pause-circle';
      case 'sold': return 'checkmark-done-circle';
      default: return 'help-circle';
    }
  };

  const handleEditProduct = (product: Product) => {
    Alert.alert('Edit Product', `Edit ${product.brand} ${product.model}`);
  };

  const handleToggleStatus = (product: Product) => {
    const newStatus = product.status === 'active' ? 'inactive' : 'active';
    setProducts(products.map(p => 
      p.id === product.id ? { ...p, status: newStatus } : p
    ));
  };

  const handleDeleteProduct = (product: Product) => {
    Alert.alert(
      'Delete Product',
      `Are you sure you want to delete ${product.brand} ${product.model}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setProducts(products.filter(p => p.id !== product.id));
          },
        },
      ]
    );
  };

  const renderProductCard = ({ item }: { item: Product }) => (
    <View style={styles.productCard}>
      <View style={styles.productHeader}>
        <View style={styles.productInfo}>
          <Text style={styles.productTitle}>{item.brand} {item.model}</Text>
          <Text style={styles.productCategory}>{item.category}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
          <Ionicons 
            name={getStatusIcon(item.status)} 
            size={16} 
            color={getStatusColor(item.status)} 
          />
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
      </View>

      <View style={styles.productDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Condition:</Text>
          <Text style={styles.detailValue}>{item.condition}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Price:</Text>
          <Text style={styles.detailValue}>{item.price}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Stock:</Text>
          <Text style={styles.detailValue}>{item.stock} units</Text>
        </View>
        {item.warranty && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Warranty:</Text>
            <Text style={styles.detailValue}>{item.warranty}</Text>
          </View>
        )}
      </View>

      {item.description && (
        <Text style={styles.productDescription}>{item.description}</Text>
      )}

      <View style={styles.productActions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleEditProduct(item)}
        >
          <Ionicons name="create-outline" size={16} color={colors.primary} />
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleToggleStatus(item)}
        >
          <Ionicons 
            name={item.status === 'active' ? 'pause-outline' : 'play-outline'} 
            size={16} 
            color={colors.warning} 
          />
          <Text style={styles.actionButtonText}>
            {item.status === 'active' ? 'Pause' : 'Activate'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleDeleteProduct(item)}
        >
          <Ionicons name="trash-outline" size={16} color={colors.error} />
          <Text style={styles.actionButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <LocationHeader />
      
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>My Products</Text>
          <Text style={styles.subtitle}>Manage your product listings</Text>
        </View>

        {/* Filters */}
        <View style={styles.filtersContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter.value}
                style={[
                  styles.filterChip,
                  selectedFilter === filter.value && styles.filterChipActive
                ]}
                onPress={() => setSelectedFilter(filter.value as any)}
              >
                <Text style={[
                  styles.filterChipText,
                  selectedFilter === filter.value && styles.filterChipTextActive
                ]}>
                  {filter.label}
                </Text>
                <View style={styles.filterCount}>
                  <Text style={[
                    styles.filterCountText,
                    selectedFilter === filter.value && styles.filterCountTextActive
                  ]}>
                    {filter.count}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Add Product Button */}
        <View style={styles.addButtonContainer}>
          <TouchableOpacity style={styles.addButton}>
            <Ionicons name="add-circle" size={20} color={colors.background} />
            <Text style={styles.addButtonText}>Add New Product</Text>
          </TouchableOpacity>
        </View>

        {/* Products List */}
        <View style={styles.productsContainer}>
          {filteredProducts.length > 0 ? (
            <FlatList
              data={filteredProducts}
              renderItem={renderProductCard}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
            />
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="cube-outline" size={48} color={colors.textSecondary} />
              <Text style={styles.emptyStateTitle}>No Products Found</Text>
              <Text style={styles.emptyStateSubtitle}>
                {selectedFilter === 'all' 
                  ? 'Start by adding your first product'
                  : `No ${selectedFilter} products found`
                }
              </Text>
            </View>
          )}
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
  filtersContainer: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.sm,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    fontSize: fontSize.sm,
    color: colors.text,
    marginRight: spacing.xs,
  },
  filterChipTextActive: {
    color: colors.background,
    fontWeight: '600',
  },
  filterCount: {
    backgroundColor: colors.background,
    borderRadius: 10,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
  },
  filterCountText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  filterCountTextActive: {
    color: colors.primary,
  },
  addButtonContainer: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
  },
  addButtonText: {
    fontSize: fontSize.md,
    color: colors.background,
    fontWeight: '600',
    marginLeft: spacing.xs,
  },
  productsContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  productCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  productInfo: {
    flex: 1,
  },
  productTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  productCategory: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textTransform: 'capitalize',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },
  statusText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    marginLeft: spacing.xs,
    textTransform: 'capitalize',
  },
  productDetails: {
    marginBottom: spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  detailLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  detailValue: {
    fontSize: fontSize.sm,
    color: colors.text,
    fontWeight: '500',
  },
  productDescription: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    fontStyle: 'italic',
  },
  productActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  actionButtonText: {
    fontSize: fontSize.sm,
    marginLeft: spacing.xs,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyStateTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  emptyStateSubtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export default RetailerListingsScreen;
