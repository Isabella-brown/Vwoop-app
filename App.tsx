/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useState, useEffect} from 'react';
import {
  StatusBar,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  ScrollView,
  Alert,
  RefreshControl,
} from 'react-native';
import EventCard from './components/EventCard';
import Account from './components/Account';
import VwoopPage from './components/VwoopPage';
import MenuBar, {Screen} from './components/MenuBar';
import {generateEvents, GeneratedEvent} from './services/eventGeneration';

const {width} = Dimensions.get('window');



function App(): React.JSX.Element {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [events, setEvents] = useState<GeneratedEvent[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadEvents = async () => {
    try {
      const newEvents = await generateEvents(3);
      setEvents(newEvents);
    } catch (error) {
      console.error('Failed to generate events:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadEvents();
    setRefreshing(false);
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleSignUp = () => {
    Alert.alert(
      'Sign Up Successful',
      'You have been registered for this event!',
      [{text: 'OK'}],
    );
  };

  const renderContent = () => {
    switch (currentScreen) {
      case 'home':
        return (
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            style={styles.content}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}>
            {events.map(event => (
              <EventCard
                key={event.id}
                {...event}
                onSignUp={() => handleSignUp()}
              />
            ))}
          </ScrollView>
        );
      case 'account':
        return <Account />;
      case 'vwoop':
        return <VwoopPage />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.background}>
        {renderContent()}
        <MenuBar
          currentScreen={currentScreen}
          onScreenChange={setCurrentScreen}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    backgroundColor: '#805AD5', // Using the middle color from the previous gradient
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  menuBar: {
    height: 80,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  menuItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    fontWeight: '600',
  },
  menuTextActive: {
    color: 'white',
  },
  logo: {
    width: width * 0.3,
    height: 40,
  },
});

export default App;
