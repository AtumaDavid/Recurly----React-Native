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

type VerificationStep = 'credentials' | 'verify';
type VerificationStrategy = 'email_code' | 'phone_code' | null;

export default function SignIn() {
  const { signIn, errors, fetchStatus } = useSignIn();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [verificationStep, setVerificationStep] =
    useState<VerificationStep>('credentials');
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationStrategy, setVerificationStrategy] =
    useState<VerificationStrategy>(null);
  const [verificationPrompt, setVerificationPrompt] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const isFetching = fetchStatus === 'fetching';
  const signInButtonLabel = isFetching
    ? 'Loading...'
    : verificationStep === 'verify'
      ? 'Verify code'
      : 'Sign in';

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
    setLocalError(null);
    const { error } = await signIn.password({ identifier: email, password });
    if (error) return;

    if (signIn.status === 'complete') {
      await signIn.finalize();
      return;
    }

    if (
      signIn.status === 'needs_client_trust' ||
      signIn.status === 'needs_second_factor'
    ) {
      const emailCodeFactor = signIn.supportedSecondFactors.find(
        (factor) => factor.strategy === 'email_code'
      );
      const phoneCodeFactor = signIn.supportedSecondFactors.find(
        (factor) => factor.strategy === 'phone_code'
      );

      if (emailCodeFactor) {
        const { error: sendError } = await signIn.mfa.sendEmailCode();
        if (sendError) {
          setLocalError('Unable to send verification code. Try again.');
          return;
        }

        setVerificationStrategy('email_code');
        setVerificationPrompt(
          'Enter the verification code sent to your email.'
        );
        setVerificationStep('verify');
        return;
      }

      if (phoneCodeFactor) {
        const { error: sendError } = await signIn.mfa.sendPhoneCode();
        if (sendError) {
          setLocalError('Unable to send verification code. Try again.');
          return;
        }

        setVerificationStrategy('phone_code');
        setVerificationPrompt(
          'Enter the verification code sent to your phone.'
        );
        setVerificationStep('verify');
        return;
      }

      setLocalError('No supported verification method is available.');
      return;
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode.trim()) {
      setLocalError('Verification code is required.');
      return;
    }

    setLocalError(null);

    if (verificationStrategy === 'phone_code') {
      const { error } = await signIn.mfa.verifyPhoneCode({
        code: verificationCode.trim(),
      });
      if (error) return;
    } else {
      const { error } = await signIn.mfa.verifyEmailCode({
        code: verificationCode.trim(),
      });
      if (error) return;
    }

    if (signIn.status === 'complete') {
      await signIn.finalize();
      return;
    }

    setLocalError('Verification incomplete. Please try again.');
  };

  const handlePrimaryAction = async () => {
    if (verificationStep === 'verify') {
      await handleVerifyCode();
      return;
    }

    await handleSignIn();
  };

  const handleResendCode = async () => {
    setLocalError(null);

    if (verificationStrategy === 'phone_code') {
      const { error } = await signIn.mfa.sendPhoneCode();
      if (error) {
        setLocalError('Unable to resend code. Please try again.');
      }
      return;
    }

    const { error } = await signIn.mfa.sendEmailCode();
    if (error) {
      setLocalError('Unable to resend code. Please try again.');
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
              {verificationStep === 'verify'
                ? verificationPrompt || 'Verify your sign-in to continue'
                : 'Sign in to continue managing your subscriptions'}
            </Text>
          </View>
          <View style={s.card}>
            <View style={s.form}>
              {verificationStep === 'credentials' ? (
                <>
                  <AuthField
                    label="Email"
                    value={email}
                    onChangeText={(value) => {
                      setEmail(value);
                      if (localError) setLocalError(null);
                    }}
                    placeholder="Enter your email"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    autoComplete="email"
                    error={errors?.fields?.identifier?.message}
                  />
                  <AuthField
                    label="Password"
                    value={password}
                    onChangeText={(value) => {
                      setPassword(value);
                      if (localError) setLocalError(null);
                    }}
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
                          name={
                            passwordVisible ? 'eye-off-outline' : 'eye-outline'
                          }
                          size={20}
                          color="rgba(8,17,38,0.4)"
                        />
                      </Pressable>
                    }
                  />
                  {!!localError && (
                    <Text style={s.localError}>{localError}</Text>
                  )}
                </>
              ) : (
                <>
                  <AuthField
                    label="Verification Code"
                    value={verificationCode}
                    onChangeText={(value) => {
                      setVerificationCode(value);
                      if (localError) setLocalError(null);
                    }}
                    placeholder="Enter code"
                    autoCapitalize="none"
                    keyboardType="number-pad"
                    autoComplete="one-time-code"
                    error={
                      errors?.fields?.code?.message ?? localError ?? undefined
                    }
                  />
                  <Pressable
                    style={s.secondaryButton}
                    onPress={handleResendCode}
                    disabled={isFetching}
                    accessibilityRole="button"
                    accessibilityLabel="Resend verification code"
                  >
                    <Text style={s.secondaryButtonText}>Resend code</Text>
                  </Pressable>
                </>
              )}

              <Pressable
                style={[
                  s.button,
                  ((verificationStep === 'credentials' &&
                    (!email || !password)) ||
                    (verificationStep === 'verify' &&
                      !verificationCode.trim()) ||
                    isFetching) &&
                    s.buttonDisabled,
                ]}
                onPress={handlePrimaryAction}
                disabled={
                  (verificationStep === 'credentials' &&
                    (!email || !password)) ||
                  (verificationStep === 'verify' && !verificationCode.trim()) ||
                  isFetching
                }
              >
                <Text style={s.buttonText}>{signInButtonLabel}</Text>
              </Pressable>
            </View>
          </View>
          {verificationStep === 'credentials' ? (
            <View style={s.linkRow}>
              <Text style={s.linkCopy}>New to Recurly?</Text>
              <Link href="/(auth)/sign-up">
                <Text style={s.link}>Create an account</Text>
              </Link>
            </View>
          ) : (
            <Pressable
              onPress={() => {
                setVerificationStep('credentials');
                setVerificationCode('');
                setVerificationStrategy(null);
                setVerificationPrompt('');
                setLocalError(null);
              }}
              style={s.linkRow}
            >
              <Text style={s.link}>Back to sign in</Text>
            </Pressable>
          )}
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
  localError: {
    marginTop: -6,
    fontSize: 12,
    fontWeight: '500',
    color: colors.destructive,
  },
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
