import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export const TestScreen: React.FC = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>HELLO WORLD!</Text>
      <Text style={styles.counter}>Number: {count}</Text>
      <TouchableOpacity 
        style={styles.button}
        onPress={() => setCount(prev => prev + 1)}
      >
        <Text style={styles.buttonText}>CLICK ME!</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00FF00', // Bright green background
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 20,
  },
  counter: {
    fontSize: 48,
    color: 'black',
    marginBottom: 20,
  },
  button: {
    backgroundColor: 'black',
    padding: 20,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00FF00',
  },
}); 