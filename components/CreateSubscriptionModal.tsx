import { icons } from '@/constants/icons';
import { colors } from '@/constants/theme';
import dayjs from 'dayjs';
import React, { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

const CATEGORY_OPTIONS = [
  'Entertainment',
  'AI Tools',
  'Developer Tools',
  'Design',
  'Productivity',
  'Cloud',
  'Music',
  'Other',
] as const;

type Category = (typeof CATEGORY_OPTIONS)[number];

const CATEGORY_COLORS: Record<Category, string> = {
  Entertainment: '#ffd9b8',
  'AI Tools': '#b8d4e3',
  'Developer Tools': '#e8def8',
  Design: '#f5c542',
  Productivity: '#b8e8d0',
  Cloud: '#b9dcff',
  Music: '#fdd9e5',
  Other: '#f6eecf',
};

type BillingFrequency = Extract<Subscription['billing'], 'Monthly' | 'Yearly'>;

type CreateSubscriptionModalProps = {
  visible: boolean;
  onClose: () => void;
  onCreate: (subscription: Subscription) => void;
};

let fallbackIdCounter = 0;

const generateSubscriptionId = () => {
  const maybeCrypto = globalThis.crypto as
    | { randomUUID?: () => string }
    | undefined;
  const uuid = maybeCrypto?.randomUUID?.();

  if (uuid) {
    return `custom-${uuid}`;
  }

  fallbackIdCounter += 1;
  return `custom-${Date.now().toString(36)}-${fallbackIdCounter.toString(36)}`;
};

export default function CreateSubscriptionModal({
  visible,
  onClose,
  onCreate,
}: CreateSubscriptionModalProps) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [frequency, setFrequency] = useState<BillingFrequency>('Monthly');
  const [category, setCategory] = useState<Category>('Entertainment');
  const [nameError, setNameError] = useState('');
  const [priceError, setPriceError] = useState('');

  const parsedPrice = useMemo(() => Number.parseFloat(price), [price]);
  const canSubmit =
    name.trim().length > 0 && Number.isFinite(parsedPrice) && parsedPrice > 0;

  const resetForm = () => {
    setName('');
    setPrice('');
    setFrequency('Monthly');
    setCategory('Entertainment');
    setNameError('');
    setPriceError('');
  };

  const validate = () => {
    let valid = true;

    if (!name.trim()) {
      setNameError('Name is required');
      valid = false;
    } else {
      setNameError('');
    }

    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      setPriceError('Price must be a positive number');
      valid = false;
    } else {
      setPriceError('');
    }

    return valid;
  };

  const handleCreate = () => {
    if (!validate()) return;

    const now = dayjs();
    const renewalDate =
      frequency === 'Monthly'
        ? now.add(1, 'month').toISOString()
        : now.add(1, 'year').toISOString();

    const subscription: Subscription = {
      id: generateSubscriptionId(),
      name: name.trim(),
      price: parsedPrice,
      category,
      status: 'active',
      startDate: now.toISOString(),
      renewalDate,
      icon: icons.wallet,
      billing: frequency,
      currency: 'USD',
      color: CATEGORY_COLORS[category],
      paymentMethod: 'Added manually',
      plan: `${frequency} Plan`,
    };

    onCreate(subscription);
    resetForm();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={s.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Dim backdrop — tapping it closes the modal */}
        <Pressable style={s.overlay} onPress={onClose} />

        {/* Sheet */}
        <View style={s.sheet}>
          {/* Header */}
          <View style={s.header}>
            <Text style={s.title}>New Subscription</Text>
            <Pressable
              style={s.closeBtn}
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="Close modal"
            >
              <Text style={s.closeBtnText}>✕</Text>
            </Pressable>
          </View>

          {/* Scrollable form */}
          <ScrollView
            contentContainerStyle={s.body}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Name */}
            <View style={s.field}>
              <Text style={s.label}>Name</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Enter subscription name"
                placeholderTextColor="rgba(8,17,38,0.35)"
                style={[s.input, !!nameError && s.inputError]}
                autoCapitalize="words"
                returnKeyType="next"
                accessibilityLabel="Subscription name"
              />
              {!!nameError && <Text style={s.error}>{nameError}</Text>}
            </View>

            {/* Price */}
            <View style={s.field}>
              <Text style={s.label}>Price (USD)</Text>
              <TextInput
                value={price}
                onChangeText={setPrice}
                placeholder="0.00"
                placeholderTextColor="rgba(8,17,38,0.35)"
                style={[s.input, !!priceError && s.inputError]}
                keyboardType="decimal-pad"
                returnKeyType="done"
                accessibilityLabel="Subscription price"
              />
              {!!priceError && <Text style={s.error}>{priceError}</Text>}
            </View>

            {/* Frequency */}
            <View style={s.field}>
              <Text style={s.label}>Frequency</Text>
              <View style={s.pickerRow}>
                {(['Monthly', 'Yearly'] as const).map((option) => {
                  const active = frequency === option;
                  return (
                    <Pressable
                      key={option}
                      style={[s.pickerOption, active && s.pickerOptionActive]}
                      onPress={() => setFrequency(option)}
                      accessibilityRole="button"
                      accessibilityLabel={`Set frequency to ${option}`}
                    >
                      <Text
                        style={[
                          s.pickerOptionText,
                          active && s.pickerOptionTextActive,
                        ]}
                      >
                        {option}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Category */}
            <View style={s.field}>
              <Text style={s.label}>Category</Text>
              <View style={s.chips}>
                {CATEGORY_OPTIONS.map((option) => {
                  const active = category === option;
                  return (
                    <Pressable
                      key={option}
                      style={[s.chip, active && s.chipActive]}
                      onPress={() => setCategory(option)}
                      accessibilityRole="button"
                      accessibilityLabel={`Set category to ${option}`}
                    >
                      <Text style={[s.chipText, active && s.chipTextActive]}>
                        {option}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Submit */}
            <Pressable
              style={[s.button, !canSubmit && s.buttonDisabled]}
              onPress={handleCreate}
              disabled={!canSubmit}
              accessibilityRole="button"
              accessibilityLabel="Create subscription"
            >
              <Text style={s.buttonText}>Create Subscription</Text>
            </Pressable>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const s = StyleSheet.create({
  flex: { flex: 1 },

  /* Overlay */
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },

  /* Bottom sheet */
  sheet: {
    marginTop: 'auto',
    maxHeight: '85%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: colors.background,
    overflow: 'hidden',
  },

  /* Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: { fontSize: 20, fontWeight: '700', color: colors.primary },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.muted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: { fontSize: 14, fontWeight: '700', color: colors.primary },

  /* Scrollable body */
  body: { gap: 20, padding: 20, paddingBottom: 36 },

  /* Field */
  field: { gap: 8 },
  label: { fontSize: 14, fontWeight: '600', color: colors.primary },
  input: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    fontWeight: '500',
    color: colors.primary,
  },
  inputError: { borderColor: colors.destructive },
  error: { fontSize: 12, fontWeight: '500', color: colors.destructive },

  /* Frequency picker */
  pickerRow: { flexDirection: 'row', gap: 12 },
  pickerOption: {
    flex: 1,
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    paddingVertical: 12,
  },
  pickerOptionActive: {
    borderColor: colors.accent,
    backgroundColor: 'rgba(234,122,83,0.1)',
  },
  pickerOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.mutedForeground,
  },
  pickerOptionTextActive: { color: colors.accent },

  /* Category chips */
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  chipActive: {
    borderColor: colors.accent,
    backgroundColor: 'rgba(234,122,83,0.1)',
  },
  chipText: { fontSize: 14, fontWeight: '600', color: colors.mutedForeground },
  chipTextActive: { color: colors.accent },

  /* Submit */
  button: {
    marginTop: 4,
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: colors.accent,
    paddingVertical: 16,
  },
  buttonDisabled: { backgroundColor: 'rgba(234,122,83,0.45)' },
  buttonText: { fontSize: 16, fontWeight: '700', color: colors.primary },
});
