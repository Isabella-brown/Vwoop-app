import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';

interface UserProfile {
  name: string;
  email: string;
  bio: string;
  interests: string[];
  location: string;
  vwoopScore: number;
}

const Account: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: 'John Doe',
    email: 'john.doe@example.com',
    bio: 'Community enthusiast and event organizer',
    interests: ['Gardening', 'Art', 'Reading'],
    location: 'Downtown',
    vwoopScore: 54,
  });

  const [editedProfile, setEditedProfile] = useState<UserProfile>(profile);

  const handleSave = () => {
    setProfile(editedProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Image
            source={{uri: 'https://ui-avatars.com/api/?name=' + profile.name}}
            style={styles.avatar}
          />
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreLabel}>VwoopScore</Text>
            <Text style={styles.scoreValue}>{profile.vwoopScore}</Text>
          </View>
          {!isEditing && (
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setIsEditing(true)}>
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.content}>
        {isEditing ? (
          // Edit Mode
          <>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                value={editedProfile.name}
                onChangeText={text =>
                  setEditedProfile({...editedProfile, name: text})
                }
                placeholder="Your name"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={editedProfile.email}
                onChangeText={text =>
                  setEditedProfile({...editedProfile, email: text})
                }
                placeholder="Your email"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Location</Text>
              <TextInput
                style={styles.input}
                value={editedProfile.location}
                onChangeText={text =>
                  setEditedProfile({...editedProfile, location: text})
                }
                placeholder="Your location"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Bio</Text>
              <TextInput
                style={[styles.input, styles.bioInput]}
                value={editedProfile.bio}
                onChangeText={text =>
                  setEditedProfile({...editedProfile, bio: text})
                }
                placeholder="Tell us about yourself"
                multiline
                numberOfLines={4}
              />
            </View>

            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={handleCancel}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleSave}>
                <Text style={styles.buttonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          // View Mode
          <>
            <View style={styles.infoGroup}>
              <Text style={styles.label}>Name</Text>
              <Text style={styles.infoText}>{profile.name}</Text>
            </View>

            <View style={styles.infoGroup}>
              <Text style={styles.label}>Email</Text>
              <Text style={styles.infoText}>{profile.email}</Text>
            </View>

            <View style={styles.infoGroup}>
              <Text style={styles.label}>Location</Text>
              <Text style={styles.infoText}>{profile.location}</Text>
            </View>

            <View style={styles.infoGroup}>
              <Text style={styles.label}>Bio</Text>
              <Text style={styles.infoText}>{profile.bio}</Text>
            </View>

            <View style={styles.infoGroup}>
              <Text style={styles.label}>Interests</Text>
              <View style={styles.interestsContainer}>
                {profile.interests.map((interest, index) => (
                  <View key={index} style={styles.interestTag}>
                    <Text style={styles.interestText}>{interest}</Text>
                  </View>
                ))}
              </View>
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    paddingTop: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  avatarContainer: {
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#805AD5',
  },
  editButton: {
    backgroundColor: '#805AD5',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  infoGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    color: '#333333',
  },
  bioInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  infoText: {
    fontSize: 16,
    color: '#333333',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: '#E0E0E0',
  },
  saveButton: {
    backgroundColor: '#805AD5',
  },
  buttonText: {
    color: '#333333',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  interestTag: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#805AD5',
  },
  interestText: {
    color: '#805AD5',
    fontSize: 14,
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  scoreLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#805AD5',
  },
});

export default Account; 