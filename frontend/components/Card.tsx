import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

const Card = ({ front, back }: { front: string; back: string }) => {
  const handleEdit = () => {
    router.navigate('./editCard');
  };

  const handleDelete = () => {
    router.navigate('./deleteCard');
  };
  return (
    <View style={styles.card}>
      <Text style={styles.front}>{front}</Text>
      <Text style={styles.back}>{back}</Text>
      <View style={styles.icons}>
        <TouchableOpacity onPress={handleEdit}>
          <MaterialIcons name="edit" size={24} color="gray" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDelete}>
          <MaterialIcons name="delete" size={24} color="gray" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 20,
  },
  front: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  back: {
    marginTop: 8,
    fontSize: 16,
    color: '#555',
  },
  icons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
});

export default Card; 