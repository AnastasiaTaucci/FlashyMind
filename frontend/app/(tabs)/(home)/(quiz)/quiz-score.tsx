import { Text, ScrollView, StyleSheet, View, Pressable, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as api from '@/service/api';

interface DetailedQuizResult {
  id: number;
  created_at: string;
  user_id: string;
  flashcard_deck_id: number;
  score: number;
  correct_answers: {
    question: string;
    user_answer: string;
    correct_answer: string;
  }[];
  wrong_answers: {
    question: string;
    user_answer: string;
    correct_answer: string;
  }[];
}

export default function QuizScore() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Extract parameters passed from quiz submission
  const quizResultId = params.quizResultId as string;
  const score = parseInt(params.score as string) || 0;
  const totalQuestions = parseInt(params.totalQuestions as string) || 0;
  const correctAnswers = parseInt(params.correctAnswers as string) || 0;
  const deckTitle = params.deckTitle as string;
  const deckId = params.deckId as string;

  const [detailedResult, setDetailedResult] = useState<DetailedQuizResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Calculate percentage
  const percentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

  // Determine performance message and color
  const getPerformanceInfo = () => {
    if (percentage >= 90) {
      return { message: 'Excellent!', color: '#10b981', emoji: '🎉' };
    } else if (percentage >= 80) {
      return { message: 'Great job!', color: '#3b82f6', emoji: '👏' };
    } else if (percentage >= 70) {
      return { message: 'Good work!', color: '#f59e0b', emoji: '👍' };
    } else if (percentage >= 60) {
      return { message: 'Not bad!', color: '#f97316', emoji: '💪' };
    } else {
      return { message: 'Keep practicing!', color: '#ef4444', emoji: '📚' };
    }
  };

  const performance = getPerformanceInfo();

  // Fetch detailed quiz results
  useEffect(() => {
    const fetchDetailedResults = async () => {
      if (!quizResultId) return;

      try {
        setIsLoading(true);
        const result = await api.getDetailedQuizResultById(parseInt(quizResultId));
        setDetailedResult(result);
      } catch (error) {
        console.error('Error fetching detailed quiz results:', error);
        Alert.alert('Error', 'Failed to load detailed results');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetailedResults();
  }, [quizResultId]);

  const renderAnswerCard = (
    item: { question: string; user_answer: string; correct_answer: string },
    isCorrect: boolean,
    index: number
  ) => (
    <View
      key={index}
      style={[styles.answerCard, isCorrect ? styles.correctCard : styles.incorrectCard]}
    >
      <View style={styles.cardHeader}>
        <Text style={[styles.statusText, isCorrect ? styles.correctText : styles.incorrectText]}>
          {isCorrect ? '✓ Correct' : '✗ Incorrect'}
        </Text>
      </View>

      <Text style={styles.questionText}>{item.question}</Text>

      <View style={styles.answerSection}>
        <Text style={styles.answerLabel}>Your Answer:</Text>
        <Text style={styles.answerText}>{item.user_answer || 'No answer provided'}</Text>
      </View>

      <View style={styles.answerSection}>
        <Text style={styles.answerLabel}>Correct Answer:</Text>
        <Text style={styles.answerText}>{item.correct_answer || 'No correct answer provided'}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Quiz Complete!</Text>
        <Text style={styles.deckTitle}>{deckTitle}</Text>
      </View>

      <View style={styles.scoreContainer}>
        <Text style={styles.emoji}>{performance.emoji}</Text>
        <Text style={[styles.percentage, { color: performance.color }]}>{percentage}%</Text>
        <Text style={[styles.performanceMessage, { color: performance.color }]}>
          {performance.message}
        </Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Score</Text>
          <Text style={styles.statValue}>{score} points</Text>
        </View>

        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Correct Answers</Text>
          <Text style={styles.statValue}>
            {correctAnswers}/{totalQuestions}
          </Text>
        </View>

        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Accuracy</Text>
          <Text style={styles.statValue}>{percentage}%</Text>
        </View>
      </View>

      {/* Detailed Results Section */}
      {!isLoading && detailedResult && (
        <View style={styles.detailedResultsContainer}>
          <Text style={styles.sectionTitle}>Detailed Results</Text>

          {/* Correct Answers */}
          {detailedResult.correct_answers && detailedResult.correct_answers.length > 0 && (
            <View style={styles.resultsSection}>
              <Text style={styles.resultsSectionTitle}>
                ✅ Correct Answers ({detailedResult.correct_answers.length})
              </Text>
              {detailedResult.correct_answers.map((item, index) =>
                renderAnswerCard(item, true, index)
              )}
            </View>
          )}

          {/* Incorrect Answers */}
          {detailedResult.wrong_answers && detailedResult.wrong_answers.length > 0 && (
            <View style={styles.resultsSection}>
              <Text style={styles.resultsSectionTitle}>
                ❌ Incorrect Answers ({detailedResult.wrong_answers.length})
              </Text>
              {detailedResult.wrong_answers.map((item, index) =>
                renderAnswerCard(item, false, index)
              )}
            </View>
          )}
        </View>
      )}

      <View style={styles.buttonContainer}>
        <Pressable
          style={styles.primaryButton}
          onPress={() => router.push(`/(tabs)/(home)/(quiz)/${deckId}`)}
        >
          <Text style={styles.primaryButtonText}>Try Again</Text>
        </Pressable>

        <Pressable style={styles.secondaryButton} onPress={() => router.push('/(tabs)/(home)')}>
          <Text style={styles.secondaryButtonText}>Back to Home</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 80,
    padding: 20,
    flexGrow: 1,
    paddingBottom: 100,
    backgroundColor: '#fffafc',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  deckTitle: {
    fontSize: 18,
    color: '#6b7280',
    textAlign: 'center',
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 40,
    paddingVertical: 30,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 10,
  },
  percentage: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  performanceMessage: {
    fontSize: 20,
    fontWeight: '600',
  },
  statsContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  statLabel: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
  statValue: {
    fontSize: 16,
    color: '#1f2937',
    fontWeight: 'bold',
  },
  buttonContainer: {
    gap: 15,
  },
  primaryButton: {
    backgroundColor: '#fbbf24',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fbbf24',
  },
  secondaryButtonText: {
    color: '#fbbf24',
    fontSize: 18,
    fontWeight: 'bold',
  },
  detailedResultsContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 20,
  },
  resultsSection: {
    marginBottom: 20,
  },
  resultsSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 10,
  },
  answerCard: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  correctText: {
    color: '#10b981',
  },
  incorrectText: {
    color: '#ef4444',
  },
  questionText: {
    fontSize: 16,
    color: '#1f2937',
    marginBottom: 10,
  },
  answerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  answerLabel: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
  answerText: {
    fontSize: 16,
    color: '#1f2937',
    fontWeight: 'bold',
  },
  correctCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#10b981',
  },
  incorrectCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
  },
});
