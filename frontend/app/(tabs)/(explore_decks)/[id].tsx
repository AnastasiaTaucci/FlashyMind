import React, { useState, useEffect } from 'react';
import { TextInput, Button, Text, ScrollView, Dimensions, View, TouchableOpacity, StyleSheet } from 'react-native';
import { VStack } from '@/components/ui/vstack';
import { Box } from '@/components/ui/box';
import Card from '@/components/Card';
import { Heading } from '@/components/ui/heading';
import { router, useLocalSearchParams } from 'expo-router';
import { fetchCards, getDeck, getDecks, deleteFlashcard } from '@/service/api';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

interface Card {
  question: string;
  answer: string;
  subject: string;
  topic: string;
  deck_id: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  id: string;
}

interface Deck {
  id: string;
  title: string;
  subject: string;
  description?: string;
}

const DeckPage = () => {
  const [search, setSearch] = useState('');
  const [cards, setCards] = useState<Card[]>([]);
  const [deck, setDeck] = useState<Deck | null>(null);
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const { height } = Dimensions.get('window');

  useFocusEffect(
    React.useCallback(() => {
      const loadCards = async () => {
        try {
          setLoading(true);
          const data = await fetchCards(id as string);
          setCards(data);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching cards:', error);
        }
      };

      const loadDeck = async () => {
        try {
          const data = await getDeck(id as string);
          setDeck(data);
        } catch (error) {
          console.error('Error fetching deck:', error);
        }
      };

      loadCards();
      loadDeck();
    }, [id])
  );

  const handleSearch = (text: string) => {
    setSearch(text);
  };

  const filteredCards = cards.filter((card) => {
    const searchTerms = search.toLowerCase().split(' ');
    return searchTerms.every((term) => card.question?.toLowerCase().includes(term));
  });

  const handleAddCard = () => {
    router.navigate(`../../addCard/${id}`);
  };

  const handleDeleteCard = async (cardId: string) => {
    try {
      // Call the API to delete the card
      await deleteFlashcard(cardId);
      // Update the state to remove the deleted card
      setCards((prevCards) => prevCards.filter((card) => card.id !== cardId));
    } catch (error) {
      console.error('Error deleting card:', error);
    }
  };

  return (
    <>
    {loading ? (
        <Text>Loading...</Text>
    ) : ( 
    <VStack space="md">
      <TouchableOpacity
            style={styles.backButton}
              onPress={() => router.navigate(`../(decks)`)}
          >
            <MaterialIcons name="arrow-back" size={24} color="gray" />
            <Text style={styles.buttonText}>Back to Decks</Text>
          </TouchableOpacity>
      <Box style={{ padding: 16, borderWidth: 1, borderRadius: 4 }}>
        <Heading>Search Cards</Heading>
        <TextInput
          placeholder="Search Cards"
          style={{ padding: 8, marginBottom: 16, borderWidth: 1, borderRadius: 6 }}
          value={search}
          onChangeText={handleSearch}
        />
        <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{deck?.title} Cards</Text>
        <ScrollView style={{ maxHeight: height }}>
          {filteredCards.map((card) => (
            <Card
              key={card.id}
              question={card.question}
              answer={card.answer}
              id={card.id as string}
              deck_id={card.deck_id as string}
              onDelete={() => handleDeleteCard(card.id)}
            />
          ))}
        </ScrollView>
        <View style={{ marginBottom: 16 }}>
          <Button title="+ Add New Card" onPress={handleAddCard} />
        </View>
      </Box>
    </VStack>
    )}
    </>
  );
};


const styles = StyleSheet.create({
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: 'gray',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'left',
  },
});

export default DeckPage; 