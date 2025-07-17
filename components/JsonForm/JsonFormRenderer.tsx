import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { FormConfig, FormGroup, WizardStep } from '@/types/formTypes';
import { FormBannerComponent } from './FormBannerComponent';
import { FormGroupComponent } from './FormGroupComponent';
import { WizardComponent } from './WizardComponent';
import { FormActionsComponent } from './FormActionsComponent';
import { FormValidator } from './FormValidator';

interface JsonFormRendererProps {
  config: FormConfig;
  onSubmit: (data: any) => void;
  onChange: (data: any) => void;
  data: any;
}

export const JsonFormRenderer: React.FC<JsonFormRendererProps> = ({
  config,
  onSubmit,
  onChange,
  data,
}) => {
  const [formData, setFormData] = useState<any>(data || {});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  const validator = new FormValidator(config);

  useEffect(() => {
    setFormData(data || {});
  }, [data]);

  const handleFieldChange = (fieldId: string, value: any) => {
    const newData = { ...formData, [fieldId]: value };
    setFormData(newData);
    onChange(newData);

    // Clear error when field is corrected
    if (errors[fieldId]) {
      const newErrors = { ...errors };
      delete newErrors[fieldId];
      setErrors(newErrors);
    }
  };

  const handleFieldBlur = (fieldId: string) => {
    setTouchedFields(new Set([...touchedFields, fieldId]));
    
    // Validate field on blur
    const field = getAllFields().find(f => f.id === fieldId);
    if (field) {
      const fieldError = validator.validateField(field, formData[fieldId], formData);
      if (fieldError) {
        setErrors({ ...errors, [fieldId]: fieldError });
      }
    }
  };

  const getAllFields = () => {
    if (config.type === 'wizard' && config.steps) {
      return config.steps.flatMap(step => 
        step.groups.flatMap(group => group.fields)
      );
    }
    return config.groups?.flatMap(group => group.fields) || [];
  };

  const handleSubmit = () => {
    const allFields = getAllFields();
    const validationErrors = validator.validateForm(allFields, formData);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // Mark all fields as touched to show errors
      const allFieldIds = allFields.map(f => f.id);
      setTouchedFields(new Set(allFieldIds));
      return;
    }

    setErrors({});
    onSubmit(formData);
  };

  const handleReset = () => {
    setFormData({});
    setErrors({});
    setTouchedFields(new Set());
    setCurrentStep(0);
    onChange({});
  };

  const renderBanners = () => {
    if (!config.banners) return null;

    return config.banners.map(banner => (
      <FormBannerComponent
        key={banner.id}
        banner={banner}
        theme={config.theme}
      />
    ));
  };

  const renderForm = () => {
    if (config.type === 'wizard' && config.steps) {
      return (
        <WizardComponent
          steps={config.steps}
          currentStep={currentStep}
          onStepChange={setCurrentStep}
          formData={formData}
          errors={errors}
          touchedFields={touchedFields}
          theme={config.theme}
          onFieldChange={handleFieldChange}
          onFieldBlur={handleFieldBlur}
          onSubmit={handleSubmit}
          submitButtonText={config.submitButtonText}
        />
      );
    }

    return (
      <View>
        {config.groups?.map(group => (
          <FormGroupComponent
            key={group.id}
            group={group}
            formData={formData}
            errors={errors}
            touchedFields={touchedFields}
            theme={config.theme}
            onFieldChange={handleFieldChange}
            onFieldBlur={handleFieldBlur}
          />
        ))}
        
        <FormActionsComponent
          theme={config.theme}
          onSubmit={handleSubmit}
          onReset={handleReset}
          submitButtonText={config.submitButtonText}
          resetButtonText={config.resetButtonText}
          showResetButton={config.showResetButton}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderBanners()}
      {renderForm()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});