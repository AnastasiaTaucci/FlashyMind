import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useFlashcardSetStore, useFlashcardStore } from '@/store/deck-card-store';
import { Flashcard } from '@/types/Flashcard';
import { HStack } from '@/components/ui/hstack';
import { Button, ButtonText } from '@/components/ui/button';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function StudyDeckScreen() {
  const router = useRouter();
  const { deckId } = useLocalSearchParams();
  const flashcardSets = useFlashcardSetStore((state) => state.flashcardSets);
  const flashcards = useFlashcardStore((state) => state.flashcards);

  const deck = flashcardSets.find((set) => String(set.id) === deckId);
  const initialDeck = flashcards.filter((card) => String(card.deck_id) === deckId);
  const [studyDeck, setStudyDeck] = useState<Flashcard[]>(shuffle(initialDeck));

  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentCard, setCurrentCard] = useState<Flashcard | null>(studyDeck[0] || null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [reviewQueue, setReviewQueue] = useState<Flashcard[]>([]);

  useEffect(() => {
    if (currentIndex < studyDeck.length) {
      setCurrentCard(studyDeck[currentIndex]);
    } else {
      setCurrentCard(null);
    }
  }, [currentIndex, studyDeck]);

  // useEffect(() => {
  //   console.log('Updated reviewQueue:', reviewQueue);
  // }, [reviewQueue]);

  function markForReview() {
    if (currentCard) {
      setReviewQueue((prev) => [...prev, currentCard]);
      setCurrentIndex((prev) => prev + 1);
      setShowAnswer(false);
    }
  }

  function markLearned() {
    if (currentCard) {
      setCurrentIndex((prev) => prev + 1);
      setShowAnswer(false);
    }
  }

  function startReview() {
    setStudyDeck(shuffle(reviewQueue));
    setCurrentIndex(0);
    setReviewQueue([]);
    setShowAnswer(false);
  }
  function startOver() {
    setStudyDeck(shuffle(initialDeck));
    setCurrentIndex(0);
    setReviewQueue([]);
    setShowAnswer(false);
  }

  if (!deck) {
    return (
      <View style={styles.container}>
        <Text>Deck not found.</Text>
      </View>
    );
  }

  if (studyDeck.length === 0) {
    return (
      <View style={styles.container}>
        <Text>No cards found for this deck.</Text>
      </View>
    );
  }

  function shuffle(array: Flashcard[]) {
    return [...array].sort(() => Math.random() - 0.5);
  }

  return (
    <SafeAreaView style={styles.container}>
      <Pressable onPress={() => router.back()} style={{ marginBottom: 10 }}>
        <Text style={{ color: '#5e3e2b', fontSize: 16 }}>← Back</Text>
      </Pressable>
      <View style={styles.pageContainer}>
        <HStack>
          <Text style={styles.title}>Study: </Text>
          <Text style={[styles.title, { color: '#4caf8e' }]}>{deck.title}</Text>
        </HStack>

        {currentCard ? (
          <View>
            <View style={styles.card}>
              <HStack style={styles.cardHeader}>
                <Text style={styles.cardTopic}>{currentCard.topic}</Text>
                <Text style={styles.progress}>
                  Card {currentIndex + 1} / {studyDeck.length}
                </Text>
              </HStack>
              <Text style={styles.cardText}>Q: {currentCard.question}</Text>
              {showAnswer && (
                <View style={{ flex: 1, justifyContent: 'center' }}>
                  <Text style={[styles.cardText, styles.answerText]}>A: {currentCard.answer}</Text>
                </View>
              )}
            </View>
            <Button style={styles.showAnswerButton} onPress={() => setShowAnswer(!showAnswer)}>
              <ButtonText style={styles.buttonText}>
                {showAnswer ? 'Hide Answer' : 'Show Answer'}
              </ButtonText>
            </Button>
            <HStack style={styles.actionRow}>
              <Button
                style={[styles.actionButton, { backgroundColor: '#dc6b5c' }]}
                onPress={markForReview}
              >
                <MaterialCommunityIcons name="repeat-variant" size={24} color="white" />
                <ButtonText style={styles.buttonText}>Needs Practice</ButtonText>
              </Button>
              <Button
                style={[styles.actionButton, { backgroundColor: '#4caf8e' }]}
                onPress={markLearned}
              >
                <ButtonText style={styles.buttonText}>Learned</ButtonText>
                <MaterialIcons name="done-outline" size={20} color="white" />
              </Button>
            </HStack>
          </View>
        ) : reviewQueue.length !== 0 ? (
          <View>
            <View style={styles.card}>
              <Button
                onPress={startOver}
                style={[styles.actionButton, { backgroundColor: '#a16207', alignSelf: 'flex-end' }]}
              >
                <MaterialCommunityIcons name="restart" size={20} color="white" />
                <ButtonText style={styles.buttonText}>Restart Deck</ButtonText>
              </Button>
              <View style={{ height: '100%', justifyContent: 'center' }}>
                <Text style={[styles.congratText, { paddingBottom: 30 }]}>
                  🎉 You finished all cards!
                </Text>
              </View>
            </View>
            <HStack style={styles.actionRow}>
              <Button
                style={[styles.actionButton, { backgroundColor: '#4a6fb3' }]}
                onPress={startReview}
              >
                <MaterialCommunityIcons name="repeat-variant" size={24} color="white" />
                <ButtonText style={styles.buttonText}>Keep learning</ButtonText>
              </Button>
              <Button
                style={[styles.actionButton, { backgroundColor: '#ffdd54' }]}
                onPress={() => router.back()}
              >
                <ButtonText style={[styles.buttonText, { color: '#5e2606' }]}>
                  Done for today
                </ButtonText>
                <MaterialIcons name="done-outline" size={24} color="#5e2606" />
              </Button>
            </HStack>
          </View>
        ) : (
          <View>
            <View style={[styles.card, { justifyContent: 'center' }]}>
              <Text style={styles.congratText}>🎉 You learned all cards!</Text>
            </View>
            <HStack style={styles.actionRow}>
              <Button
                style={[styles.actionButton, { backgroundColor: '#a16207' }]}
                onPress={startOver}
              >
                <MaterialCommunityIcons name="repeat-variant" size={24} color="white" />
                <ButtonText style={styles.buttonText}>Start Over</ButtonText>
              </Button>
              <Button
                style={[styles.actionButton, { backgroundColor: '#ffdd54' }]}
                onPress={() => router.back()}
              >
                <ButtonText style={[styles.buttonText, { color: '#5e2606' }]}>
                  Done for today
                </ButtonText>
                <MaterialIcons name="done-outline" size={24} color="white" />
              </Button>
            </HStack>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    gap: 16,
    backgroundColor: '#fffafc',
  },
  pageContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    minWidth: '100%',
    backgroundColor: '#fef3c7',
    minHeight: '55%',
    maxHeight: '70%',
    borderRadius: 16,
    padding: 20,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTopic: {
    fontSize: 14,
    fontWeight: '600',
    color: '#b45309',
    backgroundColor: '#ffedd5',
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  progress: {
    fontSize: 16,
    color: '#a38f83',
  },
  cardText: {
    fontSize: 22,
    color: '#78350f',
    textAlign: 'left',
    lineHeight: 27,
  },
  answerText: {
    marginTop: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  showAnswerButton: {
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: '#b45309',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    gap: 8,
    flexWrap: 'wrap',
  },
  actionButton: {
    maxWidth: 150,
    minWidth: 140,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 14,
  },
  congratText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#78350f',
    // marginTop: 40,
    // marginBottom: 16,
    textAlign: 'center',
  },
});
