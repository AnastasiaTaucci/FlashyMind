import React, { useState, useEffect } from 'react';
import { TextInput, Button, Text, TouchableOpacity, View } from 'react-native';
import { VStack } from '@/components/ui/vstack';
import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { router } from 'expo-router';
import { deleteDeck, getDecks } from '@/service/api';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

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

  useFocusEffect(
    React.useCallback(() => {
      loadDecks();
    }, [])
  );

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

  const handleEditDeck = (deck: Deck) => {
    router.navigate(`./editDeck/${deck.id}`);
  };

  const handleDeleteDeck = async (deck: Deck) => {
    const data = await deleteDeck(deck.id);
    // Handle the response if needed
    if (data[0].id) {
      loadDecks();
      router.navigate(`../(decks)`);
    }
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
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8 }}>
                <TouchableOpacity onPress={() => handleEditDeck(deck)}>
                  <MaterialIcons name="edit" size={24} color="gray" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteDeck(deck)}>
                  <MaterialIcons name="delete" size={24} color="gray" />
                </TouchableOpacity>
              </View>
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