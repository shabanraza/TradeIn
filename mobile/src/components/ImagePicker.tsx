import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { colors, spacing, fontSize, borderRadius } from '../styles';

interface ImagePickerProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  title?: string;
  error?: string;
}

const { width: screenWidth } = Dimensions.get('window');
const imageSize = (screenWidth - spacing.lg * 2 - spacing.sm * 2) / 3;

const ImagePickerComponent: React.FC<ImagePickerProps> = ({
  images,
  onImagesChange,
  maxImages = 5,
  title = 'Upload Phone Images',
  error,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const requestPermissions = async () => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (cameraStatus !== 'granted' || mediaStatus !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Camera and photo library permissions are required to upload images.',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  };

  const compressImage = async (uri: string): Promise<string> => {
    try {
      const manipResult = await ImageManipulator.manipulateAsync(
        uri,
        [
          {
            resize: {
              width: 800, // Max width
              height: 800, // Max height
            },
          },
        ],
        {
          compress: 0.7, // 70% quality (0.7)
          format: ImageManipulator.SaveFormat.JPEG,
        }
      );
      return manipResult.uri;
    } catch (error) {
      console.error('Image compression error:', error);
      return uri; // Return original if compression fails
    }
  };

  const pickImage = async (source: 'camera' | 'gallery') => {
    if (images.length >= maxImages) {
      Alert.alert('Limit Reached', `You can upload maximum ${maxImages} images.`);
      return;
    }

    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    setIsLoading(true);

    try {
      let result;
      
      if (source === 'camera') {
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1, // We'll compress it later
        });
      } else {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1, // We'll compress it later
        });
      }

      if (!result.canceled && result.assets[0]) {
        const compressedUri = await compressImage(result.assets[0].uri);
        onImagesChange([...images, compressedUri]);
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const showImageOptions = () => {
    Alert.alert(
      'Add Phone Image',
      'Choose how you want to add an image of your phone',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Take Photo', onPress: () => pickImage('camera') },
        { text: 'Choose from Gallery', onPress: () => pickImage('gallery') },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>
        Upload {maxImages - images.length} more image{maxImages - images.length !== 1 ? 's' : ''} 
        {images.length > 0 && ` (${images.length}/${maxImages})`}
      </Text>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.imageContainer}
        contentContainerStyle={styles.imageScrollContent}
      >
        {images.map((uri, index) => (
          <View key={index} style={styles.imageWrapper}>
            <Image source={{ uri }} style={styles.image} />
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removeImage(index)}
            >
              <Ionicons name="close-circle" size={20} color={colors.error} />
            </TouchableOpacity>
          </View>
        ))}

        {images.length < maxImages && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={showImageOptions}
            disabled={isLoading}
          >
            {isLoading ? (
              <Ionicons name="hourglass" size={24} color={colors.textSecondary} />
            ) : (
              <Ionicons name="camera" size={24} color={colors.primary} />
            )}
            <Text style={styles.addButtonText}>Add Image</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  imageContainer: {
    marginBottom: spacing.sm,
  },
  imageScrollContent: {
    paddingRight: spacing.md,
  },
  imageWrapper: {
    position: 'relative',
    marginRight: spacing.sm,
  },
  image: {
    width: imageSize,
    height: imageSize,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: colors.background,
    borderRadius: 10,
    padding: 2,
  },
  addButton: {
    width: imageSize,
    height: imageSize,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  addButtonText: {
    fontSize: fontSize.xs,
    color: colors.primary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  errorText: {
    fontSize: fontSize.sm,
    color: colors.error,
    marginTop: spacing.xs,
  },
});

export default ImagePickerComponent;


