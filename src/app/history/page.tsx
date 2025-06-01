'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import Navigation from '../components/Navigation';
import { getUserTasks } from '@/lib/tasks';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Execution {
  executed_at: string;
  duration_minutes?: number;
}

interface Task {
  id: string;
  title: string;
  description: string;
  room: string;
  frequency_type: string;
  frequency_value: number;
  created_at: string;
  last_executed_at: string | null;
  execution_history: string;
}

export default function HistoryPage() {
  const { data: session, status } = useSession();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      redirect('/login');
    }

    if (session?.user?.email) {
      loadTasks();
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

  // Récupérer toutes les exécutions de toutes les tâches
  const allExecutions = tasks.flatMap(task => {
    const executions = JSON.parse(task.execution_history) as Execution[];
    return executions.map(execution => ({
      taskId: task.id,
      taskTitle: task.title,
      taskRoom: task.room,
      ...execution,
    }));
  }).sort((a, b) => new Date(b.executed_at).getTime() - new Date(a.executed_at).getTime());

  // Calculer les statistiques globales
  const totalExecutions = allExecutions.length;
  const totalDuration = allExecutions.reduce((acc, exec) => acc + (exec.duration_minutes || 0), 0);
  const averageDuration = totalExecutions > 0 ? Math.round(totalDuration / totalExecutions) : 0;

  // Statistiques par pièce
  const roomStats = tasks.reduce((acc, task) => {
    const executions = JSON.parse(task.execution_history) as Execution[];
    if (!acc[task.room]) {
      acc[task.room] = {
        totalTasks: 0,
        totalExecutions: 0,
        totalDuration: 0,
      };
    }
    acc[task.room].totalTasks++;
    acc[task.room].totalExecutions += executions.length;
    acc[task.room].totalDuration += executions.reduce((sum, exec) => sum + (exec.duration_minutes || 0), 0);
    return acc;
  }, {} as Record<string, { totalTasks: number; totalExecutions: number; totalDuration: number }>);

  if (status === 'loading' || isLoading) {
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-2xl font-semibold text-gray-900 mb-8">Historique et statistiques</h1>

          {/* Statistiques globales */}
          <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total des tâches effectuées
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-indigo-600">
                  {totalExecutions}
                </dd>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Temps total passé
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-indigo-600">
                  {Math.round(totalDuration / 60)} heures
                </dd>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Durée moyenne par tâche
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-indigo-600">
                  {averageDuration} min
                </dd>
              </div>
            </div>
          </div>

          {/* Statistiques par pièce */}
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Statistiques par pièce</h2>
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pièce
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nombre de tâches
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Exécutions totales
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Temps total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Object.entries(roomStats).map(([room, stats]) => (
                    <tr key={room}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {room}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {stats.totalTasks}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {stats.totalExecutions}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {Math.round(stats.totalDuration)} min
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Historique détaillé */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Historique détaillé</h2>
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="divide-y divide-gray-200">
                {allExecutions.map((execution, index) => (
                  <div key={`${execution.taskId}-${index}`} className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">{execution.taskTitle}</h3>
                        <p className="text-sm text-gray-500">
                          {format(parseISO(execution.executed_at), 'PPP à HH:mm', { locale: fr })}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                          {execution.taskRoom}
                        </span>
                        {execution.duration_minutes && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {execution.duration_minutes} min
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 