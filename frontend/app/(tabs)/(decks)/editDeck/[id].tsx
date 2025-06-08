import React, { useState, useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { getDeck, updateDeck } from '@/service/api';
import { MaterialIcons } from '@expo/vector-icons';

export default function EditDeckScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const deckId = Array.isArray(id) ? id[0] : id;
  const [loading, setLoading] = useState(true);
  const [deck, setDeck] = useState<any>(null);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const getDeckFromDatabase = async () => {
      const data = await getDeck(deckId as string);
      setDeck(data);
      setTitle(data.title || '');
      setSubject(data.subject || '');
      setDescription(data.description || '');
      setLoading(false);
    };
    getDeckFromDatabase();
  }, [deckId]);

  const handleTitleChange = (text: string) => {
    setTitle(text);
  };

  const handleSubjectChange = (text: string) => {
    setSubject(text);
  };

  const handleDescriptionChange = (text: string) => {
    setDescription(text);
  };

  const handleSaveChanges = async () => {
    const updatedDeck = { ...deck, title, subject, description };
    const data = await updateDeck(deckId as string, updatedDeck);
    if (data.success) {
      router.navigate('/(tabs)/(decks)');
    } else {
      console.log(data.error);
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
            onPress={() => router.navigate(`../(tabs)/(decks)/${deckId}`)}
          >
            <MaterialIcons name="arrow-back" size={24} color="gray" />
            <Text style={styles.buttonText}>Back to Decks</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Edit Deck</Text>

          <TextInput
            placeholder="Title"
            style={styles.input}
            value={title}
            onChangeText={handleTitleChange}
          />
          <TextInput
            placeholder="Subject"
            style={styles.input}
            value={subject}
            onChangeText={handleSubjectChange}
          />
          <TextInput
            placeholder="Description"
            style={styles.input}
            value={description}
            onChangeText={handleDescriptionChange}
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
