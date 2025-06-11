import { View, Text, Button, StyleSheet } from 'react-native';

export default function StudyDeckScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Study Mode</Text>

      <View style={styles.card}>
        <Text style={styles.cardText}>¿Cómo estás?</Text>
      </View>

      <Button title="Show Answer" onPress={() => { }} />
      <Button title="Next Card" onPress={() => { }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    width: '100%',
    padding: 24,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  cardText: {
    fontSize: 18,
  },
});
