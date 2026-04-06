import { colors } from '@/constants/theme';
import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Subscriptions() {
  return (
    <SafeAreaView style={s.safe}>
      <Text style={s.heading}>Subscriptions</Text>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background, padding: 20 },
  heading: { fontSize: 20, fontWeight: '700', color: colors.success },
});
