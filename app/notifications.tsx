import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';

// Mock notifications data
const MOCK_NOTIFICATIONS = [
  {
    id: '1',
    title: 'Welcome to Tech Conference 2025!',
    message: 'Thank you for joining us at this year\'s conference. Registration is open from 8:00 AM at the main lobby.',
    date: '2025-06-15T07:30:00',
    read: true,
    type: 'info'
  },
  {
    id: '2',
    title: 'Keynote Starting in 30 Minutes',
    message: 'The opening keynote with John Smith and Emma Johnson is starting in 30 minutes in the Main Hall.',
    date: '2025-06-15T08:30:00',
    read: false,
    type: 'alert'
  },
  {
    id: '3',
    title: 'Schedule Change: AI Workshop',
    message: 'The AI Workshop has been moved from Room 102 to Room 105 due to higher-than-expected attendance.',
    date: '2025-06-15T10:15:00',
    read: false,
    type: 'important'
  },
  {
    id: '4',
    title: 'Lunch is Served',
    message: 'Lunch is now being served in the Dining Hall. Please have your badge ready for scanning.',
    date: '2025-06-15T12:00:00',
    read: false,
    type: 'info'
  },
  {
    id: '5',
    title: 'Networking Reception Tonight',
    message: 'Join us for drinks and appetizers at the Networking Reception on the Rooftop Lounge from 5:00 PM to 7:00 PM.',
    date: '2025-06-15T14:00:00',
    read: true,
    type: 'info'
  }
];

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  
  const markAsRead = (id) => {
    const updatedNotifications = notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    );
    setNotifications(updatedNotifications);
  };
  
  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notification => ({ ...notification, read: true }));
    setNotifications(updatedNotifications);
  };
  
  const formatNotificationTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };
  
  const unreadCount = notifications.filter(notification => !notification.read).length;
  
  const renderNotificationItem = ({ item }) => {
    return (
      <TouchableOpacity 
        style={[styles.notificationCard, !item.read && styles.unreadCard]}
        onPress={() => markAsRead(item.id)}
      >
        <View style={styles.notificationHeader}>
          <Text style={styles.notificationTime}>{formatNotificationTime(item.date)}</Text>
          {!item.read && <View style={styles.unreadDot} />}
        </View>
        
        <Text style={styles.notificationTitle}>{item.title}</Text>
        <Text style={styles.notificationMessage}>{item.message}</Text>
        
        <View style={[styles.notificationType, styles[`${item.type}Type`]]} />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.screenTitle}>Notifications</Text>
          {unreadCount > 0 && (
            <TouchableOpacity onPress={markAllAsRead}>
              <Text style={styles.markAllButton}>Mark All as Read</Text>
            </TouchableOpacity>
          )}
        </View>
        
        <FlatList
          data={notifications}
          renderItem={renderNotificationItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.notificationsList}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No notifications yet. Check back later!</Text>
            </View>
          }
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
  markAllButton: {
    color: '#4285F4',
    fontSize: 14,
    fontWeight: '500',
  },
  notificationsList: {
    padding: 12,
  },
  notificationCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
    overflow: 'hidden',
  },
  unreadCard: {
    backgroundColor: '#f0f7ff',
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  notificationTime: {
    fontSize: 12,
    color: '#888',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4285F4',
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#444',
  },
  notificationType: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  infoType: {
    backgroundColor: '#4285F4',
  },
  alertType: {
    backgroundColor: '#FBBC05',
  },
  importantType: {
    backgroundColor: '#EA4335',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
});