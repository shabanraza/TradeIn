import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius } from '../styles';
import { useLocation } from '../hooks/useLocation';

interface SearchBarProps {
  onSearch?: (query: string) => void;
  onLocationPress?: () => void;
  onNotificationPress?: () => void;
  placeholder?: string;
  currentLocation?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  onLocationPress,
  onNotificationPress,
  placeholder = 'Search for phone models...',
  currentLocation,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { location, isLoading, refreshLocation } = useLocation();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      onSearch?.(searchQuery);
    }
  };

  const handleLocationPress = () => {
    if (onLocationPress) {
      onLocationPress();
    } else {
      Alert.alert(
        'Change Location',
        'Select your city to find nearby retailers',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Refresh Location', onPress: refreshLocation },
          { text: 'Select Manually', onPress: () => console.log('Manual selection') },
        ]
      );
    }
  };

  const handleNotificationPress = () => {
    if (onNotificationPress) {
      onNotificationPress();
    } else {
      Alert.alert('Notifications', 'You have no new notifications');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        {/* Top Header with Location and Notification */}
        <View style={styles.topHeader}>
          <TouchableOpacity style={styles.locationContainer} onPress={handleLocationPress}>
            <Ionicons name="location" size={18} color={colors.primary} />
            <View style={styles.locationTextContainer}>
              <Text style={styles.locationLabel}>Your location</Text>
              <Text style={styles.locationText} numberOfLines={1}>
                {isLoading ? 'Getting location...' : (location?.formattedAddress || currentLocation || 'Location not available')}
              </Text>
            </View>
            <Ionicons name="chevron-down" size={16} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.notificationButton} onPress={handleNotificationPress}>
            <Ionicons name="notifications-outline" size={22} color={colors.text} />
            <View style={styles.notificationBadge}>
              <Text style={styles.badgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder={placeholder}
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              style={styles.clearButton}
            >
              <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.background,
  },
  container: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    marginBottom: spacing.sm,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingVertical: spacing.xs,
  },
  locationTextContainer: {
    flex: 1,
    marginLeft: spacing.sm,
    marginRight: spacing.xs,
  },
  locationLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  locationText: {
    fontSize: fontSize.sm,
    color: colors.text,
    fontWeight: '600',
  },
  notificationButton: {
    position: 'relative',
    padding: spacing.sm,
    marginLeft: spacing.sm,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: colors.error,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  badgeText: {
    color: colors.background,
    fontSize: 10,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 50,
  },
  searchInput: {
    flex: 1,
    fontSize: fontSize.md,
    color: colors.text,
    paddingVertical: 0,
    paddingRight: spacing.sm,
  },
  clearButton: {
    padding: spacing.xs,
  },
});

export default SearchBar;
