import * as SQLite from 'expo-sqlite';

export interface Task {
  id?: number;
  title: string;
  description: string;
  task_date: string; // YYYY-MM-DD format
  task_time: string; // HH:MM format (24-hour)
  is_completed: boolean;
}

class DatabaseManager {
  private db: SQLite.SQLiteDatabase | null = null;

  async init() {
    try {
      this.db = await SQLite.openDatabaseAsync('tasks.db');
      await this.createTables();
    } catch (error) {
      console.error('Database initialization error:', error);
      throw error;
    }
  }

  private async createTables() {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        task_date TEXT NOT NULL,
        task_time TEXT NOT NULL,
        is_completed INTEGER DEFAULT 0
      );
    `);
  }

  async addTask(task: Omit<Task, 'id'>): Promise<number> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.runAsync(
      'INSERT INTO tasks (title, description, task_date, task_time, is_completed) VALUES (?, ?, ?, ?, ?)',
      [task.title, task.description, task.task_date, task.task_time, task.is_completed ? 1 : 0]
    );

    return result.lastInsertRowId;
  }

  async getAllTasks(): Promise<Task[]> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.getAllAsync('SELECT * FROM tasks ORDER BY task_date, task_time');
    
    return result.map((row: any) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      task_date: row.task_date,
      task_time: row.task_time,
      is_completed: row.is_completed === 1
    }));
  }

  async getTasksByDate(date: string): Promise<Task[]> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.getAllAsync(
      'SELECT * FROM tasks WHERE task_date = ? ORDER BY task_time',
      [date]
    );

    return result.map((row: any) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      task_date: row.task_date,
      task_time: row.task_time,
      is_completed: row.is_completed === 1
    }));
  }

  async getTaskDates(): Promise<string[]> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.getAllAsync(
      'SELECT DISTINCT task_date FROM tasks ORDER BY task_date'
    );

    return result.map((row: any) => row.task_date);
  }

  async updateTask(id: number, task: Partial<Task>): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const fields = [];
    const values = [];

    if (task.title !== undefined) {
      fields.push('title = ?');
      values.push(task.title);
    }
    if (task.description !== undefined) {
      fields.push('description = ?');
      values.push(task.description);
    }
    if (task.task_date !== undefined) {
      fields.push('task_date = ?');
      values.push(task.task_date);
    }
    if (task.task_time !== undefined) {
      fields.push('task_time = ?');
      values.push(task.task_time);
    }
    if (task.is_completed !== undefined) {
      fields.push('is_completed = ?');
      values.push(task.is_completed ? 1 : 0);
    }

    if (fields.length === 0) return;

    values.push(id);
    await this.db.runAsync(
      `UPDATE tasks SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
  }

  async deleteTask(id: number): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.runAsync('DELETE FROM tasks WHERE id = ?', [id]);
  }

  async toggleTaskCompletion(id: number): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.runAsync(
      'UPDATE tasks SET is_completed = NOT is_completed WHERE id = ?',
      [id]
    );
  }
}

export const database = new DatabaseManager();