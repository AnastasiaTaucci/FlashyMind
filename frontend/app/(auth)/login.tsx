import { View, Text, TextInput, Button, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../context/AuthContext';

export default function LoginScreen() {
  const { login } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome!</Text>

      <TextInput placeholder="Email Address" style={styles.input} />
      <TextInput placeholder="Password" secureTextEntry style={styles.input} />

      <Button
        title="Login"
        onPress={() => {
          login(); // Sets user = true
          router.replace('/'); // go to index.tsx and trigger Redirect
        }}
      />

      <Pressable onPress={() => router.push('/signup')}>
        <Text style={styles.link}>Not a member? Register now</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8, marginBottom: 16 },
  link: { color: '#007bff', marginTop: 16, textAlign: 'center' },
});
