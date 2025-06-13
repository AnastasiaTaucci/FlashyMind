import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useFlashcardSetStore, useFlashcardStore } from '@/store/deck-card-store';
import { Flashcard } from '@/types/Flashcard';
import { HStack } from '@/components/ui/hstack';
import { Button, ButtonText } from '@/components/ui/button';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

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

  useEffect(() => {
    console.log('Updated reviewQueue:', reviewQueue);
  }, [reviewQueue]);

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
      console.log('markForReview reviewQueue', reviewQueue);
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
    <View style={styles.container}>
      <Pressable onPress={() => router.back()} style={{ marginBottom: 10 }}>
        <Text style={{ color: 'brown', fontSize: 16 }}>← Back</Text>
      </Pressable>
      <Text style={styles.title}>Study: {deck.title}</Text>
      {currentCard ? (
        <View>
          <View style={styles.card}>
            <Text style={styles.progress}>
              Card {currentIndex + 1} / {studyDeck.length}
            </Text>

            <Text style={styles.cardText}>Q: {currentCard.question}</Text>

            {showAnswer && (
              <Text style={[styles.cardText, { marginTop: 10 }]}>A: {currentCard.answer}</Text>
            )}

            <HStack style={styles.actionRow}>
              <Button style={styles.actionButton} onPress={markForReview}>
                <MaterialCommunityIcons name="repeat-variant" size={24} color="white" />
                <ButtonText style={styles.buttonText}>Needs Practice</ButtonText>
              </Button>
              <Button style={styles.actionButton} onPress={markLearned}>
                <ButtonText style={styles.buttonText}>Learned</ButtonText>
                <MaterialIcons name="done-outline" size={24} color="white" />
              </Button>
            </HStack>
          </View>
          <Button onPress={() => setShowAnswer(!showAnswer)}>
            <ButtonText style={styles.buttonText}>
              {showAnswer ? 'Hide Answer' : 'Show Answer'}
            </ButtonText>
          </Button>
        </View>
      ) : reviewQueue.length !== 0 ? (
        <View>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>🎉 You finished all cards!</Text>
          <HStack style={styles.actionRow}>
            <Button onPress={startOver} style={styles.actionButton}>
              <MaterialCommunityIcons name="restart" size={20} color="white" />
              <ButtonText style={styles.buttonText}>Restart Deck</ButtonText>
            </Button>
            <Button style={styles.actionButton} onPress={startReview}>
              <MaterialCommunityIcons name="repeat-variant" size={24} color="white" />
              <ButtonText style={styles.buttonText}>Keep learning</ButtonText>
            </Button>
            <Button style={styles.actionButton} onPress={() => router.back()}>
              <ButtonText style={styles.buttonText}>Done for today</ButtonText>
              <MaterialIcons name="done-outline" size={24} color="white" />
            </Button>
          </HStack>
        </View>
      ) : (
        <View>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>🎉 You learned all cards!</Text>
          <HStack style={styles.actionRow}>
            <Button
              style={[styles.actionButton]}
              onPress={startOver}
            >
              <MaterialCommunityIcons name="repeat-variant" size={24} color="white" />
              <ButtonText style={styles.buttonText}>Start Over</ButtonText>
            </Button>
            <Button style={[styles.actionButton]} onPress={() => router.back()}>
              <ButtonText style={styles.buttonText}>Done for today</ButtonText>
              <MaterialIcons name="done-outline" size={24} color="white" />
            </Button>
          </HStack>
        </View>
      )}
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
    backgroundColor: '#fffafc',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    width: '100%',
    padding: 24,
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  progress: {
    marginBottom: 10,
    fontSize: 16,
    color: '#6b7280',
  },
  cardText: {
    fontSize: 18,
    color: '#78350f',
    textAlign: 'center',
  },
  actionRow: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    maxWidth: 150,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
});
