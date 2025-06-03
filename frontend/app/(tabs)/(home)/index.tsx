import { Text, Button, StyleSheet, FlatList, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useFlashcardSetStore } from '@/store/deck-card-store';

export default function HomeScreen() {
  const router = useRouter();
  const flashcardSets = useFlashcardSetStore((state) => state.flashcardSets);
  const deleteFlashcardSet = useFlashcardSetStore((state) => state.deleteFlashcardSet);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Flashcard Sets</Text>

      <FlatList
        data={flashcardSets}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardSubtitle}>{item.subject}</Text>
            <Text>{item.description}</Text>
            <Button
              title="Edit Deck"
              onPress={() => router.push({ pathname: './addDeck', params: { id: item.id } })}
            />
            <Button
              title="Study Deck"
              onPress={() => router.push({ pathname: './study', params: { id: item.id } })}
            />
            <Button
              title="Start Quiz"
              onPress={() => router.push({ pathname: './(quiz)/quiz', params: { id: item.id } })}
            />
            <Button title="Delete Deck" onPress={() => deleteFlashcardSet(item.id)} />
          </View>
        )}
      />

      <Button title="Create Deck" onPress={() => router.push('./addDeck')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 16,
    flexGrow: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#f2f2f2',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardSubtitle: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 4,
  },
});
