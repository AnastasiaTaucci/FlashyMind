import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native';

import { useRouter, useLocalSearchParams } from 'expo-router';
import mockData from '@/data/flashcards.json';

export default function SubjectCardsScreen() {
  const router = useRouter();
  const { category, amount } = useLocalSearchParams();

  const isLoading = false;
  const error = false;

  function handleSaveDeck() {
    console.log('runs function from zustand to save to supabase');
    Alert.alert('Success', 'Deck added to your library!');
  }

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

        {/* Header with Title and number of cards*/}
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
            {`${category} Cards`}
          </Text>
        </View>

        <Text
          style={{
            fontSize: 16,
            color: '#fbbf24',
          }}
        >
          {amount} {amount === '1' ? 'card' : 'cards'}
        </Text>
      </View>

      {/* Button to add to Library */}
      <View style={{ padding: 20 }}>
        <Pressable
          onPress={handleSaveDeck}
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
            + Add to Your Decks
          </Text>
        </Pressable>
        <Text style={styles.explanation}>* you will be able to edit the deck from Home</Text>
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
        {mockData.length === 0 ? (
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
              Error displaying cards
            </Text>
            <Text style={{ fontSize: 14, color: '#78350f', textAlign: 'center', marginBottom: 20 }}>
              Please explore one more time {category}
            </Text>
            <Pressable
              onPress={() => router.back()}
              style={{
                backgroundColor: '#b45309',
                paddingHorizontal: 24,
                paddingVertical: 12,
                borderRadius: 12,
              }}
            >
              <Text style={{ color: 'white', fontWeight: '600', fontSize: 16 }}>Explore Again</Text>
            </Pressable>
          </View>
        ) : (
          mockData.map((card, index) => (
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
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  explanation: {
    color: '#f06c6c',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
  },
});
