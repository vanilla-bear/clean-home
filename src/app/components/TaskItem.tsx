'use client';

import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Task {
  id: string;
  title: string;
  description: string;
  room: string;
  frequency_type: string;
  frequency_value: number;
  created_at: string;
  last_executed_at: string | null;
  next_execution: string | null;
  completed: boolean;
  execution_history: string;
}

interface TaskItemProps {
  task: Task;
  onComplete: (id: string, duration?: number) => void;
  onDelete: (id: string) => void;
}

export default function TaskItem({ task, onComplete, onDelete }: TaskItemProps) {
  const handleComplete = () => {
    const duration = prompt('Combien de minutes avez-vous passé sur cette tâche ?');
    onComplete(task.id, duration ? parseInt(duration) : undefined);
  };

  const formatFrequency = (type: string, value: number) => {
    switch (type) {
      case 'daily':
        return `Tous les ${value} jour${value > 1 ? 's' : ''}`;
      case 'weekly':
        return `Toutes les ${value} semaine${value > 1 ? 's' : ''}`;
      case 'monthly':
        return `Tous les ${value} mois`;
      default:
        return 'Fréquence inconnue';
    }
  };

  const formatRoom = (room: string) => {
    const rooms: Record<string, string> = {
      salon: 'Salon',
      cuisine: 'Cuisine',
      entree: 'Entrée',
      toilettes: 'Toilettes',
      salle_de_bain: 'Salle de bain',
      chambre_principale: 'Chambre principale',
      chambre_secondaire: 'Chambre secondaire',
    };
    return rooms[room] || room;
  };

  const executions = task.execution_history ? 
    JSON.parse(task.execution_history) as { executed_at: string; duration_minutes?: number }[] :
    [];
    
  const avgDuration = executions.length > 0
    ? Math.round(executions.reduce((acc, exec) => acc + (exec.duration_minutes || 0), 0) / executions.length)
    : 0;

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Non définie';
    try {
      return format(parseISO(dateStr), 'PPp', { locale: fr });
    } catch (error) {
      console.error('Erreur de formatage de date:', error);
      return 'Date invalide';
    }
  };

  return (
    <div className={`p-4 rounded-lg shadow-sm mb-4 ${task.completed ? 'bg-gray-100' : 'bg-white'}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={handleComplete}
            className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer text-black"
          />
          <div>
            <h3 className={`text-lg font-medium ${task.completed ? 'text-gray-600' : 'text-gray-900'}`}>
              {task.title}
            </h3>
            <p className={`text-sm mt-1 ${task.completed ? 'text-gray-500' : 'text-gray-700'}`}>
              {task.description}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {formatRoom(task.room)}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {formatFrequency(task.frequency_type, task.frequency_value)}
              </span>
              {task.last_executed_at && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                  Dernière exécution : {formatDate(task.last_executed_at)}
                </span>
              )}
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Prochaine : {formatDate(task.next_execution)}
              </span>
            </div>
            {executions.length > 0 && (
              <div className="mt-2 text-xs text-gray-700">
                Temps moyen : {avgDuration} minutes
              </div>
            )}
          </div>
        </div>
        <button
          onClick={() => onDelete(task.id)}
          className="text-red-600 hover:text-red-800 transition-colors duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
} 