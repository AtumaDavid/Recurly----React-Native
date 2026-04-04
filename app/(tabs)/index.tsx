import '@/global.css';
import { Link } from 'expo-router';
import { styled } from 'nativewind';
import { Text } from 'react-native';
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context';

const SafeAreaView = styled(RNSafeAreaView);

export default function App() {
  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <Text className="text-5xl font-sans-bold text-primary">Home </Text>
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

      {/* <Link
        href={{
          pathname: '/(tabs)/subscriptions/[id]',
          params: { id: 'claude' },
        }}
      >
        claude Subscriptions
      </Link> */}
    </SafeAreaView>
  );
}
