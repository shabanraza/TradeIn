import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types';
import { colors, spacing, fontSize, borderRadius } from '../../styles';
import LocationHeader from '../../components/LocationHeader';

type RetailerLandingScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;

const { width } = Dimensions.get('window');

const RetailerLandingScreen: React.FC = () => {
  const navigation = useNavigation<RetailerLandingScreenNavigationProp>();

  const handleAddProduct = () => {
    navigation.navigate('AddProduct');
  };
  const benefits = [
    {
      icon: 'trending-up',
      title: 'Increase Sales',
      description: 'Reach more customers and boost your revenue',
    },
    {
      icon: 'people',
      title: 'Verified Customers',
      description: 'Connect with genuine buyers in your area',
    },
    {
      icon: 'shield-checkmark',
      title: 'Secure Payments',
      description: 'Get paid instantly with secure transactions',
    },
    {
      icon: 'analytics',
      title: 'Analytics Dashboard',
      description: 'Track your performance and sales metrics',
    },
  ];

  const features = [
    {
      icon: 'phone-portrait',
      title: 'List Phones',
      description: 'Add new and refurbished phones to your inventory',
    },
    {
      icon: 'cube',
      title: 'Accessories',
      description: 'Sell cases, chargers, and other phone accessories',
    },
    {
      icon: 'settings',
      title: 'Manage Listings',
      description: 'Edit, update, and track your product listings',
    },
    {
      icon: 'notifications',
      title: 'Get Leads',
      description: 'Receive customer inquiries and phone selling requests',
    },
  ];

  const stats = [
    { label: 'Active Listings', value: '150+' },
    { label: 'Monthly Sales', value: '₹2.5L+' },
    { label: 'Happy Customers', value: '500+' },
    { label: 'Cities Covered', value: '25+' },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <LocationHeader showNotification={false} />
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>Welcome to Your Retailer Dashboard</Text>
          <Text style={styles.heroSubtitle}>
            Manage your inventory, track sales, and connect with customers
          </Text>
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Your Performance</Text>
          <View style={styles.statsGrid}>
            {stats.map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Benefits Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Why Partner With Us?</Text>
          <Text style={styles.sectionSubtitle}>Join thousands of successful retailers</Text>
          <View style={styles.benefitsContainer}>
            {benefits.map((benefit, index) => (
              <View key={index} style={styles.benefitCard}>
                <View style={styles.benefitIcon}>
                  <Ionicons name={benefit.icon as any} size={24} color={colors.primary} />
                </View>
                <Text style={styles.benefitTitle}>{benefit.title}</Text>
                <Text style={styles.benefitDescription}>{benefit.description}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Features Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What You Can Do</Text>
          <Text style={styles.sectionSubtitle}>Manage your business with powerful tools</Text>
          <View style={styles.featuresContainer}>
            {features.map((feature, index) => (
              <View key={index} style={styles.featureCard}>
                <View style={styles.featureIcon}>
                  <Ionicons name={feature.icon as any} size={20} color={colors.primary} />
                </View>
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDescription}>{feature.description}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Call to Action */}
        <View style={styles.ctaSection}>
          <Text style={styles.ctaTitle}>Ready to Grow Your Business?</Text>
          <Text style={styles.ctaSubtitle}>
            Start listing your products and reach more customers today
          </Text>
          <TouchableOpacity style={styles.ctaButton} onPress={handleAddProduct}>
            <Ionicons name="add-circle" size={20} color={colors.background} />
            <Text style={styles.ctaButtonText}>Add Your First Product</Text>
          </TouchableOpacity>
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
  scrollContent: {
    paddingBottom: 100, // For bottom navigation
  },
  heroSection: {
    padding: spacing.lg,
    alignItems: 'center',
    backgroundColor: colors.primary + '10',
    marginBottom: spacing.lg,
  },
  heroTitle: {
    fontSize: fontSize.xxl,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  heroSubtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  section: {
    padding: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  sectionSubtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  statsSection: {
    padding: spacing.lg,
    backgroundColor: colors.surface,
    marginBottom: spacing.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    alignItems: 'center',
  },
  statValue: {
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
  benefitsContainer: {
    marginBottom: spacing.lg,
  },
  benefitCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  benefitIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  benefitTitle: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  benefitDescription: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  featuresContainer: {
    marginBottom: spacing.lg,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  featureDescription: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  ctaSection: {
    padding: spacing.lg,
    backgroundColor: colors.primary + '10',
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  ctaTitle: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  ctaSubtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  ctaButtonText: {
    color: colors.background,
    fontSize: fontSize.md,
    fontWeight: '600',
    marginLeft: spacing.xs,
  },
});

export default RetailerLandingScreen;
