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
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import Card from '@/components/Flashcard';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { TextInput, Button } from 'react-native-paper';
import { useAuth } from '@/context/AuthContext';
import * as api from '@/service/api';

export default function QuizScreen() {
  const { id } = useLocalSearchParams();
  const { flashcardSets, isLoading } = useFlashcardSetStore();
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
  const [isTyped, setIsTyped] = useState(false);
  const flipAnimation = useRef(new Animated.Value(0)).current;
  const saveButtonPressed = useRef(false);

  const randomizeFlashcards = useCallback(() => {
    if (!deck) return [];
    const deckFlashcards = flashcards.filter((card) => card.deck_id === deck.id);
    return [...deckFlashcards].sort(() => Math.random() - 0.5);
  }, [deck, flashcards]);

  useEffect(() => {
    const cards = randomizeFlashcards();
    setShuffledCards(cards);
    setCurrentCardIndex(0);
    setUserAnswer('');
    setUserAnswers({});
    setIsFlipped(false);
    flipAnimation.setValue(0);
  }, [flashcards, deck, flipAnimation, randomizeFlashcards]);

  const goToNextCard = () => {
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

      const finalUserAnswers = { ...userAnswers };
      if (currentCard && userAnswer.trim()) {
        finalUserAnswers[currentCard.id] = userAnswer.trim();
      }

      const allAnswers = shuffledCards.map((card) => {
        const answer = finalUserAnswers[card.id] || '';
        return { card_id: card.id, answer: answer };
      });

      const quizResult = await api.createDetailedQuizResult(deckId, session.user.id, allAnswers);

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
    } catch {
      Alert.alert('Error', 'Failed to submit quiz. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentCard = shuffledCards[currentCardIndex];

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

  useEffect(() => {
    if (currentCard && userAnswers[currentCard.id]) {
      setUserAnswer(userAnswers[currentCard.id]);
    } else {
      setUserAnswer('');
    }
  }, [currentCardIndex, currentCard, userAnswers]);

  if (isLoading) return <Text>Loading...</Text>;
  if (!deck) return <Text>Deck not found</Text>;

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
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 20}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={{ flex: 1 }}>
          <View style={styles.header}>
            <Pressable onPress={() => router.back()} style={{ marginBottom: 10 }}>
              <Text style={{ color: 'white', fontSize: 16 }}>← Back</Text>
            </Pressable>
            <Text style={{ fontSize: 28, fontWeight: 'bold', color: 'white', marginBottom: 8 }}>
              {deck.title}
            </Text>
            <Text style={{ fontSize: 16, color: '#fbbf24', opacity: 0.9 }}>{deck.description}</Text>
            <Text style={{ fontSize: 14, color: 'white', opacity: 0.8, marginTop: 8 }}>
              Card {currentCardIndex + 1} of {shuffledCards.length}
            </Text>
          </View>

          <View style={styles.contentArea}>
            <View style={styles.cardContainer}>
              <View style={styles.cardWrapper}>
                <Animated.View
                  style={[
                    styles.cardSide,
                    frontAnimatedStyle,
                    !isFlipped && { pointerEvents: 'auto' },
                    isFlipped && { pointerEvents: 'none' },
                  ]}
                >
                  <Card>
                    <View style={styles.cardContentContainer}>
                      <Pressable onPress={handleFlipCard}>
                        <Text
                          style={{
                            color: 'white',
                            fontSize: 18,
                            fontWeight: '500',
                            textAlign: 'center',
                            marginBottom: 15,
                          }}
                        >
                          {currentCard?.question}
                        </Text>
                      </Pressable>

                      <View style={styles.inputContainer}>
                        <TextInput
                          mode="outlined"
                          placeholder="Your Answer"
                          value={userAnswer}
                          onChangeText={(text) => {
                            setUserAnswer(text);
                            setIsTyped(text.length > 0);
                          }}
                          onFocus={() => setIsTyped(true)}
                          onBlur={() => {
                            setTimeout(() => {
                              if (!saveButtonPressed.current) {
                                setIsTyped(userAnswer.length > 0);
                              }
                            }, 100);
                          }}
                          style={styles.textInput}
                          outlineColor="#fbbf24"
                          activeOutlineColor="#ffdd54"
                          textColor="#78350f"
                          placeholderTextColor="#a16207"
                          multiline
                          numberOfLines={2}
                          contentStyle={styles.textInputContent}
                          theme={{
                            colors: {
                              onSurfaceVariant: '#78350f',
                              outline: '#fbbf24',
                              primary: '#ffdd54',
                              surface: '#fef3c7',
                              onSurface: '#78350f',
                            },
                          }}
                        />
                      </View>
                    </View>
                  </Card>
                </Animated.View>

                <Animated.View
                  style={[
                    styles.cardSide,
                    styles.cardBack,
                    backAnimatedStyle,
                    isFlipped && { pointerEvents: 'auto' },
                    !isFlipped && { pointerEvents: 'none' },
                  ]}
                >
                  <Card>
                    <View style={styles.cardContentContainer}>
                      <Pressable onPress={handleFlipCard}>
                        <Text
                          style={{
                            color: 'white',
                            fontSize: 18,
                            fontWeight: '500',
                            textAlign: 'center',
                            marginBottom: 15,
                          }}
                        >
                          {currentCard?.question}
                        </Text>
                      </Pressable>

                      <View style={styles.inputContainer}>
                        <View style={styles.answerContainer}>
                          <Text style={styles.answerLabel}>Correct Answer:</Text>
                          <Text style={styles.answerText}>{currentCard?.answer}</Text>
                        </View>
                      </View>
                    </View>
                  </Card>
                </Animated.View>
              </View>

              <View style={styles.navigationButtons}>
                {!isTyped ? (
                  <>
                    <Pressable
                      style={[styles.navButton, currentCardIndex === 0 && styles.navButtonDisabled]}
                      onPress={goToPreviousCard}
                      disabled={currentCardIndex === 0}
                    >
                      <Text
                        style={[
                          styles.navButtonText,
                          currentCardIndex === 0 && styles.navButtonTextDisabled,
                        ]}
                      >
                        Previous
                      </Text>
                    </Pressable>

                    {currentCardIndex === shuffledCards.length - 1 ? (
                      <Pressable
                        style={styles.navButton}
                        onPress={submitQuiz}
                        disabled={isSubmitting}
                      >
                        <Text style={styles.navButtonText}>
                          {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
                        </Text>
                      </Pressable>
                    ) : (
                      <Pressable style={styles.navButton} onPress={goToNextCard}>
                        <Text style={styles.navButtonText}>Next</Text>
                      </Pressable>
                    )}
                  </>
                ) : (
                  <View style={styles.saveButtonContainer}>
                    <Button
                      mode="contained"
                      onPress={() => {
                        saveButtonPressed.current = true;
                        if (currentCard && userAnswer.trim()) {
                          setUserAnswers((prev) => ({
                            ...prev,
                            [currentCard.id]: userAnswer.trim(),
                          }));
                        }
                        setIsTyped(false);
                        Keyboard.dismiss();
                        setTimeout(() => {
                          saveButtonPressed.current = false;
                        }, 200);
                      }}
                      style={styles.saveAnswerButton}
                      buttonColor="#059669"
                      textColor="white"
                    >
                      Save Answer
                    </Button>
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#b45309',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  pageWrapper: {
    flex: 1,
    backgroundColor: '#fffafc',
    width: '100%',
  },

  cardContainer: {
    alignItems: 'center',
    marginBottom: 10,
    flex: 0,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 5,
    gap: 20,
  },
  contentArea: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: 'flex-start',
  },
  navButton: {
    backgroundColor: '#fbbf24',
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonDisabled: {
    backgroundColor: '#d1d5db',
  },
  navButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  navButtonTextDisabled: {
    color: '#9ca3af',
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
    backgroundColor: '#fef3c7',
    margin: 5,
    alignSelf: 'center',
    width: '90%',
    maxHeight: 100,
  },
  textInputContent: {
    fontSize: 14,
    color: '#78350f',
    paddingTop: 8,
  },
  answerContainer: {
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    alignItems: 'center',
  },
  answerLabel: {
    color: '#fbbf24',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  answerText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 22,
  },
  cardWrapper: {
    width: '100%',
    position: 'relative',
    height: 300,
    marginBottom: 20,
  },
  cardSide: {
    width: '100%',
    height: 300,
    position: 'absolute',
    backfaceVisibility: 'hidden',
  },
  cardBack: {
    transform: [{ rotateY: '180deg' }],
  },
  saveAnswerButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 120,
  },
  saveButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContentContainer: {
    height: 250,
    padding: 20,
    justifyContent: 'space-between',
  },
  inputContainer: {
    flex: 1,
    justifyContent: 'center',
  },
});
