import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Box } from '@/components/ui/box';
import Card from '@/components/Card';
import { Heading } from '@/components/ui/heading';
import { router } from 'expo-router';

const DeckPage = () => {
  const [search, setSearch] = useState('');

  const handleSearch = (text: string) => {
    setSearch(text);
  };

  const cards = [
    { front: 'Mock Question 1', back: 'Mock Answer 1' },
    { front: 'Mock Question 2', back: 'Mock Answer 2' },
  ];

  const filteredCards = cards.filter((card) => {
    const searchTerms = search.toLowerCase().split(' ');
    return searchTerms.every((term) => card.front.toLowerCase().includes(term));
  });


  const handleAddCard = () => {
    router.navigate('./addCard');
  };

  const handleSave = () => {
    router.navigate('./saveDeck');
  };

  return (
    <VStack space="md">
      <Box style={{ padding: 16, borderWidth: 1, borderRadius: 4 }}>
        <Heading>Deck Name</Heading>
        <TextInput
          placeholder="Search Cards"
          style={{ padding: 8, marginBottom: 16, borderWidth: 1, borderRadius: 6 }}
          value={search}
          onChangeText={handleSearch}
        />
        <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Decks</Text>
        {filteredCards.map((card) => (
          <Card key={card.front} front={card.front} back={card.back} />
        ))}
        <Button title="+ Add New Card" onPress={handleAddCard} />
        <Button title="Save" onPress={handleSave} color="black" />
      </Box>
    </VStack>
  );
};

export default DeckPage; 