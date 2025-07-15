import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Plus, Clock, User } from 'lucide-react-native';
import { router } from 'expo-router';

interface Task {
  id: string;
  title: string;
  dueDate: string;
  category: 'pending' | 'new' | 'completed';
  description?: string;
}

export default function Dashboard() {
  const [selectedDate, setSelectedDate] = useState(13);
  const [activeTab, setActiveTab] = useState<'pending' | 'new' | 'completed'>('pending');

  const calendarDates = [
    { date: 12, day: 'Tue' },
    { date: 13, day: 'Wed' },
    { date: 14, day: 'Thu' },
    { date: 15, day: 'Fri' },
    { date: 16, day: 'Sat' },
  ];

  const tasks: Task[] = [
    {
      id: '1',
      title: 'NFT Dashboard',
      dueDate: '14th June',
      category: 'pending',
      description: 'Design and develop NFT dashboard'
    },
    {
      id: '2',
      title: 'Landing Page',
      dueDate: '15th June',
      category: 'pending',
      description: 'Create responsive landing page'
    },
    {
      id: '3',
      title: 'Onboarding Screen',
      dueDate: '16th June',
      category: 'pending',
      description: 'Design user onboarding flow'
    },
    {
      id: '4',
      title: 'Mobile Programming',
      dueDate: 'March 17 2025',
      category: 'new',
      description: 'Complete mobile app development'
    },
    {
      id: '5',
      title: 'Icon Modification',
      dueDate: 'March 17 2025',
      category: 'new',
      description: 'Update app icons and branding'
    },
    {
      id: '6',
      title: 'UI Design Course',
      dueDate: 'March 17 2025',
      category: 'completed',
      description: 'Finish UI/UX design course'
    },
  ];

  const progressTasks = [
    { id: '1', title: 'Mobile Programming', date: 'March 7' },
    { id: '2', title: 'Icon Modification', date: 'March 17' },
    { id: '3', title: 'UI Design Course', date: 'March 17' },
    { id: '4', title: 'UI Design Course', date: 'March 17' },
  ];

  const filteredTasks = tasks.filter(task => task.category === activeTab);

  const handleAddTask = () => {
    router.push('/add-task');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>TaskSchedule</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
          <Plus size={20} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Add Task</Text>
        </TouchableOpacity>
      </View>

      {/* Calendar Strip */}
      <View style={styles.calendarContainer}>
        {calendarDates.map((item) => (
          <TouchableOpacity
            key={item.date}
            style={[
              styles.dateItem,
              selectedDate === item.date && styles.selectedDateItem
            ]}
            onPress={() => setSelectedDate(item.date)}
          >
            <Text style={[
              styles.dateNumber,
              selectedDate === item.date && styles.selectedDateNumber
            ]}>
              {item.date}
            </Text>
            <Text style={[
              styles.dayText,
              selectedDate === item.date && styles.selectedDayText
            ]}>
              {item.day}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Task Categories */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'pending' && styles.activeTab]}
            onPress={() => setActiveTab('pending')}
          >
            <Text style={[styles.tabText, activeTab === 'pending' && styles.activeTabText]}>
              Pending
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'new' && styles.activeTab]}
            onPress={() => setActiveTab('new')}
          >
            <Text style={[styles.tabText, activeTab === 'new' && styles.activeTabText]}>
              New
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'completed' && styles.activeTab]}
            onPress={() => setActiveTab('completed')}
          >
            <Text style={[styles.tabText, activeTab === 'completed' && styles.activeTabText]}>
              Completed
            </Text>
          </TouchableOpacity>
        </View>

        {/* Task List */}
        {activeTab === 'pending' && (
          <View style={styles.taskSection}>
            <Text style={styles.sectionTitle}>Task</Text>
            {filteredTasks.map((task) => (
              <View key={task.id} style={styles.taskCard}>
                <View style={styles.taskIcon}>
                  <Clock size={20} color="#FFFFFF" />
                </View>
                <View style={styles.taskContent}>
                  <Text style={styles.taskTitle}>{task.title}</Text>
                  <Text style={styles.taskDate}>{task.dueDate}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {activeTab === 'new' && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalTasks}>
            {filteredTasks.map((task) => (
              <View key={task.id} style={styles.projectCard}>
                <View style={styles.projectIcon}>
                  <User size={20} color="#FFFFFF" />
                </View>
                <Text style={styles.projectTitle}>Project {task.id}</Text>
                <Text style={styles.projectDescription}>{task.title}</Text>
                <Text style={styles.projectDate}>{task.dueDate}</Text>
              </View>
            ))}
          </ScrollView>
        )}

        {activeTab === 'completed' && (
          <View style={styles.taskSection}>
            <Text style={styles.sectionTitle}>Completed Tasks</Text>
            {filteredTasks.map((task) => (
              <View key={task.id} style={[styles.taskCard, styles.completedTask]}>
                <View style={[styles.taskIcon, styles.completedIcon]}>
                  <Clock size={20} color="#FFFFFF" />
                </View>
                <View style={styles.taskContent}>
                  <Text style={[styles.taskTitle, styles.completedTitle]}>{task.title}</Text>
                  <Text style={styles.taskDate}>{task.dueDate}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Progress Section */}
        <View style={styles.progressSection}>
          <Text style={styles.sectionTitle}>Progress</Text>
          {progressTasks.map((task) => (
            <View key={task.id} style={styles.progressCard}>
              <View style={styles.progressIcon}>
                <Clock size={20} color="#FFFFFF" />
              </View>
              <View style={styles.progressContent}>
                <Text style={styles.progressTitle}>{task.title}</Text>
                <Text style={styles.progressDate}>{task.date}</Text>
              </View>
            </View>
          ))}
        </View>
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
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#22C55E',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    shadowColor: '#22C55E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  calendarContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
  },
  dateItem: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  selectedDateItem: {
    backgroundColor: '#22C55E',
  },
  dateNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  selectedDateNumber: {
    color: '#FFFFFF',
  },
  dayText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  selectedDayText: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#22C55E',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  taskSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  taskIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#22C55E',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  taskDate: {
    fontSize: 14,
    color: '#6B7280',
  },
  horizontalTasks: {
    marginBottom: 30,
  },
  projectCard: {
    backgroundColor: '#22C55E',
    padding: 20,
    borderRadius: 16,
    marginRight: 16,
    width: 200,
    shadowColor: '#22C55E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  projectIcon: {
    width: 32,
    height: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  projectTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  projectDescription: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 12,
  },
  projectDate: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  completedTask: {
    opacity: 0.7,
  },
  completedIcon: {
    backgroundColor: '#10B981',
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: '#6B7280',
  },
  progressSection: {
    marginBottom: 100,
  },
  progressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  progressIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#22C55E',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  progressContent: {
    flex: 1,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  progressDate: {
    fontSize: 14,
    color: '#6B7280',
  },
});