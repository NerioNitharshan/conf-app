import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  SafeAreaView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

// Mock data for schedule and speakers
const MOCK_SCHEDULE = [
  {
    id: '1',
    title: 'Registration & Morning Coffee',
    timeStart: '8:00 AM',
    timeEnd: '9:00 AM',
    date: '2025-06-15',
    location: 'Main Lobby',
    description: 'Pick up your badge and enjoy complimentary coffee.',
    type: 'break'
  },
  {
    id: '2',
    title: 'Opening Keynote: The Future of Tech',
    timeStart: '9:00 AM',
    timeEnd: '10:30 AM',
    date: '2025-06-15',
    location: 'Main Hall',
    description: 'Join our CEO for a look at upcoming technology trends.',
    type: 'keynote',
    speakerIds: ['1', '2']
  },
  {
    id: '3',
    title: 'Building Scalable Applications with React Native',
    timeStart: '11:00 AM',
    timeEnd: '12:00 PM',
    date: '2025-06-15',
    location: 'Room 101',
    description: 'Learn best practices for building large-scale React Native apps.',
    type: 'session',
    speakerIds: ['3']
  },
  {
    id: '5',
    title: 'AI in Mobile Development',
    timeStart: '1:30 PM',
    timeEnd: '2:30 PM',
    date: '2025-06-15',
    location: 'Room 102',
    description: 'Explore how AI is changing mobile development.',
    type: 'session',
    speakerIds: ['4']
  }
];

// Mock data for speakers
const MOCK_SPEAKERS = {
  '1': {
    name: 'John Smith',
    title: 'CTO, TechGiant',
  },
  '2': {
    name: 'Emma Johnson',
    title: 'VP Engineering, FutureCorp',
  },
  '3': {
    name: 'Michael Chen',
    title: 'React Native Evangelist',
  },
  '4': {
    name: 'Sarah Johnson',
    title: 'CTO, TechForward',
  }
};

