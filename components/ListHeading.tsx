import { colors } from '@/constants/theme';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ListHeading({ title }: ListHeadingProps) {
  return (
    <View style={s.head}>
      <Text style={s.title}>{title}</Text>
      <TouchableOpacity style={s.action} onPress={() => {}}>
        <Text style={s.actionText}>View All</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  head: {
    marginVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: { fontSize: 24, fontWeight: '700', color: colors.primary },
  action: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  actionText: { fontSize: 18, fontWeight: '600', color: colors.primary },
});
