import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius } from '../styles';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    title?: string;
    price: string;
    originalPrice?: string;
    discountPrice?: string;
    discountPercentage?: number;
    condition: string;
    phoneType: string;
    images?: string[];
    category?: {
      name: string;
    };
    retailer?: {
      name: string;
      businessName?: string;
    };
  };
  onPress: () => void;
  compact?: boolean;
  showDiscount?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onPress, compact = false, showDiscount = false }) => {
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
        return 'Excellent';
      case 'good':
        return 'Good';
      case 'fair':
        return 'Fair';
      case 'poor':
        return 'Poor';
      case 'broken':
        return 'Broken';
      default:
        return condition;
    }
  };

  const getPhoneTypeLabel = (phoneType: string) => {
    switch (phoneType) {
      case 'new':
        return 'New';
      case 'refurbished':
        return 'Refurbished';
      case 'used':
        return 'Old';
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

  return (
    <TouchableOpacity
      style={[styles.container, compact && styles.compactContainer]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Product Image - Left Side */}
      <View style={styles.imageContainer}>
        {product.images && product.images.length > 0 ? (
          <Image
            source={{ uri: product.images[0] }}
            style={styles.productImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderImage}>
            <Ionicons name="phone-portrait" size={24} color={colors.textSecondary} />
          </View>
        )}
        
        {/* Phone Type Badge */}
        <View style={[styles.typeBadge, { backgroundColor: getPhoneTypeColor(product.phoneType) }]}>
          <Text style={styles.typeBadgeText}>
            {getPhoneTypeLabel(product.phoneType)}
          </Text>
        </View>
        
        {/* Discount Banner */}
        {showDiscount && (
          <View style={styles.discountBanner}>
            <Text style={styles.discountBannerText}>
              ₹{Math.floor(parseFloat(product.price) * 0.3).toLocaleString()} OFF
            </Text>
          </View>
        )}
      </View>

      {/* Product Info - Right Side */}
      <View style={styles.productInfo}>
        {/* Product Title */}
        <Text style={styles.productTitle} numberOfLines={2}>
          {product.title || product.name}
        </Text>
        

        {/* Condition */}
        <View style={styles.conditionContainer}>
          <View style={[styles.conditionDot, { backgroundColor: getConditionColor(product.condition) }]} />
          <Text style={styles.conditionText}>
            {getConditionLabel(product.condition)}
          </Text>
        </View>

        {/* Price Section */}
        <View style={styles.priceSection}>
          {product.originalPrice && parseFloat(product.originalPrice) > parseFloat(product.price) ? (
            // Show discounted price prominently
            <>
              <Text style={styles.discountedPrice}>
                ₹{parseFloat(product.price).toLocaleString()}
              </Text>
              <Text style={styles.originalPrice}>
                ₹{parseFloat(product.originalPrice).toLocaleString()}
              </Text>
            </>
          ) : (
            // Show regular price
            <Text style={styles.currentPrice}>
              ₹{parseFloat(product.price).toLocaleString()}
            </Text>
          )}
          {product.originalPrice && parseFloat(product.originalPrice) > parseFloat(product.price) && (
            <Text style={styles.discountText}>
              {Math.round(((parseFloat(product.originalPrice) - parseFloat(product.price)) / parseFloat(product.originalPrice)) * 100)}% off
            </Text>
          )}
        </View>
        
        {/* Gold Member Price */}
        {showDiscount && (
          <View style={styles.goldMemberBanner}>
            <Text style={styles.goldMemberText}>
              ₹{Math.floor(parseFloat(product.price) * 0.95).toLocaleString()} with GOLD
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.lg,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
    flexDirection: 'row',
    height: 140,
    marginBottom: spacing.sm,
  },
  compactContainer: {
    marginBottom: spacing.sm,
  },
  imageContainer: {
    position: 'relative',
    width: 140,
    height: 140,
    backgroundColor: colors.surfaceColor,
    padding: spacing.sm,
  },
  productImage: {
    width: '100%',
    height: '100%',
    borderRadius: borderRadius.sm,
  },
  placeholderImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surfaceColor,
  },
  typeBadge: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  typeBadgeText: {
    fontSize: fontSize.xs,
    color: colors.background,
    fontWeight: '600',
  },
  productInfo: {
    flex: 1,
    padding: spacing.lg,
    paddingTop: spacing.md,
    justifyContent: 'space-between',
    minHeight: 140,
  },
  productTitle: {
    fontSize: fontSize.sm,
    fontWeight: '500',
    color: colors.text,
    marginBottom: spacing.xs,
    lineHeight: 18,
    minHeight: 36, // Fixed height for 2 lines
    flex: 1,
  },
  conditionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
    flexShrink: 0,
  },
  conditionDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  conditionText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  priceSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flexWrap: 'wrap',
    marginTop: 'auto',
    paddingTop: spacing.xs,
  },
  currentPrice: {
    fontSize: fontSize.md,
    fontWeight: 'bold',
    color: colors.text,
  },
  discountedPrice: {
    fontSize: fontSize.md,
    fontWeight: 'bold',
    color: colors.text,
  },
  originalPrice: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textDecorationLine: 'line-through',
    marginLeft: spacing.xs,
  },
  discountText: {
    fontSize: fontSize.xs,
    color: colors.successColor,
    fontWeight: '600',
  },
  discountBanner: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.warningColor,
    paddingVertical: spacing.xs,
    alignItems: 'center',
  },
  discountBannerText: {
    fontSize: fontSize.xs,
    color: colors.background,
    fontWeight: 'bold',
  },
  discountPercentage: {
    fontSize: fontSize.sm,
    color: colors.errorColor,
    fontWeight: 'bold',
  },
  goldMemberBanner: {
    backgroundColor: colors.warningColor,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.sm,
    marginTop: spacing.xs,
  },
  goldMemberText: {
    fontSize: fontSize.xs,
    color: colors.background,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ProductCard;