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