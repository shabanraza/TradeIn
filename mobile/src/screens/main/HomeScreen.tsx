import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { THEME_CONFIG } from '../../config';

const HomeScreen: React.FC = () => {
  const { user } = useAuth();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {user?.name || 'User'}!</Text>
          <Text style={styles.subtitle}>Welcome to SellerApp</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={24} color={THEME_CONFIG.textColor} />
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Ionicons name="grid-outline" size={24} color={THEME_CONFIG.primaryColor} />
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Products</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="eye-outline" size={24} color={THEME_CONFIG.successColor} />
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Views</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="chatbubble-outline" size={24} color={THEME_CONFIG.accentColor} />
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Messages</Text>
        </View>
      </View>

      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity style={styles.actionCard}>
            <Ionicons name="add-circle" size={32} color={THEME_CONFIG.primaryColor} />
            <Text style={styles.actionText}>Sell Product</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard}>
            <Ionicons name="search" size={32} color={THEME_CONFIG.successColor} />
            <Text style={styles.actionText}>Browse</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard}>
            <Ionicons name="chatbubbles" size={32} color={THEME_CONFIG.accentColor} />
            <Text style={styles.actionText}>Messages</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard}>
            <Ionicons name="analytics" size={32} color={THEME_CONFIG.warningColor} />
            <Text style={styles.actionText}>Analytics</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.recentActivity}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityCard}>
          <Ionicons name="information-circle-outline" size={24} color={THEME_CONFIG.textSecondaryColor} />
          <Text style={styles.activityText}>No recent activity</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME_CONFIG.backgroundColor,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingTop: 60,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: THEME_CONFIG.textColor,
  },
  subtitle: {
    fontSize: 16,
    color: THEME_CONFIG.textSecondaryColor,
    marginTop: 4,
  },
  notificationButton: {
    padding: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 32,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: THEME_CONFIG.surfaceColor,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME_CONFIG.borderColor,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: THEME_CONFIG.textColor,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: THEME_CONFIG.textSecondaryColor,
    marginTop: 4,
  },
  quickActions: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: THEME_CONFIG.textColor,
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    width: '48%',
    backgroundColor: THEME_CONFIG.surfaceColor,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME_CONFIG.borderColor,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME_CONFIG.textColor,
    marginTop: 8,
  },
  recentActivity: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME_CONFIG.surfaceColor,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: THEME_CONFIG.borderColor,
  },
  activityText: {
    fontSize: 16,
    color: THEME_CONFIG.textSecondaryColor,
    marginLeft: 12,
  },
});

export default HomeScreen;

