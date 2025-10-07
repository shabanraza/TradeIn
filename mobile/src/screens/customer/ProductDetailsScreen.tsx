import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  Alert,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius } from '../../styles';

interface ProductDetailsScreenProps {
  navigation: any;
  route: {
    params: {
      product: {
        id: string;
        name: string;
        description?: string;
        price: string;
        condition: string;
        phoneType: string;
        images?: string[];
        category?: {
          name: string;
        };
        retailer?: {
          id: string;
          name: string;
          businessName?: string;
          phone?: string;
          location?: string;
        };
        createdAt: string;
      };
    };
  };
}

const ProductDetailsScreen: React.FC<ProductDetailsScreenProps> = ({ navigation, route }) => {
  const { product } = route.params;
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'excellent':
        return colors.successColor;
      case 'good':
        return colors.primary;
      case 'fair':
        return colors.warningColor;
      case 'poor':
      case 'broken':
        return colors.errorColor;
      default:
        return colors.textSecondary;
    }
  };

  const getConditionLabel = (condition: string) => {
    switch (condition) {
      case 'excellent':
        return 'Excellent Condition';
      case 'good':
        return 'Good Condition';
      case 'fair':
        return 'Fair Condition';
      case 'poor':
        return 'Poor Condition';
      case 'broken':
        return 'Broken';
      default:
        return condition;
    }
  };

  const getPhoneTypeLabel = (phoneType: string) => {
    switch (phoneType) {
      case 'new':
        return 'Brand New';
      case 'refurbished':
        return 'Refurbished';
      case 'used':
        return 'Used';
      default:
        return phoneType;
    }
  };

  const getPhoneTypeColor = (phoneType: string) => {
    switch (phoneType) {
      case 'new':
        return colors.successColor;
      case 'refurbished':
        return colors.primary;
      case 'used':
        return colors.warningColor;
      default:
        return colors.textSecondary;
    }
  };

  const handleCallRetailer = () => {
    if (product.retailer?.phone) {
      Linking.openURL(`tel:${product.retailer.phone}`);
    } else {
      Alert.alert('Contact Info', 'Phone number not available for this retailer.');
    }
  };

  const handleContactRetailer = () => {
    Alert.alert(
      'Contact Retailer',
      `Contact ${product.retailer?.businessName || product.retailer?.name} for more information about this product.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call', onPress: handleCallRetailer },
      ]
    );
  };

  const handleViewRetailer = () => {
    // Navigate to retailer profile or store
    Alert.alert('Retailer Profile', 'This will show the retailer\'s profile and other products.');
  };

  const renderImageGallery = () => {
    const images = product.images || [];
    
    if (images.length === 0) {
      return (
        <View style={styles.placeholderImage}>
          <Ionicons name="phone-portrait" size={64} color={colors.textSecondary} />
          <Text style={styles.placeholderText}>No image available</Text>
        </View>
      );
    }

    return (
      <View style={styles.imageGallery}>
        <Image
          source={{ uri: images[selectedImageIndex] }}
          style={styles.mainImage}
          resizeMode="cover"
        />
        
        {images.length > 1 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.thumbnailContainer}
            contentContainerStyle={styles.thumbnailContent}
          >
            {images.map((image, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.thumbnail,
                  selectedImageIndex === index && styles.selectedThumbnail
                ]}
                onPress={() => setSelectedImageIndex(index)}
              >
                <Image
                  source={{ uri: image }}
                  style={styles.thumbnailImage}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Details</Text>
        <TouchableOpacity>
          <Ionicons name="heart-outline" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Image Gallery */}
        {renderImageGallery()}

        {/* Product Info */}
        <View style={styles.productInfo}>
          {/* Product Type and Condition */}
          <View style={styles.badgeContainer}>
            <View style={[styles.typeBadge, { backgroundColor: getPhoneTypeColor(product.phoneType) }]}>
              <Text style={styles.typeBadgeText}>
                {getPhoneTypeLabel(product.phoneType)}
              </Text>
            </View>
            <View style={[styles.conditionBadge, { backgroundColor: getConditionColor(product.condition) + '20' }]}>
              <View style={[styles.conditionDot, { backgroundColor: getConditionColor(product.condition) }]} />
              <Text style={[styles.conditionText, { color: getConditionColor(product.condition) }]}>
                {getConditionLabel(product.condition)}
              </Text>
            </View>
          </View>

          {/* Product Name */}
          <Text style={styles.productName}>{product.name}</Text>

          {/* Category */}
          {product.category && (
            <Text style={styles.categoryName}>{product.category.name}</Text>
          )}

          {/* Price */}
          <Text style={styles.price}>₹{parseFloat(product.price).toLocaleString()}</Text>

          {/* Description */}
          {product.description && (
            <View style={styles.descriptionContainer}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.description}>{product.description}</Text>
            </View>
          )}

          {/* Retailer Info */}
          {product.retailer && (
            <View style={styles.retailerContainer}>
              <Text style={styles.sectionTitle}>Sold By</Text>
              <View style={styles.retailerInfo}>
                <View style={styles.retailerDetails}>
                  <Text style={styles.retailerName}>
                    {product.retailer.businessName || product.retailer.name}
                  </Text>
                  {product.retailer.location && (
                    <View style={styles.retailerLocation}>
                      <Ionicons name="location" size={14} color={colors.textSecondary} />
                      <Text style={styles.retailerLocationText}>{product.retailer.location}</Text>
                    </View>
                  )}
                </View>
                <TouchableOpacity
                  style={styles.viewRetailerButton}
                  onPress={handleViewRetailer}
                >
                  <Text style={styles.viewRetailerButtonText}>View Store</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Product Details */}
          <View style={styles.detailsContainer}>
            <Text style={styles.sectionTitle}>Product Details</Text>
            <View style={styles.detailsList}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Condition</Text>
                <Text style={styles.detailValue}>{getConditionLabel(product.condition)}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Type</Text>
                <Text style={styles.detailValue}>{getPhoneTypeLabel(product.phoneType)}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Listed</Text>
                <Text style={styles.detailValue}>
                  {new Date(product.createdAt).toLocaleDateString()}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={styles.contactButton}
          onPress={handleContactRetailer}
        >
          <Ionicons name="call" size={20} color={colors.background} />
          <Text style={styles.contactButtonText}>Contact Retailer</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.viewRetailerButtonMain}
          onPress={handleViewRetailer}
        >
          <Ionicons name="storefront" size={20} color={colors.primary} />
          <Text style={styles.viewRetailerButtonTextMain}>View Retailer</Text>
        </TouchableOpacity>
      </View>
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
  content: {
    flex: 1,
  },
  imageGallery: {
    backgroundColor: colors.surfaceColor,
  },
  mainImage: {
    width: '100%',
    height: 300,
  },
  placeholderImage: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surfaceColor,
  },
  placeholderText: {
    marginTop: spacing.sm,
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  thumbnailContainer: {
    paddingVertical: spacing.sm,
  },
  thumbnailContent: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.sm,
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  selectedThumbnail: {
    borderColor: colors.primary,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  productInfo: {
    padding: spacing.lg,
  },
  badgeContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  typeBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  typeBadgeText: {
    fontSize: fontSize.xs,
    color: colors.background,
    fontWeight: '600',
  },
  conditionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    gap: spacing.xs,
  },
  conditionDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  conditionText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
  },
  productName: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  categoryName: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  price: {
    fontSize: fontSize.xxl,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: spacing.lg,
  },
  descriptionContainer: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: fontSize.md,
    color: colors.text,
    lineHeight: 22,
  },
  retailerContainer: {
    marginBottom: spacing.lg,
  },
  retailerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surfaceColor,
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
  retailerDetails: {
    flex: 1,
  },
  retailerName: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  retailerLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  retailerLocationText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  viewRetailerButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.primary + '20',
    borderRadius: borderRadius.sm,
  },
  viewRetailerButtonText: {
    fontSize: fontSize.sm,
    color: colors.primary,
    fontWeight: '600',
  },
  detailsContainer: {
    marginBottom: spacing.xl,
  },
  detailsList: {
    backgroundColor: colors.surfaceColor,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderColor,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  detailLabel: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  detailValue: {
    fontSize: fontSize.md,
    color: colors.text,
    fontWeight: '500',
  },
  actionContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.borderColor,
    gap: spacing.sm,
  },
  contactButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
  },
  contactButtonText: {
    color: colors.background,
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  viewRetailerButtonMain: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
  },
  viewRetailerButtonTextMain: {
    color: colors.primary,
    fontSize: fontSize.md,
    fontWeight: '600',
  },
});

export default ProductDetailsScreen;
