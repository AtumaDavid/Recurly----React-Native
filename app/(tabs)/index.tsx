import CreateSubscriptionModal from '@/components/CreateSubscriptionModal';
import ListHeading from '@/components/ListHeading';
import SubscriptionCard from '@/components/SubscriptionCard';
import UpcomingSubscriptionCard from '@/components/UpcomingSubscriptionCard';
import { HOME_BALANCE, UPCOMING_SUBSCRIPTIONS } from '@/constants/data';
import { icons } from '@/constants/icons';
import { colors } from '@/constants/theme';
import { addSubscription, useSubscriptions } from '@/lib/subscriptions-store';
import { formatCurrency } from '@/lib/utils';
import { useUser } from '@clerk/expo';
import dayjs from 'dayjs';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Home() {
  const router = useRouter();
  const { user } = useUser();
  const subscriptions = useSubscriptions();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

  const displayName =
    user?.firstName ??
    user?.primaryEmailAddress?.emailAddress ??
    user?.emailAddresses?.[0]?.emailAddress ??
    'there';

  return (
    <SafeAreaView style={s.safe}>
      <FlatList
        data={subscriptions}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.list}
        ListHeaderComponent={
          <>
            {/* Header: avatar + name on left, plus icon on right */}
            <View style={s.header}>
              <Pressable
                style={s.userRow}
                onPress={() => router.push('/(tabs)/Settings')}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="Go to settings"
              >
                {user?.imageUrl ? (
                  <Image source={{ uri: user.imageUrl }} style={s.avatar} />
                ) : (
                  <View style={s.avatarFallback}>
                    <Text style={s.avatarInitial}>
                      {displayName.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                )}
                <Text style={s.userName} numberOfLines={1}>
                  {displayName}
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setIsCreateModalVisible(true)}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="Create new subscription"
              >
                <Image
                  source={icons.add}
                  style={s.addIcon}
                  resizeMode="contain"
                />
              </Pressable>
            </View>

            {/* Balance card */}
            <View style={s.balanceCard}>
              <Text style={s.balanceLabel}>Current Balance</Text>
              <View style={s.balanceRow}>
                <Text style={s.balanceAmount}>
                  {formatCurrency(HOME_BALANCE.amount)}
                </Text>
                <Text style={s.balanceDate}>
                  {dayjs(HOME_BALANCE.nextRenewalDate).format('MMM D, YYYY')}
                </Text>
              </View>
            </View>

            {/* Upcoming */}
            <ListHeading title="Upcoming Renewals" />
            <FlatList
              data={UPCOMING_SUBSCRIPTIONS}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => <UpcomingSubscriptionCard {...item} />}
            />

            {/* All subscriptions heading */}
            <ListHeading
              title="Your Subscriptions"
              onViewAllPress={() => router.push('/(tabs)/Subscriptions')}
            />
          </>
        }
        renderItem={({ item }) => (
          <View style={{ marginBottom: 12 }}>
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

      <CreateSubscriptionModal
        visible={isCreateModalVisible}
        onClose={() => setIsCreateModalVisible(false)}
        onCreate={(newSubscription) => {
          addSubscription(newSubscription);
          setExpandedId(newSubscription.id);
        }}
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  list: { paddingHorizontal: 20, paddingBottom: 120 },
  header: {
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userRow: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 64, height: 64, borderRadius: 32 },
  avatarFallback: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: { fontSize: 24, fontWeight: '700', color: '#ffffff' },
  userName: {
    flex: 1,
    marginLeft: 16,
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
  },
  addIcon: { width: 48, height: 48 },
  balanceCard: {
    marginVertical: 10,
    minHeight: 200,
    justifyContent: 'space-between',
    gap: 20,
    borderBottomLeftRadius: 32,
    borderTopRightRadius: 32,
    borderBottomRightRadius: 0,
    borderTopLeftRadius: 0,
    backgroundColor: colors.accent,
    padding: 24,
  },
  balanceLabel: {
    fontSize: 20,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  balanceAmount: { fontSize: 36, fontWeight: '800', color: '#ffffff' },
  balanceDate: { fontSize: 20, fontWeight: '500', color: '#ffffff' },
});
