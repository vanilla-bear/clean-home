'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import Navigation from '../components/Navigation';
import { getUserTasks, completeTask } from '@/lib/tasks';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isSameMonth, parseISO, addDays, isSameDay, startOfDay, endOfDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ViewColumnsIcon, CalendarDaysIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface Task {
  id: string;
  title: string;
  next_execution: string;
  description?: string;
  room?: string;
}

export default function CalendarPage() {
  const { data: session, status } = useSession();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'calendar' | 'agenda'>('calendar');
  const [completingTask, setCompletingTask] = useState<string | null>(null);

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

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getTasksForDay = (date: Date) => {
    return tasks.filter(task => {
      const taskDate = parseISO(task.next_execution);
      return isSameDay(taskDate, date);
    });
  };

  const getTasksForNextDays = (startDate: Date, numberOfDays: number) => {
    const days: { date: Date; tasks: Task[] }[] = [];
    
    for (let i = 0; i < numberOfDays; i++) {
      const currentDay = addDays(startDate, i);
      const dayTasks = tasks.filter(task => {
        const taskDate = parseISO(task.next_execution);
        return isSameDay(taskDate, currentDay);
      });
      
      days.push({
        date: currentDay,
        tasks: dayTasks,
      });
    }
    
    return days;
  };

  const previousMonth = () => {
    setCurrentDate(date => new Date(date.getFullYear(), date.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(date => new Date(date.getFullYear(), date.getMonth() + 1, 1));
  };

  const handleCompleteTask = async (taskId: string) => {
    const duration = prompt('Combien de minutes avez-vous passé sur cette tâche ?');
    if (duration === null) return; // L'utilisateur a annulé

    setCompletingTask(taskId);
    try {
      await completeTask(taskId, parseInt(duration) || undefined);
      await loadTasks();
    } catch (error) {
      console.error('Erreur lors de la complétion de la tâche:', error);
    } finally {
      setCompletingTask(null);
    }
  };

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

  const renderCalendarView = () => (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="grid grid-cols-7 gap-px border-b border-gray-200">
        {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day) => (
          <div
            key={day}
            className="text-center py-2 bg-gray-50 text-sm font-semibold text-gray-700"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {days.map((day) => {
          const dayTasks = getTasksForDay(day);
          return (
            <div
              key={day.toString()}
              className={`min-h-[100px] bg-white p-2 ${
                !isSameMonth(day, currentDate)
                  ? 'text-gray-400 bg-gray-50'
                  : isToday(day)
                  ? 'bg-blue-50'
                  : ''
              }`}
            >
              <time
                dateTime={format(day, 'yyyy-MM-dd')}
                className={`flex justify-center items-center h-6 w-6 rounded-full mb-1 ${
                  isToday(day)
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700'
                }`}
              >
                {format(day, 'd')}
              </time>
              <div className="space-y-1">
                {dayTasks.map((task) => (
                  <div
                    key={task.id}
                    className="text-xs p-1 rounded bg-indigo-100 text-indigo-700 truncate"
                    title={task.title}
                  >
                    {task.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderAgendaView = () => {
    const nextDaysTasks = getTasksForNextDays(new Date(), 30);
    const endDate = addDays(new Date(), 29);
    
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <p className="text-sm text-gray-600">
            Affichage des tâches du {format(new Date(), 'd MMMM', { locale: fr })} au {format(endDate, 'd MMMM yyyy', { locale: fr })}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow divide-y divide-gray-200">
          {nextDaysTasks.map(({ date, tasks }) => (
            <div key={date.toString()} 
              className={`p-4 ${isToday(date) ? 'bg-blue-50' : ''}`}
            >
              <div className="flex items-center mb-2">
                <div className="flex-1">
                  <h3 className={`text-lg font-semibold ${isToday(date) ? 'text-blue-900' : 'text-gray-900'}`}>
                    {isToday(date) ? "Aujourd'hui" : format(date, 'EEEE d MMMM', { locale: fr })}
                  </h3>
                  <p className={`text-sm ${isToday(date) ? 'text-blue-600' : 'text-gray-500'}`}>
                    {tasks.length > 0 
                      ? `${tasks.length} tâche${tasks.length > 1 ? 's' : ''}`
                      : 'Aucune tâche'
                    }
                  </p>
                </div>
              </div>
              {tasks.length > 0 && (
                <div className="space-y-3">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-start p-3 rounded-lg bg-indigo-50 hover:bg-indigo-100 transition-colors"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-indigo-900">{task.title}</h4>
                        {task.description && (
                          <p className="mt-1 text-sm text-indigo-700">{task.description}</p>
                        )}
                        {task.room && (
                          <p className="mt-1 text-xs text-indigo-600">
                            Pièce : {task.room}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => handleCompleteTask(task.id)}
                        disabled={completingTask === task.id}
                        className={`ml-4 p-2 rounded-full ${
                          completingTask === task.id
                            ? 'bg-green-100 text-green-400 cursor-not-allowed'
                            : 'bg-green-100 text-green-600 hover:bg-green-200 hover:text-green-700'
                        }`}
                      >
                        <CheckCircleIcon className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-900">
              {viewMode === 'calendar' 
                ? format(currentDate, 'MMMM yyyy', { locale: fr })
                : 'Planning des tâches'
              }
            </h2>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-white rounded-md shadow p-1">
                <button
                  onClick={() => setViewMode('calendar')}
                  className={`p-2 rounded-md ${
                    viewMode === 'calendar'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  title="Vue calendrier"
                >
                  <CalendarDaysIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('agenda')}
                  className={`p-2 rounded-md ${
                    viewMode === 'agenda'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  title="Vue agenda"
                >
                  <ViewColumnsIcon className="h-5 w-5" />
                </button>
              </div>
              {viewMode === 'calendar' && (
                <div className="flex space-x-2">
                  <button
                    onClick={previousMonth}
                    className="p-2 rounded-md hover:bg-gray-100"
                  >
                    ←
                  </button>
                  <button
                    onClick={nextMonth}
                    className="p-2 rounded-md hover:bg-gray-100"
                  >
                    →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {viewMode === 'calendar' ? renderCalendarView() : renderAgendaView()}
      </main>
    </div>
  );
} 