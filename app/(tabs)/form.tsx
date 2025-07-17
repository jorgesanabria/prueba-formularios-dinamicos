import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native';
import { JsonFormRenderer } from '@/components/JsonForm/JsonFormRenderer';
import { getFormConfig } from '@/config/formConfigs';
import { FormConfigStorage } from '@/services/FormConfigStorage';
import { FormConfig } from '@/types/formTypes';

export default function FormScreen() {
  const { testCase, customConfig } = useLocalSearchParams<{ 
    testCase: string; 
    customConfig?: string; 
  }>();
  const [formConfig, setFormConfig] = useState<FormConfig | null>(null);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    const loadConfig = async () => {
      if (customConfig) {
        try {
          const parsed = JSON.parse(customConfig);
          setFormConfig(parsed);
          setFormData({});
        } catch (error) {
          console.error('Error parsing custom config:', error);
          Alert.alert('Error', 'Invalid custom configuration');
          router.back();
        }
      } else if (testCase) {
        if (testCase === 'custom') {
          Alert.alert('Error', 'Custom configuration required');
          router.back();
          return;
        }
        
        const config = getFormConfig(testCase);
        setFormConfig(config);
        setFormData({});
      }
    };

    loadConfig();
  }, [testCase, customConfig]);

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push('/');
    }
  };

  const handleFormSubmit = async (data: any) => {
    if (!formConfig) return;

    // Simulate API call
    console.log('Submitting form:', data);
    console.log('Endpoint:', formConfig.endpoint);
    console.log('Method:', formConfig.method);

    // Show success alert
    Alert.alert(
      'Form Submitted',
      `Data submitted successfully!\n\nEndpoint: ${formConfig.endpoint}\nMethod: ${formConfig.method}`,
      [{ text: 'OK' }]
    );
  };

  const handleFormChange = (data: any) => {
    setFormData(data);
  };

  if (!formConfig) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>No form configuration found</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: formConfig.theme.backgroundColor }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.header, { backgroundColor: formConfig.theme.headerBackgroundColor }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleGoBack}
        >
          <ArrowLeft size={24} color={formConfig.theme.headerTextColor} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: formConfig.theme.headerTextColor }]}>
          {formConfig.title}
        </Text>
        {formConfig.subtitle && (
          <Text style={[styles.subtitle, { color: formConfig.theme.subtitleColor }]}>
            {formConfig.subtitle}
          </Text>
        )}
      </View>

      <JsonFormRenderer
        config={formConfig}
        onSubmit={handleFormSubmit}
        onChange={handleFormChange}
        data={formData}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 24,
    paddingTop: 60,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 24,
    zIndex: 1,
    padding: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    paddingLeft: 40,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    paddingLeft: 40,
  },
  error: {
    fontSize: 16,
    color: '#DC2626',
    textAlign: 'center',
    marginTop: 100,
  },
});