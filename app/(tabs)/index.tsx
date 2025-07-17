import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Play } from 'lucide-react-native';

const testCases = [
  {
    id: 'corporate',
    title: 'Corporate Form',
    description: 'Professional business form with validation',
    color: '#1E40AF',
    backgroundColor: '#EBF4FF',
  },
  {
    id: 'creative',
    title: 'Creative Form',
    description: 'Colorful design form with groups',
    color: '#7C3AED',
    backgroundColor: '#F3E8FF',
  },
  {
    id: 'medical',
    title: 'Medical Form',
    description: 'Healthcare form with wizard steps',
    color: '#059669',
    backgroundColor: '#ECFDF5',
  },
  {
    id: 'ecommerce',
    title: 'E-commerce Form',
    description: 'Shopping form with custom styling',
    color: '#DC2626',
    backgroundColor: '#FEF2F2',
  },
];

export default function HomeScreen() {
  const handleTestCase = (testCase: any) => {
    router.push({
      pathname: '/form',
      params: { testCase: testCase.id }
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>JSON Form Testing</Text>
        <Text style={styles.subtitle}>
          Conceptual testing app for JSON-based forms
        </Text>
      </View>

      <View style={styles.testCases}>
        {testCases.map((testCase) => (
          <TouchableOpacity
            key={testCase.id}
            style={[
              styles.testCaseCard,
              { backgroundColor: testCase.backgroundColor }
            ]}
            onPress={() => handleTestCase(testCase)}
          >
            <View style={styles.testCaseHeader}>
              <Text style={[styles.testCaseTitle, { color: testCase.color }]}>
                {testCase.title}
              </Text>
              <Play size={20} color={testCase.color} />
            </View>
            <Text style={styles.testCaseDescription}>
              {testCase.description}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.info}>
        <Text style={styles.infoTitle}>Features Supported:</Text>
        <Text style={styles.infoText}>
          • Complete JSON form configuration{'\n'}
          • Custom branding and styling{'\n'}
          • Groups and wizard steps{'\n'}
          • Dynamic validation rules{'\n'}
          • Banners and alerts{'\n'}
          • Custom endpoints and methods{'\n'}
          • Extensible architecture
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
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
  testCases: {
    padding: 16,
    gap: 16,
  },
  testCaseCard: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  testCaseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  testCaseTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  testCaseDescription: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
  info: {
    margin: 16,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
});