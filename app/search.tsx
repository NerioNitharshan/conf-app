import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TextInput, 
  TouchableOpacity, 
  Image,
  ActivityIndicator,
  SafeAreaView,
  ScrollView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Mock data for search (compiled from sessions, speakers, and exhibitors)
const MOCK_SEARCH_DATA = [
  {
    id: 'session-2',
    type: 'session',
    title: 'Opening Keynote: The Future of Tech',
    subtitle: 'Main Hall • June 15, 9:00 AM',
    description: 'Join our CEO for a look at upcoming technology trends.',
  },
  {
    id: 'session-3',
    type: 'session',
    title: 'Building Scalable Applications with React Native',
    subtitle: 'Room 101 • June 15, 11:00 AM',
    description: 'Learn best practices for building large-scale React Native apps.',
  },
  {
    id: 'session-5',
    type: 'session',
    title: 'AI in Mobile Development',
    subtitle: 'Room 102 • June 15, 1:30 PM',
    description: 'Explore how AI is changing mobile development.',
  },
  {
    id: 'speaker-1',
    type: 'speaker',
    title: 'John Smith',
    subtitle: 'CTO, TechGiant',
    description: 'John is a seasoned technology leader with over 15 years of experience.',
    image: 'https://api.a0.dev/assets/image?text=John Smith&aspect=1:1'
  },
  {
    id: 'speaker-3',
    type: 'speaker',
    title: 'Michael Chen',
    subtitle: 'React Native Evangelist',
    description: 'Michael is a React Native expert who has contributed to the framework.',
    image: 'https://api.a0.dev/assets/image?text=Michael Chen&aspect=1:1'
  },
  {
    id: 'speaker-4',
    type: 'speaker',
    title: 'Sarah Johnson',
    subtitle: 'CTO, TechForward',
    description: 'Sarah specializes in AI and its applications in mobile technology.',
    image: 'https://api.a0.dev/assets/image?text=Sarah Johnson&aspect=1:1'
  },
  {
    id: 'exhibitor-1',
    type: 'exhibitor',
    title: 'TechGiant',
    subtitle: 'Booth A1 • Cloud Services',
    description: 'Leading provider of cloud computing solutions for enterprise.',
    image: 'https://api.a0.dev/assets/image?text=TechGiant&aspect=1:1'
  },
  {
    id: 'exhibitor-2',
    type: 'exhibitor',
    title: 'MobileFirst',
    subtitle: 'Booth B3 • Mobile Development',
    description: 'Specializing in cross-platform mobile application development.',
    image: 'https://api.a0.dev/assets/image?text=MobileFirst&aspect=1:1'
  },
  {
    id: 'exhibitor-4',
    type: 'exhibitor',
    title: 'AIInnovate',
    subtitle: 'Booth C2 • Artificial Intelligence',
    description: 'Cutting-edge AI solutions for businesses.',
    image: 'https://api.a0.dev/assets/image?text=AIInnovate&aspect=1:1'
  }
];

