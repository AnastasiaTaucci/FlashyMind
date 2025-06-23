import { useFlashcardSetStore, useFlashcardStore } from '@/store/deck-card-store';
import { router, useLocalSearchParams } from 'expo-router';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  Alert,
  Animated,
} from 'react-native';
import Card from '@/components/Flashcard';
import { useEffect, useState, useRef } from 'react';
import { TextInput, Button, IconButton } from 'react-native-paper';
import { useAuth } from '@/context/AuthContext';
import * as api from '@/service/api';

export default function QuizScreen() {
  const { id } = useLocalSearchParams();
  const { flashcardSets, isLoading, error } = useFlashcardSetStore();
  const { flashcards } = useFlashcardStore();
  const { session } = useAuth();
  const deckId = Array.isArray(id) ? parseInt(id[0], 10) : parseInt(id as string, 10);
  const deck = flashcardSets.find((deck) => deck.id === deckId);

  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [shuffledCards, setShuffledCards] = useState<any[]>([]);
  const [userAnswer, setUserAnswer] = useState('');
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const flipAnimation = useRef(new Animated.Value(0)).current;

  // function to randomize the flashcards
  const randomizeFlashcards = () => {
    if (!deck) return [];
    const deckFlashcards = flashcards.filter((card) => card.deck_id === deck.id);
    const shuffledFlashcards = [...deckFlashcards].sort(() => Math.random() - 0.5);
    return shuffledFlashcards;
  };

  useEffect(() => {
    const cards = randomizeFlashcards();
    setShuffledCards(cards);
    setCurrentCardIndex(0);
    setUserAnswer('');
    setUserAnswers({});
    setIsFlipped(false);
    flipAnimation.setValue(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flashcards, deck]);

  const goToNextCard = () => {
    // Save current answer before moving
    if (currentCard && userAnswer.trim()) {
      setUserAnswers((prev) => ({
        ...prev,
        [currentCard.id]: userAnswer.trim(),
      }));
    }

    if (currentCardIndex < shuffledCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setUserAnswer('');
      setIsFlipped(false);
      flipAnimation.setValue(0);
    }
  };

  const goToPreviousCard = () => {
    // Save current answer before moving
    if (currentCard && userAnswer.trim()) {
      setUserAnswers((prev) => ({
        ...prev,
        [currentCard.id]: userAnswer.trim(),
      }));
    }

    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setUserAnswer('');
      setIsFlipped(false);
      flipAnimation.setValue(0);
    }
  };

  const handleFlipCard = () => {
    const toValue = isFlipped ? 0 : 1;

    Animated.timing(flipAnimation, {
      toValue,
      duration: 300,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        setIsFlipped(!isFlipped);
      }
    });
  };

  const submitQuiz = async () => {
    if (!session?.user?.id) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }

    try {
      setIsSubmitting(true);

      // Create a copy of current userAnswers and add the current answer
      const finalUserAnswers = { ...userAnswers };
      if (currentCard && userAnswer.trim()) {
        finalUserAnswers[currentCard.id] = userAnswer.trim();
      }

      // Prepare all answers for a single submission
      const allAnswers = shuffledCards.map((card) => {
        const answer = finalUserAnswers[card.id] || '';
        return { card_id: card.id, answer: answer };
      });

      // Submit all answers in a single API call and capture the response
      const quizResult = await api.createDetailedQuizResult(deckId, session.user.id, allAnswers);

      // Navigate to quiz score screen with the quiz result data
      router.push({
        pathname: '/(tabs)/(home)/(quiz)/quiz-score',
        params: {
          quizResultId: quizResult.id.toString(),
          score: quizResult.score.toString(),
          totalQuestions: shuffledCards.length.toString(),
          correctAnswers: quizResult.correct_answers.length.toString(),
          deckTitle: deck?.title || '',
          deckId: deckId.toString(),
        },
      });
    } catch (error) {
      console.error('Error submitting quiz:', error);
      Alert.alert('Error', 'Failed to submit quiz. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentCard = shuffledCards[currentCardIndex];

  // Create animated transforms for flip effect
  const frontAnimatedStyle = {
    transform: [
      {
        rotateY: flipAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '180deg'],
        }),
      },
    ],
  };

  const backAnimatedStyle = {
    transform: [
      {
        rotateY: flipAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: ['180deg', '360deg'],
        }),
      },
    ],
  };

  // Load saved answer when card changes
  useEffect(() => {
    if (currentCard && userAnswers[currentCard.id]) {
      setUserAnswer(userAnswers[currentCard.id]);
    } else {
      setUserAnswer('');
    }
  }, [currentCardIndex, currentCard, userAnswers]);

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  if (!deck) {
    return <Text>Deck not found</Text>;
  }

  if (shuffledCards.length === 0) {
    return (
      <KeyboardAvoidingView
        style={styles.pageWrapper}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={{ marginBottom: 10 }}>
            <Text style={{ color: 'white', fontSize: 16 }}>← Back</Text>
          </Pressable>
          <Text style={{ fontSize: 28, fontWeight: 'bold', color: 'white', marginBottom: 8 }}>
            {deck.title}
          </Text>
          <Text style={{ fontSize: 16, color: '#fbbf24', opacity: 0.9 }}>{deck.description}</Text>
        </View>
        <View style={styles.centerContent}>
          <Text style={styles.noCardsText}>No flashcards found in this deck</Text>
        </View>
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.pageWrapper}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={{ marginBottom: 10 }}>
          <Text style={{ color: 'white', fontSize: 16 }}>← Back</Text>
        </Pressable>

        <Text
          style={{
            fontSize: 28,
            fontWeight: 'bold',
            color: 'white',
            marginBottom: 8,
          }}
        >
          {deck.title}
        </Text>

        <Text
          style={{
            fontSize: 16,
            color: '#fbbf24',
            opacity: 0.9,
          }}
        >
          {deck.description}
        </Text>

        <Text
          style={{
            fontSize: 14,
            color: 'white',
            opacity: 0.8,
            marginTop: 8,
          }}
        >
          Card {currentCardIndex + 1} of {shuffledCards.length}
        </Text>
      </View>
      <View style={styles.flipButtonContainer}>
        {/* Flip Button */}
        <IconButton
          icon={isFlipped ? 'eye-off' : 'eye'}
          onPress={handleFlipCard}
          style={styles.flipButton}
          iconColor="white"
          size={24}
          mode="contained"
          containerColor="#fbbf24"
        />
      </View>

      {/* Current Card */}
      <View style={styles.cardContainer}>
        <View style={styles.cardWrapper}>
          {/* Front of card (Question) */}
          <Animated.View style={[styles.cardSide, frontAnimatedStyle]}>
            <Card>
              <Text
                style={{ color: 'white', fontSize: 18, fontWeight: '500', textAlign: 'center' }}
              >
                {currentCard?.question}
              </Text>

              <TextInput
                mode="outlined"
                label="Your Answer"
                value={userAnswer}
                onChangeText={setUserAnswer}
                style={styles.textInput}
                outlineColor="white"
                activeOutlineColor="#fbbf24"
                textColor="white"
                placeholderTextColor="white"
                multiline
                numberOfLines={3}
                contentStyle={styles.textInputContent}
              />
            </Card>
          </Animated.View>

          {/* Back of card (Answer) */}
          <Animated.View style={[styles.cardSide, styles.cardBack, backAnimatedStyle]}>
            <Card>
              <Text
                style={{ color: 'white', fontSize: 18, fontWeight: '500', textAlign: 'center' }}
              >
                {currentCard?.question}
              </Text>

              <View style={styles.answerContainer}>
                <Text style={styles.answerLabel}>Correct Answer:</Text>
                <Text style={styles.answerText}>{currentCard?.answer}</Text>
              </View>
            </Card>
          </Animated.View>
        </View>
      </View>

      {/* Navigation Controls */}
      <View style={styles.navigationContainer}>
        <Pressable
          style={[styles.navButton, currentCardIndex === 0 && styles.navButtonDisabled]}
          onPress={goToPreviousCard}
          disabled={currentCardIndex === 0}
        >
          <Text
            style={[styles.navButtonText, currentCardIndex === 0 && styles.navButtonTextDisabled]}
          >
            Previous
          </Text>
        </Pressable>

        {currentCardIndex === shuffledCards.length - 1 ? (
          <Button
            mode="contained"
            onPress={submitQuiz}
            loading={isSubmitting}
            disabled={isSubmitting}
            style={styles.submitButton}
            buttonColor="#fbbf24"
            textColor="white"
          >
            Submit Quiz
          </Button>
        ) : (
          <Pressable style={styles.navButton} onPress={goToNextCard}>
            <Text style={styles.navButtonText}>Next</Text>
          </Pressable>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#b45309',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  pageWrapper: {
    flex: 1,
    backgroundColor: '#fffafc',
    width: '100%',
  },
  headerText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  cardContainer: {
    flex: 1,
    marginTop: 100,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  navButton: {
    backgroundColor: '#fbbf24',
    padding: 10,
    borderRadius: 5,
  },
  navButtonDisabled: {
    backgroundColor: '#ccc',
  },
  navButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  navButtonTextDisabled: {
    color: '#999',
  },
  submitButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noCardsText: {
    color: '#999',
    fontSize: 16,
    fontWeight: 'bold',
  },
  textInput: {
    backgroundColor: 'transparent',
    margin: 10,
    alignSelf: 'center',
    width: '80%',
  },
  textInputContent: {
    fontSize: 18,
    color: 'white',
  },
  answerContainer: {
    margin: 10,
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    alignItems: 'center',
  },
  answerLabel: {
    color: '#fbbf24',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  answerText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
  flipButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#fbbf24',
    borderRadius: 20,
  },
  cardWrapper: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  cardSide: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    backfaceVisibility: 'hidden',
  },
  cardBack: {
    transform: [{ rotateY: '180deg' }],
  },
  flipButtonContainer: {
    position: 'absolute',
    top: 180,
    right: 10,
  },
});
