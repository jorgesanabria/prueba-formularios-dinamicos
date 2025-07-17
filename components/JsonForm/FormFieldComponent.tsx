import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { FormField, FormTheme } from '@/types/formTypes';
import { Check, ChevronDown } from 'lucide-react-native';

interface FormFieldComponentProps {
  field: FormField;
  value: any;
  error?: string;
  theme: FormTheme;
  formData: any;
  onChange: (value: any) => void;
  onBlur: () => void;
}

export const FormFieldComponent: React.FC<FormFieldComponentProps> = ({
  field,
  value,
  error,
  theme,
  formData,
  onChange,
  onBlur,
}) => {
  const [showOptions, setShowOptions] = useState(false);

  // Check field dependencies
  const isVisible = checkFieldVisibility(field, formData);
  const isDisabled = field.disabled || checkFieldDisability(field, formData);

  if (!isVisible) return null;

  const getInputStyle = () => {
    const baseStyle = {
      backgroundColor: field.style?.backgroundColor || theme.inputBackgroundColor,
      borderColor: error ? theme.errorColor : (field.style?.borderColor || theme.inputBorderColor),
      borderWidth: field.style?.borderWidth || 1,
      borderRadius: field.style?.borderRadius || theme.inputBorderRadius,
      padding: field.style?.padding || theme.spacing.md,
      fontSize: field.style?.fontSize || 16,
      color: field.style?.color || theme.inputTextColor,
      height: field.style?.height || 48,
    };

    if (isDisabled) {
      baseStyle.backgroundColor = theme.inputBackgroundColor + '80';
      baseStyle.color = theme.inputTextColor + '60';
    }

    return baseStyle;
  };

  const labelStyle = {
    color: theme.inputTextColor,
    fontSize: 16,
    fontWeight: '600' as const,
    marginBottom: theme.spacing.xs,
  };

  const errorStyle = {
    color: theme.errorColor,
    fontSize: 14,
    marginTop: theme.spacing.xs,
  };

  const renderTextInput = () => {
    const inputProps = {
      style: getInputStyle(),
      value: value || '',
      placeholder: field.placeholder,
      placeholderTextColor: theme.inputTextColor + '60',
      editable: !isDisabled,
      onChangeText: onChange,
      onBlur,
    };

    switch (field.type) {
      case 'email':
        return (
          <TextInput
            {...inputProps}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        );
      case 'password':
        return (
          <TextInput
            {...inputProps}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />
        );
      case 'number':
        return (
          <TextInput
            {...inputProps}
            keyboardType="numeric"
            onChangeText={(text) => onChange(Number(text) || 0)}
          />
        );
      case 'phone':
        return (
          <TextInput
            {...inputProps}
            keyboardType="phone-pad"
          />
        );
      case 'textarea':
        return (
          <TextInput
            {...inputProps}
            multiline
            numberOfLines={4}
            style={[getInputStyle(), { height: field.style?.height || 100, textAlignVertical: 'top' }]}
          />
        );
      case 'date':
        return (
          <TextInput
            {...inputProps}
            placeholder={field.placeholder || 'YYYY-MM-DD'}
          />
        );
      default:
        return <TextInput {...inputProps} />;
    }
  };

  const renderSelect = () => {
    return (
      <View>
        <TouchableOpacity
          style={[getInputStyle(), styles.selectContainer]}
          onPress={() => !isDisabled && setShowOptions(!showOptions)}
          disabled={isDisabled}
        >
          <Text style={[{ color: value ? theme.inputTextColor : theme.inputTextColor + '60' }]}>
            {value ? field.options?.find(opt => opt.value === value)?.label : field.placeholder}
          </Text>
          <ChevronDown size={20} color={theme.inputTextColor} />
        </TouchableOpacity>
        
        {showOptions && (
          <View style={[styles.optionsContainer, { borderColor: theme.inputBorderColor }]}>
            {field.options?.map(option => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.option,
                  { backgroundColor: value === option.value ? theme.primaryColor + '10' : 'transparent' }
                ]}
                onPress={() => {
                  onChange(option.value);
                  setShowOptions(false);
                }}
              >
                <Text style={[
                  styles.optionText,
                  { color: value === option.value ? theme.primaryColor : theme.inputTextColor }
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  };

  const renderMultiSelect = () => {
    const selectedValues = Array.isArray(value) ? value : [];
    
    return (
      <View>
        <TouchableOpacity
          style={[getInputStyle(), styles.selectContainer]}
          onPress={() => !isDisabled && setShowOptions(!showOptions)}
          disabled={isDisabled}
        >
          <Text style={[{ color: selectedValues.length > 0 ? theme.inputTextColor : theme.inputTextColor + '60' }]}>
            {selectedValues.length > 0 
              ? `${selectedValues.length} selected` 
              : field.placeholder || 'Select options'}
          </Text>
          <ChevronDown size={20} color={theme.inputTextColor} />
        </TouchableOpacity>
        
        {showOptions && (
          <View style={[styles.optionsContainer, { borderColor: theme.inputBorderColor }]}>
            {field.options?.map(option => {
              const isSelected = selectedValues.includes(option.value);
              return (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.option,
                    { backgroundColor: isSelected ? theme.primaryColor + '10' : 'transparent' }
                  ]}
                  onPress={() => {
                    const newValues = isSelected
                      ? selectedValues.filter(v => v !== option.value)
                      : [...selectedValues, option.value];
                    onChange(newValues);
                  }}
                >
                  <Text style={[
                    styles.optionText,
                    { color: isSelected ? theme.primaryColor : theme.inputTextColor }
                  ]}>
                    {option.label}
                  </Text>
                  {isSelected && (
                    <Check size={16} color={theme.primaryColor} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>
    );
  };

  const renderRadio = () => {
    return (
      <View style={styles.radioContainer}>
        {field.options?.map(option => (
          <TouchableOpacity
            key={option.value}
            style={styles.radioOption}
            onPress={() => !isDisabled && onChange(option.value)}
            disabled={isDisabled}
          >
            <View style={[
              styles.radioCircle,
              { borderColor: theme.inputBorderColor },
              value === option.value && { backgroundColor: theme.primaryColor, borderColor: theme.primaryColor }
            ]}>
              {value === option.value && (
                <View style={[styles.radioInner, { backgroundColor: theme.buttonTextColor }]} />
              )}
            </View>
            <Text style={[styles.radioLabel, { color: theme.inputTextColor }]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderCheckbox = () => {
    const isChecked = Boolean(value);
    
    return (
      <TouchableOpacity
        style={styles.checkboxContainer}
        onPress={() => !isDisabled && onChange(!isChecked)}
        disabled={isDisabled}
      >
        <View style={[
          styles.checkbox,
          { borderColor: theme.inputBorderColor },
          isChecked && { backgroundColor: theme.primaryColor, borderColor: theme.primaryColor }
        ]}>
          {isChecked && (
            <Check size={14} color={theme.buttonTextColor} />
          )}
        </View>
        <Text style={[styles.checkboxLabel, { color: theme.inputTextColor }]}>
          {field.label}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderSwitch = () => {
    const isOn = Boolean(value);
    
    return (
      <TouchableOpacity
        style={styles.switchContainer}
        onPress={() => !isDisabled && onChange(!isOn)}
        disabled={isDisabled}
      >
        <Text style={[styles.switchLabel, { color: theme.inputTextColor }]}>
          {field.label}
        </Text>
        <View style={[
          styles.switch,
          { backgroundColor: isOn ? theme.primaryColor : theme.inputBorderColor }
        ]}>
          <View style={[
            styles.switchThumb,
            { backgroundColor: theme.buttonTextColor },
            isOn && styles.switchThumbOn
          ]} />
        </View>
      </TouchableOpacity>
    );
  };

  const renderField = () => {
    switch (field.type) {
      case 'select':
        return renderSelect();
      case 'multiselect':
        return renderMultiSelect();
      case 'radio':
        return renderRadio();
      case 'checkbox':
        return renderCheckbox();
      case 'switch':
        return renderSwitch();
      default:
        return renderTextInput();
    }
  };

  const showLabel = field.type !== 'checkbox' && field.type !== 'switch';

  return (
    <View style={styles.fieldContainer}>
      {showLabel && (
        <Text style={labelStyle}>
          {field.label}
          {field.required && <Text style={{ color: theme.errorColor }}> *</Text>}
        </Text>
      )}
      {renderField()}
      {error && <Text style={errorStyle}>{error}</Text>}
    </View>
  );
};

const checkFieldVisibility = (field: FormField, formData: any): boolean => {
  if (!field.dependencies) return true;
  
  return field.dependencies.every(dep => {
    const depValue = formData[dep.field];
    const shouldShow = depValue === dep.value;
    return dep.action === 'show' ? shouldShow : !shouldShow;
  });
};

const checkFieldDisability = (field: FormField, formData: any): boolean => {
  if (!field.dependencies) return false;
  
  return field.dependencies.some(dep => {
    const depValue = formData[dep.field];
    const shouldDisable = depValue === dep.value;
    return dep.action === 'disable' ? shouldDisable : dep.action === 'enable' ? !shouldDisable : false;
  });
};

const styles = StyleSheet.create({
  fieldContainer: {
    marginBottom: 16,
  },
  selectContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionsContainer: {
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 4,
    backgroundColor: '#FFFFFF',
    maxHeight: 200,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  optionText: {
    fontSize: 16,
    flex: 1,
  },
  radioContainer: {
    gap: 12,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  radioLabel: {
    fontSize: 16,
    flex: 1,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxLabel: {
    fontSize: 16,
    flex: 1,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  switchLabel: {
    fontSize: 16,
    flex: 1,
  },
  switch: {
    width: 50,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  switchThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  switchThumbOn: {
    transform: [{ translateX: 22 }],
  },
});