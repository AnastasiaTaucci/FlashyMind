import { useFlashcardSetStore } from "@/store/deck-card-store";
import { router } from "expo-router";
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, View } from "react-native";


export default function QuizScreen() {
  const { flashcardSets, isLoading, error } = useFlashcardSetStore();

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
          Quiz
        </Text>

        <Text
          style={{
            fontSize: 16,
            color: '#fbbf24',
            opacity: 0.9,
          }}
        >
          Test your knowledge with interactive flashcards
        </Text>
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
}); 