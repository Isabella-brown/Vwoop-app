import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  Platform,
  Animated,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { EventCard } from './EventCard';
import { generateEvents, signUpForEvent, type Event } from '../services/eventGeneration';

export const EventsScreen: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<string>('Loading location...');
  const flashAnim = React.useRef(new Animated.Value(0)).current;

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Location Permission",
          message: "Vwoop needs access to your location to show nearby events.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const getCurrentLocation = useCallback(() => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log('Current position:', latitude, longitude);
        // Use reverse geocoding to get city name
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
          .then(response => response.json())
          .then(data => {
            const city = data.address.city || data.address.town || data.address.village || 'Unknown location';
            console.log('Reverse geocoding result (city):', city);
            setLocation(city);
            loadEvents(city);
          })
          .catch(err => {
            console.error('Error getting location name:', err);
            setLocation('Unknown location');
            loadEvents('Unknown location');
          });
      },
      (error) => {
        console.error('Error getting location:', error);
        if (error.code === 2) {
          Alert.alert(
            "Location Services Disabled",
            "Please enable location services in your device settings to get nearby events.",
            [
              { text: "OK", onPress: () => console.log("OK Pressed") }
            ]
          );
          setLocation('Location services disabled');
        } else {
          console.error('Error object:', error);
          setLocation('Unknown location');
        }
        loadEvents('Unknown location');
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  }, []);

  const flashScreen = () => {
    Animated.sequence([
      Animated.timing(flashAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(flashAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const loadEvents = useCallback(async (userLocation: string) => {
    console.log('Attempting to load events...');
    try {
      console.log('Loading events for location:', userLocation);
      setError(null);
      const newEvents = await generateEvents(3, userLocation);
      console.log('Events loaded:', newEvents);
      console.log('Full events array:', JSON.stringify(newEvents, null, 2));
      setEvents(newEvents);
      flashScreen();
    } catch (err) {
      console.error('Error loading events:', err);
      setError('Failed to load events. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    console.log('Manual refresh triggered');
    setRefreshing(true);
    try {
      getCurrentLocation();
    } finally {
      setRefreshing(false);
    }
  }, [getCurrentLocation]);

  const handleSignUp = async (eventId: string) => {
    try {
      await signUpForEvent(eventId);
      setEvents(currentEvents =>
        currentEvents.map(event =>
          event.id === eventId
            ? { ...event, currentAttendees: event.currentAttendees + 1 }
            : event
        )
      );
    } catch (error) {
      console.error('Error signing up for event:', error);
      throw error;
    }
  };

  // Request location permission and get location on component mount
  useEffect(() => {
    const setupLocation = async () => {
      const hasPermission = await requestLocationPermission();
      if (hasPermission) {
        getCurrentLocation();
      } else {
        setLocation('Location permission denied');
        loadEvents('Unknown location');
      }
    };
    setupLocation();
  }, [getCurrentLocation, loadEvents]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#805AD5" />
        <Text style={styles.locationText}>{location}</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => getCurrentLocation()}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.locationContainer}>
        <Text style={styles.locationText}>{location}</Text>
      </View>
      <Animated.View
        style={[
          styles.flashOverlay,
          {
            opacity: flashAnim,
            backgroundColor: 'rgba(128, 90, 213, 0.1)',
          },
        ]}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#805AD5']}
            tintColor="#805AD5"
            title="Pull to refresh"
            titleColor="#805AD5"
            progressViewOffset={Platform.OS === 'android' ? 20 : 0}
            progressBackgroundColor="#F5F5F5"
            enabled={true}
          />
        }
      >
        {events.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No events available</Text>
            <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
              <Text style={styles.refreshButtonText}>Refresh</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.eventsContainer}>
            {events.map(event => (
              <EventCard
                key={event.id}
                event={event}
                onSignUp={handleSignUp}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  locationContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  locationText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    paddingTop: Platform.OS === 'android' ? 20 : 0,
  },
  eventsContainer: {
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#805AD5',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 16,
  },
  refreshButton: {
    backgroundColor: '#805AD5',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  refreshButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  flashOverlay: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: 'none',
  },
}); 