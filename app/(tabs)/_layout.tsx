import { Tabs } from 'expo-router';
import { Chrome as Home, TestTube, Code } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#999',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ size, color }) => (
            <Home size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="form"
        options={{
          title: 'Form Test',
          tabBarIcon: ({ size, color }) => (
            <TestTube size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="editor"
        options={{
          title: 'Editor',
          tabBarIcon: ({ size, color }) => (
            <Code size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}