import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useFlashcardSetStore } from '../../../store/deck-card-store';

export default function AddDeckScreen() {
  const router = useRouter();
  const { deckId } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  const { getFlashcardSetById, addFlashcardSet, updateFlashcardSet, fetchFlashcardSets, error } =
    useFlashcardSetStore();

  const deckIdString = Array.isArray(deckId) ? deckId[0] : deckId;
  const deckIdNumber = deckIdString ? parseInt(deckIdString, 10) : undefined;
  const existingDeck = deckIdNumber ? getFlashcardSetById(deckIdNumber) : null;
  const isEditMode = !!existingDeck;

  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .trim()
      .required('Title is required')
      .min(2, 'Title must be at least 2 characters')
      .max(100, 'Title must be less than 100 characters'),
    subject: Yup.string()
      .trim()
      .required('Subject is required')
      .min(2, 'Subject must be at least 2 characters')
      .max(50, 'Subject must be less than 50 characters'),
    description: Yup.string().trim().max(500, 'Description must be less than 500 characters'),
  });

  const initialValues = {
    title: existingDeck?.title || '',
    subject: existingDeck?.subject || '',
    description: existingDeck?.description || '',
  };

  async function handleSubmit(values: typeof initialValues, { resetForm }: { resetForm: () => void }) {
    try {
      setIsLoading(true);

      if (isEditMode && existingDeck) {
        await updateFlashcardSet(existingDeck.id, values);
        Alert.alert('Success', 'Deck updated successfully!', [
          {
            text: 'OK',
            onPress: () =>
              router.navigate({
                pathname: './subjectCards',
                params: { subject: values.subject, deckId: existingDeck.id },
              }),
          },
        ]);
      } else {
        const deckData = { ...values, flashcards: [] };
        const newDeck = await addFlashcardSet(deckData);

        resetForm();

        Alert.alert('Success', 'Deck created successfully!', [
          {
            text: 'OK',
            onPress: () =>
              router.navigate({
                pathname: './subjectCards',
                params: { subject: values.subject, deckId: newDeck.id },
              }),
          },
        ]);
      }

      await fetchFlashcardSets();
    } catch (error: any) {
      console.error('Error saving deck:', error);
      Alert.alert('Error', error.message || 'Failed to save deck. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#fffafc' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View
        style={{
          backgroundColor: '#b45309',
          paddingTop: 60,
          paddingBottom: 20,
          paddingHorizontal: 20,
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
        }}
      >
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
          {isEditMode ? 'Edit Deck' : 'Create New Deck'}
        </Text>

        <Text
          style={{
            fontSize: 16,
            color: '#fbbf24',
            opacity: 0.9,
          }}
        >
          {isEditMode
            ? 'Update your flashcard deck details'
            : 'Add a new flashcard deck to your collection'}
        </Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
        {error && (
          <View
            style={{
              backgroundColor: '#fee2e2',
              borderColor: '#fca5a5',
              borderWidth: 1,
              borderRadius: 8,
              padding: 12,
              marginBottom: 20,
            }}
          >
            <Text style={{ color: '#dc2626', fontSize: 14 }}>{error}</Text>
          </View>
        )}

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched, resetForm }) => (
            <View style={{ gap: 20, paddingBottom: 100 }}>
              {/* Title */}
              <View>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: '#b45309',
                    marginBottom: 8,
                  }}
                >
                  Deck Title *
                </Text>
                <TextInput
                  style={{
                    backgroundColor: '#fef3c7',
                    borderWidth: 1,
                    borderColor: touched.title && errors.title ? '#ef4444' : '#fbbf24',
                    borderRadius: 12,
                    padding: 16,
                    fontSize: 16,
                    color: '#78350f',
                  }}
                  placeholder="e.g., Introduction to Biology"
                  placeholderTextColor="#a16207"
                  value={values.title}
                  onChangeText={handleChange('title')}
                  onBlur={handleBlur('title')}
                />
                {touched.title && errors.title && (
                  <Text style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>
                    {errors.title}
                  </Text>
                )}
              </View>

              {/* Subject */}
              <View>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: '#b45309',
                    marginBottom: 8,
                  }}
                >
                  Subject *
                </Text>
                <TextInput
                  style={{
                    backgroundColor: '#fef3c7',
                    borderWidth: 1,
                    borderColor: touched.subject && errors.subject ? '#ef4444' : '#fbbf24',
                    borderRadius: 12,
                    padding: 16,
                    fontSize: 16,
                    color: '#78350f',
                  }}
                  placeholder="e.g., Biology, Math, History"
                  placeholderTextColor="#a16207"
                  value={values.subject}
                  onChangeText={handleChange('subject')}
                  onBlur={handleBlur('subject')}
                />
                {touched.subject && errors.subject && (
                  <Text style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>
                    {errors.subject}
                  </Text>
                )}
              </View>

              {/* Description Field */}
              <View>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: '#b45309',
                    marginBottom: 8,
                  }}
                >
                  Description (Optional)
                </Text>
                <TextInput
                  style={{
                    backgroundColor: '#fef3c7',
                    borderWidth: 1,
                    borderColor: touched.description && errors.description ? '#ef4444' : '#fbbf24',
                    borderRadius: 12,
                    padding: 16,
                    fontSize: 16,
                    color: '#78350f',
                    minHeight: 100,
                    textAlignVertical: 'top',
                  }}
                  placeholder="Describe what this deck is about..."
                  placeholderTextColor="#a16207"
                  value={values.description}
                  onChangeText={handleChange('description')}
                  onBlur={handleBlur('description')}
                  multiline
                  numberOfLines={4}
                />
                {touched.description && errors.description && (
                  <Text style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>
                    {errors.description}
                  </Text>
                )}
              </View>

              {/* Submit */}
              <Pressable
                onPress={() => handleSubmit()}
                disabled={isLoading}
                style={{
                  backgroundColor: isLoading ? '#9ca3af' : '#059669',
                  borderRadius: 12,
                  padding: 16,
                  alignItems: 'center',
                  marginTop: 20,
                  shadowColor: '#059669',
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                  shadowOffset: { width: 0, height: 2 },
                  elevation: 3,
                }}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: 'bold',
                      color: 'white',
                    }}
                  >
                    {isEditMode ? 'Update Deck' : 'Create Deck'}
                  </Text>
                )}
              </Pressable>

              {/* Cancel */}
              <Pressable
                onPress={() => router.back()}
                style={{
                  backgroundColor: '#f3f4f6',
                  borderWidth: 1,
                  borderColor: '#d1d5db',
                  borderRadius: 12,
                  padding: 16,
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: '#6b7280',
                  }}
                >
                  Cancel
                </Text>
              </Pressable>
            </View>
          )}
        </Formik>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
