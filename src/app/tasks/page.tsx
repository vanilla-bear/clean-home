'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import AddTaskForm from '../components/AddTaskForm';
import TaskList from '../components/TaskList';
import TaskFilters from '../components/TaskFilters';
import Navigation from '../components/Navigation';
import { createTask, getUserTasks, completeTask, deleteTask, updateTask } from '@/lib/tasks';
import type { Room } from '@/lib/tasks';

interface Task {
  id: string;
  title: string;
  description: string;
  room: Room;
  frequency_type: string;
  frequency_value: number;
  created_at: string;
  last_executed_at: string | null;
  next_execution: string;
  completed: boolean;
  execution_history: string;
}

interface Filters {
  search: string;
  room: Room | 'all';
  sortBy: 'name' | 'next_execution';
}

export default function TasksPage() {
  const { data: session, status } = useSession();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({
    search: '',
    room: 'all',
    sortBy: 'next_execution'
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      redirect('/login');
    }

    if (session?.user?.email) {
      loadTasks();
    } else if (status !== 'loading') {
      setIsLoading(false);
    }
  }, [session?.user?.email, status]);

  const loadTasks = async () => {
    try {
      const loadedTasks = await getUserTasks(session!.user!.email!);
      setTasks(loadedTasks);
    } catch (error) {
      console.error('Erreur lors du chargement des tâches:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Extraire la liste unique des pièces à partir des tâches
  const availableRooms = useMemo(() => {
    const rooms = new Set(tasks.map(task => task.room));
    return Array.from(rooms);
  }, [tasks]);

  // Filtrer et trier les tâches
  const filteredAndSortedTasks = useMemo(() => {
    return tasks
      .filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                            task.description.toLowerCase().includes(filters.search.toLowerCase());
        const matchesRoom = filters.room === 'all' || task.room === filters.room;
        return matchesSearch && matchesRoom;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'name') {
          return a.title.localeCompare(b.title);
        } else {
          return new Date(a.next_execution).getTime() - new Date(b.next_execution).getTime();
        }
      });
  }, [tasks, filters]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    redirect('/login');
  }

  const handleAddTask = async (taskData: {
    title: string;
    description: string;
    room: Room;
    frequency: {
      type: 'daily' | 'weekly' | 'monthly';
      value: number;
    };
  }) => {
    try {
      await createTask({
        ...taskData,
        user_id: session.user?.email || '',
      });
      await loadTasks();
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la tâche:', error);
    }
  };

  const handleCompleteTask = async (taskId: string, duration?: number) => {
    try {
      await completeTask(taskId, duration);
      await loadTasks();
    } catch (error) {
      console.error('Erreur lors de la complétion de la tâche:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      await loadTasks();
    } catch (error) {
      console.error('Erreur lors de la suppression de la tâche:', error);
    }
  };

  const handleUpdateTask = async (taskId: string, data: {
    title: string;
    description: string;
    room: Room;
    frequency: {
      type: 'daily' | 'weekly' | 'monthly';
      value: number;
    };
  }) => {
    try {
      await updateTask(taskId, data);
      await loadTasks();
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la tâche:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Chargement des tâches...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <TaskFilters
                rooms={availableRooms}
                onFilterChange={setFilters}
              />
              
              <div className="grid grid-cols-1 gap-6 md:grid-cols-[350px_1fr]">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Ajouter une tâche</h2>
                  <AddTaskForm onAdd={handleAddTask} />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Tâches {filters.room !== 'all' ? `- ${filters.room}` : ''}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {filteredAndSortedTasks.length} tâche{filteredAndSortedTasks.length > 1 ? 's' : ''}
                    </p>
                  </div>
                  <TaskList
                    tasks={filteredAndSortedTasks}
                    onComplete={handleCompleteTask}
                    onDelete={handleDeleteTask}
                    onUpdate={handleUpdateTask}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 