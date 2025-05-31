import { Text, Button, ScrollView, StyleSheet } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';

export default function Quiz() {
  const router = useRouter();
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Quiz Screen</Text>

      <Button title="Quiz Score" onPress={() => router.push('./quiz-score')} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 12,
    flexGrow: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
});
