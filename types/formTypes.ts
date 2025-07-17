export interface FormField {
  id: string;
  type: 'text' | 'email' | 'password' | 'number' | 'phone' | 'select' | 'multiselect' | 'checkbox' | 'radio' | 'textarea' | 'date' | 'switch';
  label: string;
  placeholder?: string;
  required?: boolean;
  validation?: ValidationRule[];
  options?: { value: string; label: string }[];
  defaultValue?: any;
  style?: FieldStyle;
  disabled?: boolean;
  dependencies?: FieldDependency[];
}

export interface ValidationRule {
  type: 'required' | 'email' | 'min' | 'max' | 'pattern' | 'custom';
  value?: any;
  message: string;
}

export interface FieldDependency {
  field: string;
  value: any;
  action: 'show' | 'hide' | 'enable' | 'disable';
}

export interface FieldStyle {
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  padding?: number;
  margin?: number;
  fontSize?: number;
  fontWeight?: string;
  color?: string;
  height?: number;
}

export interface FormGroup {
  id: string;
  title: string;
  subtitle?: string;
  fields: FormField[];
  style?: GroupStyle;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

export interface GroupStyle {
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  padding?: number;
  margin?: number;
  titleColor?: string;
  titleFontSize?: number;
  titleFontWeight?: string;
}

export interface WizardStep {
  id: string;
  title: string;
  subtitle?: string;
  groups: FormGroup[];
  nextButtonText?: string;
  previousButtonText?: string;
  canGoNext?: (data: any) => boolean;
}

export interface FormBanner {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title?: string;
  message: string;
  dismissible?: boolean;
  style?: BannerStyle;
}

export interface BannerStyle {
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  padding?: number;
  margin?: number;
  textColor?: string;
  titleColor?: string;
}

export interface FormTheme {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  headerBackgroundColor: string;
  headerTextColor: string;
  subtitleColor: string;
  buttonBackgroundColor: string;
  buttonTextColor: string;
  buttonBorderRadius: number;
  inputBackgroundColor: string;
  inputBorderColor: string;
  inputTextColor: string;
  inputBorderRadius: number;
  errorColor: string;
  successColor: string;
  warningColor: string;
  infoColor: string;
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
}

export interface FormConfig {
  id: string;
  title: string;
  subtitle?: string;
  type: 'simple' | 'wizard';
  theme: FormTheme;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: { [key: string]: string };
  banners?: FormBanner[];
  groups?: FormGroup[];
  steps?: WizardStep[];
  submitButtonText?: string;
  resetButtonText?: string;
  showResetButton?: boolean;
  callbacks?: {
    onSubmit?: string;
    onChange?: string;
    onValidation?: string;
  };
}