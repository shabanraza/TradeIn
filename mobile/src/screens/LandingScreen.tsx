import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius } from '../styles';
import { RootStackParamList } from '../types';
import BannerCarousel from '../components/BannerCarousel';
import LoginBottomSheet from '../components/LoginBottomSheet';

const { width } = Dimensions.get('window');

type LandingScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Landing'>;

const LandingScreen: React.FC = () => {
  const navigation = useNavigation<LandingScreenNavigationProp>();
  const [showLoginSheet, setShowLoginSheet] = useState(false);

  const handleGetStarted = () => {
    setShowLoginSheet(true);
  };

  const handleViewProducts = () => {
    setShowLoginSheet(true);
  };

  const handleNavigateToOTP = (email: string) => {
    console.log('🧭 LandingScreen - Navigating to Auth with email:', email);
    // Try using navigate with options
    navigation.navigate('Auth', {});
    console.log('✅ LandingScreen - Navigation navigate called');
  };

  const handleCloseLoginSheet = () => {
    setShowLoginSheet(false);
  };
  const processSteps = [
    {
      id: 1,
      title: 'Submit Details',
      description: 'Tell us about your phone model, condition, and specifications',
      icon: '📱',
    },
    {
      id: 2,
      title: 'Retailer Contact',
      description: 'Our verified retailer will call you to schedule inspection',
      icon: '📞',
    },
    {
      id: 3,
      title: 'Device Inspection',
      description: 'Retailer visits your shop to inspect the device physically',
      icon: '🔍',
    },
    {
      id: 4,
      title: 'Get Paid',
      description: 'Receive payment instantly after successful inspection',
      icon: '✅',
    },
  ];

  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      location: 'Mumbai',
      rating: 5,
      text: 'Sold my iPhone 12 in just 2 days! The process was so smooth and I got a great price.',
      phone: 'iPhone 12 Pro',
      amount: '₹45,000',
    },
    {
      id: 2,
      name: 'Rajesh Kumar',
      location: 'Delhi',
      rating: 5,
      text: 'Excellent service! The retailer came to my home and the transaction was completed in minutes.',
      phone: 'Samsung Galaxy S21',
      amount: '₹38,000',
    },
    {
      id: 3,
      name: 'Priya Sharma',
      location: 'Bangalore',
      rating: 5,
      text: 'Trusted platform with verified retailers. Got the best price for my old phone.',
      phone: 'OnePlus 9 Pro',
      amount: '₹32,000',
    },
  ];

  const trustFeatures = [
    { icon: '🔒', title: 'Secure Transactions', description: '100% safe and encrypted' },
    { icon: '✅', title: 'Verified Retailers', description: 'All partners are background checked' },
    { icon: '💰', title: 'Best Prices', description: 'Guaranteed fair market rates' },
    { icon: '🏠', title: 'Home Pickup', description: 'Free pickup from your location' },
  ];


  const handleBannerPress = (banner: any) => {
    // Navigate to buy page (Products screen)
    navigation.navigate('Main', { screen: 'Products' });
  };

  const handleStartSelling = () => {
    // Navigate directly to sell form
    navigation.navigate('SellForm');
  };

  return (
    <LinearGradient
      colors={['#E3F2FD', '#F8FAFF', '#FFFFFF']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradientContainer}
    >
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView 
          style={styles.container} 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Location Header */}
          <View style={styles.locationHeader}>
           <View style={styles.locationInfo}>
             <Ionicons name="location" size={16} color={colors.primary} />
             <Text style={styles.locationText}>Delhi, India</Text>
             <Ionicons name="chevron-down" size={16} color={colors.primary} />
           </View>
           <TouchableOpacity style={styles.notificationButton}>
             <Ionicons name="notifications" size={20} color={colors.primary} />
           </TouchableOpacity>
          </View>

          {/* Hero Section - Sell Focused */}
          <View style={styles.heroSection}>
            <Text style={styles.heroTitle}>
              Sell Your Phone{'\n'}Get Instant Cash
            </Text>
            <Text style={styles.heroSubtitle}>
              Connect with verified retailers and get the best price for your phone. 
              Quick, safe, and secure transactions.
            </Text>
            <View style={styles.ctaButtonsContainer}>
              <TouchableOpacity style={styles.primaryCtaButton} onPress={handleStartSelling}>
                <Ionicons name="cash" size={22} color="#FFFFFF" />
                <Text numberOfLines={1} style={styles.primaryCtaButtonText}>Sell Now</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryCtaButton} onPress={handleBannerPress}>
                <Ionicons name="search" size={22} color={colors.primary} />
                <Text numberOfLines={1} style={styles.secondaryCtaButtonText}>Browse Phones</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Value Proposition */}
          <View style={styles.valueSection}>
            <Text style={styles.valueTitle}>Why Sell With Us?</Text>
            <View style={styles.valueCards}>
               <View style={styles.valueCard}>
                 <View style={styles.valueIcon}>
                   <Ionicons name="shield-checkmark" size={24} color={colors.primary} />
                 </View>
                 <Text style={styles.valueCardTitle}>Verified Retailers</Text>
                 <Text style={styles.valueCardDescription}>
                   Only trusted and verified retailers
                 </Text>
               </View>
               <View style={styles.valueCard}>
                 <View style={styles.valueIcon}>
                   <Ionicons name="flash" size={24} color={colors.primary} />
                 </View>
                 <Text style={styles.valueCardTitle}>Instant Payment</Text>
                 <Text style={styles.valueCardDescription}>
                   Get paid immediately after verification
                 </Text>
               </View>
               <View style={styles.valueCard}>
                 <View style={styles.valueIcon}>
                   <Ionicons name="trending-up" size={24} color={colors.primary} />
                 </View>
                 <Text style={styles.valueCardTitle}>Best Price</Text>
                 <Text style={styles.valueCardDescription}>
                   Competitive rates from multiple retailers
                 </Text>
               </View>
            </View>
          </View>

      {/* Process Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>How It Works</Text>
        <Text style={styles.sectionSubtitle}>Sell your phone in 4 simple steps</Text>
        
        <View style={styles.processContainer}>
          {processSteps.map((step, index) => (
            <View key={step.id} style={styles.processStep}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{step.id}</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepIcon}>{step.icon}</Text>
                <Text style={styles.stepTitle}>{step.title}</Text>
                <Text style={styles.stepDescription}>{step.description}</Text>
              </View>
              {index < processSteps.length - 1 && (
                <View style={styles.stepConnector} />
              )}
            </View>
          ))}
        </View>
      </View>

      {/* Trust Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Why Choose Us</Text>
        <Text style={styles.sectionSubtitle}>Trusted by thousands of customers</Text>
        
        <View style={styles.trustGrid}>
          {trustFeatures.map((feature, index) => (
            <View key={index} style={styles.trustCard}>
              <Text style={styles.trustIcon}>{feature.icon}</Text>
              <Text style={styles.trustTitle}>{feature.title}</Text>
              <Text style={styles.trustDescription}>{feature.description}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Exclusive Store Section */}
      <View style={styles.exclusiveSection}>
        <View style={styles.exclusiveContent}>
          <Text style={styles.exclusiveTitle}>🏪 Our Exclusive Store</Text>
          <Text style={styles.exclusiveSubtitle}>
            Partnered with 500+ verified retailers across India
          </Text>
          <View style={styles.storeStats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>500+</Text>
              <Text style={styles.statLabel}>Verified Retailers</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>50K+</Text>
              <Text style={styles.statLabel}>Happy Customers</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>₹2Cr+</Text>
              <Text style={styles.statLabel}>Phones Sold</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Testimonials Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>What Our Customers Say</Text>
        <Text style={styles.sectionSubtitle}>Real experiences from real customers</Text>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.testimonialsContainer}>
          {testimonials.map((testimonial) => (
            <View key={testimonial.id} style={styles.testimonialCard}>
              <View style={styles.testimonialHeader}>
                <View style={styles.testimonialInfo}>
                  <Text style={styles.testimonialName}>{testimonial.name}</Text>
                  <Text style={styles.testimonialLocation}>{testimonial.location}</Text>
                </View>
                <View style={styles.ratingContainer}>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Text key={i} style={styles.star}>⭐</Text>
                  ))}
                </View>
              </View>
              <Text style={styles.testimonialText}>"{testimonial.text}"</Text>
              <View style={styles.testimonialFooter}>
                <Text style={styles.testimonialPhone}>{testimonial.phone}</Text>
                <Text style={styles.testimonialAmount}>{testimonial.amount}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* CTA Section */}
      <View style={styles.ctaSection}>
        <Text style={styles.ctaTitle}>Ready to Sell Your Phone?</Text>
        <Text style={styles.ctaSubtitle}>
          Join thousands of satisfied customers and get the best price for your phone
        </Text>
        <TouchableOpacity style={styles.ctaButton} onPress={handleStartSelling}>
          <Text numberOfLines={1} style={styles.ctaButtonText}>Start Selling Now</Text>
        </TouchableOpacity>
      </View>
      </ScrollView>
      
        {/* Login Bottom Sheet */}
        <LoginBottomSheet
          visible={showLoginSheet}
          onClose={handleCloseLoginSheet}
          onNavigateToOTP={handleNavigateToOTP}
        />
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // Extra padding for bottom navigation
  },
  locationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  locationText: {
    fontSize: fontSize.md,
    color: colors.text,
    fontWeight: '600',
  },
  notificationButton: {
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
    backgroundColor: 'rgba(0, 122, 255, 0.05)',
  },
  heroSection: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: fontSize.xxxl,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  heroSubtitle: {
    fontSize: fontSize.lg,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 24,
  },
  ctaButtonsContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    width: '100%',
  },
  primaryCtaButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    gap: spacing.sm,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  primaryCtaButtonText: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flexShrink: 1,
    maxWidth: '80%',
  },
  secondaryCtaButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.primary,
    minWidth: 0,
  },
  secondaryCtaButtonText: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.primary,
    flexShrink: 1,
    maxWidth: '80%',
  },
  valueSection: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  valueTitle: {
    fontSize: fontSize.xxl,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  valueCards: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  valueCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    backdropFilter: 'blur(10px)',
    borderWidth: 1,
    borderColor: 'rgba(0, 122, 255, 0.1)',
  },
  valueIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  valueCardTitle: {
    fontSize: fontSize.md,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  valueCardDescription: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  section: {
    padding: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.xxl,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  sectionSubtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  processContainer: {
    marginTop: spacing.lg,
  },
  processStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
    position: 'relative',
  },
  stepNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  stepNumberText: {
    color: colors.background,
    fontSize: fontSize.md,
    fontWeight: 'bold',
  },
  stepContent: {
    flex: 1,
    paddingTop: spacing.xs,
  },
  stepIcon: {
    fontSize: 24,
    marginBottom: spacing.xs,
  },
  stepTitle: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  stepDescription: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  stepConnector: {
    position: 'absolute',
    left: 19,
    top: 40,
    width: 2,
    height: 40,
    backgroundColor: colors.border,
  },
  trustGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
  },
  trustCard: {
    width: (width - spacing.lg * 3) / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(0, 122, 255, 0.1)',
  },
  trustIcon: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  trustTitle: {
    fontSize: fontSize.md,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  trustDescription: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  exclusiveSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    margin: spacing.lg,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    backdropFilter: 'blur(10px)',
    borderWidth: 1,
    borderColor: 'rgba(0, 122, 255, 0.1)',
  },
  exclusiveContent: {
    alignItems: 'center',
  },
  exclusiveTitle: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  exclusiveSubtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  storeStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  testimonialsContainer: {
    marginTop: spacing.lg,
  },
  testimonialCard: {
    width: width * 0.8,
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginRight: spacing.md,
  },
  testimonialHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  testimonialInfo: {
    flex: 1,
  },
  testimonialName: {
    fontSize: fontSize.md,
    fontWeight: 'bold',
    color: colors.text,
  },
  testimonialLocation: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  ratingContainer: {
    flexDirection: 'row',
  },
  star: {
    fontSize: 16,
  },
  testimonialText: {
    fontSize: fontSize.md,
    color: colors.text,
    lineHeight: 22,
    marginBottom: spacing.md,
    fontStyle: 'italic',
  },
  testimonialFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  testimonialPhone: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  testimonialAmount: {
    fontSize: fontSize.md,
    fontWeight: 'bold',
    color: colors.success,
  },
  ctaSection: {
    backgroundColor: colors.primary,
    margin: spacing.lg,
    padding: spacing.xl,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    color: colors.background,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  ctaSubtitle: {
    fontSize: fontSize.md,
    color: colors.background,
    textAlign: 'center',
    opacity: 0.9,
    marginBottom: spacing.lg,
    lineHeight: 22,
  },
  ctaButton: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.full,
    minWidth: 200,
  },
  ctaButtonText: {
    color: colors.primary,
    fontSize: fontSize.md,
    fontWeight: 'bold',
    textAlign: 'center',
    maxWidth: '100%',
  },
});

export default LandingScreen;
