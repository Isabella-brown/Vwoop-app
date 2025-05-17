/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useState} from 'react';
import {
  StatusBar,
  StyleSheet,
  View,
  Image,
  Dimensions,
  SafeAreaView,
  ScrollView,
  Alert,
  TouchableOpacity,
  Text,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import EventCard from './components/EventCard';
import Account from './components/Account';
import VwoopPage from './components/VwoopPage';
import MenuBar, {Screen} from './components/MenuBar';

const {width} = Dimensions.get('window');

// Sample event data
const sampleEvents = [
  {
    id: '1',
    title: 'Community Garden Cleanup',
    date: 'Saturday, March 23, 2024 • 10:00 AM',
    location: 'Central Park Community Garden',
    description: 'Join us for a morning of gardening and community building. We\'ll be planting spring vegetables and cleaning up the garden beds. Tools and refreshments provided!',
    imageUrl: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=800',
    currentAttendees: 12,
    maxAttendees: 20,
  },
  {
    id: '2',
    title: 'Local Art Exhibition',
    date: 'Sunday, March 24, 2024 • 2:00 PM',
    location: 'Downtown Art Gallery',
    description: 'Experience the work of local artists in our monthly exhibition. Meet the artists, enjoy live music, and participate in interactive art workshops.',
    imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800',
    currentAttendees: 45,
    maxAttendees: 50,
  },
  {
    id: '3',
    title: 'Neighborhood Book Club',
    date: 'Tuesday, March 26, 2024 • 7:00 PM',
    location: 'Community Library',
    description: 'This month we\'re discussing "The Midnight Library" by Matt Haig. New members welcome! Light refreshments will be served.',
    imageUrl: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800',
    currentAttendees: 8,
    maxAttendees: 15,
  },
];

function App(): React.JSX.Element {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');

  const handleSignUp = (eventId: string) => {
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
            style={styles.content}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}>
            {sampleEvents.map(event => (
              <EventCard
                key={event.id}
                title={event.title}
                date={event.date}
                location={event.location}
                description={event.description}
                imageUrl={event.imageUrl}
                currentAttendees={event.currentAttendees}
                maxAttendees={event.maxAttendees}
                onSignUp={() => handleSignUp(event.id)}
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
      <LinearGradient
        colors={['#6B46C1', '#805AD5', '#9F7AEA']}
        style={styles.gradient}>
        {renderContent()}
        <MenuBar
          currentScreen={currentScreen}
          onScreenChange={setCurrentScreen}
        />
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
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
