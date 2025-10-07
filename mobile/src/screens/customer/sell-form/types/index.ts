export interface FormData {
  brand: string;
  model: string;
  modelName: string;
  age: string;
  hasBill: string;
  billImage: string;
  hasBox: string;
  screenReplacement: string;
  condition: string;
  battery: string;
  phoneImages: string[]; // Array of phone image URIs
  name: string;
  phone: string;
  city: string;
}

export interface FormErrors {
  brand?: string;
  model?: string;
  modelName?: string;
  age?: string;
  hasBill?: string;
  billImage?: string;
  hasBox?: string;
  screenReplacement?: string;
  condition?: string;
  battery?: string;
  phoneImages?: string;
  name?: string;
  phone?: string;
  city?: string;
}

export type SellFormStep = 'brand-selection' | 'details' | 'contact';

export interface BrandOption {
  name: string;
  icon: string;
  color: string;
}

export interface AgeOption {
  label: string;
  value: string;
}

export interface YesNoOption {
  label: string;
  value: string;
}

export interface ConditionOption {
  label: string;
  value: string;
}

export interface BatteryOption {
  label: string;
  value: string;
}
