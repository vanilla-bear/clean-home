'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import AddTaskForm from './components/AddTaskForm';
import TaskList from './components/TaskList';
import LogoutButton from './components/LogoutButton';
import { createTask, getUserTasks, completeTask, deleteTask } from '@/lib/tasks';
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

export default function Home() {
  const { data: session, status } = useSession();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  // Afficher un message de chargement uniquement si nous sommes en train de charger la session
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

  // Si nous n'avons pas de session et que nous ne sommes pas en train de charger
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
      await loadTasks(); // Recharger les tâches après l'ajout
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la tâche:', error);
    }
  };

  const handleCompleteTask = async (taskId: string, duration?: number) => {
    try {
      await completeTask(taskId, duration);
      await loadTasks(); // Recharger les tâches après la mise à jour
    } catch (error) {
      console.error('Erreur lors de la complétion de la tâche:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      await loadTasks(); // Recharger les tâches après la suppression
    } catch (error) {
      console.error('Erreur lors de la suppression de la tâche:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Clean Home</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">{session.user?.email}</span>
            <LogoutButton />
          </div>
        </div>
      </header>

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
            <div className="grid grid-cols-1 gap-6 md:grid-cols-[350px_1fr]">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Ajouter une tâche</h2>
                <AddTaskForm onAdd={handleAddTask} />
              </div>
              
              <div>
                <TaskList
                  tasks={tasks}
                  onComplete={handleCompleteTask}
                  onDelete={handleDeleteTask}
                />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
