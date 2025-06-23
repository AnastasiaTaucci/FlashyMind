import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  StyleSheet,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useFlashcardStore } from '@/store/deck-card-store';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VStack } from '@/components/ui/vstack';
import { Heading } from '@/components/ui/heading';

export default function CreateCardScreen() {
  const router = useRouter();
  const { cardId, deckId, subject } = useLocalSearchParams();

  const {
    getFlashcardById,
    addFlashcard,
    updateFlashcard,
    isLoading,
    error,
    fetchFlashcards,
    flashcards,
  } = useFlashcardStore();

  const cardIdNumber = typeof cardId === 'string' && cardId ? parseInt(cardId, 10) : undefined;
  const deckIdNumber = typeof deckId === 'string' && deckId ? parseInt(deckId, 10) : undefined;

  const [existingCard, setExistingCard] = useState(
    cardIdNumber ? getFlashcardById(cardIdNumber) : null
  );

  useEffect(() => {
    fetchFlashcards();
  }, [fetchFlashcards]);

  useEffect(() => {
    useFlashcardStore.setState({ error: null });
  }, []);

  // Update existingCard
  useEffect(() => {
    if (cardIdNumber && flashcards && flashcards.length > 0) {
      const card = getFlashcardById(cardIdNumber);
      setExistingCard(card);
    }
  }, [cardIdNumber, flashcards, getFlashcardById]);

  const validationSchema = Yup.object().shape({
    subject: Yup.string()
      .trim()
      .required('Subject is required')
      .max(50, 'Subject must be less than 50 characters'),
    topic: Yup.string()
      .trim()
      .required('Topic is required')
      .max(50, 'Topic must be less than 50 characters'),
    question: Yup.string()
      .trim()
      .required('Question is required')
      .max(200, 'Question must be less than 200 characters'),
    answer: Yup.string()
      .trim()
      .required('Answer is required')
      .max(200, 'Answer must be less than 200 characters'),
  });

  const initialValues = {
    subject: existingCard?.subject || (typeof subject === 'string' ? subject : ''),
    topic: existingCard?.topic || '',
    question: existingCard?.question || '',
    answer: existingCard?.answer || '',
  };

  async function handleSubmit(values: typeof initialValues) {
    try {
      if (existingCard) {
        await updateFlashcard(existingCard.id, values);
        Alert.alert('Success', 'Flashcard updated successfully!');
      } else {
        const targetDeckId = deckIdNumber;
        await addFlashcard(values, targetDeckId);
        Alert.alert('Success', 'Flashcard created successfully!');
      }

      const { fetchFlashcards } = useFlashcardStore.getState();
      await fetchFlashcards();

      router.back();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to save flashcard. Please try again.');
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.keyboardView}
          >
            <VStack style={styles.pageWrapper}>
              <Heading style={styles.heading}>
                {existingCard ? 'Edit Flashcard' : 'Create Flashcard'}
              </Heading>

              <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.formContainer}>
                  {error && (
                    <View style={styles.errorContainer}>
                      <Text style={styles.errorText}>{error}</Text>
                    </View>
                  )}

                  {['subject', 'topic', 'question', 'answer'].map((field) => (
                    <View key={field} style={styles.fieldContainer}>
                      <Text style={styles.label}>
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                      </Text>
                      <TextInput
                        placeholder={`Enter ${field}`}
                        placeholderTextColor="rgba(0, 0, 0, 0.3)"
                        onChangeText={handleChange(field)}
                        onBlur={handleBlur(field)}
                        value={(values as any)[field]}
                        multiline={field === 'question' || field === 'answer'}
                        editable={!isLoading}
                        style={[
                          styles.input,
                          field === 'answer' && styles.answerInput,
                          isLoading && styles.inputDisabled,
                        ]}
                      />
                      {touched[field as keyof typeof values] &&
                        errors[field as keyof typeof values] && (
                          <Text style={styles.error}>{errors[field as keyof typeof values]}</Text>
                        )}
                    </View>
                  ))}

                  <Pressable
                    onPress={() => handleSubmit()}
                    disabled={isLoading}
                    style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
                  >
                    <Text style={styles.saveButtonText}>
                      {isLoading ? 'Saving...' : existingCard ? 'Update Card' : 'Save Card'}
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={() => {
                      if (subject && deckId) {
                        router.push({
                          pathname: '/subjectCards',
                          params: { subject, deckId },
                        });
                      } else {
                        router.push('/');
                      }
                    }}
                    disabled={isLoading}
                    style={[styles.cancelButton, isLoading && styles.cancelButtonDisabled]}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </Pressable>
                </View>
              </ScrollView>
            </VStack>
          </KeyboardAvoidingView>
        )}
      </Formik>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffafc',
    width: '100%',
  },
  keyboardView: {
    flex: 1,
  },
  pageWrapper: {
    flex: 1,
    marginTop: 30,
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 30,
    marginHorizontal: 16,
    color: '#5e2606',
    lineHeight: 36,
    textAlign: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  errorContainer: {
    backgroundColor: '#fee2e2',
    borderColor: '#fca5a5',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 14,
    fontWeight: '500',
  },
  fieldContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5e2606',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f9fafb',
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    fontSize: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    color: '#374151',
    textAlignVertical: 'top',
  },
  answerInput: {
    minHeight: 120,
  },
  inputDisabled: {
    opacity: 0.6,
  },
  error: {
    color: '#dc2626',
    fontSize: 14,
    marginTop: 6,
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#4f46e5',
    marginTop: 16,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderColor: '#4f46e5',
    borderWidth: 1,
    shadowColor: '#4f46e5',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  saveButtonDisabled: {
    backgroundColor: '#9ca3af',
    borderColor: '#6b7280',
    shadowColor: '#6b7280',
    shadowOpacity: 0.2,
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
  },
  cancelButton: {
    marginTop: 12,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
    alignItems: 'center',
  },
  cancelButtonDisabled: {
    opacity: 0.6,
  },
  cancelButtonText: {
    color: '#6b7280',
    fontWeight: '600',
    fontSize: 16,
  },
});
