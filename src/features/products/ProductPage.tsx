import { useRouter } from 'expo-router';
import type { PropsWithChildren } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export function ProductPage({ title, children }: PropsWithChildren<{ title: string }>) {
  const router = useRouter();
  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.canGoBack() ? router.back() : router.replace('/products')}
            style={styles.backButton}>
            <Text style={styles.backText}>Volver</Text>
          </Pressable>
          <Text accessibilityRole="header" style={styles.title}>{title}</Text>
          <View>{children}</View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F4F7F8' },
  flex: { flex: 1 },
  content: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 56 },
  backButton: { minHeight: 48, justifyContent: 'center', alignSelf: 'flex-start', marginBottom: 18 },
  backText: { color: '#0B5266', fontSize: 17, fontWeight: '600' },
  title: { color: '#172E38', fontSize: 30, fontWeight: '700', marginBottom: 26 },
});
