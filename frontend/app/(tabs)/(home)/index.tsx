import { Text, StyleSheet, FlatList, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useFlashcardSetStore } from '@/store/deck-card-store';
import { EditIcon, TrashIcon } from '@/components/ui/icon';
import { Heading } from '@/components/ui/heading';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Box } from '@/components/ui/box';

export default function HomeScreen() {
  const router = useRouter();
  const flashcardSets = useFlashcardSetStore((state) => state.flashcardSets);
  const deleteFlashcardSet = useFlashcardSetStore((state) => state.deleteFlashcardSet);

  return (
    <View style={styles.container}>
      <VStack style={styles.pageWrapper}>
        <HStack style={styles.logoutWrapper}>
          <Button
            style={styles.logoutButton}
            hitSlop={25}
            onPress={() => {
              /* Add logout logic later */
            }}
          >
            <ButtonText style={styles.logoutText}>Logout</ButtonText>
            <MaterialIcons name="logout" size={20} color="#fff" />
          </Button>
        </HStack>

        <Heading style={styles.heading}>Your Flashcard Sets</Heading>
        <HStack style={styles.addDeckWrapper}>
          <Button style={styles.addDeckButton} onPress={() => router.navigate('./addDeck')}>
            <ButtonText style={styles.addDeckText}>+ New Set</ButtonText>
          </Button>
        </HStack>

        <FlatList
          data={flashcardSets}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <Box style={styles.card}>
              <VStack style={styles.cardContent}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardSubtitle}>{item.subject}</Text>
                <Text style={styles.cardDescription}>{item.description}</Text>
                <Text style={styles.cardCount}>Cards: {item.flashcards?.length || 0}</Text>

                <HStack style={styles.actionRow}>
                  <Button
                    style={[styles.actionButton, styles.studyButton]}
                    onPress={() => router.push({ pathname: './study', params: { id: item.id } })}
                  >
                    <ButtonText style={styles.buttonText}>Study</ButtonText>
                    <MaterialCommunityIcons name="head-flash" size={24} color="white" />
                  </Button>
                  <Button
                    style={[styles.actionButton, styles.quizButton]}
                    onPress={() =>
                      router.push({ pathname: './(quiz)/quiz', params: { id: item.id } })
                    }
                  >
                    <ButtonText style={styles.buttonText}>Quiz</ButtonText>
                    <MaterialIcons name="quiz" size={24} color="white" />
                  </Button>
                </HStack>
              </VStack>

              <VStack style={styles.iconColumn}>
                <Button
                  style={styles.iconButton}
                  onPress={() => router.push({ pathname: './addDeck', params: { id: item.id } })}
                >
                  <ButtonIcon as={EditIcon} />
                </Button>
                <Button
                  style={[styles.iconButton, styles.deleteButton]}
                  onPress={() => deleteFlashcardSet(item.id)}
                >
                  <ButtonIcon as={TrashIcon} />
                </Button>
              </VStack>
            </Box>
          )}
        />
      </VStack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffafc',
    paddingBottom: 15,
    width: '100%',
  },
  pageWrapper: {
    flex: 1,
    marginTop: 25,
  },
  logoutWrapper: {
    justifyContent: 'flex-end',
    marginRight: 15,
    marginVertical: 10,
  },
  logoutButton: {
    width: '27%',
    backgroundColor: '#ef4444',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },
  logoutText: {
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 6,
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 16,
    marginLeft: 16,
    color: '1f2937',
    lineHeight: 30,
  },
  addDeckWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginRight: 20,
    marginBottom: 12,
  },
  addDeckButton: {
    width: '80%',
    backgroundColor: '#ffdd54',
    borderRadius: 8,
    paddingHorizontal: 14,
  },
  addDeckText: {
    color: '#5e2606',
    fontWeight: '700',
    fontSize: 20,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  card: {
    backgroundColor: '#fef3c7',
    padding: 16,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  cardContent: {
    paddingRight: 60,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#b45309',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#78350f',
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
    color: '#6b7280',
  },
  actionRow: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  studyButton: {
    backgroundColor: '#2563eb',
  },
  quizButton: {
    backgroundColor: '#b854ff',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
  iconColumn: {
    position: 'absolute',
    right: 10,
    top: 16,
    gap: 12,
  },
  iconButton: {
    padding: 8,
    backgroundColor: '#5492f7',
    borderRadius: 10,
  },
  deleteButton: {
    backgroundColor: '#ef4444',
  },
});
