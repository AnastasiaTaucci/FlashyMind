import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: any;
}

export default function Card({ children, onPress, style }: CardProps) {
  const CardComponent = onPress ? Pressable : View;

  return (
    <CardComponent style={[styles.card, style]} onPress={onPress}>
      {children}
    </CardComponent>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#b45309',
    borderRadius: 16,
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    color: 'white',
  },
});
