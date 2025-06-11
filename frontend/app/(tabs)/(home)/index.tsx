import { Text, StyleSheet, FlatList, View, RefreshControl } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useFlashcardSetStore, useFlashcardStore } from '@/store/deck-card-store';

import { Heading } from '@/components/ui/heading';
import { Button, ButtonText } from '@/components/ui/button';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import FlashcardSetCard from '@/components/FlashcardSetCard';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const router = useRouter();
  const { flashcardSets, fetchFlashcardSets, isLoading, error } = useFlashcardSetStore();
  const { fetchFlashcards } = useFlashcardStore();
  const { logout } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const refreshData = useCallback(async () => {
    try {
      await Promise.all([fetchFlashcardSets(), fetchFlashcards()]);
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  }, [fetchFlashcardSets, fetchFlashcards]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshData();
    setRefreshing(false);
  }, [refreshData]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Automatically refresh when returning to this screen
  useFocusEffect(
    useCallback(() => {
      refreshData();
    }, [refreshData])
  );

  return (
    <SafeAreaView style={styles.container}>
      <VStack style={styles.pageWrapper}>
        <HStack style={styles.logoutWrapper}>
          <Button
            style={styles.logoutButton}
            hitSlop={25}
            onPress={async () => {
              try {
                await logout();
                router.replace('/login');
              } catch (error: any) {
                console.error('Logout failed:', error.message);
              }
            }}
          >
            <ButtonText style={styles.logoutText}>Logout</ButtonText>
            <MaterialIcons name="logout" size={20} color="#fff" />
          </Button>
        </HStack>

        <Heading style={styles.heading}>Your Flashcard Sets</Heading>

        {error && (
          <View style={{ backgroundColor: '#fee2e2', padding: 12, margin: 16, borderRadius: 8 }}>
            <Text style={{ color: '#dc2626', fontSize: 14 }}>Error: {error}</Text>
          </View>
        )}

        {isLoading && !refreshing && (
          <View style={{ alignItems: 'center', padding: 20 }}>
            <Text style={{ color: '#6b7280' }}>Loading flashcard sets...</Text>
          </View>
        )}

        <HStack style={styles.addDeckWrapper}>
          <Button style={styles.addDeckButton} onPress={() => router.navigate('./addDeck')}>
            <ButtonText style={styles.addDeckText}>+ New Set</ButtonText>
          </Button>
        </HStack>

        <FlatList
          data={flashcardSets}
          keyExtractor={(item, index) => (item.id ? item.id.toString() : `deck-${index}`)}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => <FlashcardSetCard item={item} />}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#2563eb']}
              tintColor="#2563eb"
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyWrapper}>
              <Text style={styles.emptyText}>
                You have no sets yet. Tap &ldquo;+ New Set&rdquo; to get started!
              </Text>
            </View>
          }
        />
      </VStack>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffafc',
    // paddingBottom: 15,
    width: '100%',
  },
  pageWrapper: {
    flex: 1,
    marginTop: 10,
  },
  logoutWrapper: {
    justifyContent: 'flex-end',
    marginRight: 15,
    marginVertical: 10,
  },
  logoutButton: {
    maxWidth: 200,
    backgroundColor: '#ef4444',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    marginTop: 20,
  },
  logoutText: {
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 6,
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    marginLeft: 16,
    color: '1f2937',
    lineHeight: 30,
  },
  addDeckWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginRight: 20,
    marginBottom: 12,
  },
  addDeckButton: {
    width: '60%',
    backgroundColor: '#ffdd54',
    borderRadius: 8,
    paddingHorizontal: 14,
  },
  addDeckText: {
    color: '#5e2606',
    fontWeight: '700',
    fontSize: 20,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  emptyWrapper: {
    marginTop: 50,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 22,
  },
});
