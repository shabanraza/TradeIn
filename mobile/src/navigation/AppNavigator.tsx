import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '../contexts/AuthContext';
import { RootStackParamList, AuthStackParamList, MainTabParamList, ProductsStackParamList } from '../types';

// Import screens
import LandingScreen from '../screens/LandingScreen';
import VerifyOTPScreen from '../screens/auth/VerifyOTPScreen';
import HomeScreen from '../screens/main/HomeScreen';
import ProductsScreen from '../screens/customer/ProductsScreen';
import ProductListingScreen from '../screens/customer/ProductListingScreen';
import ProductDetailsScreen from '../screens/customer/ProductDetailsScreen';
import SellFormScreen from '../screens/customer/SellFormScreen';
import RetailerLandingScreen from '../screens/retailer/RetailerLandingScreen';
import RetailerListingsScreen from '../screens/retailer/RetailerListingsScreen';
import AddProductScreen from '../screens/retailer/AddProductScreen';
import ProfileScreen from '../screens/shared/ProfileScreen';
import LoadingScreen from '../screens/LoadingScreen';

const RootStack = createStackNavigator<RootStackParamList>();
const AuthStack = createStackNavigator<AuthStackParamList>();
const MainTab = createBottomTabNavigator<MainTabParamList>();
const ProductsStack = createStackNavigator<ProductsStackParamList>();

const AuthNavigator = () => {
  console.log('🔐 AuthNavigator - Rendering Auth stack');
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="VerifyOTP"
    >
      <AuthStack.Screen name="VerifyOTP" component={VerifyOTPScreen} />
    </AuthStack.Navigator>
  );
};

const ProductsNavigator = () => {
  return (
    <ProductsStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <ProductsStack.Screen name="ProductsList" component={ProductsScreen} />
      <ProductsStack.Screen name="ProductListing" component={ProductListingScreen} />
      <ProductsStack.Screen name="ProductDetails" component={ProductDetailsScreen} />
    </ProductsStack.Navigator>
  );
};

const MainNavigator = () => {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  
  // Determine if user is a retailer
  const isRetailer = user?.email?.includes('retailer') || user?.role === 'retailer';
  
  return (
    <MainTab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

        if (route.name === 'Sell' || route.name === 'Dashboard') {
          iconName = focused ? 'cash' : 'cash-outline';
        } else if (route.name === 'Products') {
          iconName = focused ? 'bag' : 'bag-outline';
        } else if (route.name === 'Profile') {
          iconName = focused ? 'person' : 'person-outline';
        } else {
          iconName = 'help-outline';
        }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: {
          height: 70 + insets.bottom,
          paddingBottom: insets.bottom + 10,
          paddingTop: 10,
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 2,
        },
        headerShown: false,
      })}
    >
    {isRetailer ? (
      // Retailer tabs
      <>
        <MainTab.Screen 
          name="Dashboard" 
          component={RetailerLandingScreen}
          options={{ tabBarLabel: 'Dashboard' }}
        />
        <MainTab.Screen 
          name="Products" 
          component={RetailerListingsScreen}
          options={{ tabBarLabel: 'My Listings' }}
        />
        <MainTab.Screen 
          name="Profile" 
          component={ProfileScreen}
          options={{ tabBarLabel: 'Profile' }}
        />
      </>
    ) : (
      // Customer tabs
      <>
        <MainTab.Screen 
          name="Sell" 
          component={LandingScreen}
          options={{ tabBarLabel: 'Sell' }}
        />
        <MainTab.Screen 
          name="Products" 
          component={ProductsNavigator}
          options={{ tabBarLabel: 'Buy' }}
        />
        <MainTab.Screen 
          name="Profile" 
          component={ProfileScreen}
          options={{ tabBarLabel: 'Profile' }}
        />
      </>
    )}
    </MainTab.Navigator>
  );
};

const AppNavigator = () => {
  const { isAuthenticated, loading, user } = useAuth();

  console.log('🧭 AppNavigator - isAuthenticated:', isAuthenticated, 'loading:', loading, 'user:', user?.email);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer
      onStateChange={(state) => {
        console.log('🧭 Navigation state changed:', JSON.stringify(state, null, 2));
      }}
    >
      <RootStack.Navigator 
        screenOptions={{ headerShown: false }}
        initialRouteName="Landing"
      >
        <RootStack.Screen name="Landing" component={MainNavigator} />
        <RootStack.Screen name="Auth" component={AuthNavigator} />
        <RootStack.Screen name="Main" component={MainNavigator} />
        <RootStack.Screen 
          name="AddProduct" 
          component={AddProductScreen}
          options={{ headerShown: false }}
        />
        <RootStack.Screen 
          name="SellForm" 
          component={SellFormScreen}
          options={{ headerShown: false }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

