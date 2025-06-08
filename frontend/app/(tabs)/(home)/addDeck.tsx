import { View, TextInput, TouchableOpacity, Text, Button, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { addDeck } from '@/service/api';

export default function CreateDeckScreen() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');

  const handleSaveDeck = async () => {
    const data = await addDeck({
      title: title,
      subject: subject,
      description: description
    });
    if (data.success) {
      setTitle('');
      setSubject('');
      setDescription('');
      router.navigate(`../(decks)`);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.navigate(`../(decks)`)}
      >
        <MaterialIcons name="arrow-back" size={24} color="gray" />
        <Text style={styles.buttonText}>Back to Decks</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Add New Deck</Text>

      <TextInput placeholder="Title" style={styles.input} value={title} onChangeText={setTitle} />
      <TextInput placeholder="Subject" style={styles.input} value={subject} onChangeText={setSubject} />
      <TextInput placeholder="Description" style={styles.input} value={description} onChangeText={setDescription} />

      <Button title="Save Deck" onPress={handleSaveDeck} />
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
