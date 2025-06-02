import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const navigation = useNavigation();

  const navigateTo = (screen) => {
    navigation.navigate(screen);
  };

  const QuickNavTile = ({ title, icon, screenName }) => (
    <TouchableOpacity 
      style={styles.navTile} 
      onPress={() => navigateTo(screenName)}
    >
      <Text style={styles.navTileIcon}>{icon}</Text>
      <Text style={styles.navTileText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.eventTitle}>Tech Conference 2025</Text>
          <Text style={styles.eventDate}>June 15-17, 2025</Text>
        </View>
      
        <ImageBackground 
          source={{ uri: 'https://api.a0.dev/assets/image?text=Conference Banner&aspect=16:9' }}
          style={styles.banner}
        >
          <View style={styles.bannerOverlay}>
            <Text style={styles.bannerText}>Welcome to the premier tech event of the year!</Text>
          </View>
        </ImageBackground>
       
        <View style={styles.announcementCard}>
          <Text style={styles.announcementTitle}>Announcements</Text>
          <Text style={styles.announcementText}>
            Keynote starts tomorrow at 9:00 AM in the Main Hall. 
            Don't forget to download the latest schedule updates!
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Quick Navigation</Text>
        
        <View style={styles.navGrid}>
          <QuickNavTile title="Schedule" icon="🗓️" screenName="Schedule" />
          <QuickNavTile title="Speakers" icon="🎤" screenName="Speakers" />
          <QuickNavTile title="Exhibitors" icon="🏢" screenName="Exhibitors" />
          <QuickNavTile title="Map" icon="🗺️" screenName="Map" />
          <QuickNavTile title="My Schedule" icon="⭐" screenName="MySchedule" />
          <QuickNavTile title="Networking" icon="👥" screenName="Networking" />
        </View>

        <View style={styles.upcomingContainer}>
          <Text style={styles.sectionTitle}>Coming Up Next</Text>
          <View style={styles.sessionCard}>
            <Text style={styles.sessionTime}>10:00 AM - 11:30 AM</Text>
            <Text style={styles.sessionTitle}>Future of AI in Mobile Development</Text>
            <Text style={styles.sessionSpeaker}>Sarah Johnson, CTO at TechForward</Text>
            <Text style={styles.sessionLocation}>Room 42A, Main Building</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f7'
  },
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    backgroundColor: '#ffffff',
  },
  eventTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  eventDate: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  banner: {
    height: 180,
    marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  bannerOverlay: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    flex: 1,
    justifyContent: 'flex-end',
    padding: 16,
  },
  bannerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  navGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 8,
  },
  navTile: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: 'white',
    margin: '1.65%',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  navTileIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  navTileText: {
    fontSize: 14,
    fontWeight: '500',
  },
  announcementCard: {
    backgroundColor: '#E8F0FE',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#4285F4',
  },
  announcementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A73E8',
    marginBottom: 4,
  },
  announcementText: {
    fontSize: 14,
    color: '#333',
  },
  upcomingContainer: {
    paddingBottom: 24,
  },
  sessionCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sessionTime: {
    fontSize: 14,
    color: '#4285F4',
    fontWeight: '500',
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 4,
    marginBottom: 6,
  },
  sessionSpeaker: {
    fontSize: 14,
    color: '#666',
  },
  sessionLocation: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
});