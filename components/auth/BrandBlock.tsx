import { colors } from '@/constants/theme';
import { StyleSheet, Text, View } from 'react-native';

export default function BrandBlock() {
  return (
    <View style={s.block}>
      <View style={s.logoWrap}>
        <View style={s.logoMark}>
          <Text style={s.logoMarkText}>R</Text>
        </View>
        <View>
          <Text style={s.wordmark}>Recurly</Text>
          <Text style={s.wordmarkSub}>Smart Billing</Text>
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  block: { marginTop: 8, alignItems: 'center' },
  logoWrap: {
    marginBottom: 28,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoMark: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: colors.accent,
  },
  logoMarkText: { fontSize: 24, fontWeight: '800', color: colors.background },
  wordmark: { fontSize: 30, fontWeight: '800', color: colors.primary },
  wordmarkSub: {
    marginTop: -4,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: colors.mutedForeground,
  },
});
