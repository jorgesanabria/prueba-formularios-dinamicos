import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Alert, 
  StyleSheet,
  Modal,
  SafeAreaView
} from 'react-native';
import { Plus, CreditCard as Edit3, Trash2, Copy, Save, X, FileText, Eye, Code } from 'lucide-react-native';
import { FormConfigStorage, StoredFormConfig } from '@/services/FormConfigStorage';
import { getFormConfig } from '@/config/formConfigs';
import { FormConfig } from '@/types/formTypes';
import { router } from 'expo-router';

const presetConfigs = ['corporate', 'creative', 'medical', 'ecommerce'];

export default function EditorScreen() {
  const [configs, setConfigs] = useState<StoredFormConfig[]>([]);
  const [showEditor, setShowEditor] = useState(false);
  const [editingConfig, setEditingConfig] = useState<StoredFormConfig | null>(null);
  const [jsonText, setJsonText] = useState('');
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConfigs();
  }, []);

  const loadConfigs = async () => {
    try {
      const stored = await FormConfigStorage.getAllConfigs();
      setConfigs(stored);
    } catch (error) {
      Alert.alert('Error', 'Failed to load configurations');
    } finally {
      setLoading(false);
    }
  };

  const createNewConfig = () => {
    const newConfig: StoredFormConfig = {
      id: FormConfigStorage.generateId(),
      title: 'New Form',
      subtitle: 'Custom form configuration',
      type: 'simple',
      theme: {
        primaryColor: '#3B82F6',
        secondaryColor: '#60A5FA',
        backgroundColor: '#F8FAFC',
        headerBackgroundColor: '#3B82F6',
        headerTextColor: '#FFFFFF',
        subtitleColor: '#CBD5E1',
        buttonBackgroundColor: '#3B82F6',
        buttonTextColor: '#FFFFFF',
        buttonBorderRadius: 8,
        inputBackgroundColor: '#FFFFFF',
        inputBorderColor: '#D1D5DB',
        inputTextColor: '#374151',
        inputBorderRadius: 8,
        errorColor: '#DC2626',
        successColor: '#059669',
        warningColor: '#D97706',
        infoColor: '#0284C7',
        spacing: {
          xs: 4,
          sm: 8,
          md: 16,
          lg: 24,
          xl: 32,
        },
      },
      endpoint: '/api/form/submit',
      method: 'POST',
      groups: [
        {
          id: 'basic',
          title: 'Basic Information',
          fields: [
            {
              id: 'name',
              type: 'text',
              label: 'Name',
              placeholder: 'Enter your name',
              required: true,
              validation: [
                { type: 'required', message: 'Name is required' }
              ]
            }
          ]
        }
      ],
      submitButtonText: 'Submit',
      isCustom: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setEditingConfig(newConfig);
    setJsonText(JSON.stringify(newConfig, null, 2));
    setJsonError(null);
    setShowEditor(true);
  };

  const copyPresetConfig = (presetId: string) => {
    const preset = getFormConfig(presetId);
    const newConfig: StoredFormConfig = {
      ...preset,
      id: FormConfigStorage.generateId(),
      title: `${preset.title} (Copy)`,
      isCustom: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setEditingConfig(newConfig);
    setJsonText(JSON.stringify(newConfig, null, 2));
    setJsonError(null);
    setShowEditor(true);
  };

  const editConfig = (config: StoredFormConfig) => {
    setEditingConfig(config);
    setJsonText(JSON.stringify(config, null, 2));
    setJsonError(null);
    setShowEditor(true);
  };

  const deleteConfig = (config: StoredFormConfig) => {
    Alert.alert(
      'Delete Configuration',
      `Are you sure you want to delete "${config.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await FormConfigStorage.deleteConfig(config.id);
              await loadConfigs();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete configuration');
            }
          },
        },
      ]
    );
  };

  const validateAndSaveConfig = async () => {
    try {
      const parsed = JSON.parse(jsonText);
      
      // Basic validation
      if (!parsed.id || !parsed.title || !parsed.type || !parsed.theme) {
        throw new Error('Missing required fields: id, title, type, or theme');
      }

      const configToSave: StoredFormConfig = {
        ...parsed,
        isCustom: true,
        updatedAt: new Date().toISOString(),
        createdAt: editingConfig?.createdAt || new Date().toISOString(),
      };

      await FormConfigStorage.saveConfig(configToSave);
      await loadConfigs();
      setShowEditor(false);
      setEditingConfig(null);
      setJsonError(null);
      
      Alert.alert('Success', 'Configuration saved successfully');
    } catch (error) {
      if (error instanceof SyntaxError) {
        setJsonError('Invalid JSON syntax');
      } else {
        setJsonError(error instanceof Error ? error.message : 'Validation error');
      }
    }
  };

  const testConfig = () => {
    if (!editingConfig) return;
    
    try {
      const parsed = JSON.parse(jsonText);
      router.push({
        pathname: '/form',
        params: { 
          testCase: 'custom',
          customConfig: JSON.stringify(parsed)
        }
      });
    } catch (error) {
      Alert.alert('Error', 'Invalid JSON configuration');
    }
  };

  const renderConfigCard = (config: StoredFormConfig | string, isPreset: boolean = false) => {
    if (typeof config === 'string') {
      // Preset config
      const preset = getFormConfig(config);
      return (
        <View key={config} style={[styles.configCard, { borderColor: preset.theme.primaryColor }]}>
          <View style={styles.configHeader}>
            <View style={styles.configInfo}>
              <Text style={styles.configTitle}>{preset.title}</Text>
              <Text style={styles.configSubtitle}>Preset • {preset.type}</Text>
            </View>
            <View style={[styles.colorIndicator, { backgroundColor: preset.theme.primaryColor }]} />
          </View>
          
          <View style={styles.configActions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.copyButton]}
              onPress={() => copyPresetConfig(config)}
            >
              <Copy size={16} color="#6B7280" />
              <Text style={styles.actionButtonText}>Copy</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.actionButton, styles.testButton]}
              onPress={() => router.push({
                pathname: '/form',
                params: { testCase: config }
              })}
            >
              <Eye size={16} color="#3B82F6" />
              <Text style={[styles.actionButtonText, { color: '#3B82F6' }]}>Test</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    // Custom config
    return (
      <View key={config.id} style={[styles.configCard, { borderColor: config.theme.primaryColor }]}>
        <View style={styles.configHeader}>
          <View style={styles.configInfo}>
            <Text style={styles.configTitle}>{config.title}</Text>
            <Text style={styles.configSubtitle}>
              Custom • {config.type} • {new Date(config.updatedAt).toLocaleDateString()}
            </Text>
          </View>
          <View style={[styles.colorIndicator, { backgroundColor: config.theme.primaryColor }]} />
        </View>
        
        <View style={styles.configActions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={() => editConfig(config)}
          >
            <Edit3 size={16} color="#059669" />
            <Text style={[styles.actionButtonText, { color: '#059669' }]}>Edit</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.testButton]}
            onPress={() => router.push({
              pathname: '/form',
              params: { 
                testCase: 'custom',
                customConfig: JSON.stringify(config)
              }
            })}
          >
            <Eye size={16} color="#3B82F6" />
            <Text style={[styles.actionButtonText, { color: '#3B82F6' }]}>Test</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => deleteConfig(config)}
          >
            <Trash2 size={16} color="#DC2626" />
            <Text style={[styles.actionButtonText, { color: '#DC2626' }]}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderEditor = () => (
    <Modal visible={showEditor} animationType="slide" presentationStyle="fullScreen">
      <SafeAreaView style={styles.editorContainer}>
        <View style={styles.editorHeader}>
          <View style={styles.editorHeaderLeft}>
            <Code size={24} color="#374151" />
            <Text style={styles.editorTitle}>
              {editingConfig?.isCustom ? 'Edit' : 'Create'} Configuration
            </Text>
          </View>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => {
              setShowEditor(false);
              setEditingConfig(null);
              setJsonError(null);
            }}
          >
            <X size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.editorContent}>
          <View style={styles.editorActions}>
            <TouchableOpacity
              style={[styles.editorActionButton, styles.saveButton]}
              onPress={validateAndSaveConfig}
            >
              <Save size={16} color="#FFFFFF" />
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.editorActionButton, styles.testConfigButton]}
              onPress={testConfig}
            >
              <Eye size={16} color="#3B82F6" />
              <Text style={[styles.testConfigButtonText]}>Test</Text>
            </TouchableOpacity>
          </View>

          {jsonError && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{jsonError}</Text>
            </View>
          )}

          <TextInput
            style={styles.jsonEditor}
            value={jsonText}
            onChangeText={(text) => {
              setJsonText(text);
              setJsonError(null);
            }}
            multiline
            placeholder="Enter JSON configuration..."
            placeholderTextColor="#9CA3AF"
            autoCapitalize="none"
            autoCorrect={false}
            spellCheck={false}
          />
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading configurations...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>JSON Form Editor</Text>
        <Text style={styles.subtitle}>
          Create and manage form configurations
        </Text>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Create New</Text>
          <TouchableOpacity
            style={styles.createButton}
            onPress={createNewConfig}
          >
            <Plus size={20} color="#FFFFFF" />
            <Text style={styles.createButtonText}>New Form</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preset Configurations</Text>
        <Text style={styles.sectionDescription}>
          Copy these presets to create custom configurations
        </Text>
        <View style={styles.configList}>
          {presetConfigs.map(config => renderConfigCard(config, true))}
        </View>
      </View>

      {configs.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Custom Configurations</Text>
          <Text style={styles.sectionDescription}>
            Your custom form configurations
          </Text>
          <View style={styles.configList}>
            {configs.map(config => renderConfigCard(config, false))}
          </View>
        </View>
      )}

      {renderEditor()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
  header: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    lineHeight: 24,
  },
  section: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 16,
    lineHeight: 20,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  configList: {
    gap: 12,
  },
  configCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    padding: 16,
  },
  configHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  configInfo: {
    flex: 1,
  },
  configTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  configSubtitle: {
    fontSize: 14,
    color: '#64748B',
  },
  colorIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginLeft: 12,
  },
  configActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    gap: 4,
  },
  copyButton: {
    borderColor: '#D1D5DB',
    backgroundColor: '#F9FAFB',
  },
  editButton: {
    borderColor: '#A7F3D0',
    backgroundColor: '#ECFDF5',
  },
  testButton: {
    borderColor: '#BFDBFE',
    backgroundColor: '#EFF6FF',
  },
  deleteButton: {
    borderColor: '#FECACA',
    backgroundColor: '#FEF2F2',
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  editorContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  editorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },
  editorHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  editorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
  },
  closeButton: {
    padding: 8,
  },
  editorContent: {
    flex: 1,
  },
  editorActions: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },
  editorActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  saveButton: {
    backgroundColor: '#059669',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  testConfigButton: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  testConfigButtonText: {
    color: '#3B82F6',
    fontSize: 14,
    fontWeight: '600',
  },
  errorContainer: {
    margin: 16,
    padding: 12,
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: '500',
  },
  jsonEditor: {
    margin: 16,
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    fontSize: 14,
    fontFamily: 'monospace',
    color: '#374151',
    minHeight: 400,
    textAlignVertical: 'top',
  },
});