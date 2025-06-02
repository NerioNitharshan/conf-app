import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  ScrollView,
  Dimensions,
  SafeAreaView,
  Modal
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Mock venue floors data
const VENUE_FLOORS = [
  {
    id: '1',
    name: 'Floor 1 - Main Hall',
    description: 'Main exhibition hall, registration, and keynote areas',
    mapImage: 'https://api.a0.dev/assets/image?text=Floor 1 - Main Hall Map&aspect=4:3' 
  },
  {
    id: '2',
    name: 'Floor 2 - Session Rooms',
    description: 'Breakout rooms and workshop areas',
    mapImage: 'https://api.a0.dev/assets/image?text=Floor 2 - Session Rooms Map&aspect=4:3'
  },
  {
    id: '3',
    name: 'Floor 3 - Networking Areas',
    description: 'Lounge spaces and refreshment areas',
    mapImage: 'https://api.a0.dev/assets/image?text=Floor 3 - Networking Areas Map&aspect=4:3'
  }
];

// Mock booth areas (hotspots on map)
const BOOTH_AREAS = [
  {
    id: '1',
    floorId: '1',
    name: 'Section A',
    x: 100,
    y: 150,
    width: 80,
    height: 50,
    exhibitorIds: ['1', '8']
  },
  {
    id: '2',
    floorId: '1',
    name: 'Section B',
    x: 200,
    y: 150,
    width: 80,
    height: 50,
    exhibitorIds: ['2', '5']
  },
  {
    id: '3',
    floorId: '1',
    name: 'Section C',
    x: 150,
    y: 250,
    width: 80,
    height: 50,
    exhibitorIds: ['4', '7']
  },
  {
    id: '4',
    floorId: '2',
    name: 'Session Room 101',
    x: 100,
    y: 100,
    width: 100,
    height: 70,
    sessionIds: ['3', '6']
  },
  {
    id: '5',
    floorId: '2',
    name: 'Session Room 102',
    x: 220,
    y: 100,
    width: 100,
    height: 70,
    sessionIds: ['5']
  },
  {
    id: '6',
    floorId: '3',
    name: 'Networking Lounge',
    x: 150,
    y: 180,
    width: 120,
    height: 80,
    description: 'Main networking area with refreshments'
  }
];

