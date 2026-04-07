import { HOME_SUBSCRIPTIONS } from '@/constants/data';
import { useSyncExternalStore } from 'react';

let subscriptions: Subscription[] = [...HOME_SUBSCRIPTIONS];
const listeners = new Set<() => void>();

function emitChange() {
  listeners.forEach((listener) => listener());
}

export function subscribeSubscriptions(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getSubscriptionsSnapshot() {
  return subscriptions;
}

export function useSubscriptions() {
  return useSyncExternalStore(
    subscribeSubscriptions,
    getSubscriptionsSnapshot,
    getSubscriptionsSnapshot
  );
}

export function addSubscription(subscription: Subscription) {
  subscriptions = [subscription, ...subscriptions];
  emitChange();
}
