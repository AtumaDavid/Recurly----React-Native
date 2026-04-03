import '@/global.css';
import { Link } from 'expo-router';
import { Text, View } from 'react-native';

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Text className="text-xl font-bold text-success">
        Welcome to Nativewind!
      </Text>
      <Link
        href="/onboarding"
        className="mt-4 rounded-lg bg-primary text-white px-4 py-2"
      >
        <Text className="text-lg font-bold text-accent">Get Started</Text>
      </Link>
      <Link
        href="/(auth)/sign-in"
        className="mt-4 rounded-lg bg-secondary text-white px-4 py-2"
      >
        <Text className="text-lg font-bold text-accent">Sign In</Text>
      </Link>
      <Link
        href="/(auth)/sign-up"
        className="mt-4 rounded-lg bg-tertiary text-white px-4 py-2"
      >
        <Text className="text-lg font-bold text-accent">Sign Up</Text>
      </Link>

      <Link
        href={{
          pathname: '/(tabs)/subscriptions/[id]',
          params: { id: 'claude' },
        }}
      >
        claude Subscriptions
      </Link>
    </View>
  );
}
