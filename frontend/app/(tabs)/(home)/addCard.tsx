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
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useFlashcardStore } from '../../../store/deck-card-store';

export default function CreateCardScreen() {
  const router = useRouter();
  const { cardId, deckId, subject } = useLocalSearchParams();

  const { getFlashcardById, addFlashcard, updateFlashcard, isLoading, error, fetchFlashcards, flashcards } =
    useFlashcardStore();

  const [existingCard, setExistingCard] = useState(
    typeof cardId === 'string' ? getFlashcardById(cardId) : null
  );

  // Fetch flashcards when component mounts to ensure we have the latest data
  useEffect(() => {
    fetchFlashcards();
  }, [fetchFlashcards]);

  // Update existingCard when flashcards are loaded or cardId changes
  useEffect(() => {
    if (typeof cardId === 'string' && flashcards && flashcards.length > 0) {
      const card = getFlashcardById(cardId);
      setExistingCard(card);
    }
  }, [cardId, flashcards, getFlashcardById]);

  const validationSchema = Yup.object().shape({
    subject: Yup.string().required('Subject is required'),
    topic: Yup.string().required('Topic is required'),
    question: Yup.string().required('Question is required'),
    answer: Yup.string().required('Answer is required'),
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
        const targetDeckId = typeof deckId === 'string' ? deckId : (existingCard as any)?.deck_id;
        await addFlashcard(values, targetDeckId);
        Alert.alert('Success', 'Flashcard created successfully!');
      }

      // Refresh the flashcards list to show the new/updated card
      const { fetchFlashcards } = useFlashcardStore.getState();
      await fetchFlashcards();

      router.back();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to save flashcard. Please try again.');
    }
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1, backgroundColor: '#f4f4f5' }}
        >
          <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
            <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
              <Text
                style={{ fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 }}
              >
                {existingCard ? 'Edit Flashcard' : 'Create Flashcard'}
              </Text>

              {error && (
                <View
                  style={{
                    backgroundColor: '#fee2e2',
                    borderColor: '#fca5a5',
                    borderWidth: 1,
                    borderRadius: 8,
                    padding: 12,
                    marginBottom: 16,
                  }}
                >
                  <Text style={{ color: '#dc2626', fontSize: 14 }}>{error}</Text>
                </View>
              )}

              {['subject', 'topic', 'question', 'answer'].map((field) => (
                <View key={field} style={{ marginBottom: 15 }}>
                  <Text
                    style={{
                      fontWeight: '600',
                      color: '#374151',
                      marginBottom: 5,
                      textTransform: 'capitalize',
                    }}
                  >
                    {field}
                  </Text>
                  <TextInput
                    placeholder={`Enter ${field}`}
                    onChangeText={handleChange(field)}
                    onBlur={handleBlur(field)}
                    value={(values as any)[field]}
                    multiline={field === 'question' || field === 'answer'}
                    editable={!isLoading}
                    style={{
                      backgroundColor: 'white',
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor: '#d1d5db',
                      paddingHorizontal: 15,
                      paddingVertical: 12,
                      fontSize: 16,
                      shadowColor: '#000',
                      shadowOpacity: 0.05,
                      shadowRadius: 5,
                      shadowOffset: { width: 0, height: 2 },
                      minHeight: field === 'answer' ? 120 : undefined,
                      textAlignVertical: 'top',
                      opacity: isLoading ? 0.6 : 1,
                    }}
                  />
                  {touched[field as keyof typeof values] &&
                    errors[field as keyof typeof values] && (
                      <Text style={{ color: 'red', marginTop: 4 }}>
                        {errors[field as keyof typeof values]}
                      </Text>
                    )}
                </View>
              ))}

              <Pressable
                onPress={() => handleSubmit()}
                disabled={isLoading}
                style={{
                  backgroundColor: isLoading ? '#9ca3af' : '#4f46e5',
                  paddingVertical: 14,
                  borderRadius: 12,
                  shadowColor: '#4f46e5',
                  shadowOpacity: isLoading ? 0.2 : 0.5,
                  shadowRadius: 10,
                  shadowOffset: { width: 0, height: 4 },
                  opacity: isLoading ? 0.6 : 1,
                }}
              >
                <Text
                  style={{ color: 'white', textAlign: 'center', fontWeight: '600', fontSize: 18 }}
                >
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
                style={{
                  marginTop: 12,
                  paddingVertical: 12,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: '#9ca3af',
                  backgroundColor: 'white',
                  opacity: isLoading ? 0.6 : 1,
                }}
              >
                <Text style={{ textAlign: 'center', color: '#4b5563', fontWeight: '500' }}>
                  {subject ? 'Back to Cards' : 'Return to Home'}
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </Formik>
  );
}
