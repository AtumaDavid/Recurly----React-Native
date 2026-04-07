import SubscriptionCard from '@/components/SubscriptionCard';
import { colors } from '@/constants/theme';
import { useSubscriptions } from '@/lib/subscriptions-store';
import React, { useMemo, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Subscriptions() {
  const subscriptions = useSubscriptions();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  const filteredSubscriptions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return subscriptions;
    }

    return subscriptions.filter((item) => {
      const searchableText = [
        item.name,
        item.category,
        item.plan,
        item.status,
        item.billing,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return searchableText.includes(normalizedQuery);
    });
  }, [query, subscriptions]);

  return (
    <SafeAreaView style={s.safe}>
      <KeyboardAvoidingView
        style={s.keyboardWrap}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <FlatList
          data={filteredSubscriptions}
          keyExtractor={(item) => item.id}
          contentContainerStyle={s.list}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View>
              <Text style={s.heading}>Subscriptions</Text>
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Search by name, category, plan..."
                placeholderTextColor={colors.mutedForeground}
                style={s.searchInput}
                returnKeyType="search"
                autoCapitalize="none"
                autoCorrect={false}
                clearButtonMode="while-editing"
                accessibilityLabel="Search subscriptions"
              />
              <Text style={s.resultCount}>
                {filteredSubscriptions.length} result
                {filteredSubscriptions.length === 1 ? '' : 's'}
              </Text>
            </View>
          }
          ListEmptyComponent={
            <View style={s.emptyWrap}>
              <Text style={s.emptyTitle}>No subscriptions found</Text>
              <Text style={s.emptySubtext}>
                Try a different keyword or clear your search.
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={s.cardWrap}>
              <SubscriptionCard
                {...item}
                expanded={expandedId === item.id}
                onPress={() =>
                  setExpandedId((prev) => (prev === item.id ? null : item.id))
                }
              />
            </View>
          )}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  keyboardWrap: { flex: 1 },
  list: { paddingHorizontal: 20, paddingBottom: 120 },
  heading: {
    marginTop: 8,
    marginBottom: 16,
    fontSize: 22,
    fontWeight: '700',
    color: colors.foreground,
  },
  searchInput: {
    height: 46,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 14,
    color: colors.foreground,
    fontSize: 15,
  },
  resultCount: {
    marginTop: 10,
    marginBottom: 12,
    fontSize: 13,
    fontWeight: '600',
    color: colors.mutedForeground,
  },
  cardWrap: { marginBottom: 12 },
  emptyWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 36,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.foreground,
    marginBottom: 6,
  },
  emptySubtext: {
    textAlign: 'center',
    fontSize: 14,
    color: colors.mutedForeground,
  },
});
