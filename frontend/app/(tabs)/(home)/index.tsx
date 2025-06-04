import { Text, Button, StyleSheet, FlatList, View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useFlashcardSetStore } from '@/store/deck-card-store';
import { Fab, FabIcon } from '@/components/ui/fab';
import { AddIcon } from '@/components/ui/icon';
import { Heading } from '@/components/ui/heading';

export default function HomeScreen() {
  const router = useRouter();
  const flashcardSets = useFlashcardSetStore((state) => state.flashcardSets);
  const deleteFlashcardSet = useFlashcardSetStore((state) => state.deleteFlashcardSet);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Heading style={styles.title}>Your Flashcard Sets</Heading>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => {
            /* Add logout logic later */
          }}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={flashcardSets}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardSubtitle}>{item.subject}</Text>
            <Text style={styles.cardDescription}>{item.description}</Text>
            <Text style={styles.cardCount}>Cards: {item.flashcards?.length || 0}</Text>

            <View style={styles.buttonRow}>
              <Button
                title="Edit"
                onPress={() => router.push({ pathname: './addDeck', params: { id: item.id } })}
              />
              <Button
                title="Study"
                onPress={() => router.push({ pathname: './study', params: { id: item.id } })}
              />
              <Button
                title="Quiz"
                onPress={() => router.push({ pathname: './(quiz)/quiz', params: { id: item.id } })}
              />
              <Button title="Delete Deck" color="red" onPress={() => deleteFlashcardSet(item.id)} />
            </View>
          </View>
        )}
      />
      <Fab
        size="lg"
        className="bottom-20 bg-sky-700"
        onPress={() => router.navigate('./addDeck')}
        hitSlop={25}
      >
        <FabIcon as={AddIcon} color="white" />
      </Fab>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoutButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#ddd',
    borderRadius: 6,
  },
  logoutText: {
    fontWeight: 'bold',
    color: '#333',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  listContent: {
    paddingBottom: 100,
  },
  card: {
    backgroundColor: '#f2f2f2',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardSubtitle: {
    fontSize: 14,
    color: 'gray',
  },
  cardDescription: {
    marginTop: 4,
  },
  cardCount: {
    marginTop: 6,
    fontStyle: 'italic',
    color: 'gray',
  },
  buttonRow: {
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
});
