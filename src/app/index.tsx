import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <Text style={styles.title}>CORONAPP</Text>
        <Text style={styles.description}>
          Localiza tu mercancía sin depender de Internet.
        </Text>
        <Text style={styles.status}>Proyecto en preparación</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  title: {
    color: '#182B3A',
    fontSize: 36,
    fontWeight: '700',
    marginBottom: 16,
  },
  description: {
    color: '#425563',
    fontSize: 20,
    lineHeight: 28,
  },
  status: {
    color: '#637582',
    fontSize: 15,
    marginTop: 32,
  },
});
