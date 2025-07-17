import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import { FormGroup, FormTheme } from '@/types/formTypes';
import { FormFieldComponent } from './FormFieldComponent';

interface FormGroupComponentProps {
  group: FormGroup;
  formData: any;
  errors: { [key: string]: string };
  touchedFields: Set<string>;
  theme: FormTheme;
  onFieldChange: (fieldId: string, value: any) => void;
  onFieldBlur: (fieldId: string) => void;
}

export const FormGroupComponent: React.FC<FormGroupComponentProps> = ({
  group,
  formData,
  errors,
  touchedFields,
  theme,
  onFieldChange,
  onFieldBlur,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(group.defaultCollapsed || false);

  const groupStyle = {
    backgroundColor: group.style?.backgroundColor || theme.inputBackgroundColor,
    borderColor: group.style?.borderColor || theme.inputBorderColor,
    borderWidth: group.style?.borderWidth || 1,
    borderRadius: group.style?.borderRadius || theme.inputBorderRadius,
    padding: group.style?.padding || theme.spacing.md,
    margin: group.style?.margin || theme.spacing.md,
  };

  const titleStyle = {
    color: group.style?.titleColor || theme.inputTextColor,
    fontSize: group.style?.titleFontSize || 18,
    fontWeight: (group.style?.titleFontWeight || '600') as any,
    marginBottom: group.subtitle ? theme.spacing.xs : theme.spacing.sm,
  };

  const subtitleStyle = {
    color: group.style?.titleColor || theme.subtitleColor,
    fontSize: 14,
    marginBottom: theme.spacing.sm,
    opacity: 0.8,
  };

  const handleToggleCollapse = () => {
    if (group.collapsible) {
      setIsCollapsed(!isCollapsed);
    }
  };

  return (
    <View style={[styles.group, groupStyle]}>
      <TouchableOpacity
        style={styles.header}
        onPress={handleToggleCollapse}
        disabled={!group.collapsible}
        activeOpacity={group.collapsible ? 0.7 : 1}
      >
        <View style={styles.headerContent}>
          <Text style={titleStyle}>{group.title}</Text>
          {group.collapsible && (
            <View style={styles.collapseIcon}>
              {isCollapsed ? (
                <ChevronDown size={20} color={group.style?.titleColor || theme.inputTextColor} />
              ) : (
                <ChevronUp size={20} color={group.style?.titleColor || theme.inputTextColor} />
              )}
            </View>
          )}
        </View>
        {group.subtitle && (
          <Text style={subtitleStyle}>{group.subtitle}</Text>
        )}
      </TouchableOpacity>

      {!isCollapsed && (
        <View style={styles.fields}>
          {group.fields.map(field => (
            <FormFieldComponent
              key={field.id}
              field={field}
              value={formData[field.id]}
              error={touchedFields.has(field.id) ? errors[field.id] : undefined}
              theme={theme}
              formData={formData}
              onChange={(value) => onFieldChange(field.id, value)}
              onBlur={() => onFieldBlur(field.id)}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  group: {
    marginBottom: 8,
  },
  header: {
    marginBottom: 8,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  collapseIcon: {
    padding: 4,
  },
  fields: {
    gap: 12,
  },
});