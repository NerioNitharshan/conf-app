import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, ScrollView, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

// Mock data for our schedule
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
    id: '4',
    title: 'Lunch Break',
    timeStart: '12:00 PM',
    timeEnd: '1:30 PM',
    date: '2025-06-15',
    location: 'Dining Hall',
    description: 'Networking lunch with exhibitors.',
    type: 'break'
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
  },
  {
    id: '6',
    title: 'Cross-Platform Development Trends',
    timeStart: '2:45 PM',
    timeEnd: '3:45 PM',
    date: '2025-06-15',
    location: 'Room 101',
    description: 'Compare different approaches to building cross-platform apps.',
    type: 'session',
    speakerIds: ['5']
  },
  {
    id: '7',
    title: 'Networking Reception',
    timeStart: '5:00 PM',
    timeEnd: '7:00 PM',
    date: '2025-06-15',
    location: 'Rooftop Lounge',
    description: 'Drinks and appetizers with fellow attendees.',
    type: 'social'
  },
  {
    id: '8',
    title: 'Morning Coffee',
    timeStart: '8:30 AM',
    timeEnd: '9:30 AM',
    date: '2025-06-16',
    location: 'Main Lobby',
    description: 'Start your day with coffee and networking.',
    type: 'break'
  },
  {
    id: '9',
    title: 'Future of Mobile UX',
    timeStart: '9:30 AM',
    timeEnd: '10:30 AM',
    date: '2025-06-16',
    location: 'Main Hall',
    description: 'Explore upcoming trends in mobile user experience design.',
    type: 'session',
    speakerIds: ['6']
  },
  {
    id: '10',
    title: 'Blockchain for Mobile Apps',
    timeStart: '11:00 AM',
    timeEnd: '12:00 PM',
    date: '2025-06-16',
    location: 'Room 103',
    description: 'Learn how to integrate blockchain technologies in your mobile apps.',
    type: 'session',
    speakerIds: ['7']
  }
];

