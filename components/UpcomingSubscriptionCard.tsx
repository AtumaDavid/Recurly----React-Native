import { colors } from '@/constants/theme';
import { formatCurrency } from '@/lib/utils';
import { Image, StyleSheet, Text, View } from 'react-native';

export default function UpcomingSubscriptionCard({
  name,
  price,
  currency,
  daysLeft,
  icon,
}: UpcomingSubscriptionCardProps) {
  return (
    <View style={s.card}>
      <View style={s.row}>
        <Image source={icon} style={s.icon} resizeMode="contain" />
        <View>
          <Text style={s.price}>{formatCurrency(price, currency)}</Text>
          <Text style={s.meta} numberOfLines={1}>
            {daysLeft > 1
              ? `${daysLeft} days left`
              : daysLeft === 1
                ? 'last day'
                : 'due today'}
          </Text>
        </View>
      </View>
      <Text style={s.name} numberOfLines={1}>
        {name}
      </Text>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    marginRight: 16,
    width: 176,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    padding: 16,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  icon: { width: 56, height: 56 },
  price: { fontSize: 18, fontWeight: '700', color: colors.primary },
  meta: { fontSize: 14, fontWeight: '600', color: colors.mutedForeground },
  name: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
});
