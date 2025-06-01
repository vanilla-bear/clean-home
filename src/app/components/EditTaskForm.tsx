'use client';

import { useState } from 'react';
import { Room } from '@/lib/tasks';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface EditTaskFormProps {
  task: {
    id: string;
    title: string;
    description: string;
    room: Room;
    frequency_type: string;
    frequency_value: number;
  };
  onSave: (taskId: string, data: {
    title: string;
    description: string;
    room: Room;
    frequency: {
      type: 'daily' | 'weekly' | 'monthly';
      value: number;
    };
  }) => Promise<void>;
  onCancel: () => void;
}

export default function EditTaskForm({ task, onSave, onCancel }: EditTaskFormProps) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [room, setRoom] = useState<Room>(task.room);
  const [frequencyType, setFrequencyType] = useState<'daily' | 'weekly' | 'monthly'>(
    task.frequency_type as 'daily' | 'weekly' | 'monthly'
  );
  const [frequencyValue, setFrequencyValue] = useState(task.frequency_value);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSave(task.id, {
        title,
        description,
        room,
        frequency: {
          type: frequencyType,
          value: frequencyValue,
        },
      });
    } catch (error) {
      console.error('Erreur lors de la modification de la tâche:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Modifier la tâche</h2>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-500"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Titre
              </label>
              <input
                type="text"
                id="title"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                rows={3}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="room" className="block text-sm font-medium text-gray-700">
                Pièce
              </label>
              <select
                id="room"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={room}
                onChange={(e) => setRoom(e.target.value as Room)}
              >
                <option value="cuisine">Cuisine</option>
                <option value="salon">Salon</option>
                <option value="salle_de_bain">Salle de bain</option>
                <option value="chambre">Chambre</option>
                <option value="toilettes">Toilettes</option>
                <option value="bureau">Bureau</option>
                <option value="autre">Autre</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="frequencyType" className="block text-sm font-medium text-gray-700">
                  Fréquence
                </label>
                <select
                  id="frequencyType"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={frequencyType}
                  onChange={(e) => setFrequencyType(e.target.value as 'daily' | 'weekly' | 'monthly')}
                >
                  <option value="daily">Jours</option>
                  <option value="weekly">Semaines</option>
                  <option value="monthly">Mois</option>
                </select>
              </div>

              <div>
                <label htmlFor="frequencyValue" className="block text-sm font-medium text-gray-700">
                  Tous les
                </label>
                <input
                  type="number"
                  id="frequencyValue"
                  required
                  min="1"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={frequencyValue}
                  onChange={(e) => setFrequencyValue(parseInt(e.target.value))}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                  isSubmitting
                    ? 'bg-indigo-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              >
                {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 