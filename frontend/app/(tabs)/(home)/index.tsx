import { Text, StyleSheet, View, RefreshControl, ActivityIndicator } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useFlashcardSetStore, useFlashcardStore } from '@/store/deck-card-store';
import { Heading } from '@/components/ui/heading';
import { Button, ButtonText } from '@/components/ui/button';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import FlashcardSetCard from '@/components/FlashcardSetCard';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { LinearTransition } from 'react-native-reanimated';

export default function HomeScreen() {
  const router = useRouter();
  const { flashcardSets, fetchFlashcardSets, isLoading, isDeleting, error, notConnected } =
    useFlashcardSetStore();
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
    await refreshData(); // calls fetchFlashcardSets and fetchFlashcards
    setRefreshing(false);
  }, [refreshData]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  useFocusEffect(
    useCallback(() => {
      useFlashcardSetStore.setState({ error: null });
      useFlashcardStore.setState({ error: null });
    }, [])
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
            <SimpleLineIcons name="logout" size={18} color="white" />
            <ButtonText style={styles.logoutText}>Logout</ButtonText>
          </Button>
        </HStack>

        <Heading style={styles.heading}>Your Flashcard Decks</Heading>

        <HStack style={styles.addDeckWrapper}>
          <Button
            style={styles.addDeckButton}
            onPress={() => router.navigate('./addDeck')}
            disabled={notConnected}
          >
            <ButtonText style={styles.addDeckText}>+ New Deck</ButtonText>
          </Button>
        </HStack>

        {error && (
          <View style={{ backgroundColor: '#fee2e2', padding: 12, margin: 16, borderRadius: 8 }}>
            <Text style={{ color: '#dc2626', fontSize: 14 }}>Error: {error}</Text>
          </View>
        )}

        {isLoading && !refreshing && (
          <View style={{ alignItems: 'center', padding: 20 }}>
            <Text style={{ color: '#6b7280' }}>Loading flashcard decks...</Text>
          </View>
        )}

        {isDeleting && !refreshing && (
          <View style={styles.overlay}>
            <ActivityIndicator size="large" color="#fff" />
          </View>
        )}

        <Animated.FlatList
          testID="flatlist" // this is for the test
          data={flashcardSets}
          keyExtractor={(item, index) => (item.id ? item.id.toString() : `deck-${index}`)}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => <FlashcardSetCard item={item} />}
          itemLayoutAnimation={LinearTransition}
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
                You have no decks yet. Tap &ldquo;+ New Deck&rdquo; to get started!
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
    width: '100%',
  },
  pageWrapper: {
    flex: 1,
    marginTop: 10,
  },
  logoutWrapper: {
    justifyContent: 'flex-start',
    marginLeft: 15,
    marginVertical: 10,
  },
  logoutButton: {
    maxWidth: 200,
    backgroundColor: '#f06c6c',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    marginBottom: 15,
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
    marginRight: 16,
    color: '#5e2606',
    lineHeight: 30,
    textAlign: 'center',
  },
  addDeckWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginRight: 20,
    marginBottom: 12,
  },
  addDeckButton: {
    backgroundColor: '#ffdd54',
    borderRadius: 8,
    borderColor: '#bd4e0f',
    borderWidth: 0.5,
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
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
});
