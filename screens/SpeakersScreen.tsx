import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, TextInput, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Mock speakers data
const MOCK_SPEAKERS = [
  {
    id: '1',
    name: 'John Smith',
    title: 'CTO, TechGiant',
    bio: 'John is a seasoned technology leader with over 15 years of experience in software development and innovation.',
    sessions: ['2'],
    imageUrl: 'https://api.a0.dev/assets/image?text=John Smith&aspect=1:1'
  },
  {
    id: '2',
    name: 'Emma Johnson',
    title: 'VP Engineering, FutureCorp',
    bio: 'Emma has led engineering teams at multiple successful startups and focuses on scalable architecture.',
    sessions: ['2'],
    imageUrl: 'https://api.a0.dev/assets/image?text=Emma Johnson&aspect=1:1'
  },
  {
    id: '3',
    name: 'Michael Chen',
    title: 'React Native Evangelist',
    bio: 'Michael is a React Native expert who has contributed to the framework and written extensively about mobile development.',
    sessions: ['3'],
    imageUrl: 'https://api.a0.dev/assets/image?text=Michael Chen&aspect=1:1'
  },
  {
    id: '4',
    name: 'Sarah Johnson',
    title: 'CTO, TechForward',
    bio: 'Sarah specializes in AI and its applications in mobile technology, with a focus on ethical implementation.',
    sessions: ['5'],
    imageUrl: 'https://api.a0.dev/assets/image?text=Sarah Johnson&aspect=1:1'
  },
  {
    id: '5',
    name: 'David Rodriguez',
    title: 'Lead Developer, CrossTech',
    bio: 'David has built cross-platform applications for Fortune 500 companies and specializes in performance optimization.',
    sessions: ['6'],
    imageUrl: 'https://api.a0.dev/assets/image?text=David Rodriguez&aspect=1:1'
  },
  {
    id: '6',
    name: 'Lisa Wong',
    title: 'UX Research Lead, DesignFirst',
    bio: 'Lisa has conducted UX research for mobile applications across various industries and is an advocate for accessible design.',
    sessions: ['9'],
    imageUrl: 'https://api.a0.dev/assets/image?text=Lisa Wong&aspect=1:1'
  },
  {
    id: '7',
    name: 'Alex Turner',
    title: 'Blockchain Developer',
    bio: 'Alex specializes in blockchain integration with mobile applications and has developed several popular crypto wallets.',
    sessions: ['10'],
    imageUrl: 'https://api.a0.dev/assets/image?text=Alex Turner&aspect=1:1'
  }
];

export default function SpeakersScreen() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredSpeakers = MOCK_SPEAKERS.filter(speaker => 
    speaker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    speaker.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderSpeakerItem = ({ item }) => {
    return (
      <TouchableOpacity 
        style={styles.speakerCard}
        onPress={() => navigation.navigate('SpeakerDetail', { speakerId: item.id })}
      >
        <Image 
          source={{ uri: item.imageUrl }}
          style={styles.speakerImage}
        />
        <View style={styles.speakerInfo}>
          <Text style={styles.speakerName}>{item.name}</Text>
          <Text style={styles.speakerTitle}>{item.title}</Text>
          <Text numberOfLines={2} style={styles.speakerBio}>{item.bio}</Text>
          <TouchableOpacity style={styles.sessionsButton}>
            <Text style={styles.sessionsButtonText}>
              {item.sessions.length} {item.sessions.length === 1 ? 'Session' : 'Sessions'}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.screenTitle}>Speakers</Text>
        </View>
        
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search speakers..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
                <Text>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        
        <FlatList
          data={filteredSpeakers}
          renderItem={renderSpeakerItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.speakersList}
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
  searchContainer: {
    backgroundColor: '#ffffff',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f7',
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
  },
  clearButton: {
    padding: 6,
  },
  speakersList: {
    padding: 12,
  },
  speakerCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 16,
    flexDirection: 'row',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  speakerImage: {
    width: 100,
    height: 120,
  },
  speakerInfo: {
    flex: 1,
    padding: 12,
  },
  speakerName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  speakerTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  speakerBio: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  sessionsButton: {
    backgroundColor: '#f0f7ff',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  sessionsButtonText: {
    fontSize: 12,
    color: '#4285F4',
    fontWeight: '500',
  },
});