import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import type { Event } from '../services/eventGeneration';

const {width} = Dimensions.get('window');

interface EventCardProps {
  event: Event;
  onSignUp: (eventId: string) => Promise<void>;
}

// Function to get default image URL based on event type
const getDefaultImageUrl = (type: Event['type']): string => {
  const primaryType = type.split('/')[0]; // Get the part before the first slash
  console.log('Event type:', type, 'Primary type:', primaryType); // Added log to debug
  switch (primaryType) {
    case 'food':
      return 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80'; // Colorful food dish
    case 'outdoor':
      return 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'; // Nature, vibrant outdoors
    case 'indoor':
      return 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=800&q=80'; // Bright indoor activity
    case 'sports':
      return 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=800&q=80'; // Energetic sports action
    case 'community':
      return 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80'; // Lively community gathering
    default:
      console.log('Using default image for type:', primaryType); // Added log to debug
      return 'https://images.unsplash.com/photo-1712158878579-77281dbdb5d6?auto=format&fit=crop&w=800&q=80'; // Generic vibrant event
  }
};

export const EventCard: React.FC<EventCardProps> = ({ event, onSignUp }) => {
  const handleSignUp = async () => {
    Alert.alert(
      'Sign Up Confirmation',
      `Would you like to sign up for "${event.title}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Up',
          onPress: async () => {
            try {
              await onSignUp(event.id);
              Alert.alert('Success', 'You have successfully signed up for the event!');
            } catch (error) {
              Alert.alert('Error', 'Failed to sign up for the event. Please try again.');
            }
          },
        },
      ],
    );
  };

  const getTypeColor = (type: string) => {
    const primaryType = type.split('/')[0]; // Get the part before the first slash
    switch (primaryType) {
      case 'food':
        return '#FF6B6B';
      case 'outdoor':
        return '#4ECDC4';
      case 'indoor':
        return '#FFD93D';
      case 'sports':
        return '#95E1D3';
      case 'community':
        return '#FF8B94';
      default:
        return '#805AD5';
    }
  };

  // Determine the image source: use default by type, fallback to event.imageUrl if available, or generic
  const imageSource = event.type ? { uri: getDefaultImageUrl(event.type) } : (event.imageUrl ? { uri: event.imageUrl } : { uri: 'https://images.unsplash.com/photo-1468071174046-657d9d351a40?auto=format&fit=crop&w=800&q=80' });

  return (
    <View style={styles.card}>
      {imageSource && ( // Ensure imageSource is not null or undefined
        <Image
          source={imageSource}
          style={styles.image}
          resizeMode="cover"
        />
      )}
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{event.title}</Text>
          <View style={[styles.typeTag, { backgroundColor: getTypeColor(event.type) }]}>
            <Text style={styles.typeText}>{event.type}</Text>
          </View>
        </View>
        <Text style={styles.time}>{event.startTime} - {event.endTime}</Text>
        <Text style={styles.location}>{event.location}</Text>
        <Text style={styles.description}>{event.description}</Text>
        <View style={styles.attendanceContainer}>
          <Text style={styles.attendance}>
            {event.currentAttendees}/{event.capacity} attendees
          </Text>
        </View>
        <TouchableOpacity
          style={styles.signUpButton}
          onPress={handleSignUp}
          disabled={event.currentAttendees >= event.capacity}
        >
          <Text style={styles.signUpButtonText}>
            {event.currentAttendees >= event.capacity ? 'Full' : 'Sign Up'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  image: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    flex: 1,
    marginRight: 8,
  },
  typeTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  time: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 4,
  },
  location: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#444444',
    marginBottom: 12,
    lineHeight: 20,
  },
  attendanceContainer: {
    marginBottom: 12,
  },
  attendance: {
    fontSize: 14,
    color: '#666666',
  },
  signUpButton: {
    backgroundColor: '#805AD5',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  signUpButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
}); 