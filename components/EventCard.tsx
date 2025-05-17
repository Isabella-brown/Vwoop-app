import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity
} from 'react-native';


interface EventCardProps {
  title: string;
  date: string;
  location: string;
  description: string;
  imageUrl: string;
  currentAttendees: number;
  maxAttendees: number;
  onSignUp: () => void;
}

const EventCard: React.FC<EventCardProps> = ({
  title,
  date,
  location,
  description,
  imageUrl,
  currentAttendees,
  maxAttendees,
  onSignUp,
}) => {
  const isFull = currentAttendees >= maxAttendees;

  return (
    <View style={styles.card}>
      <Image
        source={{uri: imageUrl}}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.date}>{date}</Text>
        <Text style={styles.location}>{location}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {description}
        </Text>
        <View style={styles.footer}>
          <View style={styles.attendanceContainer}>
            <Text style={styles.attendance}>
              {currentAttendees}/{maxAttendees} attending
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.signUpButton, isFull && styles.signUpButtonFull]}
            onPress={onSignUp}
            disabled={isFull}>
            <Text style={styles.signUpText}>
              {isFull ? 'Full' : 'Sign Up'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#4A5568',
    marginBottom: 16,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  attendanceContainer: {
    backgroundColor: '#EDF2F7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  attendance: {
    fontSize: 14,
    color: '#4A5568',
    fontWeight: '500',
  },
  signUpButton: {
    backgroundColor: '#805AD5',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  signUpButtonFull: {
    backgroundColor: '#CBD5E0',
  },
  signUpText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default EventCard; 