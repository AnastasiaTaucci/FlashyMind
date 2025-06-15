import React from 'react';
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
import { useRouter } from 'expo-router';

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

  const validationSchema = Yup.object().shape({
    amount: Yup.number().min(1).max(50).required('Number of questions is required'),
    category: Yup.string().required('Please choose category'),
    difficulty: Yup.string().required('Please choose difficulty'),
  });

  const initialValues = {
    amount: '10',
    category: 'Any Category',
    difficulty: 'Any Difficulty',
  };

  async function handleSubmit(
    values: typeof initialValues,
    { resetForm }: { resetForm: () => void }
  ) {
    console.log('Explore with values:', values);
    // TODO: Call Zustand action here
    router.push({ pathname: './../(home)/subjectCards', params: { explore: 'yes' } });
    resetForm();
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1, backgroundColor: '#f4f4f5' }}
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, padding: 20 }}
            keyboardShouldPersistTaps="handled"
          >
            <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
              <Text style={styles.title}>Explore External Decks</Text>

              {/* Number of Questions */}
              <Text style={styles.label}>Number of Questions</Text>
              <TextInput
                keyboardType="numeric"
                value={values.amount}
                onChangeText={handleChange('amount')}
                onBlur={handleBlur('amount')}
                style={styles.input}
              />
              {touched.amount && errors.amount && <Text style={styles.error}>{errors.amount}</Text>}

              {/* Category */}
              <Text style={styles.label}>Select Category</Text>
              <TextInput
                value={values.category}
                onChangeText={handleChange('category')}
                onBlur={handleBlur('category')}
                placeholder="Category"
                style={styles.input}
              />
              {touched.category && errors.category && (
                <Text style={styles.error}>{errors.category}</Text>
              )}

              {/* Difficulty */}
              <Text style={styles.label}>Select Difficulty</Text>
              <TextInput
                value={values.difficulty}
                onChangeText={handleChange('difficulty')}
                onBlur={handleBlur('difficulty')}
                placeholder="Difficulty"
                style={styles.input}
              />
              {touched.difficulty && errors.difficulty && (
                <Text style={styles.error}>{errors.difficulty}</Text>
              )}

              {/* Submit */}
              <Pressable onPress={() => handleSubmit()} style={styles.button}>
                <Text style={styles.buttonText}>Explore</Text>
              </Pressable>

            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </Formik>
  );
};

export default ExploreDeckScreen;

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
  button: {
    backgroundColor: '#4f46e5',
    marginTop: 24,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#4f46e5',
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    opacity: 1,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 18,
  },
});
