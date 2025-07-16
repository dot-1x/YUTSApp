import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Plus, Clock, CircleCheck as CheckCircle2, Circle, Trash2 } from 'lucide-react-native';
import { router } from 'expo-router';
import { useTasks } from '@/hooks/useDatabase';

export default function Dashboard() {
  const { tasks, loading, toggleTaskCompletion, deleteTask } = useTasks();

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

  const handleAddTask = () => {
    router.push('/add-task');
  };

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

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
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

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Task List */}
        <View style={styles.taskSection}>
          {tasks.length === 0 ? (
            <View style={styles.emptyState}>
              <Clock size={48} color="#D1D5DB" />
              <Text style={styles.emptyTitle}>No tasks scheduled</Text>
              <Text style={styles.emptySubtitle}>
                Tap "Add Task" to create your first task
              </Text>
            </View>
          ) : (
            tasks.map((task) => (
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  taskSection: {
    marginBottom: 100,
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