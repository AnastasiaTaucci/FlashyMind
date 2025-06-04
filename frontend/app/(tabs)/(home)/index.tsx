import { Text, StyleSheet, FlatList, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useFlashcardSetStore } from '@/store/deck-card-store';
import { Heading } from '@/components/ui/heading';
import { Button, ButtonText } from '@/components/ui/button';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import FlashcardSetCard from '@/components/FlashcardSetCard';

export default function HomeScreen() {
  const router = useRouter();
  const flashcardSets = useFlashcardSetStore((state) => state.flashcardSets);
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
          renderItem={({ item }) => <FlashcardSetCard item={item} />}
          ListEmptyComponent={
            <View style={styles.emptyWrapper}>
              <Text style={styles.emptyText}>
                You have no sets yet. Tap “+ New Set” to get started!
              </Text>
            </View>
          }
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
  emptyWrapper: {
    marginTop: 50,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 22,
  },
});
