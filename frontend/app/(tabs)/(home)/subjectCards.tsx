import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, Alert } from 'react-native';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { useFlashcardStore, useFlashcardSetStore } from '@/store/deck-card-store';
import { Flashcard } from '@/types/Flashcard';

export default function SubjectCardsScreen() {
  const router = useRouter();
  const { subject, deckId } = useLocalSearchParams();
  const subjectName = typeof subject === 'string' ? subject : 'Unknown Subject';
  const currentDeckId = typeof deckId === 'string' && deckId ? parseInt(deckId, 10) : undefined;

  const { flashcards, fetchFlashcards, deleteFlashcard, isLoading, error } = useFlashcardStore();
  const { flashcardSets, fetchFlashcardSets, getFlashcardSetById, notConnected } = useFlashcardSetStore();

  const [subjectCards, setSubjectCards] = useState<Flashcard[]>([]);
  const [subjectDescription, setSubjectDescription] = useState<string>('');

  const currentDeck = currentDeckId
    ? getFlashcardSetById(currentDeckId)
    : flashcardSets.find((deck) => deck.subject.toLowerCase() === subjectName.toLowerCase());

  useEffect(() => {
    fetchFlashcards();
    fetchFlashcardSets();
  }, [fetchFlashcards, fetchFlashcardSets]);

  // Refresh flashcards when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchFlashcards();
    }, [fetchFlashcards])
  );

  useEffect(() => {
    if (currentDeckId && flashcardSets.length > 0) {
      const deck = getFlashcardSetById(currentDeckId);
      if (deck && deck.description) {
        setSubjectDescription(deck.description);
      } else {
        setSubjectDescription('');
      }
    } else {
      const matchingDeck = flashcardSets.find(
        (deck) => deck.subject.toLowerCase() === subjectName.toLowerCase()
      );
      if (matchingDeck && matchingDeck.description) {
        setSubjectDescription(matchingDeck.description);
      } else {
        setSubjectDescription('');
      }
    }
  }, [currentDeckId, subjectName, flashcardSets, getFlashcardSetById]);

  useEffect(() => {
    if (!flashcards || flashcards.length === 0) {
      setSubjectCards([]);
      return;
    }

    const filteredCards = flashcards.filter((card) => {
      if (!card) {
        return false;
      }

      if (currentDeckId && card.deck_id) {
        return card.deck_id === currentDeckId;
      }

      if (!currentDeckId && card.subject && typeof card.subject === 'string' && subjectName) {
        return card.subject.toLowerCase() === subjectName.toLowerCase();
      }

      return false;
    });

    setSubjectCards(filteredCards);
  }, [flashcards, currentDeckId, subjectName]);

  const handleCreateCard = () => {
    router.push({
      pathname: '/addCard',
      params: { subject: subjectName, deckId },
    });
  };

  const handleEditCard = (cardId: number) => {
    router.push({
      pathname: '/addCard',
      params: {
        cardId: cardId.toString(),
        deckId: deckId || '',
        subject: subjectName || '',
      },
    });
  };

  const handleDeleteCard = (cardId: number) => {
    Alert.alert('Delete Card', 'Are you sure you want to delete this flashcard?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteFlashcard(cardId);
            await fetchFlashcards();
            Alert.alert('Success', 'Flashcard deleted successfully!');
          } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to delete flashcard');
          }
        },
      },
    ]);
  };

  const handleEditDeck = () => {
    const deckToEdit =
      currentDeck ||
      flashcardSets.find((deck) => deck.subject.toLowerCase() === subjectName.toLowerCase());

    if (deckToEdit) {
      router.push({
        pathname: '/addDeck',
        params: { deckId: deckToEdit.id.toString() },
      });
    } else {
      Alert.alert('No Deck Found', 'Cannot find deck to edit. Please try again.', [{ text: 'OK' }]);
    }
  };

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#fffafc',
        }}
      >
        <ActivityIndicator size="large" color="#b45309" />
        <Text style={{ marginTop: 16, fontSize: 16, color: '#6b7280' }}>Loading cards...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fffafc' }}>
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
        <Pressable onPress={() => router.push('/')} style={{ marginBottom: 10 }}>
          <Text style={{ color: 'white', fontSize: 16 }}>← Back</Text>
        </Pressable>

        {/* Title and Settings Button */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: 12,
          }}
        >
          <Text
            style={{
              fontSize: 28,
              fontWeight: 'bold',
              color: 'white',
              flex: 1,
            }}
          >
            {currentDeck ? `${currentDeck.title} Cards` : `${subjectName} Cards`}
          </Text>

          <Pressable
            style={{
              width: 40,
              height: 40,
              backgroundColor: '#059669',
              borderRadius: 20,
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#059669',
              shadowOpacity: 0.3,
              shadowRadius: 4,
              shadowOffset: { width: 0, height: 2 },
              elevation: 3,
              marginLeft: 8,
            }}
            onPress={handleEditDeck}
            disabled={notConnected}
          >
            <MaterialIcons name="edit" size={24} color="white" />
          </Pressable>
        </View>

        {subjectDescription && subjectDescription !== '' && (
          <Text
            style={{
              fontSize: 16,
              color: '#fbbf24',
              marginBottom: 12,
              lineHeight: 22,
              opacity: 0.9,
            }}
          >
            {subjectDescription}
          </Text>
        )}

        <Text
          style={{
            fontSize: 16,
            color: '#fbbf24',
          }}
        >
          {subjectCards.length} {subjectCards.length === 1 ? 'card' : 'cards'}
        </Text>
      </View>

      <View style={{ padding: 20 }}>
        <Pressable
          onPress={handleCreateCard}
          disabled={notConnected}
          style={{
            backgroundColor: '#ffdd54',
            borderRadius: 12,
            padding: 16,
            alignItems: 'center',
            shadowColor: '#000',
            shadowOpacity: 0.1,
            shadowRadius: 5,
            shadowOffset: { width: 0, height: 2 },
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: '#5e2606',
            }}
          >
            + Create New Card
          </Text>
        </Pressable>
      </View>

      {error && (
        <View
          style={{
            backgroundColor: '#fee2e2',
            borderColor: '#fca5a5',
            borderWidth: 1,
            borderRadius: 8,
            padding: 12,
            marginHorizontal: 20,
            marginBottom: 10,
          }}
        >
          <Text style={{ color: '#dc2626', fontSize: 14 }}>{error}</Text>
        </View>
      )}

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {subjectCards.length === 0 ? (
          <View
            style={{
              backgroundColor: '#fef3c7',
              borderRadius: 16,
              padding: 40,
              alignItems: 'center',
              marginTop: 20,
              shadowColor: '#000',
              shadowOpacity: 0.05,
              shadowRadius: 10,
              shadowOffset: { width: 0, height: 2 },
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: '600', color: '#b45309', marginBottom: 8 }}>
              No cards yet
            </Text>
            <Text style={{ fontSize: 14, color: '#78350f', textAlign: 'center', marginBottom: 20 }}>
              Create your first flashcard for {subjectName}
            </Text>
            <Pressable
              onPress={handleCreateCard}
              disabled={notConnected}
              style={{
                backgroundColor: '#b45309',
                paddingHorizontal: 24,
                paddingVertical: 12,
                borderRadius: 12,
              }}
            >
              <Text style={{ color: 'white', fontWeight: '600', fontSize: 16 }}>
                Create First Card
              </Text>
            </Pressable>
          </View>
        ) : (
          subjectCards.map((card, index) => (
            <View
              key={card.id}
              style={{
                backgroundColor: '#fef3c7',
                borderRadius: 16,
                padding: 20,
                marginBottom: 16,
                shadowColor: '#000',
                shadowOpacity: 0.08,
                shadowRadius: 6,
                shadowOffset: { width: 0, height: 2 },
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 12,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: '#b45309',
                    backgroundColor: '#ffedd5',
                    paddingHorizontal: 12,
                    paddingVertical: 4,
                    borderRadius: 8,
                  }}
                >
                  {card.topic}
                </Text>
                <Text style={{ fontSize: 12, color: '#78350f' }}>Card #{index + 1}</Text>
              </View>

              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: '#b45309',
                  marginBottom: 8,
                }}
              >
                Q: {card.question}
              </Text>

              <Text
                style={{
                  fontSize: 14,
                  color: '#78350f',
                  lineHeight: 20,
                  marginBottom: 16,
                }}
              >
                A: {card.answer}
              </Text>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingTop: 12,
                  borderTopWidth: 1,
                  borderTopColor: '#fbbf24',
                }}
              >
                <Pressable
                  onPress={() => handleEditCard(card.id)}
                  disabled={notConnected}
                  style={{
                    backgroundColor: '#2563eb',
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    borderRadius: 8,
                    flex: 1,
                    marginRight: 8,
                  }}
                >
                  <Text
                    style={{
                      color: 'white',
                      fontWeight: '600',
                      textAlign: 'center',
                    }}
                  >
                    Edit
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => handleDeleteCard(card.id)}
                  disabled={notConnected}
                  style={{
                    backgroundColor: '#ef4444',
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    borderRadius: 8,
                    flex: 1,
                    marginLeft: 8,
                  }}
                >
                  <Text
                    style={{
                      color: 'white',
                      fontWeight: '600',
                      textAlign: 'center',
                    }}
                  >
                    Delete
                  </Text>
                </Pressable>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}
