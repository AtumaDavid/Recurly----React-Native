import { colors } from '@/constants/theme';
import { useAuth, useUser } from '@clerk/expo';
import React from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

type SettingsRowProps = {
  label: string;
  onPress: () => void;
  destructive?: boolean;
};

function SettingsRow({ label, onPress, destructive }: SettingsRowProps) {
  return (
    <Pressable
      style={({ pressed }) => [s.row, pressed && s.rowPressed]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Text style={[s.rowLabel, destructive && s.destructiveLabel]}>
        {label}
      </Text>
      {!destructive && <Text style={s.chevron}>›</Text>}
    </Pressable>
  );
}

export default function Settings() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const insets = useSafeAreaInsets();

  const email =
    user?.primaryEmailAddress?.emailAddress ??
    user?.emailAddresses?.[0]?.emailAddress ??
    '';
  const name =
    [user?.firstName, user?.lastName].filter(Boolean).join(' ') || email;

  const handleSignOut = async () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          try {
            await signOut();
          } catch {
            Alert.alert(
              'Sign Out Failed',
              'Unable to sign out. Please try again.'
            );
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView
        contentContainerStyle={[
          s.content,
          { paddingBottom: insets.bottom + 28 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={s.heading}>Settings</Text>

        {/* Account */}
        <View style={s.profileCard}>
          <View style={s.avatar}>
            <Text style={s.avatarLetter}>{(name[0] ?? '?').toUpperCase()}</Text>
          </View>
          <View>
            {!!name && name !== email && (
              <Text style={s.profileName}>{name}</Text>
            )}
            <Text style={s.profileEmail}>{email}</Text>
          </View>
        </View>

        {/* Preferences */}
        <Text style={s.sectionLabel}>Preferences</Text>
        <View style={s.section}>
          <SettingsRow
            label="Notifications"
            onPress={() =>
              Alert.alert('Coming soon', 'Notification settings coming soon.')
            }
          />
          <View style={s.divider} />
          <SettingsRow
            label="Currency"
            onPress={() =>
              Alert.alert('Coming soon', 'Currency settings coming soon.')
            }
          />
        </View>

        {/* Support */}
        <Text style={s.sectionLabel}>Support</Text>
        <View style={s.section}>
          <SettingsRow
            label="Privacy Policy"
            onPress={() => Alert.alert('Privacy Policy', 'Coming soon.')}
          />
          <View style={s.divider} />
          <SettingsRow
            label="Terms of Service"
            onPress={() => Alert.alert('Terms of Service', 'Coming soon.')}
          />
        </View>

        {/* Danger zone */}
        <View style={s.section}>
          <SettingsRow label="Sign Out" onPress={handleSignOut} destructive />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: {
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.foreground,
    marginTop: 8,
    marginBottom: 20,
  },

  /* Profile card */
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: { color: '#fff', fontSize: 20, fontWeight: '700' },
  profileName: { fontSize: 15, fontWeight: '600', color: colors.foreground },
  profileEmail: { fontSize: 13, color: colors.mutedForeground },

  /* Sections */
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.mutedForeground,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 6,
    marginLeft: 4,
  },
  section: {
    backgroundColor: colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 20,
    overflow: 'hidden',
  },

  /* Row */
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  rowPressed: { backgroundColor: colors.muted },
  rowLabel: { fontSize: 15, color: colors.foreground },
  destructiveLabel: { color: colors.destructive, fontWeight: '600' },
  chevron: { fontSize: 20, color: colors.mutedForeground, lineHeight: 22 },

  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 16,
  },
});
