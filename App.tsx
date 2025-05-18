/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import VwoopPage from './components/VwoopPage';
import { EventsScreen } from './components/EventsScreen';
import Account from './components/Account';
import MenuBar from './components/MenuBar';

type Screen = 'home' | 'account' | 'vwoop';

const App = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <EventsScreen />;
      case 'account':
        return <Account />;
      case 'vwoop':
        return <VwoopPage />;
      default:
        return <EventsScreen />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.content}>
        {renderScreen()}
      </View>
      <MenuBar 
        currentScreen={currentScreen}
        onScreenChange={setCurrentScreen}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    flex: 1,
  },
});

export default App;
