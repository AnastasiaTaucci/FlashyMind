import React, { useState, useEffect } from 'react';
import { TextInput, Button, Text, TouchableOpacity } from 'react-native';
import { VStack } from '@/components/ui/vstack';
import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { router } from 'expo-router';
import { getDecks } from '@/service/api';

interface Deck {
  id: string;
  title: string;
  subject: string;
  description?: string;
}

const DeckPage = () => {
  const [search, setSearch] = useState('');
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const loadDecks = async () => {
      try {
        setLoading(true);
        const data = await getDecks();
        setDecks(data);
        setLoading(false);
        } catch (error) {
        console.error('Error fetching decks:', error);
      }
    };

    loadDecks();
  }, []);

  const handleSearch = (text: string) => {
    setSearch(text);
  };

  const filteredDecks = decks.filter((deck) => {
    const searchTerms = search.toLowerCase().split(' ');
    return searchTerms.every((term) => deck.title?.toLowerCase().includes(term));
  });

  const handleDeckPress = (deck: Deck) => {
    router.navigate(`/(tabs)/(decks)/${deck.id}`);
  };

  return (
    <>
    {loading ? (
      <Text>Loading...</Text>
    ) : (
    <VStack space="md">
      <Box style={{ padding: 16, borderWidth: 1, borderRadius: 4 }}>
        <Heading>Decks</Heading>
        <TextInput
          placeholder="Search Decks"
          style={{ padding: 8, marginBottom: 16, borderWidth: 1, borderRadius: 6 }}
          value={search}
          onChangeText={handleSearch}
        />
        {filteredDecks.map((deck) => (
          <TouchableOpacity key={deck.title} onPress={() => handleDeckPress(deck)}>
            <Box
              style={{
                padding: 8,
                borderWidth: 1,
                borderRadius: 6,
                marginBottom: 8,
                borderColor: 'gray',
                backgroundColor: 'white',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{deck.title}</Text>
              <Text>{deck.subject}</Text>
              {deck.description && <Text>{deck.description}</Text>}
            </Box>
          </TouchableOpacity>
        ))}
        <Button title="Add New Deck" onPress={() => router.navigate('./addDeck')} />
      </Box>
    </VStack>
    )}
    </>
  );
};

export default DeckPage; 