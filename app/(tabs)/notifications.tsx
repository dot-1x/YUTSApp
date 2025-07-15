import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Bell, CircleCheck as CheckCircle2, Calendar, Clock, TriangleAlert as AlertTriangle, Trash2, MoveHorizontal as MoreHorizontal } from 'lucide-react-native';

interface Notification {
  id: string;
  type: 'reminder' | 'deadline' | 'update' | 'completion';
  title: string;
  description: string;
  timestamp: string;
  timeAgo: string;
  isNew: boolean;
  taskId?: string;
}

export default function NotificationsScreen() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'reminders' | 'deadlines' | 'updates'>('all');
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'reminder',
      title: 'Upcoming Task: UI Design Meeting',
      description: 'Today at 2:30 PM',
      timestamp: '2024-01-15T14:30:00',
      timeAgo: '2 hours ago',
      isNew: true,
      taskId: 'task1'
    },
    {
      id: '2',
      type: 'deadline',
      title: 'NFT Dashboard Due Tomorrow',
      description: 'Complete by June 14th, 2022',
      timestamp: '2024-01-15T09:00:00',
      timeAgo: '7 hours ago',
      isNew: true,
      taskId: 'task2'
    },
    {
      id: '3',
      type: 'completion',
      title: 'Task Completed: Landing Page',
      description: 'Great job! Task marked as complete',
      timestamp: '2024-01-14T16:45:00',
      timeAgo: 'Yesterday',
      isNew: false,
      taskId: 'task3'
    },
    {
      id: '4',
      type: 'update',
      title: 'Task Updated: Mobile Programming',
      description: 'Due date changed to March 17, 2025',
      timestamp: '2024-01-14T11:20:00',
      timeAgo: 'Yesterday',
      isNew: false,
      taskId: 'task4'
    },
    {
      id: '5',
      type: 'reminder',
      title: 'Daily Standup Call',
      description: 'Tomorrow at 9:00 AM',
      timestamp: '2024-01-13T18:00:00',
      timeAgo: '2 days ago',
      isNew: false,
      taskId: 'task5'
    },
    {
      id: '6',
      type: 'deadline',
      title: 'Icon Modification Project',
      description: 'Due in 3 days - March 17, 2025',
      timestamp: '2024-01-13T10:15:00',
      timeAgo: '2 days ago',
      isNew: false,
      taskId: 'task6'
    },
  ]);

  const filterTabs = [
    { key: 'all', label: 'All' },
    { key: 'reminders', label: 'Reminders' },
    { key: 'deadlines', label: 'Deadlines' },
    { key: 'updates', label: 'Updates' },
  ];

  const getNotificationIcon = (type: string) => {
    const iconProps = { size: 20, color: '#FFFFFF' };
    
    switch (type) {
      case 'reminder':
        return <Bell {...iconProps} />;
      case 'deadline':
        return <AlertTriangle {...iconProps} />;
      case 'completion':
        return <CheckCircle2 {...iconProps} />;
      case 'update':
        return <Calendar {...iconProps} />;
      default:
        return <Bell {...iconProps} />;
    }
  };

  const getIconBackgroundColor = (type: string) => {
    switch (type) {
      case 'reminder':
        return '#3B82F6';
      case 'deadline':
        return '#EF4444';
      case 'completion':
        return '#22C55E';
      case 'update':
        return '#8B5CF6';
      default:
        return '#6B7280';
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'reminders') return notification.type === 'reminder';
    if (activeFilter === 'deadlines') return notification.type === 'deadline';
    if (activeFilter === 'updates') return notification.type === 'update' || notification.type === 'completion';
    return true;
  });

  const groupNotificationsByDate = (notifications: Notification[]) => {
    const groups: { [key: string]: Notification[] } = {};
    
    notifications.forEach(notification => {
      const date = new Date(notification.timestamp);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      let groupKey = '';
      if (date.toDateString() === today.toDateString()) {
        groupKey = 'Today';
      } else if (date.toDateString() === yesterday.toDateString()) {
        groupKey = 'Yesterday';
      } else {
        groupKey = 'Earlier';
      }
      
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(notification);
    });
    
    return groups;
  };

  const handleNotificationPress = (notification: Notification) => {
    // In a real app, this would navigate to the specific task
    Alert.alert('Navigate to Task', `Opening task: ${notification.title}`);
  };

  const handleDeleteNotification = (notificationId: string) => {
    Alert.alert(
      'Delete Notification',
      'Are you sure you want to delete this notification?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setNotifications(notifications.filter(n => n.id !== notificationId));
          }
        }
      ]
    );
  };

  const handleClearAll = () => {
    Alert.alert(
      'Clear All Notifications',
      'Are you sure you want to clear all notifications?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => setNotifications([])
        }
      ]
    );
  };

  const groupedNotifications = groupNotificationsByDate(filteredNotifications);
  const newNotificationsCount = notifications.filter(n => n.isNew).length;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
        {notifications.length > 0 && (
          <TouchableOpacity onPress={handleClearAll}>
            <Text style={styles.clearAllText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* New Notifications Badge */}
      {newNotificationsCount > 0 && (
        <View style={styles.newBadgeContainer}>
          <View style={styles.newBadge}>
            <Text style={styles.newBadgeText}>
              {newNotificationsCount} new notification{newNotificationsCount !== 1 ? 's' : ''}
            </Text>
          </View>
        </View>
      )}

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContent}
        >
          {filterTabs.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.filterTab,
                activeFilter === tab.key && styles.activeFilterTab
              ]}
              onPress={() => setActiveFilter(tab.key as any)}
            >
              <Text style={[
                styles.filterTabText,
                activeFilter === tab.key && styles.activeFilterTabText
              ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Notifications List */}
      <ScrollView 
        style={styles.notificationsList} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.notificationsContent}
      >
        {filteredNotifications.length === 0 ? (
          <View style={styles.emptyState}>
            <Bell size={48} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>No notifications</Text>
            <Text style={styles.emptySubtitle}>
              You're all caught up! New notifications will appear here.
            </Text>
          </View>
        ) : (
          Object.entries(groupedNotifications).map(([dateGroup, groupNotifications]) => (
            <View key={dateGroup} style={styles.dateGroup}>
              <Text style={styles.dateGroupTitle}>{dateGroup}</Text>
              
              {groupNotifications.map((notification) => (
                <TouchableOpacity
                  key={notification.id}
                  style={[
                    styles.notificationCard,
                    notification.isNew && styles.newNotificationCard
                  ]}
                  onPress={() => handleNotificationPress(notification)}
                >
                  {notification.isNew && <View style={styles.newIndicator} />}
                  
                  <View style={[
                    styles.notificationIcon,
                    { backgroundColor: getIconBackgroundColor(notification.type) }
                  ]}>
                    {getNotificationIcon(notification.type)}
                  </View>
                  
                  <View style={styles.notificationContent}>
                    <Text style={styles.notificationTitle}>
                      {notification.title}
                    </Text>
                    <Text style={styles.notificationDescription}>
                      {notification.description}
                    </Text>
                    <Text style={styles.notificationTime}>
                      {notification.timeAgo}
                    </Text>
                  </View>
                  
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteNotification(notification.id)}
                  >
                    <Trash2 size={18} color="#9CA3AF" />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  clearAllText: {
    fontSize: 16,
    color: '#22C55E',
    fontWeight: '600',
  },
  newBadgeContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  newBadge: {
    backgroundColor: '#22C55E',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  newBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  filterContainer: {
    paddingBottom: 20,
  },
  filterContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  activeFilterTab: {
    backgroundColor: '#22C55E',
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  activeFilterTabText: {
    color: '#FFFFFF',
  },
  notificationsList: {
    flex: 1,
  },
  notificationsContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 24,
  },
  dateGroup: {
    marginBottom: 24,
  },
  dateGroupTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
    paddingLeft: 4,
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    position: 'relative',
  },
  newNotificationCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#22C55E',
  },
  newIndicator: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22C55E',
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
    paddingRight: 8,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
    lineHeight: 20,
  },
  notificationDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 6,
    lineHeight: 18,
  },
  notificationTime: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  deleteButton: {
    padding: 4,
    marginTop: 4,
  },
});