import { Link, type Href } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type HomeActionProps = { title: string; description: string; href: Href };

function HomeAction({ title, description, href }: HomeActionProps) {
  return (
    <Link href={href} asChild>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={title}
        style={({ pressed }) => [styles.action, pressed && styles.actionPressed]}>
        <Text style={styles.actionTitle}>{title}</Text>
        <Text style={styles.actionDescription}>{description}</Text>
      </Pressable>
    </Link>
  );
}

export default function HomeScreen() {
  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.intro}>
          <Text style={styles.title} accessibilityRole="header">CORONAPP</Text>
          <Text style={styles.description}>Encuentra tu mercancía rápidamente.</Text>
        </View>
        <Text style={styles.sectionTitle} accessibilityRole="header">Accesos</Text>
        <HomeAction title="Buscar producto" description="Abre la sección Productos" href="/products" />
        <HomeAction title="Escanear código" description="Abre la sección Escáner" href="/scanner" />
        <HomeAction title="Ver bodegas" description="Abre la sección Bodegas" href="/warehouses" />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F4F7F8' },
  content: { paddingHorizontal: 24, paddingTop: 36, paddingBottom: 40 },
  intro: { marginBottom: 42 },
  title: { color: '#172E38', fontSize: 36, fontWeight: '800', letterSpacing: 0.5, marginBottom: 12 },
  description: { color: '#344B55', fontSize: 20, lineHeight: 28 },
  sectionTitle: { color: '#172E38', fontSize: 18, fontWeight: '700', marginBottom: 16 },
  action: { backgroundColor: '#FFFFFF', borderColor: '#D7E0E4', borderWidth: 1,
    borderLeftColor: '#0B5266', borderLeftWidth: 5, borderRadius: 10,
    minHeight: 88, justifyContent: 'center', paddingHorizontal: 20, paddingVertical: 16, marginBottom: 14 },
  actionPressed: { backgroundColor: '#E9F1F3' },
  actionTitle: { color: '#173A48', fontSize: 20, fontWeight: '700', marginBottom: 4 },
  actionDescription: { color: '#52636D', fontSize: 15, lineHeight: 21 },
});
