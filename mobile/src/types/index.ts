// Re-export shared types from the workspace
export * from '../../../shared/src/types';

// Mobile-specific types
export interface MobileAuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  token: string | null;
  refreshToken: string | null;
}

export interface MobileNavigationParams {
  Auth: undefined;
  Main: undefined;
  Home: undefined;
  Products: undefined;
  Profile: undefined;
  Sell: undefined;
}

// Mobile-specific API types
export interface MobileApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Mobile navigation types
export type RootStackParamList = {
  Landing: undefined;
  Auth: undefined | {
    screen: 'VerifyOTP';
    params: { email: string };
  };
  Main: undefined;
  AddProduct: undefined;
  SellForm: undefined;
};

export type AuthStackParamList = {
  VerifyOTP: { email: string };
};

export type MainTabParamList = {
  Sell: undefined;
  Dashboard: undefined;
  Products: undefined;
  Profile: undefined;
};

export type ProductsStackParamList = {
  ProductsList: undefined;
  ProductListing: {
    categoryId?: string;
    categoryName?: string;
    filterType?: 'old' | 'refurbished' | 'new';
  };
  ProductDetails: {
    product: any;
  };
};

