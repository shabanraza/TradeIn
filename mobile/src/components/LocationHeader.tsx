import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize } from '../styles';
import { useLocation } from '../hooks/useLocation';

interface LocationHeaderProps {
  onLocationPress?: () => void;
  onNotificationPress?: () => void;
  currentLocation?: string;
  showNotification?: boolean;
}

const LocationHeader: React.FC<LocationHeaderProps> = ({
  onLocationPress,
  onNotificationPress,
  currentLocation,
  showNotification = true,
}) => {
  const { location, isLoading, error, refreshLocation } = useLocation();

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

        {showNotification && (
          <TouchableOpacity style={styles.notificationButton} onPress={handleNotificationPress}>
            <Ionicons name="notifications-outline" size={22} color={colors.text} />
            <View style={styles.notificationBadge}>
              <Text style={styles.badgeText}>3</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.background,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
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
});

export default LocationHeader;
