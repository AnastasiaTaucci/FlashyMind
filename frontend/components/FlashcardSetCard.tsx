import React from 'react';
import { StyleSheet, Text, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useFlashcardSetStore, useFlashcardStore } from '@/store/deck-card-store';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Button, ButtonText } from '@/components/ui/button';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { FlashcardSet } from '@/types/FlashcardSet';

export default function FlashcardSetCard({ item }: { item: FlashcardSet }) {
  const router = useRouter();
  const { deleteFlashcardSet, isDeleting } = useFlashcardSetStore();
  const { flashcards } = useFlashcardStore();

  const cardCount = flashcards.filter((card) => card.deck_id === item.id).length;

  const handleDeleteDeck = async () => {
    Alert.alert('Delete Deck', `Are you sure you want to delete "${item.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const result = await deleteFlashcardSet(item.id, false);

            if (result.needsConfirmation) {
              Alert.alert('Delete Deck', `${result.error}`, [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Delete All',
                  style: 'destructive',
                  onPress: async () => {
                    try {
                      await deleteFlashcardSet(item.id, true);
                      Alert.alert('Success', 'Deck and flashcards deleted successfully!');
                    } catch (err: any) {
                      Alert.alert('Error', err.message || 'Failed to delete');
                    }
                  },
                },
              ]);
            } else {
              // Delete immediately (no flashcards)
              await deleteFlashcardSet(item.id, true);
              Alert.alert('Success', `${result.message}`);
            }
          } catch (error: any) {
            Alert.alert(
              'Cannot Delete Deck',
              error.message || 'Failed to delete deck. Please try again.',
              [{ text: 'OK', style: 'default' }]
            );
          }
        },
      },
    ]);
  };

  return (
    <Box style={styles.card}>
      <VStack style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardSubtitle}>{item.subject}</Text>
        <Text style={styles.cardDescription}>{item.description ? item.description : ''}</Text>
        <Text style={styles.cardCount}>Cards: {cardCount}</Text>

        <HStack style={styles.actionRow}>
          <Button
            style={[styles.actionButton, styles.studyButton]}
            onPress={() => router.push({ pathname: './study', params: { deckId: item.id } })}
          >
            <ButtonText style={styles.buttonText}>Study</ButtonText>
            <MaterialCommunityIcons name="head-flash" size={24} color="white" />
          </Button>
          <Button
            style={[styles.actionButton, styles.quizButton]}
            onPress={() => router.push({ pathname: './(quiz)/[id]', params: { id: item.id } })}
          >
            <ButtonText style={styles.buttonText}>Quiz</ButtonText>
            <MaterialIcons name="quiz" size={24} color="white" />
          </Button>
        </HStack>
      </VStack>

      <VStack style={styles.iconColumn}>
        <Button
          testID="edit-button" // this is for the test
          style={[styles.iconButton, styles.cardsButton]}
          onPress={() =>
            router.push({
              pathname: './subjectCards',
              params: { subject: item.subject, deckId: item.id },
            })
          }
        >
          <MaterialCommunityIcons name="cards-outline" size={22} color="white" />
        </Button>

        <Button
          testID="delete-button" // this is for the test
          disabled={isDeleting}
          style={[styles.iconButton, { backgroundColor: isDeleting ? '#9ca3af' : '#ef4444' }]}
          onPress={handleDeleteDeck}
        >
          <MaterialIcons name="delete" size={20} color="white" />
        </Button>
      </VStack>
    </Box>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fef3c7',
    padding: 16,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  cardContent: {
    paddingRight: 60,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#b45309',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#78350f',
    marginTop: 2,
  },
  cardDescription: {
    marginTop: 6,
    fontSize: 14,
    color: '#444',
  },
  cardCount: {
    marginTop: 8,
    fontSize: 13,
    fontStyle: 'italic',
    color: '#6b7280',
  },
  actionRow: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    maxWidth: 150,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  studyButton: {
    backgroundColor: '#2563eb',
  },
  quizButton: {
    backgroundColor: '#b854ff',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
  iconColumn: {
    position: 'absolute',
    right: 10,
    top: 16,
    gap: 10,
  },
  iconButton: {
    padding: 8,
    backgroundColor: '#5492f7',
    borderRadius: 10,
  },
  cardsButton: {
    backgroundColor: '#059669',
  },
});
