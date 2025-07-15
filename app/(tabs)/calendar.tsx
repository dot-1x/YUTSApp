import React, { useState, useEffect } from 'react';
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
import { ChevronLeft, ChevronRight, Clock, Trash2, Plus, CircleCheck as CheckCircle2, Circle } from 'lucide-react-native';
import { router } from 'expo-router';
import { useTasks, useTasksByDate } from '@/hooks/useDatabase';

interface CalendarDay {
  date: number;
  isCurrentMonth: boolean;
  fullDate: string;
  hasTask: boolean;
  isToday: boolean;
}

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const { tasks, toggleTaskCompletion, deleteTask } = useTasks();
  const { tasks: selectedDateTasks, refreshTasks } = useTasksByDate(selectedDate);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const generateCalendarDays = (): CalendarDay[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days: CalendarDay[] = [];
    const today = new Date().toISOString().split('T')[0];
    
    // Get all task dates for marking
    const taskDates = new Set(tasks.map(task => task.task_date));
    
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const dateString = date.toISOString().split('T')[0];
      const isCurrentMonth = date.getMonth() === month;
      
      days.push({
        date: date.getDate(),
        isCurrentMonth,
        fullDate: dateString,
        hasTask: taskDates.has(dateString),
        isToday: dateString === today,
      });
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const handleDateSelect = (day: CalendarDay) => {
    if (day.isCurrentMonth) {
      setSelectedDate(day.fullDate);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTask(taskId);
              refreshTasks();
            } catch (error) {
              console.error('Failed to delete task:', error);
            }
          }
        }
      ]
    );
  };

  const handleToggleComplete = async (taskId: number) => {
    try {
      await toggleTaskCompletion(taskId);
      refreshTasks();
    } catch (error) {
      console.error('Failed to toggle task completion:', error);
    }
  };

  const handleAddTask = () => {
    router.push('/add-task');
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
  };

  const formatSelectedDate = () => {
    const date = new Date(selectedDate);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
      
      {/* Header with Month Navigation */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => navigateMonth('prev')}
        >
          <ChevronLeft size={24} color="#374151" />
        </TouchableOpacity>
        
        <Text style={styles.monthText}>
          {months[currentDate.getMonth()]} {currentDate.getFullYear()}
        </Text>
        
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => navigateMonth('next')}
        >
          <ChevronRight size={24} color="#374151" />
        </TouchableOpacity>
      </View>

      {/* Calendar Grid */}
      <View style={styles.calendarContainer}>
        {/* Day Headers */}
        <View style={styles.dayHeaders}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <Text key={day} style={styles.dayHeader}>{day}</Text>
          ))}
        </View>

        {/* Calendar Days */}
        <View style={styles.calendarGrid}>
          {calendarDays.map((day, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.calendarDay,
                !day.isCurrentMonth && styles.inactiveDay,
                day.fullDate === selectedDate && styles.selectedDay,
                day.isToday && styles.todayDay,
              ]}
              onPress={() => handleDateSelect(day)}
              disabled={!day.isCurrentMonth}
            >
              <Text style={[
                styles.calendarDayText,
                !day.isCurrentMonth && styles.inactiveDayText,
                day.fullDate === selectedDate && styles.selectedDayText,
                day.isToday && styles.todayDayText,
              ]}>
                {day.date}
              </Text>
              {day.hasTask && day.isCurrentMonth && (
                <View style={[
                  styles.taskIndicator,
                  day.fullDate === selectedDate && styles.selectedTaskIndicator
                ]} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Tasks Section */}
      <View style={styles.tasksHeader}>
        <Text style={styles.tasksTitle}>
          Tasks for {formatSelectedDate()}
        </Text>
        <Text style={styles.taskCount}>
          {selectedDateTasks.length} task{selectedDateTasks.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {/* Task List */}
      <ScrollView 
        style={styles.taskList} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.taskListContent}
      >
        {selectedDateTasks.length === 0 ? (
          <View style={styles.emptyState}>
            <Clock size={48} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>No tasks for this date</Text>
            <Text style={styles.emptySubtitle}>
              Tap the + button to add a new task
            </Text>
          </View>
        ) : (
          selectedDateTasks.map((task) => (
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
                  {task.description}
                </Text>
                
                <Text style={styles.taskTime}>{formatTime(task.task_time)}</Text>
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
      </ScrollView>

      {/* Floating Add Button */}
      <TouchableOpacity style={styles.floatingButton} onPress={handleAddTask}>
        <Plus size={24} color="#FFFFFF" />
      </TouchableOpacity>
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
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  monthText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  calendarContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  dayHeaders: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  dayHeader: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarDay: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 8,
  },
  selectedDay: {
    backgroundColor: '#22C55E',
    borderRadius: 8,
  },
  todayDay: {
    borderWidth: 2,
    borderColor: '#22C55E',
    borderRadius: 8,
  },
  inactiveDay: {
    opacity: 0.3,
  },
  calendarDayText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  selectedDayText: {
    color: '#FFFFFF',
  },
  todayDayText: {
    color: '#22C55E',
  },
  inactiveDayText: {
    color: '#9CA3AF',
  },
  taskIndicator: {
    position: 'absolute',
    bottom: 2,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#22C55E',
  },
  selectedTaskIndicator: {
    backgroundColor: '#FFFFFF',
  },
  tasksHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  tasksTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  taskCount: {
    fontSize: 14,
    color: '#6B7280',
  },
  taskList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  taskListContent: {
    paddingBottom: 100,
  },
  emptyState: {
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
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  completedTaskTitle: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
  },
  taskDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
    lineHeight: 20,
  },
  taskTime: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  deleteButton: {
    padding: 8,
    marginLeft: 8,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 90,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#22C55E',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#22C55E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});