export default function SearchScreen() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  
  const performSearch = useCallback((query) => {
    setIsSearching(true);
    
    // Simulate a network request with setTimeout
    setTimeout(() => {
      if (!query.trim()) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }
      
      const results = MOCK_SEARCH_DATA.filter(item => {
        const matchesQuery = 
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase());
          
        const matchesFilter = activeFilter === 'all' || item.type === activeFilter;
        
        return matchesQuery && matchesFilter;
      });
      
      setSearchResults(results);
      setIsSearching(false);
    }, 300); // Simulate delay for more realistic experience
  }, [activeFilter]);
  
  const handleSearch = (text) => {
    setSearchQuery(text);
    performSearch(text);
  };
  
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    performSearch(searchQuery);
  };
  
  const navigateToDetail = (item) => {
    const [itemType, itemId] = item.id.split('-');
    
    switch (itemType) {
      case 'session':
        navigation.navigate('SessionDetail', { sessionId: itemId });
        break;
      case 'speaker':
        navigation.navigate('SpeakerDetail', { speakerId: itemId });
        break;
      case 'exhibitor':
        navigation.navigate('ExhibitorDetail', { exhibitorId: itemId });
        break;
    }
  };
  
  const renderFilterButton = (filter, label) => {
    const isActive = filter === activeFilter;
    
    return (
      <TouchableOpacity
        style={[styles.filterButton, isActive && styles.activeFilterButton]}
        onPress={() => handleFilterChange(filter)}
      >
        <Text style={[styles.filterButtonText, isActive && styles.activeFilterButtonText]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };
  
  const renderSearchResult = ({ item }) => {
    const hasImage = item.type === 'speaker' || item.type === 'exhibitor';
    
    return (
      <TouchableOpacity 
        style={styles.resultCard}
        onPress={() => navigateToDetail(item)}
      >
        <View style={styles.resultContent}>
          {hasImage && (
            <Image 
              source={{ uri: item.image }}
              style={styles.resultImage}
            />
          )}
          <View style={styles.resultTextContainer}>
            <Text style={styles.resultTitle}>{item.title}</Text>
            <Text style={styles.resultSubtitle}>{item.subtitle}</Text>
            <Text numberOfLines={2} style={styles.resultDescription}>
              {item.description}
            </Text>
          </View>
        </View>
        <View style={[styles.resultType, styles[`${item.type}Type`]]} />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.screenTitle}>Search</Text>
        </View>
        
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search sessions, speakers, exhibitors..."
              value={searchQuery}
              onChangeText={handleSearch}
              autoFocus
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity 
                style={styles.clearButton}
                onPress={() => handleSearch('')}
              >
                <Text>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        
        <View style={styles.filtersContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersScroll}>
            {renderFilterButton('all', 'All Results')}
            {renderFilterButton('session', 'Sessions')}
            {renderFilterButton('speaker', 'Speakers')}
            {renderFilterButton('exhibitor', 'Exhibitors')}
          </ScrollView>
        </View>
        
        {isSearching ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4285F4" />
          </View>
        ) : searchQuery && searchResults.length === 0 ? (
          <View style={styles.noResultsContainer}>
            <Image
              source={{ uri: 'https://api.a0.dev/assets/image?text=No Results&aspect=1:1' }}
              style={styles.noResultsImage}
            />
            <Text style={styles.noResultsTitle}>No Results Found</Text>
            <Text style={styles.noResultsText}>
              We couldn't find any matches for "{searchQuery}".
              Try different keywords or filters.
            </Text>
          </View>
        ) : (
          <FlatList
            data={searchResults}
            renderItem={renderSearchResult}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.resultsList}
            ListEmptyComponent={
              !searchQuery ? (
                <View style={styles.emptySearchContainer}>
                  <Text style={styles.emptySearchText}>Search for sessions, speakers, or exhibitors</Text>
                </View>
              ) : null
            }
          />
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
  filtersContainer: {
    backgroundColor: '#ffffff',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  filtersScroll: {
    paddingHorizontal: 12,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 8,
    backgroundColor: '#f5f5f7',
  },
  activeFilterButton: {
    backgroundColor: '#4285F4',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#666',
  },
  activeFilterButtonText: {
    color: '#ffffff',
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultsList: {
    padding: 12,
  },
  resultCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 10,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  resultContent: {
    flexDirection: 'row',
    padding: 12,
  },
  resultImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  resultTextContainer: {
    flex: 1,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  resultSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  resultDescription: {
    fontSize: 14,
    color: '#444',
  },
  resultType: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  sessionType: {
    backgroundColor: '#4285F4',
  },
  speakerType: {
    backgroundColor: '#34A853',
  },
  exhibitorType: {
    backgroundColor: '#FBBC05',
  },
  emptySearchContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptySearchText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  noResultsImage: {
    width: 100,
    height: 100,
    marginBottom: 16,
    opacity: 0.7,
  },
  noResultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  noResultsText: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
});