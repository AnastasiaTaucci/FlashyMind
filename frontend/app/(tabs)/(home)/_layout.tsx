import { Stack } from 'expo-router';

export default function HomeLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(quiz)/quiz" />
      <Stack.Screen name="(quiz)/quiz-score" />
      <Stack.Screen name="addCard" />
      <Stack.Screen name="addDeck" />
      <Stack.Screen name="study" />
    </Stack>
  );
}
