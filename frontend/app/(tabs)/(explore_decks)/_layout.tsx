import { Stack } from 'expo-router';

export default function ExploreDecksLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="addDeck" />
      <Stack.Screen name="editDeck" />
    </Stack>
  );
}
