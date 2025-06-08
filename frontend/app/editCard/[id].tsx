import React from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { getCard, updateCard } from '@/service/api';
import { MaterialIcons } from '@expo/vector-icons';

export default function EditCardScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const cardId = Array.isArray(id) ? id[0] : id;
  const [loading, setLoading] = useState(true);
  const [card, setCard] = useState<any>(null);
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const getCardFromDatabase = async () => { 
      const data = await getCard(cardId as string);
      setCard(data);
      setSubject(data.subject || '');
      setTopic(data.topic || '');
      setLoading(false);
    };
    getCardFromDatabase();
  }, [cardId]);

  const handleSubjectChange = (text: string) => {
    setSubject(text);
  };

  const handleTopicChange = (text: string) => {
    setTopic(text);
  };

  const handleQuestionChange = (text: string) => {
    setCard({ ...card, question: text });
  };
  const handleAnswerChange = (text: string) => {
    setCard({ ...card, answer: text });
  };

  const handleSaveChanges = async () => {
    const updatedCard = { ...card, subject, topic };
    try {
      const data = await updateCard(cardId as string, updatedCard);
      if (data.id) {
        setSubject('');
        setTopic('');
        setCard({ ...card, question: '', answer: '' });
        router.navigate(`../(tabs)/(decks)/${card?.deck_id}`);
      } else {
        console.log(data.error);
        setError(data.error || 'Failed to save changes');
      }
    } catch (err) {
      console.error('Error saving changes:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <>
    {loading ? (
      <Text>Loading...</Text>
    ) : (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.navigate(`../(tabs)/(decks)/${card?.deck_id}`)}
      >
        <MaterialIcons name="arrow-back" size={24} color="gray" />
        <Text style={styles.buttonText}>Back to Deck</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Edit Card</Text>

      {error && <Text style={styles.error}>{error}</Text>}

      <TextInput
        placeholder="Subject"
        style={styles.input}
        value={subject}
        onChangeText={handleSubjectChange}
      />
      <TextInput
        placeholder="Topic"
        style={styles.input}
        value={topic}
        onChangeText={handleTopicChange}
      />
      <TextInput
        placeholder={card?.question}
        style={styles.input}
        value={card?.question}
        onChangeText={handleQuestionChange}
      />
      <TextInput
        placeholder={card?.answer}
        style={styles.input}
        value={card?.answer}
        onChangeText={handleAnswerChange}
      />
      <TextInput
        placeholder={cardId}
        style={styles.nonEditableInput}
        value={cardId}
        editable={false}
      />

      <Button title="Save Changes" onPress={handleSaveChanges} />
    </View>
    )}
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24, marginTop: 60, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  nonEditableInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: '#f0f0f0',
    color: 'gray',
  },
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
  error: {
    color: 'red',
    marginBottom: 16,
  },
}); 