import { View, Text, TextInput, Button, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';

export default function SignUpScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign up</Text>

      <TextInput placeholder="Email Address" style={styles.input} />
      <TextInput placeholder="Create a password" secureTextEntry style={styles.input} />
      <TextInput placeholder="Confirm password" secureTextEntry style={styles.input} />

      <Button title="Sign up" onPress={() => console.log('Sign up pressed')} />

      <Pressable onPress={() => router.push('/login')}>
        <Text style={styles.link}>Already have an account? Log in</Text>
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
