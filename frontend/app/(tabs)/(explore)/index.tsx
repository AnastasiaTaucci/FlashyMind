import React, { useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useRouter, useFocusEffect } from 'expo-router';
import { Menu, Button } from 'react-native-paper';
import { useExploreDeckStore } from '@/store/explore-deck-store';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VStack } from '@/components/ui/vstack';
import { Heading } from '@/components/ui/heading';

const categories = [
  'Any Category',
  'General Knowledge',
  'Entertainment: Books',
  'Entertainment: Film',
  'Entertainment: Music',
  'Entertainment: Musicals & Theatres',
  'Entertainment: Television',
  'Entertainment: Video Games',
  'Entertainment: Board Games',
  'Science & Nature',
  'Science: Computers',
  'Science: Mathematics',
  'Mythology',
  'Sports',
  'Geography',
  'History',
  'Politics',
  'Art',
  'Celebrities',
  'Animals',
  'Vehicles',
  'Entertainment: Comics',
  'Science: Gadgets',
  'Entertainment: Japanese Anime & Manga',
  'Entertainment: Cartoon & Animations',
];

const difficulties = ['Any Difficulty', 'Easy', 'Medium', 'Hard'];

const ExploreDeckScreen = () => {
  const router = useRouter();
  const [categoryMenuVisible, setCategoryMenuVisible] = useState(false);
  const [difficultyMenuVisible, setDifficultyMenuVisible] = useState(false);
  const { fetchExploreDeck } = useExploreDeckStore();

  const validationSchema = Yup.object().shape({
    amount: Yup.number()
      .min(1)
      .max(50)
      .integer('Must be a whole number')
      .required('Number of questions is required'),
    category: Yup.string().required('Please choose category'),
    difficulty: Yup.string().required('Please choose difficulty'),
  });

  const initialValues = {
    amount: '10',
    category: 'Any Category',
    difficulty: 'Any Difficulty',
  };

  const formRef = useRef<any>(null);

  useFocusEffect(
    useCallback(() => {
      // When the screen is focused, reset the form
      if (formRef.current?.resetForm) {
        formRef.current.resetForm();
      }
    }, [])
  );

  async function handleSubmit(
    values: typeof initialValues,
    { resetForm }: { resetForm: () => void }
  ) {
    await fetchExploreDeck(parseInt(values.amount), values.category, values.difficulty);
    router.push({
      pathname: './subjectCards',
      params: {
        category: values.category,
        difficulty: values.difficulty,
        amount: parseInt(values.amount),
      },
    });
    resetForm();
  }

  return (
    <SafeAreaView style={styles.container}>
      <Formik
        innerRef={formRef}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardView}
          >
            <VStack style={styles.pageWrapper}>
              <Heading style={styles.heading}>Import External Decks</Heading>

              <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.formContainer}>
                  {/* Number of Questions */}
                  <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Number of Questions</Text>
                    <TextInput
                      keyboardType="numeric"
                      value={values.amount}
                      onChangeText={handleChange('amount')}
                      onBlur={handleBlur('amount')}
                      style={styles.input}
                      placeholder="Enter number (1-50)"
                      placeholderTextColor="#d1d5db"
                    />
                    {touched.amount && errors.amount && (
                      <Text style={styles.error}>{errors.amount}</Text>
                    )}
                  </View>

                  {/* Category */}
                  <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Select Category</Text>
                    <Menu
                      visible={categoryMenuVisible}
                      onDismiss={() => setCategoryMenuVisible(false)}
                      anchor={
                        <Button
                          onPress={() => setCategoryMenuVisible(true)}
                          style={styles.menuButton}
                          labelStyle={styles.menuButtonLabel}
                        >
                          {values.category}
                        </Button>
                      }
                      contentStyle={styles.menuContent}
                    >
                      <View style={styles.menuScrollContainer}>
                        <ScrollView>
                          {categories.map((label) => (
                            <Menu.Item
                              key={label}
                              onPress={() => {
                                handleChange('category')(label);
                                setCategoryMenuVisible(false);
                              }}
                              title={label}
                              titleStyle={styles.menuItemTitle}
                            />
                          ))}
                        </ScrollView>
                      </View>
                    </Menu>
                  </View>

                  {/* Difficulty */}
                  <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Select Difficulty</Text>
                    <Menu
                      visible={difficultyMenuVisible}
                      onDismiss={() => setDifficultyMenuVisible(false)}
                      anchor={
                        <Button
                          onPress={() => setDifficultyMenuVisible(true)}
                          style={styles.menuButton}
                          labelStyle={styles.menuButtonLabel}
                        >
                          {values.difficulty}
                        </Button>
                      }
                      contentStyle={styles.menuContent}
                    >
                      <View style={styles.menuScrollContainer}>
                        <ScrollView>
                          {difficulties.map((level) => (
                            <Menu.Item
                              key={level}
                              onPress={() => {
                                handleChange('difficulty')(level);
                                setDifficultyMenuVisible(false);
                              }}
                              title={level}
                              titleStyle={styles.menuItemTitle}
                            />
                          ))}
                        </ScrollView>
                      </View>
                    </Menu>
                  </View>

                  {/* Submit Button */}
                  <Pressable onPress={() => handleSubmit()} style={styles.exploreButton}>
                    <Text style={styles.exploreButtonText}>🚀 Start Exploring</Text>
                  </Pressable>
                </View>
              </ScrollView>
            </VStack>
          </KeyboardAvoidingView>
        )}
      </Formik>
    </SafeAreaView>
  );
};

export default ExploreDeckScreen;

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
  },
  menuButton: {
    backgroundColor: '#f9fafb',
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    justifyContent: 'flex-start',
    minHeight: 50,
  },
  menuButtonLabel: {
    color: '#374151',
    fontSize: 16,
    textAlign: 'left',
    width: '100%',
    paddingHorizontal: 0,
    paddingLeft: 16,
    marginHorizontal: 0,
  },
  menuContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  menuScrollContainer: {
    maxHeight: 250,
  },
  menuItemTitle: {
    color: '#374151',
    fontSize: 15,
  },
  error: {
    color: '#dc2626',
    fontSize: 14,
    marginTop: 6,
    fontWeight: '500',
  },
  exploreButton: {
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
  exploreButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
  },
});