export default function MyScheduleScreen() {
  const navigation = useNavigation();
  const [bookmarkedSessions, setBookmarkedSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  
  // Get bookmarked session IDs from storage and populate the sessions
  useFocusEffect(
    React.useCallback(() => {
      async function loadBookmarkedSessions() {
        try {
          const storedSessionIds = await AsyncStorage.getItem('bookmarkedSessions');
          
          if (storedSessionIds) {
            const sessionIds = JSON.parse(storedSessionIds);
            const sessions = sessionIds.map(id => 
              MOCK_SCHEDULE.find(session => session.id === id)
            ).filter(Boolean);
            
            setBookmarkedSessions(sessions);
          } else {
            // Start with empty array instead of defaults
            setBookmarkedSessions([]);
            await AsyncStorage.setItem('bookmarkedSessions', JSON.stringify([]));
          }
        } catch (error) {
          console.error('Failed to load bookmarked sessions:', error);
          // Fallback to empty array
          setBookmarkedSessions([]);
        } finally {
          setLoading(false);
        }
      }
      
      loadBookmarkedSessions();
    }, [])
  );
  
  const removeBookmark = async (sessionId) => {
    try {
      // Remove from state
      const updatedSessions = bookmarkedSessions.filter(session => session.id !== sessionId);
      setBookmarkedSessions(updatedSessions);
      
      // Update storage
      const updatedIds = updatedSessions.map(session => session.id);
      await AsyncStorage.setItem('bookmarkedSessions', JSON.stringify(updatedIds));
      
      Alert.alert('Success', 'Session removed from your schedule');
    } catch (error) {
      console.error('Failed to remove bookmark:', error);
      Alert.alert('Error', 'Failed to update your schedule');
    }
  };
  
  const clearAllBookmarks = () => {
    Alert.alert(
      'Clear Schedule',
      'Are you sure you want to remove all sessions from your schedule?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear All', 
          style: 'destructive',
          onPress: async () => {
            try {
              setBookmarkedSessions([]);
              await AsyncStorage.setItem('bookmarkedSessions', JSON.stringify([]));
              Alert.alert('Success', 'Your schedule has been cleared');
            } catch (error) {
              console.error('Failed to clear bookmarks:', error);
              Alert.alert('Error', 'Failed to clear your schedule');
            }
          }
        }
      ]
    );
  };
  
  const toggleEditMode = () => {
    setEditMode(!editMode);
  };
  
  const getSpeakerNames = (speakerIds) => {
    if (!speakerIds || speakerIds.length === 0) return '';
    
    return speakerIds
      .map(id => MOCK_SPEAKERS[id]?.name || 'Unknown Speaker')
      .join(', ');
  };
  
  const groupSessionsByDate = () => {
    const groups = {};
    
    bookmarkedSessions.forEach(session => {
      if (!groups[session.date]) {
        groups[session.date] = [];
      }
      groups[session.date].push(session);
    });
    
    // Sort sessions within each date group by start time
    Object.keys(groups).forEach(date => {
      groups[date].sort((a, b) => {
        return a.timeStart.localeCompare(b.timeStart);
      });
    });
    
    return groups;
  };
  
  const sessionGroups = groupSessionsByDate();
  const dates = Object.keys(sessionGroups).sort();
  
  const renderSessionItem = ({ item }) => {
    const sessionTypeStyles = {
      keynote: styles.keynoteSession,
      session: styles.regularSession,
      break: styles.breakSession,
      social: styles.socialSession,
    };
    
    return (
      <View style={[styles.sessionCard, sessionTypeStyles[item.type]]}>
        <View style={styles.sessionHeader}>
          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>{item.timeStart} - {item.timeEnd}</Text>
          </View>
          {editMode && (
            <TouchableOpacity 
              style={styles.removeButton}
              onPress={() => removeBookmark(item.id)}
            >
              <Ionicons name="trash-outline" size={20} color="#f44336" />
            </TouchableOpacity>
          )}
        </View>
        
        <TouchableOpacity
          onPress={() => navigation.navigate('SessionDetail', { sessionId: item.id })}
        >
          <Text style={styles.sessionTitle}>{item.title}</Text>
          <Text style={styles.sessionLocation}>{item.location}</Text>
          
          {item.speakerIds && (
            <View style={styles.speakerContainer}>
              <Ionicons name="person" size={14} color="#4285F4" style={{marginRight: 4}} />
              <Text style={styles.speakersText}>
                {getSpeakerNames(item.speakerIds)}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    );
  };
  
  const renderDateSection = ({ item }) => {
    const formattedDate = new Date(item).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
    
    return (
      <View style={styles.dateSection}>
        <Text style={styles.dateSectionTitle}>{formattedDate}</Text>
        <FlatList
          data={sessionGroups[item]}
          renderItem={renderSessionItem}
          keyExtractor={session => session.id}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.screenTitle}>My Schedule</Text>
          <View style={styles.headerActions}>
            {bookmarkedSessions.length > 0 && (
              <TouchableOpacity style={styles.editButton} onPress={toggleEditMode}>
                <Text style={styles.editButtonText}>
                  {editMode ? 'Done' : 'Edit'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4285F4" />
            <Text style={{marginTop: 10}}>Loading your personalized schedule...</Text>
          </View>
        ) : bookmarkedSessions.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Image
              source={{ uri: 'https://api.a0.dev/assets/image?text=Empty+Schedule&aspect=1:1' }} 
              style={styles.emptyImage}
            />
            <Text style={styles.emptyTitle}>No Sessions Bookmarked</Text>
            <Text style={styles.emptyText}>
              Browse the schedule and bookmark sessions to add them to your personal agenda.
            </Text>
            <TouchableOpacity 
              style={styles.browseButton}
              onPress={() => navigation.navigate('Schedule')}
            >
              <Text style={styles.browseButtonText}>Browse Schedule</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.contentContainer}>
            {editMode && (
              <TouchableOpacity 
                style={styles.clearAllButton}
                onPress={clearAllBookmarks}
              >
                <Ionicons name="trash-bin" size={16} color="#ffffff" style={{marginRight: 6}} />
                <Text style={styles.clearAllButtonText}>Clear All</Text>
              </TouchableOpacity>
            )}
            
            <FlatList
              data={dates}
              renderItem={renderDateSection}
              keyExtractor={item => item}
              contentContainerStyle={styles.listContent}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f7',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  headerActions: {
    flexDirection: 'row',
  },
  editButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  editButtonText: {
    color: '#4285F4',
    fontWeight: '600',
  },
  contentContainer: {
    flex: 1,
  },
  clearAllButton: {
    flexDirection: 'row',
    backgroundColor: '#f44336',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
  },
  clearAllButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
    paddingTop: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyImage: {
    width: 120,
    height: 120,
    marginBottom: 20,
    opacity: 0.7,
    borderRadius: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  browseButton: {
    backgroundColor: '#4285F4',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  browseButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  dateSection: {
    marginBottom: 24,
  },
  dateSectionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  sessionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderLeftWidth: 4,
  },
  keynoteSession: {
    borderLeftColor: '#E91E63',
  },
  regularSession: {
    borderLeftColor: '#4285F4',
  },
  breakSession: {
    borderLeftColor: '#34A853',
  },
  socialSession: {
    borderLeftColor: '#FBBC05',
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  timeContainer: {
    backgroundColor: '#f0f7ff',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  timeText: {
    fontSize: 12,
    color: '#4285F4',
    fontWeight: '500',
  },
  removeButton: {
    padding: 8,
  },
  removeButtonText: {
    fontSize: 13,
    color: '#f44336',
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sessionLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  speakerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  speakersText: {
    fontSize: 14,
    color: '#4285F4',
  },
});