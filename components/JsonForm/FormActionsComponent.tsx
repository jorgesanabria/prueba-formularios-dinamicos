import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Send, RotateCcw } from 'lucide-react-native';
import { FormTheme } from '@/types/formTypes';

interface FormActionsComponentProps {
  theme: FormTheme;
  onSubmit: () => void;
  onReset: () => void;
  submitButtonText?: string;
  resetButtonText?: string;
  showResetButton?: boolean;
}

export const FormActionsComponent: React.FC<FormActionsComponentProps> = ({
  theme,
  onSubmit,
  onReset,
  submitButtonText = 'Submit',
  resetButtonText = 'Reset',
  showResetButton = false,
}) => {
  const submitButtonStyle = {
    backgroundColor: theme.buttonBackgroundColor,
    borderRadius: theme.buttonBorderRadius,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    flex: showResetButton ? 1 : undefined,
    minWidth: showResetButton ? undefined : 200,
  };

  const resetButtonStyle = {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.buttonBackgroundColor,
    borderRadius: theme.buttonBorderRadius,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    flex: 1,
  };

  const submitButtonTextStyle = {
    color: theme.buttonTextColor,
    fontSize: 16,
    fontWeight: '600' as const,
    textAlign: 'center' as const,
  };

  const resetButtonTextStyle = {
    color: theme.buttonBackgroundColor,
    fontSize: 16,
    fontWeight: '600' as const,
    textAlign: 'center' as const,
  };

  return (
    <View style={[styles.container, { padding: theme.spacing.lg }]}>
      <View style={[styles.buttonsContainer, { gap: theme.spacing.md }]}>
        {showResetButton && (
          <TouchableOpacity
            style={resetButtonStyle}
            onPress={onReset}
          >
            <View style={styles.buttonContent}>
              <RotateCcw size={16} color={theme.buttonBackgroundColor} />
              <Text style={resetButtonTextStyle}>{resetButtonText}</Text>
            </View>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity
          style={submitButtonStyle}
          onPress={onSubmit}
        >
          <View style={styles.buttonContent}>
            <Send size={16} color={theme.buttonTextColor} />
            <Text style={submitButtonTextStyle}>{submitButtonText}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
});