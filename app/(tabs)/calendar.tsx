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
  Modal,
} from 'react-native';
import { ChevronLeft, ChevronRight, Clock, Trash2, Plus, CircleCheck as CheckCircle2, Circle, ChevronDown } from 'lucide-react-native';
import { router } from 'expo-router';

interface Task {
  id: string;
  title: string;
  dueDate: string;
  category: 'Meetings' | 'Design' | 'Calls' | 'Development' | 'Review';
  completed: boolean;
  time: string;
}

interface DateItem {
  date: number;
  day: string;
  fullDate: string;
  isToday: boolean;
}

export default function CalendarView() {
  const [selectedDate, setSelectedDate] = useState(13);
  const [currentMonth, setCurrentMonth] = useState(5); // 0-based index (5 = June)
  const [currentYear, setCurrentYear] = useState(2022);
  const [showMonthYearPicker, setShowMonthYearPicker] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'NFT Dashboard Design',
      dueDate: '13th June',
      category: 'Design',
      completed: false,
      time: '2:30 PM'
    },
    {
      id: '2',
      title: 'Client Meeting',
      dueDate: '13th June',
      category: 'Meetings',
      completed: true,
      time: '10:00 AM'
    },
    {
      id: '3',
      title: 'Landing Page Review',
      dueDate: '13th June',
      category: 'Review',
      completed: false,
      time: '4:00 PM'
    },
    {
      id: '4',
      title: 'Mobile App Development',
      dueDate: '14th June',
      category: 'Development',
      completed: false,
      time: '9:00 AM'
    },
    {
      id: '5',
      title: 'Team Standup Call',
      dueDate: '14th June',
      category: 'Calls',
      completed: false,
      time: '11:30 AM'
    },
    {
      id: '6',
      title: 'UI Design Workshop',
      dueDate: '15th June',
      category: 'Design',
      completed: false,
      time: '3:00 PM'
    },
  ]);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const years = Array.from({ length: 10 }, (_, i) => 2020 + i);

  const calendarDates: DateItem[] = [
    { date: 11, day: 'Mon', fullDate: '11th June', isToday: false },
    { date: 12, day: 'Tue', fullDate: '12th June', isToday: false },
    { date: 13, day: 'Wed', fullDate: '13th June', isToday: true },
    { date: 14, day: 'Thu', fullDate: '14th June', isToday: false },
    { date: 15, day: 'Fri', fullDate: '15th June', isToday: false },
    { date: 16, day: 'Sat', fullDate: '16th June', isToday: false },
    { date: 17, day: 'Sun', fullDate: '17th June', isToday: false },
  ];

  const getCategoryColor = (category: string) => {
    const colors = {
      'Meetings': '#3B82F6',
      'Design': '#8B5CF6',
      'Calls': '#F59E0B',
      'Development': '#10B981',
      'Review': '#EF4444',
    };
    return colors[category as keyof typeof colors] || '#6B7280';
  };

  const filteredTasks = tasks.filter(task => 
    task.dueDate === calendarDates.find(d => d.date === selectedDate)?.fullDate
  );

  const handleDeleteTask = (taskId: string) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            setTasks(tasks.filter(task => task.id !== taskId));
          }
        }
      ]
    );
  };

  const handleToggleComplete = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleAddTask = () => {
    const selectedDateObj = calendarDates.find(d => d.date === selectedDate);
    // In a real app, you would pass the selected date to the add task screen
    router.push('/add-task');
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  const handleMonthYearSelect = (month: number, year: number) => {
    setCurrentMonth(month);
    setCurrentYear(year);
    setShowMonthYearPicker(false);
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
        
        <TouchableOpacity 
          style={styles.monthContainer}
          onPress={() => setShowMonthYearPicker(true)}
        >
          <Text style={styles.monthText}>{months[currentMonth]} {currentYear}</Text>
          <ChevronDown size={20} color="#374151" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => navigateMonth('next')}
        >
          <ChevronRight size={24} color="#374151" />
        </TouchableOpacity>
      </View>

      {/* Month/Year Picker Modal */}
      <Modal
        visible={showMonthYearPicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowMonthYearPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.pickerContainer}>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerTitle}>Select Month & Year</Text>
              <TouchableOpacity onPress={() => setShowMonthYearPicker(false)}>
                <Text style={styles.cancelButton}>Cancel</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.pickerContent}>
              {/* Month Selection */}
              <View style={styles.pickerSection}>
                <Text style={styles.sectionTitle}>Month</Text>
                <ScrollView style={styles.optionsList} showsVerticalScrollIndicator={false}>
                  {months.map((month, index) => (
                    <TouchableOpacity
                      key={month}
                      style={[
                        styles.optionItem,
                        currentMonth === index && styles.selectedOption
                      ]}
                      onPress={() => handleMonthYearSelect(index, currentYear)}
                    >
                      <Text style={[
                        styles.optionText,
                        currentMonth === index && styles.selectedOptionText
                      ]}>
                        {month}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
              
              {/* Year Selection */}
              <View style={styles.pickerSection}>
                <Text style={styles.sectionTitle}>Year</Text>
                <ScrollView style={styles.optionsList} showsVerticalScrollIndicator={false}>
                  {years.map((year) => (
                    <TouchableOpacity
                      key={year}
                      style={[
                        styles.optionItem,
                        currentYear === year && styles.selectedOption
                      ]}
                      onPress={() => handleMonthYearSelect(currentMonth, year)}
                    >
                      <Text style={[
                        styles.optionText,
                        currentYear === year && styles.selectedOptionText
                      ]}>
                        {year}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Calendar Date Strip */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.calendarStrip}
        contentContainerStyle={styles.calendarContent}
      >
        {calendarDates.map((item) => (
          <TouchableOpacity
            key={item.date}
            style={[
              styles.dateItem,
              selectedDate === item.date && styles.selectedDateItem,
              item.isToday && !selectedDate && styles.todayDateItem
            ]}
            onPress={() => setSelectedDate(item.date)}
          >
            <Text style={[
              styles.dayText,
              selectedDate === item.date && styles.selectedDayText,
              item.isToday && styles.todayDayText
            ]}>
              {item.day}
            </Text>
            <Text style={[
              styles.dateNumber,
              selectedDate === item.date && styles.selectedDateNumber,
              item.isToday && styles.todayDateNumber
            ]}>
              {item.date}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Tasks Section */}
      <View style={styles.tasksHeader}>
        <Text style={styles.tasksTitle}>
          Tasks for {calendarDates.find(d => d.date === selectedDate)?.fullDate}
        </Text>
        <Text style={styles.taskCount}>
          {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {/* Task List */}
      <ScrollView 
        style={styles.taskList} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.taskListContent}
      >
        {filteredTasks.length === 0 ? (
          <View style={styles.emptyState}>
            <Clock size={48} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>No tasks for this date</Text>
            <Text style={styles.emptySubtitle}>
              Tap the + button to add a new task
            </Text>
          </View>
        ) : (
          filteredTasks.map((task) => (
            <View key={task.id} style={styles.taskCard}>
              <TouchableOpacity
                style={styles.completeButton}
                onPress={() => handleToggleComplete(task.id)}
              >
                {task.completed ? (
                  <CheckCircle2 size={24} color="#22C55E" />
                ) : (
                  <Circle size={24} color="#D1D5DB" />
                )}
              </TouchableOpacity>
              
              <View style={styles.taskContent}>
                <Text style={[
                  styles.taskTitle,
                  task.completed && styles.completedTaskTitle
                ]}>
                  {task.title}
                </Text>
                
                <View style={styles.taskMeta}>
                  <View style={[
                    styles.categoryBadge,
                    { backgroundColor: getCategoryColor(task.category) + '20' }
                  ]}>
                    <Text style={[
                      styles.categoryText,
                      { color: getCategoryColor(task.category) }
                    ]}>
                      {task.category}
                    </Text>
                  </View>
                  
                  <Text style={styles.taskTime}>{task.time}</Text>
                </View>
              </View>
              
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteTask(task.id)}
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
  monthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    gap: 8,
  },
  monthText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '90%',
    maxHeight: '70%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  cancelButton: {
    fontSize: 16,
    color: '#22C55E',
    fontWeight: '600',
  },
  pickerContent: {
    flexDirection: 'row',
    flex: 1,
  },
  pickerSection: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  optionsList: {
    maxHeight: 300,
  },
  optionItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 4,
  },
  selectedOption: {
    backgroundColor: '#22C55E',
  },
  optionText: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
  },
  selectedOptionText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  calendarStrip: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  calendarContent: {
    gap: 12,
  },
  dateItem: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    minWidth: 60,
  },
  selectedDateItem: {
    backgroundColor: '#22C55E',
  },
  todayDateItem: {
    borderWidth: 2,
    borderColor: '#22C55E',
  },
  dayText: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
    fontWeight: '500',
  },
  selectedDayText: {
    color: '#FFFFFF',
  },
  todayDayText: {
    color: '#22C55E',
    fontWeight: '600',
  },
  dateNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  selectedDateNumber: {
    color: '#FFFFFF',
  },
  todayDateNumber: {
    color: '#22C55E',
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
  completeButton: {
    marginRight: 12,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  completedTaskTitle: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
  },
  taskTime: {
    fontSize: 14,
    color: '#6B7280',
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