export default function MapScreen() {
  const navigation = useNavigation();
  const [activeFloorId, setActiveFloorId] = useState('1');
  const [selectedArea, setSelectedArea] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  
  const screenWidth = Dimensions.get('window').width;
  const mapWidth = screenWidth - 32; // 16px padding on each side
  const mapHeight = mapWidth * 0.75; // 4:3 aspect ratio
  
  const activeFloor = VENUE_FLOORS.find(floor => floor.id === activeFloorId);
  const floorBoothAreas = BOOTH_AREAS.filter(area => area.floorId === activeFloorId);
  
  const handleAreaPress = (area) => {
    setSelectedArea(area);
    setModalVisible(true);
  };

  const renderMapHotspot = (area) => {
    // Calculate position based on map dimensions
    const scaleX = mapWidth / 400; // assuming original map is 400px wide
    const scaleY = mapHeight / 300; // assuming original map is 300px high
    
    const hotspotStyle = {
      position: 'absolute',
      left: area.x * scaleX,
      top: area.y * scaleY,
      width: area.width * scaleX,
      height: area.height * scaleY,
      borderWidth: 2,
      borderColor: 'rgba(66, 133, 244, 0.8)',
      backgroundColor: 'rgba(66, 133, 244, 0.2)',
      borderRadius: 4
    };
    
    return (
      <TouchableOpacity 
        key={area.id}
        style={hotspotStyle}
        onPress={() => handleAreaPress(area)}
      >
        <Text style={styles.hotspotText}>{area.name}</Text>
      </TouchableOpacity>
    );
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedArea(null);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.screenTitle}>Venue Map</Text>
        </View>
        
        <View style={styles.floorTabsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {VENUE_FLOORS.map((floor) => {
              const isActive = floor.id === activeFloorId;
              
              return (
                <TouchableOpacity
                  key={floor.id}
                  style={[styles.floorTab, isActive && styles.activeFloorTab]}
                  onPress={() => setActiveFloorId(floor.id)}
                >
                  <Text style={[styles.floorTabText, isActive && styles.activeFloorTabText]}>
                    {floor.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
        
        <ScrollView style={styles.contentContainer}>
          <Text style={styles.floorDescription}>{activeFloor.description}</Text>
          
          <View style={styles.mapContainer}>
            <Image
              source={{ uri: activeFloor.mapImage }}
              style={[styles.mapImage, { width: mapWidth, height: mapHeight }]}
            />
            {floorBoothAreas.map(renderMapHotspot)}
          </View>
          
          <View style={styles.legendContainer}>
            <Text style={styles.legendTitle}>Map Legend</Text>
            <View style={styles.legendItem}>
              <View style={styles.legendColor} />
              <Text style={styles.legendText}>Interactive Area - Tap to see details</Text>
            </View>
          </View>
        </ScrollView>
        
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={handleCloseModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{selectedArea?.name}</Text>
              
              {selectedArea?.exhibitorIds && (
                <>
                  <Text style={styles.modalSubtitle}>Exhibitors in this area:</Text>
                  {selectedArea.exhibitorIds.map(id => {
                    const exhibitor = { id, name: `Exhibitor ${id}`, boothNumber: `X${id}` }; // Would look up from actual data
                    return (
                      <TouchableOpacity 
                        key={id}
                        style={styles.modalListItem}
                        onPress={() => {
                          handleCloseModal();
                          navigation.navigate('ExhibitorDetail', { exhibitorId: id });
                        }}
                      >
                        <Text style={styles.modalItemTitle}>{exhibitor.name}</Text>
                        <Text style={styles.modalItemSubtitle}>Booth {exhibitor.boothNumber}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </>
              )}
              
              {selectedArea?.sessionIds && (
                <>
                  <Text style={styles.modalSubtitle}>Sessions in this room:</Text>
                  {selectedArea.sessionIds.map(id => {
                    const session = { id, title: `Session ${id}` }; // Would look up from actual data
                    return (
                      <TouchableOpacity 
                        key={id}
                        style={styles.modalListItem}
                        onPress={() => {
                          handleCloseModal();
                          navigation.navigate('SessionDetail', { sessionId: id });
                        }}
                      >
                        <Text style={styles.modalItemTitle}>{session.title}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </>
              )}
              
              {selectedArea?.description && (
                <Text style={styles.modalDescription}>{selectedArea.description}</Text>
              )}
              
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleCloseModal}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
  floorTabsContainer: {
    backgroundColor: '#ffffff',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  floorTab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 6,
  },
  activeFloorTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#4285F4',
  },
  floorTabText: {
    fontSize: 15,
    color: '#666',
  },
  activeFloorTabText: {
    color: '#4285F4',
    fontWeight: '600',
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  floorDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  mapContainer: {
    position: 'relative',
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
  },
  mapImage: {
    resizeMode: 'contain',
  },
  hotspotText: {
    fontSize: 10,
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 2,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  legendContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendColor: {
    width: 20,
    height: 20,
    backgroundColor: 'rgba(66, 133, 244, 0.2)',
    borderWidth: 2,
    borderColor: 'rgba(66, 133, 244, 0.8)',
    marginRight: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 14,
    color: '#333',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  modalSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 8,
    color: '#444',
  },
  modalListItem: {
    backgroundColor: '#f5f5f7',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  modalItemTitle: {
    fontSize: 15,
    fontWeight: '500',
  },
  modalItemSubtitle: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
  modalDescription: {
    fontSize: 14,
    color: '#444',
    marginTop: 12,
  },
  closeButton: {
    backgroundColor: '#4285F4',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});