import { useRef, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { normalizeWarehouseDraft, type WarehouseDraft, type WarehouseFields } from './warehouseFields';

type WarehouseFormProps = {
  initialValues: WarehouseDraft;
  actionLabel: string;
  submitting: boolean;
  saveError: string | null;
  onChange?: () => void;
  onSubmit: (fields: WarehouseFields) => Promise<void>;
};

export function WarehouseForm({ initialValues, actionLabel, submitting, saveError, onChange, onSubmit }: WarehouseFormProps) {
  const [draft, setDraft] = useState(initialValues);
  const [nameError, setNameError] = useState(false);
  const submittingRef = useRef(false);

  function change(field: keyof WarehouseDraft, value: string) {
    setDraft(current => ({ ...current, [field]: value }));
    if (field === 'name') setNameError(false);
    onChange?.();
  }

  async function submit() {
    if (submittingRef.current || submitting) return;
    const fields = normalizeWarehouseDraft(draft);
    if (!fields) {
      setNameError(true);
      return;
    }
    submittingRef.current = true;
    try {
      await onSubmit(fields);
    } finally {
      submittingRef.current = false;
    }
  }

  return (
    <View>
      <Text style={styles.label}>Nombre *</Text>
      <TextInput
        accessibilityLabel="Nombre"
        value={draft.name}
        onChangeText={value => change('name', value)}
        style={[styles.input, nameError && styles.inputError]}
        autoCapitalize="words"
        returnKeyType="next"
      />
      {nameError && <Text accessibilityRole="alert" style={styles.error}>El nombre es obligatorio.</Text>}

      <Text style={styles.label}>Descripción</Text>
      <TextInput
        accessibilityLabel="Descripción"
        value={draft.description}
        onChangeText={value => change('description', value)}
        style={[styles.input, styles.description]}
        multiline
        textAlignVertical="top"
      />

      {saveError && <Text accessibilityRole="alert" style={styles.error}>{saveError}</Text>}
      <Pressable
        accessibilityRole="button"
        disabled={submitting}
        onPress={() => { void submit(); }}
        style={[styles.button, submitting && styles.buttonDisabled]}>
        {submitting ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>{actionLabel}</Text>}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { color: '#213B46', fontSize: 16, fontWeight: '600', marginBottom: 8 },
  input: { backgroundColor: '#FFFFFF', borderColor: '#B8C8CF', borderWidth: 1,
    borderRadius: 8, color: '#172E38', fontSize: 18, minHeight: 52,
    paddingHorizontal: 14, paddingVertical: 10, marginBottom: 20 },
  inputError: { borderColor: '#B33A3A' },
  description: { minHeight: 112 },
  error: { color: '#A52F2F', fontSize: 15, lineHeight: 22, marginBottom: 18 },
  button: { backgroundColor: '#0B5266', borderRadius: 8, minHeight: 54,
    justifyContent: 'center', alignItems: 'center', marginTop: 4 },
  buttonDisabled: { opacity: 0.65 },
  buttonText: { color: '#FFFFFF', fontSize: 18, fontWeight: '700' },
});
