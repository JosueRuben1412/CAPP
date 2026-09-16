import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type SectionPlaceholderProps = {
  title: string;
  description: string;
  availability: string;
};

export function SectionPlaceholder({ title, description, availability }: SectionPlaceholderProps) {
  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
      <View style={styles.content}>
        <Text style={styles.title} accessibilityRole="header">{title}</Text>
        <Text style={styles.description}>{description}</Text>
        <View style={styles.notice}>
          <Text style={styles.noticeText}>{availability}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F4F7F8' },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 36 },
  title: { color: '#172E38', fontSize: 32, fontWeight: '700', marginBottom: 18 },
  description: { color: '#344B55', fontSize: 19, lineHeight: 28, marginBottom: 28 },
  notice: { borderLeftWidth: 4, borderLeftColor: '#0B5266', paddingLeft: 16, paddingVertical: 6 },
  noticeText: { color: '#52636D', fontSize: 16, lineHeight: 24 },
});
