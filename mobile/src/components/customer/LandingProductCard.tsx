import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius } from '../../styles';

interface LandingProductCardProps {
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
  };
  onPress: () => void;
}

const LandingProductCard: React.FC<LandingProductCardProps> = ({ product, onPress }) => {
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

  const calculateDiscount = () => {
    if (product.originalPrice && parseFloat(product.originalPrice) > parseFloat(product.price)) {
      const original = parseFloat(product.originalPrice);
      const current = parseFloat(product.price);
      return Math.round(original - current);
    }
    return null;
  };

  const discountAmount = calculateDiscount();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Product Image - Top */}
      <View style={styles.imageContainer}>
        {product.images && product.images.length > 0 ? (
          <Image
            source={{ uri: product.images[0] }}
            style={styles.productImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderImage}>
            <Ionicons name="phone-portrait" size={32} color={colors.textSecondary} />
          </View>
        )}
        
        {/* Phone Type Badge - Top Right */}
        <View style={[styles.typeBadge, { backgroundColor: getPhoneTypeColor(product.phoneType) }]}>
          <Text style={styles.typeBadgeText}>
            {getPhoneTypeLabel(product.phoneType)}
          </Text>
        </View>

        {/* Discount Badge - Bottom */}
        {discountAmount && discountAmount > 0 && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>₹{discountAmount} OFF</Text>
          </View>
        )}
      </View>

      {/* Product Info - Bottom */}
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
        </View>

        {/* Discount Percentage - Calculate based on actual price difference */}
        {product.originalPrice && parseFloat(product.originalPrice) > parseFloat(product.price) && (
          <View style={styles.discountPercentageContainer}>
            <Text style={styles.discountPercentageText}>
              {Math.round(((parseFloat(product.originalPrice) - parseFloat(product.price)) / parseFloat(product.originalPrice)) * 100)}% off
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
    width: 180,
    marginRight: spacing.md,
  },
  imageContainer: {
    position: 'relative',
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
  discountBadge: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.warningColor,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  discountText: {
    fontSize: fontSize.xs,
    color: colors.background,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  productInfo: {
    padding: spacing.lg,
    paddingTop: spacing.md,
  },
  productTitle: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
    lineHeight: 20,
  },
  conditionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.sm,
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
    marginBottom: spacing.sm,
    flexWrap: 'wrap',
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
  discountPercentageContainer: {
    alignSelf: 'flex-start',
    backgroundColor: colors.successColor + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    marginTop: spacing.xs,
  },
  discountPercentageText: {
    fontSize: fontSize.xs,
    color: colors.successColor,
    fontWeight: '600',
  },
});

export default LandingProductCard;
