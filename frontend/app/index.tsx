// import React from 'react';
// import { ActivityIndicator, View, StyleSheet } from 'react-native';
// import { Redirect } from 'expo-router';
// import { useAuth } from '../context/AuthContext';

// export default function Index() {
//   const { isAuthenticated, isLoading } = useAuth();

//   if (isLoading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" />
//       </View>
//     );
//   }

//   if (!isAuthenticated) {
//     return <Redirect href="/(auth)/login" />;
//   }

//   return <Redirect href="/(tabs)/(home)" />;
// }

// const styles = StyleSheet.create({
//   loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
// });
