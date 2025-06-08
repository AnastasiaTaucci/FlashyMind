import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { addCard } from '@/service/api';
import { useState } from 'react';

export default function CreateCardScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const deckId = Array.isArray(id) ? id[0] : id;
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');

  const handleSaveCard = async () => {
    const data = await addCard({
      question: question,
      answer: answer,
      deck_id: deckId as string,
      subject: subject,
      topic: topic
    });
    if (data.id) {
      setQuestion('');
      setAnswer('');
      setSubject('');
      setTopic('');
      router.navigate(`../(tabs)/(decks)/${deckId}`);
    }
  };


  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.navigate(`../(tabs)/(decks)/${deckId}`)}
      >
        <MaterialIcons name="arrow-back" size={24} color="gray" />
        <Text style={styles.buttonText}>Back to Deck</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Add New Card</Text>

      <TextInput placeholder="Subject" style={styles.input} value={subject} onChangeText={setSubject} />
      <TextInput placeholder="Topic" style={styles.input} value={topic} onChangeText={setTopic} />
      <TextInput placeholder="Front of card" style={styles.input} value={question} onChangeText={setQuestion} />
      <TextInput placeholder="Back of card" style={styles.input} value={answer} onChangeText={setAnswer} />

      <Button title="Save Card" onPress={handleSaveCard} />
    </View>
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
