import AsyncStorage from '@react-native-async-storage/async-storage';
import { FormConfig } from '@/types/formTypes';

const STORAGE_KEY = 'json_form_configs';

export interface StoredFormConfig extends FormConfig {
  isCustom: boolean;
  createdAt: string;
  updatedAt: string;
}

export class FormConfigStorage {
  static async getAllConfigs(): Promise<StoredFormConfig[]> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading configs:', error);
      return [];
    }
  }

  static async saveConfig(config: StoredFormConfig): Promise<void> {
    try {
      const configs = await this.getAllConfigs();
      const existingIndex = configs.findIndex(c => c.id === config.id);
      
      if (existingIndex >= 0) {
        configs[existingIndex] = { ...config, updatedAt: new Date().toISOString() };
      } else {
        configs.push({
          ...config,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
      
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(configs));
    } catch (error) {
      console.error('Error saving config:', error);
      throw error;
    }
  }

  static async deleteConfig(id: string): Promise<void> {
    try {
      const configs = await this.getAllConfigs();
      const filtered = configs.filter(c => c.id !== id);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting config:', error);
      throw error;
    }
  }

  static async getConfig(id: string): Promise<StoredFormConfig | null> {
    try {
      const configs = await this.getAllConfigs();
      return configs.find(c => c.id === id) || null;
    } catch (error) {
      console.error('Error getting config:', error);
      return null;
    }
  }

  static generateId(): string {
    return `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}