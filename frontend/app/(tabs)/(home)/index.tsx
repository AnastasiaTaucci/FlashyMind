import { Text, Button, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Home Screen</Text>

      <Button title="Create Deck" onPress={() => router.push('./addDeck')} />
      <Button title="Edit Deck" onPress={() => router.push('./addDeck')} />
      <Button title="Study Deck" onPress={() => router.push('./study')} />
      <Button title="Start Quiz" onPress={() => router.push('./(quiz)/quiz')} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 12,
    flexGrow: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
});
