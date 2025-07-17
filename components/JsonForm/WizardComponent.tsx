import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { WizardStep, FormTheme } from '@/types/formTypes';
import { FormGroupComponent } from './FormGroupComponent';

interface WizardComponentProps {
  steps: WizardStep[];
  currentStep: number;
  onStepChange: (step: number) => void;
  formData: any;
  errors: { [key: string]: string };
  touchedFields: Set<string>;
  theme: FormTheme;
  onFieldChange: (fieldId: string, value: any) => void;
  onFieldBlur: (fieldId: string) => void;
  onSubmit: () => void;
  submitButtonText?: string;
}

export const WizardComponent: React.FC<WizardComponentProps> = ({
  steps,
  currentStep,
  onStepChange,
  formData,
  errors,
  touchedFields,
  theme,
  onFieldChange,
  onFieldBlur,
  onSubmit,
  submitButtonText = 'Submit',
}) => {
  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  const canGoNext = () => {
    if (step.canGoNext) {
      return step.canGoNext(formData);
    }
    
    // Default validation: check if all required fields in current step are filled
    const stepFields = step.groups.flatMap(group => group.fields);
    const requiredFields = stepFields.filter(field => field.required);
    
    return requiredFields.every(field => {
      const value = formData[field.id];
      return value !== undefined && value !== null && value !== '';
    });
  };

  const handleNext = () => {
    if (isLastStep) {
      onSubmit();
    } else if (canGoNext()) {
      onStepChange(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      onStepChange(currentStep - 1);
    }
  };

  const renderProgressBar = () => {
    return (
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          {steps.map((_, index) => (
            <View
              key={index}
              style={[
                styles.progressStep,
                {
                  backgroundColor: index <= currentStep ? theme.primaryColor : theme.inputBorderColor,
                }
              ]}
            />
          ))}
        </View>
        <Text style={[styles.progressText, { color: theme.inputTextColor }]}>
          Step {currentStep + 1} of {steps.length}
        </Text>
      </View>
    );
  };

  const renderStepHeader = () => {
    return (
      <View style={styles.stepHeader}>
        <Text style={[styles.stepTitle, { color: theme.inputTextColor }]}>
          {step.title}
        </Text>
        {step.subtitle && (
          <Text style={[styles.stepSubtitle, { color: theme.subtitleColor }]}>
            {step.subtitle}
          </Text>
        )}
      </View>
    );
  };

  const renderStepContent = () => {
    return (
      <View style={styles.stepContent}>
        {step.groups.map(group => (
          <FormGroupComponent
            key={group.id}
            group={group}
            formData={formData}
            errors={errors}
            touchedFields={touchedFields}
            theme={theme}
            onFieldChange={onFieldChange}
            onFieldBlur={onFieldBlur}
          />
        ))}
      </View>
    );
  };

  const renderNavigationButtons = () => {
    const buttonStyle = {
      backgroundColor: theme.buttonBackgroundColor,
      borderRadius: theme.buttonBorderRadius,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      minWidth: 100,
    };

    const buttonTextStyle = {
      color: theme.buttonTextColor,
      fontSize: 16,
      fontWeight: '600' as const,
      textAlign: 'center' as const,
    };

    const disabledButtonStyle = {
      backgroundColor: theme.inputBorderColor,
    };

    const disabledTextStyle = {
      color: theme.inputTextColor + '60',
    };

    return (
      <View style={styles.navigationContainer}>
        <TouchableOpacity
          style={[
            buttonStyle,
            { backgroundColor: 'transparent', borderWidth: 1, borderColor: theme.buttonBackgroundColor },
            isFirstStep && disabledButtonStyle
          ]}
          onPress={handlePrevious}
          disabled={isFirstStep}
        >
          <View style={styles.buttonContent}>
            <ChevronLeft size={16} color={isFirstStep ? theme.inputTextColor + '60' : theme.buttonBackgroundColor} />
            <Text style={[
              { ...buttonTextStyle, color: theme.buttonBackgroundColor },
              isFirstStep && disabledTextStyle
            ]}>
              {step.previousButtonText || 'Previous'}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            buttonStyle,
            !canGoNext() && disabledButtonStyle
          ]}
          onPress={handleNext}
          disabled={!canGoNext()}
        >
          <View style={styles.buttonContent}>
            <Text style={[
              buttonTextStyle,
              !canGoNext() && disabledTextStyle
            ]}>
              {isLastStep ? submitButtonText : (step.nextButtonText || 'Next')}
            </Text>
            {!isLastStep && (
              <ChevronRight size={16} color={canGoNext() ? theme.buttonTextColor : theme.inputTextColor + '60'} />
            )}
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderProgressBar()}
      {renderStepHeader()}
      {renderStepContent()}
      {renderNavigationButtons()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  progressContainer: {
    padding: 16,
    alignItems: 'center',
  },
  progressBar: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  progressStep: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
  },
  stepHeader: {
    padding: 16,
    paddingBottom: 8,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  stepSubtitle: {
    fontSize: 16,
    lineHeight: 24,
  },
  stepContent: {
    flex: 1,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    gap: 16,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
});