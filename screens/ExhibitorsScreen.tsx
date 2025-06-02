import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, TextInput, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Mock data for exhibitors
const MOCK_EXHIBITORS = [
  {
    id: '1',
    name: 'TechGiant',
    boothNumber: 'A1',
    category: 'Cloud Services',
    description: 'Leading provider of cloud computing solutions for enterprise.',
    logo: 'https://api.a0.dev/assets/image?text=TechGiant&aspect=1:1'
  },
  {
    id: '2',
    name: 'MobileFirst',
    boothNumber: 'B3',
    category: 'Mobile Development',
    description: 'Specializing in cross-platform mobile application development frameworks.',
    logo: 'https://api.a0.dev/assets/image?text=MobileFirst&aspect=1:1'
  },
  {
    id: '3',
    name: 'DevToolsCo',
    boothNumber: 'A4',
    category: 'Developer Tools',
    description: 'Suite of tools designed to enhance developer productivity and code quality.',
    logo: 'https://api.a0.dev/assets/image?text=DevToolsCo&aspect=1:1'
  },
  {
    id: '4',
    name: 'AIInnovate',
    boothNumber: 'C2',
    category: 'Artificial Intelligence',
    description: 'Cutting-edge AI solutions for businesses looking to transform their operations.',
    logo: 'https://api.a0.dev/assets/image?text=AIInnovate&aspect=1:1'
  },
  {
    id: '5',
    name: 'SecureNet',
    boothNumber: 'B5',
    category: 'Security',
    description: 'Enterprise-grade security solutions for web and mobile applications.',
    logo: 'https://api.a0.dev/assets/image?text=SecureNet&aspect=1:1'
  },
  {
    id: '6',
    name: 'UXMasters',
    boothNumber: 'D3',
    category: 'Design',
    description: 'User experience design agency specializing in mobile interfaces.',
    logo: 'https://api.a0.dev/assets/image?text=UXMasters&aspect=1:1'
  },
  {
    id: '7',
    name: 'BlockchainNow',
    boothNumber: 'C5',
    category: 'Blockchain',
    description: 'Blockchain solutions for secure, transparent business operations.',
    logo: 'https://api.a0.dev/assets/image?text=BlockchainNow&aspect=1:1'
  },
  {
    id: '8',
    name: 'CloudScale',
    boothNumber: 'A2',
    category: 'Cloud Services',
    description: 'Scalable infrastructure solutions for growing businesses.',
    logo: 'https://api.a0.dev/assets/image?text=CloudScale&aspect=1:1'
  }
];

// Get all unique categories for filtering
const ALL_CATEGORIES = ['All', ...new Set(MOCK_EXHIBITORS.map(item => item.category))];

export default function ExhibitorsScreen() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const filteredExhibitors = MOCK_EXHIBITORS.filter(exhibitor => {
    const matchesSearch = 
      exhibitor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exhibitor.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || exhibitor.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const renderCategoryTab = (category) => {
    const isActive = category === selectedCategory;
    
    return (
      <TouchableOpacity
        key={category}
        style={[styles.categoryTab, isActive && styles.activeCategoryTab]}
        onPress={() => setSelectedCategory(category)}
      >
        <Text style={[styles.categoryTabText, isActive && styles.activeCategoryTabText]}>
          {category}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderExhibitorItem = ({ item }) => {
    return (
      <TouchableOpacity 
        style={styles.exhibitorCard}
        onPress={() => navigation.navigate('ExhibitorDetail', { exhibitorId: item.id })}
      >
        <Image 
          source={{ uri: item.logo }} 
          style={styles.exhibitorLogo}
        />
        <View style={styles.exhibitorInfo}>
          <Text style={styles.exhibitorName}>{item.name}</Text>
          <View style={styles.boothBadge}>
            <Text style={styles.boothNumber}>Booth {item.boothNumber}</Text>
          </View>
          <Text style={styles.exhibitorCategory}>{item.category}</Text>
          <Text numberOfLines={2} style={styles.exhibitorDescription}>
            {item.description}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.screenTitle}>Exhibitors</Text>
        </View>
        
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search exhibitors..."
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
        
        <View style={styles.categoriesContainer}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={ALL_CATEGORIES}
            renderItem={({ item }) => renderCategoryTab(item)}
            keyExtractor={item => item}
            contentContainerStyle={styles.categoriesList}
          />
        </View>
        
        <FlatList
          data={filteredExhibitors}
          renderItem={renderExhibitorItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.exhibitorsList}
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
  categoriesContainer: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  categoriesList: {
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  categoryTab: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: '#f5f5f7',
    borderRadius: 16,
    marginHorizontal: 4,
  },
  activeCategoryTab: {
    backgroundColor: '#4285F4',
  },
  categoryTabText: {
    fontSize: 14,
    color: '#666',
  },
  activeCategoryTabText: {
    color: '#ffffff',
    fontWeight: '500',
  },
  exhibitorsList: {
    padding: 12,
  },
  exhibitorCard: {
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
  exhibitorLogo: {
    width: 90,
    height: 90,
  },
  exhibitorInfo: {
    flex: 1,
    padding: 12,
  },
  exhibitorName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  boothBadge: {
    backgroundColor: '#f0f7ff',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  boothNumber: {
    fontSize: 12,
    color: '#4285F4',
    fontWeight: '500',
  },
  exhibitorCategory: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  exhibitorDescription: {
    fontSize: 14,
    color: '#333',
  },
});