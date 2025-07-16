import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Search, Clock, CircleCheck as CheckCircle2, Circle, Trash2 } from 'lucide-react-native';
import { useTasks } from '@/hooks/useDatabase';

export default function SearchTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const { tasks, toggleTaskCompletion, deleteTask } = useTasks();

  const filteredTasks = useMemo(() => {
    if (!searchQuery.trim()) {
      return [];
    }
    
    return tasks.filter(task =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [tasks, searchQuery]);

  const recentSearches = [
    'Mobile Programming',
    'UI Design',
    'Landing Page',
    'NFT Dashboard',
  ];

  const handleToggleComplete = async (taskId: number) => {
    try {
      await toggleTaskCompletion(taskId);
    } catch (error) {
      console.error('Failed to toggle task completion:', error);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      await deleteTask(taskId);
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const formatDateTime = (dateString: string, timeString: string) => {
    const date = new Date(dateString);
    const [hours, minutes] = timeString.split(':');
    
    const dateOptions: Intl.DateTimeFormatOptions = { 
      year: 'numeric',
      month: 'long', 
      day: 'numeric' 
    };
    
    const formattedDate = date.toLocaleDateString('en-US', dateOptions);
    const formattedTime = `${hours}:${minutes}`;
    
    return `${formattedDate} - ${formattedTime}`;
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Search Tasks</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search tasks by title..."
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Show recent searches when no query */}
        {!searchQuery.trim() && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Searches</Text>
            <View style={styles.tagsContainer}>
              {recentSearches.map((search, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.tag}
                  onPress={() => setSearchQuery(search)}
                >
                  <Text style={styles.tagText}>{search}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Show search results */}
        {searchQuery.trim() && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Search Results ({filteredTasks.length})
            </Text>
            
            {filteredTasks.length === 0 ? (
              <View style={styles.emptyResults}>
                <Search size={48} color="#D1D5DB" />
                <Text style={styles.emptyTitle}>No tasks found</Text>
                <Text style={styles.emptySubtitle}>
                  Try searching with different keywords
                </Text>
              </View>
            ) : (
              filteredTasks.map((task) => (
                <View key={task.id} style={styles.taskCard}>
                  <TouchableOpacity
                    style={styles.completeButton}
                    onPress={() => task.id && handleToggleComplete(task.id)}
                  >
                    {task.is_completed ? (
                      <CheckCircle2 size={24} color="#22C55E" />
                    ) : (
                      <Circle size={24} color="#D1D5DB" />
                    )}
                  </TouchableOpacity>
                  
                  <View style={styles.taskContent}>
                    <Text style={[
                      styles.taskTitle,
                      task.is_completed && styles.completedTaskTitle
                    ]}>
                      {task.title}
                    </Text>
                    
                    <Text style={styles.taskDescription}>
                      {truncateText(task.description, 100)}
                    </Text>
                    
                    <Text style={styles.taskDateTime}>
                      {formatDateTime(task.task_date, task.task_time)}
                    </Text>
                  </View>
                  
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => task.id && handleDeleteTask(task.id)}
                  >
                    <Trash2 size={20} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#111827',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 14,
    color: '#374151',
  },
  emptyResults: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  taskCard: {
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
  },
  completeButton: {
    marginRight: 12,
    marginTop: 2,
  },
  taskContent: {
    flex: 1,
    paddingRight: 8,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  completedTaskTitle: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
  },
  taskDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 8,
  },
  taskDateTime: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  deleteButton: {
    padding: 4,
    marginTop: 2,
  },
});