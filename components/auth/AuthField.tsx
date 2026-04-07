import { colors } from '@/constants/theme';
import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';

interface AuthFieldProps extends TextInputProps {
  label: string;
  error?: string;
  rightElement?: React.ReactNode;
}

export default function AuthField({
  label,
  error,
  rightElement,
  ...inputProps
}: AuthFieldProps) {
  return (
    <View style={s.field}>
      <Text style={s.label}>{label}</Text>
      <View style={s.container}>
        <TextInput
          accessibilityLabel={label}
          style={[
            s.input,
            !!error && s.inputError,
            !!rightElement && { paddingRight: 48 },
          ]}
          placeholderTextColor="rgba(8,17,38,0.35)"
          {...inputProps}
        />
        {rightElement != null && (
          <View style={s.rightWrapper}>{rightElement}</View>
        )}
      </View>
      {!!error && <Text style={s.error}>{error}</Text>}
    </View>
  );
}

const s = StyleSheet.create({
  field: { gap: 8 },
  label: { fontSize: 14, fontWeight: '600', color: colors.primary },
  container: { position: 'relative' },
  input: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    fontWeight: '500',
    color: colors.primary,
  },
  rightWrapper: {
    position: 'absolute',
    right: 16,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputError: { borderColor: colors.destructive },
  error: { fontSize: 12, fontWeight: '500', color: colors.destructive },
});
