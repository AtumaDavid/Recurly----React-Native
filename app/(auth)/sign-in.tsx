import AuthField from '@/components/auth/AuthField';
import BrandBlock from '@/components/auth/BrandBlock';
import { colors } from '@/constants/theme';
import { useSignIn } from '@clerk/expo';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SignIn() {
  const { signIn, errors, fetchStatus } = useSignIn();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  const isFetching = fetchStatus === 'fetching';
  const signInButtonLabel = isFetching ? 'Loading...' : 'Sign in';

  if (!signIn) {
    return (
      <SafeAreaView style={s.safe}>
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          <Text style={s.helper}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleSignIn = async () => {
    const { error } = await signIn.password({ identifier: email, password });
    if (error) return;
    // await signIn.finalize({
    //   navigate: () => {
    //     router.replace('/(tabs)' as Href);
    //   },
    // });
    if (signIn.status === 'complete') {
      await signIn.finalize();
      return;
    }

    if (signIn.status === 'needs_client_trust') {
      await signIn.mfa.sendEmailCode();
      return;
    }

    if (signIn.status === 'needs_second_factor') {
      // render the follow-up verification step here
      return;
    }
  };

  return (
    <SafeAreaView style={s.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={s.content}
          keyboardShouldPersistTaps="handled"
        >
          <BrandBlock />
          <View style={{ marginTop: 32, alignItems: 'center' }}>
            <Text style={[s.title, { textAlign: 'center' }]}>Welcome back</Text>
            <Text style={s.subtitle}>
              Sign in to continue managing your subscriptions
            </Text>
          </View>
          <View style={s.card}>
            <View style={s.form}>
              <AuthField
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
                error={errors?.fields?.identifier?.message}
              />
              <AuthField
                label="Password"
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                secureTextEntry={!passwordVisible}
                autoComplete="current-password"
                error={errors?.fields?.password?.message}
                rightElement={
                  <Pressable
                    onPress={() => setPasswordVisible((v) => !v)}
                    hitSlop={8}
                  >
                    <Ionicons
                      name={passwordVisible ? 'eye-off-outline' : 'eye-outline'}
                      size={20}
                      color="rgba(8,17,38,0.4)"
                    />
                  </Pressable>
                }
              />
              <Pressable
                style={[
                  s.button,
                  (!email || !password || isFetching) && s.buttonDisabled,
                ]}
                onPress={handleSignIn}
                disabled={!email || !password || isFetching}
              >
                <Text style={s.buttonText}>{signInButtonLabel}</Text>
              </Pressable>
            </View>
          </View>
          <View style={s.linkRow}>
            <Text style={s.linkCopy}>New to Recurly?</Text>
            <Link href="/(auth)/sign-up">
              <Text style={s.link}>Create an account</Text>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 32,
  },
  title: { fontSize: 30, fontWeight: '700', color: colors.primary },
  subtitle: {
    marginTop: 8,
    maxWidth: 320,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
    color: colors.mutedForeground,
  },
  helper: { fontSize: 14, fontWeight: '500', color: colors.mutedForeground },
  card: {
    marginTop: 32,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    padding: 20,
  },
  form: { gap: 16 },
  button: {
    marginTop: 4,
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: colors.accent,
    paddingVertical: 16,
  },
  buttonDisabled: { backgroundColor: 'rgba(234, 122, 83, 0.45)' },
  buttonText: { fontSize: 16, fontWeight: '700', color: colors.primary },
  linkRow: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  linkCopy: { fontSize: 14, fontWeight: '500', color: colors.mutedForeground },
  link: { fontSize: 14, fontWeight: '700', color: colors.accent },
});
