import { SQLiteProvider } from 'expo-sqlite';
import { Component, type PropsWithChildren } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { DATABASE_NAME } from './constants';
import { initializeDatabase } from './initializeDatabase';

class DatabaseErrorBoundary extends Component<PropsWithChildren, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error) {
    console.error('No se pudo iniciar CORONAPP o acceder a su base de datos.', error);
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <View style={styles.error}>
        <Text>No se pudo iniciar CORONAPP. Cierra la aplicación e inténtalo de nuevo.</Text>
      </View>
    );
  }
}

export function DatabaseProvider({ children }: PropsWithChildren) {
  return (
    <DatabaseErrorBoundary>
      <SQLiteProvider databaseName={DATABASE_NAME} onInit={initializeDatabase}>
        {children}
      </SQLiteProvider>
    </DatabaseErrorBoundary>
  );
}

const styles = StyleSheet.create({
  error: { flex: 1, justifyContent: 'center', padding: 32 },
});
