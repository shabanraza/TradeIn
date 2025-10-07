import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, fontSize, borderRadius } from '../styles';

const { width } = Dimensions.get('window');

interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  actionText: string;
  actionUrl?: string;
  backgroundColor: string;
  textColor: string;
}

interface BannerCarouselProps {
  banners?: Banner[];
  onBannerPress?: (banner: Banner) => void;
}

const BannerCarousel: React.FC<BannerCarouselProps> = ({
  banners = defaultBanners,
  onBannerPress,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === banners.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Auto-rotate every 5 seconds

    return () => clearInterval(timer);
  }, [banners.length]);

  const handleBannerPress = (banner: Banner) => {
    onBannerPress?.(banner);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        style={styles.scrollView}
      >
        {banners.map((banner, index) => (
          <TouchableOpacity
            key={banner.id}
            style={[styles.banner, { backgroundColor: banner.backgroundColor }]}
            onPress={() => handleBannerPress(banner)}
            activeOpacity={0.8}
          >
            <View style={styles.bannerContent}>
              <View style={styles.bannerText}>
                <Text style={[styles.bannerTitle, { color: banner.textColor }]}>
                  {banner.title}
                </Text>
                <Text style={[styles.bannerSubtitle, { color: banner.textColor }]}>
                  {banner.subtitle}
                </Text>
                <TouchableOpacity style={styles.bannerButton}>
                  <Text style={[styles.bannerButtonText, { color: banner.textColor }]}>
                    {banner.actionText}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.bannerImage}>
                <Text style={styles.bannerEmoji}>{banner.image}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      {/* Pagination Dots */}
      <View style={styles.pagination}>
        {banners.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === currentIndex ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

// Default banners that can be updated by admin
const defaultBanners: Banner[] = [
  {
    id: '1',
    title: 'Get Instant Quote',
    subtitle: 'Upload your phone details and get the best price in seconds',
    image: '📱',
    actionText: 'Start Now',
    backgroundColor: colors.primary,
    textColor: colors.background,
  },
  {
    id: '2',
    title: 'Verified Retailers',
    subtitle: 'Trusted partners across India for secure transactions',
    image: '🏪',
    actionText: 'Learn More',
    backgroundColor: colors.secondary,
    textColor: colors.background,
  },
  {
    id: '3',
    title: 'Best Prices Guaranteed',
    subtitle: 'We ensure you get the highest market value for your device',
    image: '💰',
    actionText: 'Check Prices',
    backgroundColor: colors.success,
    textColor: colors.background,
  },
];

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  scrollView: {
    height: 200,
  },
  banner: {
    width: width - spacing.lg * 2,
    marginHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    justifyContent: 'center',
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bannerText: {
    flex: 1,
    paddingRight: spacing.md,
  },
  bannerTitle: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    marginBottom: spacing.sm,
  },
  bannerSubtitle: {
    fontSize: fontSize.md,
    opacity: 0.9,
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  bannerButton: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
  },
  bannerButtonText: {
    fontSize: fontSize.sm,
    fontWeight: 'bold',
  },
  bannerImage: {
    width: 80,
    height: 80,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerEmoji: {
    fontSize: 40,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: colors.primary,
  },
  inactiveDot: {
    backgroundColor: colors.border,
  },
});

export default BannerCarousel;
