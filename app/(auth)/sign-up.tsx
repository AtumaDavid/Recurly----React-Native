import { Link } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';

export default function SignUp() {
  return (
    <View>
      <Text>sign-up</Text>
      <Link href="/(auth)/sign-in">
        <Text>Already have an account? Sign In</Text>
      </Link>
    </View>
  );
}
