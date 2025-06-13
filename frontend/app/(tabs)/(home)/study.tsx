import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useFlashcardSetStore, useFlashcardStore } from '@/store/deck-card-store';

export default function StudyDeckScreen() {
  const { deckId } = useLocalSearchParams();
  const flashcardSets = useFlashcardSetStore((state) => state.flashcardSets);
  const flashcards = useFlashcardStore((state) => state.flashcards);

  const deck = flashcardSets.find((set) => String(set.id) === deckId);
  const matchedCards = flashcards.filter((card) => String(card.deck_id) === deckId);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isDone, setIsDone] = useState(false);

  if (!deck) {
    return (
      <View style={styles.container}>
        <Text>Deck not found.</Text>
      </View>
    );
  }

  if (matchedCards.length === 0) {
    return (
      <View style={styles.container}>
        <Text>No cards found for this deck.</Text>
      </View>
    );
  }

  const currentCard = matchedCards[currentIndex];

  const handleNext = () => {
    if (currentIndex < matchedCards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setShowAnswer(false);
    } else {
      setIsDone(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setShowAnswer(false);
    setIsDone(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Study: {deck.title}</Text>

      <View style={styles.card}>
        <Text style={styles.progress}>
          Card {currentIndex + 1} / {matchedCards.length}
        </Text>

        <Text style={styles.cardText}>Q: {currentCard.question}</Text>

        {showAnswer && (
          <Text style={[styles.cardText, { marginTop: 10 }]}>A: {currentCard.answer}</Text>
        )}
      </View>

      {isDone ? (
        <Button title="Start Over" onPress={handleRestart} />
      ) : (
        <>
          <Button
            title={showAnswer ? 'Hide Answer' : 'Show Answer'}
            onPress={() => setShowAnswer(!showAnswer)}
          />
          <Button title="Next Card" onPress={handleNext} />
        </>
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
});
