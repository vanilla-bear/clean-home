'use client';

import { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Room } from '@/lib/tasks';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import EditTaskForm from './EditTaskForm';

interface Task {
  id: string;
  title: string;
  description: string;
  room: Room;
  frequency_type: string;
  frequency_value: number;
  next_execution: string;
  last_executed_at: string | null;
}

interface TaskListProps {
  tasks: Task[];
  onComplete: (taskId: string, duration?: number) => Promise<void>;
  onDelete: (taskId: string) => Promise<void>;
  onUpdate: (taskId: string, data: {
    title: string;
    description: string;
    room: Room;
    frequency: {
      type: 'daily' | 'weekly' | 'monthly';
      value: number;
    };
  }) => Promise<void>;
}

export default function TaskList({ tasks, onComplete, onDelete, onUpdate }: TaskListProps) {
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isCompleting, setIsCompleting] = useState<string | null>(null);

  const handleComplete = async (taskId: string) => {
    setIsCompleting(taskId);
    try {
      await onComplete(taskId);
    } finally {
      setIsCompleting(null);
    }
  };

  const handleDelete = async (taskId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
      setIsDeleting(taskId);
      try {
        await onDelete(taskId);
      } finally {
        setIsDeleting(null);
      }
    }
  };

  const handleUpdate = async (taskId: string, data: {
    title: string;
    description: string;
    room: Room;
    frequency: {
      type: 'daily' | 'weekly' | 'monthly';
      value: number;
    };
  }) => {
    await onUpdate(taskId, data);
    setTaskToEdit(null);
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Aucune tâche trouvée</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="bg-white shadow rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900">{task.title}</h3>
                <p className="mt-1 text-sm text-gray-600">{task.description}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    {task.room}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Tous les {task.frequency_value} {task.frequency_type === 'daily' ? 'jours' : task.frequency_type === 'weekly' ? 'semaines' : 'mois'}
                  </span>
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  Prochaine exécution : {format(parseISO(task.next_execution), 'PPP', { locale: fr })}
                </div>
              </div>
              <div className="flex items-start space-x-2 ml-4">
                <button
                  onClick={() => setTaskToEdit(task)}
                  className="p-2 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-100"
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDelete(task.id)}
                  disabled={isDeleting === task.id}
                  className={`p-2 text-red-400 hover:text-red-500 rounded-full hover:bg-red-50 ${
                    isDeleting === task.id ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="mt-4">
              <button
                onClick={() => handleComplete(task.id)}
                disabled={isCompleting === task.id}
                className={`w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${
                  isCompleting === task.id
                    ? 'bg-green-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
              >
                {isCompleting === task.id ? 'Validation...' : 'Marquer comme fait'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {taskToEdit && (
        <EditTaskForm
          task={taskToEdit}
          onSave={handleUpdate}
          onCancel={() => setTaskToEdit(null)}
        />
      )}
    </>
  );
} 