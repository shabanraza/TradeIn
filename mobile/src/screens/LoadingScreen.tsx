import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { THEME_CONFIG } from '../config';

const LoadingScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={THEME_CONFIG.primaryColor} />
      <Text style={styles.text}>Loading...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: THEME_CONFIG.backgroundColor,
  },
  text: {
    marginTop: 16,
    fontSize: 16,
    color: THEME_CONFIG.textColor,
  },
});

export default LoadingScreen;

