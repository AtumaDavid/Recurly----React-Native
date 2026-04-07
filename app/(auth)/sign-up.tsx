import AuthField from '@/components/auth/AuthField';
import BrandBlock from '@/components/auth/BrandBlock';
import { colors } from '@/constants/theme';
import { useSignUp } from '@clerk/expo';
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

export default function SignUp() {
  const { signUp, errors, fetchStatus } = useSignUp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [code, setCode] = useState('');
  const [passwordMatchError, setPasswordMatchError] = useState('');
  const [verificationError, setVerificationError] = useState('');

  const isFetching = fetchStatus === 'fetching';
  const createAccountButtonLabel = isFetching ? 'Loading...' : 'Create account';
  const verifyButtonLabel = isFetching ? 'Loading...' : 'Verify account';
  const resendButtonLabel = isFetching ? 'Loading...' : 'Resend code';

  if (!signUp) {
    return (
      <SafeAreaView style={s.safe}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.background,
          }}
        >
          <Text style={s.helper}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      setPasswordMatchError('Passwords do not match');
      return;
    }
    setPasswordMatchError('');
    setVerificationError('');
    const { error } = await signUp.password({ emailAddress: email, password });
    if (error) return;
    await signUp.verifications.sendEmailCode();
  };

  const handleVerify = async () => {
    setVerificationError('');
    const { error } = await signUp.verifications.verifyEmailCode({ code });
    if (error) {
      setVerificationError(
        errors?.fields?.code?.message ??
          'Verification failed. Check the code and try again.'
      );
      return;
    }

    if (signUp.status === 'complete') {
      await signUp.finalize();
      return;
    }

    setVerificationError('Verification is incomplete. Please try again.');
  };

  const isVerifying =
    signUp.status === 'missing_requirements' &&
    signUp.unverifiedFields.includes('email_address') &&
    signUp.missingFields.length === 0;

  // Email verification step
  if (isVerifying) {
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
              <Text style={[s.title, { textAlign: 'center' }]}>
                Check your inbox
              </Text>
              <Text style={s.subtitle}>
                We sent a 6-digit code to {email}. Enter it below to verify your
                account.
              </Text>
            </View>
            <View style={s.card}>
              <View style={s.form}>
                <AuthField
                  label="Verification Code"
                  value={code}
                  onChangeText={(val) => {
                    setCode(val);
                    if (verificationError) setVerificationError('');
                  }}
                  placeholder="6-digit code"
                  keyboardType="number-pad"
                  autoComplete="one-time-code"
                  error={errors?.fields?.code?.message ?? verificationError}
                />
                <Pressable
                  style={[s.button, (!code || isFetching) && s.buttonDisabled]}
                  onPress={handleVerify}
                  disabled={!code || isFetching}
                >
                  <Text style={s.buttonText}>{verifyButtonLabel}</Text>
                </Pressable>
                <Pressable
                  style={s.secondaryButton}
                  onPress={async () => {
                    setVerificationError('');
                    const { error } =
                      await signUp.verifications.sendEmailCode();
                    if (error) {
                      setVerificationError(
                        'Could not resend code right now. Please try again.'
                      );
                    }
                  }}
                  disabled={isFetching}
                >
                  <Text style={s.secondaryButtonText}>{resendButtonLabel}</Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

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
            <Text style={[s.title, { textAlign: 'center' }]}>
              Create your account
            </Text>
            <Text style={s.subtitle}>
              Start managing your subscriptions smarter
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
                error={errors?.fields?.emailAddress?.message}
              />
              <AuthField
                label="Password"
                value={password}
                onChangeText={(val) => {
                  setPassword(val);
                  if (passwordMatchError) setPasswordMatchError('');
                }}
                placeholder="Create a password"
                secureTextEntry={!passwordVisible}
                autoComplete="new-password"
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
              <AuthField
                label="Confirm Password"
                value={confirmPassword}
                onChangeText={(val) => {
                  setConfirmPassword(val);
                  if (passwordMatchError) setPasswordMatchError('');
                }}
                placeholder="Re-enter your password"
                secureTextEntry={!confirmVisible}
                autoComplete="new-password"
                error={passwordMatchError}
                rightElement={
                  <Pressable
                    onPress={() => setConfirmVisible((v) => !v)}
                    hitSlop={8}
                  >
                    <Ionicons
                      name={confirmVisible ? 'eye-off-outline' : 'eye-outline'}
                      size={20}
                      color="rgba(8,17,38,0.4)"
                    />
                  </Pressable>
                }
              />
              <Pressable
                style={[
                  s.button,
                  (!email || !password || !confirmPassword || isFetching) &&
                    s.buttonDisabled,
                ]}
                onPress={handleSignUp}
                disabled={!email || !password || !confirmPassword || isFetching}
              >
                <Text style={s.buttonText}>{createAccountButtonLabel}</Text>
              </Pressable>
            </View>
          </View>
          <View style={s.linkRow}>
            <Text style={s.linkCopy}>Already have an account?</Text>
            <Link href="/(auth)/sign-in">
              <Text style={s.link}>Sign in</Text>
            </Link>
          </View>
          {/* Required for Clerk bot sign-up protection */}
          <View nativeID="clerk-captcha" />
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
  card: {
    marginTop: 32,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    padding: 20,
  },
  form: { gap: 16 },
  helper: { fontSize: 14, fontWeight: '500', color: colors.mutedForeground },
  button: {
    marginTop: 4,
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: colors.accent,
    paddingVertical: 16,
  },
  buttonDisabled: { backgroundColor: 'rgba(234, 122, 83, 0.45)' },
  buttonText: { fontSize: 16, fontWeight: '700', color: colors.primary },
  secondaryButton: {
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(234, 122, 83, 0.3)',
    backgroundColor: 'rgba(234, 122, 83, 0.1)',
    paddingVertical: 12,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.accent,
  },
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
