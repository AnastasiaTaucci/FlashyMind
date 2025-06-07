import React, { useState, useEffect } from 'react';
import { TextInput, Button, Text } from 'react-native';
import { VStack } from '@/components/ui/vstack';
import { Box } from '@/components/ui/box';
import Card from '@/components/Card';
import { Heading } from '@/components/ui/heading';
import { router, useLocalSearchParams } from 'expo-router';
import { fetchCards, getDeck, getDecks } from '@/service/api';

interface Card {
  question: string;
  answer: string;
  subject: string;
  topic: string;
  deck_id: string;
  created_by: string;
  created_at: string;
  updated_at: string;
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


  useEffect(() => {
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
  }, []);

  const handleSearch = (text: string) => {
    setSearch(text);
  };

  const filteredCards = cards.filter((card) => {
    const searchTerms = search.toLowerCase().split(' ');
    return searchTerms.every((term) => card.question?.toLowerCase().includes(term));
  });

  const handleAddCard = () => {
    router.navigate('./addCard');
  };

  const handleSave = () => {
    router.navigate('./saveDeck');
  };

  return (
    <>
    {loading ? (
        <Text>Loading...</Text>
    ) : ( 
    <VStack space="md">
      <Box style={{ padding: 16, borderWidth: 1, borderRadius: 4 }}>
        <Heading>Search Cards</Heading>
        <TextInput
          placeholder="Search Cards"
          style={{ padding: 8, marginBottom: 16, borderWidth: 1, borderRadius: 6 }}
          value={search}
          onChangeText={handleSearch}
        />
        <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{deck?.title} Cards</Text>
        {filteredCards.map((card) => (
          <Card key={card.question} question={card.question} answer={card.answer} />
        ))}
        <Button title="+ Add New Card" onPress={handleAddCard} />
        <Button title="Save" onPress={handleSave} color="black" />
      </Box>
    </VStack>
    )}
    </>
  );
};

export default DeckPage; 