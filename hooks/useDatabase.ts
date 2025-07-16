import { useEffect, useState } from 'react';
import { database, Task } from '../database/database';

export function useDatabase() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initDatabase = async () => {
      try {
        await database.init();
        setIsReady(true);
      } catch (error) {
        console.error('Failed to initialize database:', error);
      }
    };

    initDatabase();
  }, []);

  return { isReady };
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const allTasks = await database.getAllTasks();
      setTasks(allTasks);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (task: Omit<Task, 'id'>) => {
    try {
      await database.addTask(task);
      await loadTasks();
    } catch (error) {
      console.error('Failed to add task:', error);
      throw error;
    }
  };

  const updateTask = async (id: number, task: Partial<Task>) => {
    try {
      await database.updateTask(id, task);
      await loadTasks();
    } catch (error) {
      console.error('Failed to update task:', error);
      throw error;
    }
  };

  const deleteTask = async (id: number) => {
    try {
      await database.deleteTask(id);
      await loadTasks();
    } catch (error) {
      console.error('Failed to delete task:', error);
      throw error;
    }
  };

  const toggleTaskCompletion = async (id: number) => {
    try {
      await database.toggleTaskCompletion(id);
      await loadTasks();
    } catch (error) {
      console.error('Failed to toggle task completion:', error);
      throw error;
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  return {
    tasks,
    loading,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
    refreshTasks: loadTasks
  };
}

export function useTasksByDate(date: string) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTasksByDate = async () => {
    try {
      setLoading(true);
      const dateTasks = await database.getTasksByDate(date);
      setTasks(dateTasks);
    } catch (error) {
      console.error('Failed to load tasks by date:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasksByDate();
  }, [date]);

  return { tasks, loading, refreshTasks: loadTasksByDate };
}

export function useTaskDates() {
  const [dates, setDates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTaskDates = async () => {
    try {
      setLoading(true);
      const taskDates = await database.getTaskDates();
      setDates(taskDates);
    } catch (error) {
      console.error('Failed to load task dates:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTaskDates();
  }, []);

  return { dates, loading, refreshDates: loadTaskDates };
}

export function useTaskNotifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { tasks } = useTasks();

  const generateNotifications = () => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    const notificationList: any[] = [];

    tasks.forEach(task => {
      const taskDateTime = new Date(`${task.task_date}T${task.task_time}:00`);
      const timeDiff = taskDateTime.getTime() - now.getTime();
      const hoursDiff = timeDiff / (1000 * 60 * 60);

      // Create notifications for upcoming tasks
      if (task.task_date === today && hoursDiff > 0 && hoursDiff <= 24) {
        notificationList.push({
          id: `reminder-${task.id}`,
          type: 'reminder',
          title: `Upcoming Task: ${task.title}`,
          description: `Today at ${task.task_time}`,
          timestamp: new Date(taskDateTime.getTime() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours before
          timeAgo: hoursDiff < 2 ? `${Math.floor(hoursDiff * 60)} minutes ago` : `${Math.floor(hoursDiff)} hours ago`,
          isNew: hoursDiff <= 2,
          taskId: task.id?.toString()
        });
      }

      // Create notifications for tomorrow's tasks
      if (task.task_date === tomorrowStr) {
        notificationList.push({
          id: `tomorrow-${task.id}`,
          type: 'deadline',
          title: `${task.title} Due Tomorrow`,
          description: `Tomorrow at ${task.task_time}`,
          timestamp: new Date(now.getTime() - 7 * 60 * 60 * 1000).toISOString(), // 7 hours ago
          timeAgo: '7 hours ago',
          isNew: true,
          taskId: task.id?.toString()
        });
      }

      // Create notifications for completed tasks
      if (task.is_completed) {
        notificationList.push({
          id: `completed-${task.id}`,
          type: 'completion',
          title: `Task Completed: ${task.title}`,
          description: 'Great job! Task marked as complete',
          timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
          timeAgo: 'Yesterday',
          isNew: false,
          taskId: task.id?.toString()
        });
      }
    });

    // Sort by timestamp (newest first)
    notificationList.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    setNotifications(notificationList);
    setLoading(false);
  };

  useEffect(() => {
    generateNotifications();
  }, [tasks]);

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return {
    notifications,
    loading,
    deleteNotification,
    clearAllNotifications
  };
}