export default function ScheduleScreen() {
  const navigation = useNavigation();
  const [activeDate, setActiveDate] = useState('2025-06-15');
  const [activeFilter, setActiveFilter] = useState('all');
  const [bookmarkedSessions, setBookmarkedSessions] = useState([]);
  
  // Load bookmarked sessions
  useFocusEffect(
    React.useCallback(() => {
      async function loadBookmarkedSessions() {
        try {
          const storedSessionIds = await AsyncStorage.getItem('bookmarkedSessions');
          if (storedSessionIds) {
            setBookmarkedSessions(JSON.parse(storedSessionIds));
          }
        } catch (error) {
          console.error('Failed to load bookmarked sessions:', error);
        }
      }
      
      loadBookmarkedSessions();
    }, [])
  );
  
  // Toggle bookmark for a session
  const toggleBookmark = async (sessionId) => {
    try {
      let updatedBookmarks;
      
      if (bookmarkedSessions.includes(sessionId)) {
        // Remove bookmark
        updatedBookmarks = bookmarkedSessions.filter(id => id !== sessionId);
        Alert.alert('Removed', 'Session removed from My Schedule');
      } else {
        // Add bookmark
        updatedBookmarks = [...bookmarkedSessions, sessionId];
        Alert.alert('Added', 'Session added to My Schedule');
      }
      
      // Update state and storage
      setBookmarkedSessions(updatedBookmarks);
      await AsyncStorage.setItem('bookmarkedSessions', JSON.stringify(updatedBookmarks));
    } catch (error) {
      console.error('Failed to update bookmarks:', error);
      Alert.alert('Error', 'Failed to update your schedule');
    }
  };
  
  const dates = [...new Set(MOCK_SCHEDULE.map(item => item.date))];
  const filteredSchedule = MOCK_SCHEDULE.filter(
    item => item.date === activeDate && 
    (activeFilter === 'all' || item.type === activeFilter)
  );
  
  const renderDateTab = (date) => {
    const isActive = date === activeDate;
    const formattedDate = new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
    
    return (
      <TouchableOpacity
        style={[styles.dateTab, isActive && styles.activeDateTab]}
        onPress={() => setActiveDate(date)}
      >
        <Text style={[styles.dateTabText, isActive && styles.activeDateTabText]}>
          {formattedDate}
        </Text>
      </TouchableOpacity>
    );
  };
  
  const renderFilterTab = (filter, label) => {
    const isActive = filter === activeFilter;
    
    return (
      <TouchableOpacity
        style={[styles.filterTab, isActive && styles.activeFilterTab]}
        onPress={() => setActiveFilter(filter)}
      >
        <Text style={[styles.filterTabText, isActive && styles.activeFilterTabText]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderSessionItem = ({ item }) => {
    const sessionTypeStyles = {
      keynote: styles.keynoteSession,
      session: styles.regularSession,
      break: styles.breakSession,
      social: styles.socialSession,
    };
    
    const isBookmarked = bookmarkedSessions.includes(item.id);
    
    return (
      <TouchableOpacity 
        style={[styles.sessionCard, sessionTypeStyles[item.type]]}
        onPress={() => navigation.navigate('SessionDetail', { sessionId: item.id })}
      >
        <View style={styles.timeContainer}>
          <Text style={styles.sessionTime}>{item.timeStart}</Text>
          <Text style={styles.sessionTime}>{item.timeEnd}</Text>
        </View>
        
        <View style={styles.sessionContent}>
          <Text style={styles.sessionTitle}>{item.title}</Text>
          <Text style={styles.sessionLocation}>{item.location}</Text>
          {item.speakerIds && (
            <Text style={styles.sessionSpeakers}>
              {item.speakerIds.length > 1 ? 'Multiple Speakers' : '1 Speaker'}
            </Text>
          )}
        </View>
        
        <View style={styles.sessionActions}>
          <TouchableOpacity 
            style={styles.bookmarkButton}
            onPress={() => toggleBookmark(item.id)}
          >
            <Ionicons 
              name={isBookmarked ? 'star' : 'star-outline'} 
              size={22} 
              color={isBookmarked ? '#FBBC05' : '#666'} 
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.screenTitle}>Schedule</Text>
        </View>
        
        <View style={styles.dateTabsContainer}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={dates}
            renderItem={({ item }) => renderDateTab(item)}
            keyExtractor={item => item}
            contentContainerStyle={styles.dateTabs}
          />
        </View>
        
        <View style={styles.filterTabsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterTabs}>
            {renderFilterTab('all', 'All')}
            {renderFilterTab('keynote', 'Keynotes')}
            {renderFilterTab('session', 'Sessions')}
            {renderFilterTab('break', 'Breaks')}
            {renderFilterTab('social', 'Social')}
          </ScrollView>
        </View>
        
        <FlatList
          data={filteredSchedule}
          renderItem={renderSessionItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.sessionsList}
          showsVerticalScrollIndicator={false}
        />
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
  dateTabsContainer: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  dateTabs: {
    paddingHorizontal: 8,
  },
  dateTab: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 4,
  },
  activeDateTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#4285F4',
  },
  dateTabText: {
    fontSize: 16,
    color: '#666',
  },
  activeDateTabText: {
    color: '#4285F4',
    fontWeight: '600',
  },
  filterTabsContainer: {
    backgroundColor: '#ffffff',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  filterTabs: {
    paddingHorizontal: 8,
  },
  filterTab: {
    backgroundColor: '#f5f5f7',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginHorizontal: 4,
  },
  activeFilterTab: {
    backgroundColor: '#4285F4',
  },
  filterTabText: {
    fontSize: 14,
    color: '#666',
  },
  activeFilterTabText: {
    color: '#ffffff',
  },
  sessionsList: {
    padding: 12,
  },
  sessionCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  keynoteSession: {
    borderLeftWidth: 4,
    borderLeftColor: '#E91E63',
  },
  regularSession: {
    borderLeftWidth: 4,
    borderLeftColor: '#4285F4',
  },
  breakSession: {
    borderLeftWidth: 4,
    borderLeftColor: '#34A853',
  },
  socialSession: {
    borderLeftWidth: 4,
    borderLeftColor: '#FBBC05',
  },
  timeContainer: {
    width: 78,
    backgroundColor: '#f8f8f8',
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sessionTime: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  sessionContent: {
    flex: 1,
    padding: 12,
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  sessionLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  sessionSpeakers: {
    fontSize: 12,
    color: '#4285F4',
  },
  sessionActions: {
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookmarkButton: {
    padding: 6,
  },
});