import { colors } from '@/constants/theme';
import {
  formatCurrency,
  formatStatusLabel,
  formatSubscriptionDateTime,
} from '@/lib/utils';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

export default function SubscriptionCard({
  name,
  price,
  currency,
  icon,
  billing,
  color,
  category,
  plan,
  renewalDate,
  onPress,
  expanded,
  paymentMethod,
  startDate,
  status,
}: SubscriptionCardProps) {
  return (
    <Pressable
      style={[
        s.card,
        expanded
          ? s.cardExpanded
          : color
            ? { backgroundColor: color }
            : { backgroundColor: colors.card },
      ]}
      onPress={onPress}
    >
      <View style={s.head}>
        <View style={s.main}>
          <Image source={icon} style={s.icon} resizeMode="contain" />
          <View style={s.copy}>
            <Text style={s.title} numberOfLines={1}>
              {name}
            </Text>
            <Text style={s.meta} numberOfLines={1} ellipsizeMode="tail">
              {category?.trim() ||
                plan?.trim() ||
                (renewalDate ? formatSubscriptionDateTime(renewalDate) : '')}
            </Text>
          </View>
        </View>

        <View style={s.priceBox}>
          <Text style={s.price}>{formatCurrency(price, currency)}</Text>
          <Text style={s.billing}>{billing}</Text>
        </View>
      </View>

      {expanded && (
        <View style={s.body}>
          <View style={s.details}>
            <View style={s.row}>
              <View style={s.rowCopy}>
                <Text style={s.label}>Payment:</Text>
                <Text style={s.value} numberOfLines={1} ellipsizeMode="tail">
                  {paymentMethod?.trim() || 'N/A'}
                </Text>
              </View>
            </View>

            <View style={s.row}>
              <View style={s.rowCopy}>
                <Text style={s.label}>Category:</Text>
                <Text style={s.value} numberOfLines={1} ellipsizeMode="tail">
                  {category?.trim() || plan?.trim() || 'N/A'}
                </Text>
              </View>
            </View>

            <View style={s.row}>
              <View style={s.rowCopy}>
                <Text style={s.label}>Started:</Text>
                <Text style={s.value} numberOfLines={1} ellipsizeMode="tail">
                  {formatSubscriptionDateTime(startDate)}
                </Text>
              </View>
            </View>

            <View style={s.row}>
              <View style={s.rowCopy}>
                <Text style={s.label}>Renewal Date:</Text>
                <Text style={s.value} numberOfLines={1} ellipsizeMode="tail">
                  {formatSubscriptionDateTime(renewalDate)}
                </Text>
              </View>
            </View>

            <View style={s.row}>
              <View style={s.rowCopy}>
                <Text style={s.label}>Status:</Text>
                <Text style={s.value} numberOfLines={1} ellipsizeMode="tail">
                  {status ? formatStatusLabel(status) : 'N/A'}
                </Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </Pressable>
  );
}

const s = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
  },
  cardExpanded: { backgroundColor: colors.subscription },
  head: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  main: {
    minWidth: 0,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  icon: { width: 64, height: 64, borderRadius: 8 },
  copy: { minWidth: 0, flex: 1 },
  title: {
    marginBottom: 4,
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  meta: { fontSize: 14, fontWeight: '600', color: colors.mutedForeground },
  priceBox: { marginLeft: 12, flexShrink: 0, alignItems: 'flex-end' },
  price: {
    marginBottom: 4,
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  billing: { fontSize: 14, fontWeight: '500', color: colors.mutedForeground },
  body: { marginTop: 24, gap: 16 },
  details: { gap: 24 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  rowCopy: {
    minWidth: 0,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    flexShrink: 0,
    fontSize: 16,
    fontWeight: '500',
    color: colors.mutedForeground,
  },
  value: { flex: 1, fontWeight: '700', color: colors.primary },
});
