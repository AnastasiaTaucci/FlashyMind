import { Text, StyleSheet, FlatList, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useFlashcardSetStore } from '@/store/deck-card-store';
import { Fab, FabIcon } from '@/components/ui/fab';
import { AddIcon, EditIcon, TrashIcon } from '@/components/ui/icon';
import { Heading } from '@/components/ui/heading';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';


export default function HomeScreen() {
  const router = useRouter();
  const flashcardSets = useFlashcardSetStore((state) => state.flashcardSets);
  const deleteFlashcardSet = useFlashcardSetStore((state) => state.deleteFlashcardSet);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Button
          style={styles.logoutButton}
          hitSlop={25}
          onPress={() => {
            /* Add logout logic later */
          }}
        >
          <ButtonText style={styles.logoutText}>Logout</ButtonText>
          <MaterialIcons name="logout" size={20} color="#333" />
        </Button>
      </View>
      <Heading style={styles.title}>Your Flashcard Sets</Heading>


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
                onPress={() => router.push({ pathname: './study', params: { id: item.id } })}
              >
                <ButtonText>Study</ButtonText>
                <MaterialCommunityIcons name="head-flash" size={24} color="white" />
              </Button>
              <Button
                onPress={() =>
                  router.push({ pathname: './(quiz)/quiz', params: { id: item.id } })
                }
              >
                <ButtonText>Quiz</ButtonText>
                <MaterialIcons name="quiz" size={24} color="white" />
              </Button>
              <Button
                onPress={() => router.push({ pathname: './addDeck', params: { id: item.id } })}
              >
                <ButtonIcon as={EditIcon} />
              </Button>
              <Button onPress={() => deleteFlashcardSet(item.id)}>
                <ButtonIcon as={TrashIcon} />
              </Button>
            </View>
          </View>
        )}
      />
      <Fab
        size="lg"
        className="bottom-20 bg-blue-600"
        style={{
          shadowColor: '#000',
          shadowOpacity: 0.2,
          shadowRadius: 6,
          shadowOffset: { width: 0, height: 3 },
          elevation: 5,
        }}
        onPress={() => router.navigate('./addDeck')}
        hitSlop={25}
      >
        <FabIcon as={AddIcon} color="white" />
      </Fab>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fefefe',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  logoutButton: {
    backgroundColor: '#fca874',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutText: {
    fontWeight: 'bold',
    color: '#333',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    marginBottom: 16,
    marginTop: 25,
  },
  listContent: {
    paddingHorizontal: '4%',
  },
  card: {
    backgroundColor: '#f2f2f2',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  cardDescription: {
    marginTop: 6,
    fontSize: 14,
    color: '#444',
  },
  cardCount: {
    marginTop: 8,
    fontSize: 13,
    fontStyle: 'italic',
    color: '#888',
  },
  buttonRow: {
    marginTop: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
});
