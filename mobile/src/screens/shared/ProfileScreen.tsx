import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types';
import { colors, spacing, fontSize, borderRadius } from '../../styles';
import LoginBottomSheet from '../../components/LoginBottomSheet';

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;

const ProfileScreen: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const [showLoginSheet, setShowLoginSheet] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: logout }
      ]
    );
  };

  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'Profile editing functionality will be implemented');
  };

  const handleSettings = () => {
    Alert.alert('Settings', 'Settings functionality will be implemented');
  };

  const handleHelp = () => {
    Alert.alert('Help & Support', 'Help functionality will be implemented');
  };

  const handleAbout = () => {
    Alert.alert('About', 'App version 1.0.0\nBuilt with React Native');
  };

  const handleLogin = () => {
    setShowLoginSheet(true);
  };

  const handleNavigateToOTP = (email: string) => {
    console.log('🧭 ProfileScreen - Navigating to Auth with email:', email);
    // Try using navigate with options
    navigation.navigate('Auth', {});
    console.log('✅ ProfileScreen - Navigation navigate called');
  };

  const handleCloseLoginSheet = () => {
    setShowLoginSheet(false);
  };

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.container}>
          <View style={styles.notLoggedInContainer}>
            <Ionicons name="person-circle-outline" size={80} color={colors.textSecondary} />
            <Text style={styles.notLoggedInTitle}>Not Logged In</Text>
            <Text style={styles.notLoggedInSubtitle}>
              Please login to access your profile and manage your account
            </Text>
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Ionicons name="log-in" size={20} color={colors.background} />
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Login Bottom Sheet */}
        <LoginBottomSheet
          visible={showLoginSheet}
          onClose={handleCloseLoginSheet}
          onNavigateToOTP={handleNavigateToOTP}
        />
      </SafeAreaView>
    );
  }

  const isRetailer = user?.email?.includes('retailer') || user?.role === 'retailer';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: 'https://via.placeholder.com/100' }}
              style={styles.profileImage}
            />
            <TouchableOpacity style={styles.editImageButton}>
              <Ionicons name="camera" size={16} color={colors.background} />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{user?.name || 'User'}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
          <View style={styles.userTypeBadge}>
            <Ionicons 
              name={isRetailer ? "storefront" : "person"} 
              size={16} 
              color={colors.primary} 
            />
            <Text style={styles.userTypeText}>
              {isRetailer ? 'Retailer' : 'Customer'}
            </Text>
          </View>
        </View>

        {/* Profile Actions */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.actionItem} onPress={handleEditProfile}>
            <View style={styles.actionLeft}>
              <View style={styles.actionIcon}>
                <Ionicons name="create-outline" size={20} color={colors.primary} />
              </View>
              <Text style={styles.actionText}>Edit Profile</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem} onPress={handleSettings}>
            <View style={styles.actionLeft}>
              <View style={styles.actionIcon}>
                <Ionicons name="settings-outline" size={20} color={colors.primary} />
              </View>
              <Text style={styles.actionText}>Settings</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem} onPress={handleHelp}>
            <View style={styles.actionLeft}>
              <View style={styles.actionIcon}>
                <Ionicons name="help-circle-outline" size={20} color={colors.primary} />
              </View>
              <Text style={styles.actionText}>Help & Support</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem} onPress={handleAbout}>
            <View style={styles.actionLeft}>
              <View style={styles.actionIcon}>
                <Ionicons name="information-circle-outline" size={20} color={colors.primary} />
              </View>
              <Text style={styles.actionText}>About</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <TouchableOpacity style={styles.actionItem}>
            <View style={styles.actionLeft}>
              <View style={styles.actionIcon}>
                <Ionicons name="shield-checkmark-outline" size={20} color={colors.success} />
              </View>
              <Text style={styles.actionText}>Privacy Policy</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem}>
            <View style={styles.actionLeft}>
              <View style={styles.actionIcon}>
                <Ionicons name="document-text-outline" size={20} color={colors.primary} />
              </View>
              <Text style={styles.actionText}>Terms of Service</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Logout Section - Only visible when logged in */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color={colors.error} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </ScrollView>
      
      {/* Login Bottom Sheet */}
      <LoginBottomSheet
        visible={showLoginSheet}
        onClose={handleCloseLoginSheet}
        onNavigateToOTP={handleNavigateToOTP}
      />
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
  notLoggedInContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  notLoggedInTitle: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  notLoggedInSubtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 24,
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  loginButtonText: {
    color: colors.background,
    fontSize: fontSize.md,
    fontWeight: '600',
    marginLeft: spacing.xs,
  },
  header: {
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: colors.surface,
    marginBottom: spacing.lg,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: spacing.md,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.border,
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary,
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.background,
  },
  userName: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  userEmail: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  userTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary + '20',
    borderRadius: borderRadius.md,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  userTypeText: {
    fontSize: fontSize.sm,
    color: colors.primary,
    fontWeight: '600',
    marginLeft: spacing.xs,
  },
  section: {
    backgroundColor: colors.surface,
    marginBottom: spacing.lg,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.md,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  actionText: {
    fontSize: fontSize.md,
    color: colors.text,
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.error + '10',
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.error + '30',
  },
  logoutText: {
    fontSize: fontSize.md,
    color: colors.error,
    fontWeight: '600',
    marginLeft: spacing.xs,
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  versionText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
});

export default ProfileScreen;