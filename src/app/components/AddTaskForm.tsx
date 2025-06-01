'use client';

import { useState } from 'react';
import { Room, FrequencyType } from '@/lib/tasks';

interface AddTaskFormProps {
  onAdd: (task: {
    title: string;
    description: string;
    room: Room;
    frequency: {
      type: FrequencyType;
      value: number;
    };
  }) => void;
}

export default function AddTaskForm({ onAdd }: AddTaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [room, setRoom] = useState<Room>('salon');
  const [frequencyType, setFrequencyType] = useState<FrequencyType>('daily');
  const [frequencyValue, setFrequencyValue] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      title,
      description,
      room,
      frequency: {
        type: frequencyType,
        value: frequencyValue,
      },
    });
    setTitle('');
    setDescription('');
    setRoom('salon');
    setFrequencyType('daily');
    setFrequencyValue(1);
  };

  const inputClassName = "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900 placeholder-gray-500";

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-sm">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Titre
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={inputClassName}
          required
          placeholder="Nom de la tâche"
        />
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={inputClassName}
          rows={3}
          placeholder="Description détaillée de la tâche"
        />
      </div>

      <div>
        <label htmlFor="room" className="block text-sm font-medium text-gray-700">
          Pièce
        </label>
        <select
          id="room"
          value={room}
          onChange={(e) => setRoom(e.target.value as Room)}
          className={inputClassName}
        >
          <option value="salon">Salon</option>
          <option value="cuisine">Cuisine</option>
          <option value="entree">Entrée</option>
          <option value="toilettes">Toilettes</option>
          <option value="salle_de_bain">Salle de bain</option>
          <option value="chambre_principale">Chambre principale</option>
          <option value="chambre_secondaire">Chambre secondaire</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="frequencyType" className="block text-sm font-medium text-gray-700">
            Type de récurrence
          </label>
          <select
            id="frequencyType"
            value={frequencyType}
            onChange={(e) => setFrequencyType(e.target.value as FrequencyType)}
            className={inputClassName}
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
          <div className="mt-1 flex items-center">
            <input
              type="number"
              id="frequencyValue"
              value={frequencyValue}
              onChange={(e) => setFrequencyValue(Math.max(1, parseInt(e.target.value)))}
              min="1"
              className={inputClassName}
            />
            <span className="ml-2 text-sm text-gray-700">
              {frequencyType === 'daily' ? 'jours' : 
               frequencyType === 'weekly' ? 'semaines' : 'mois'}
            </span>
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Ajouter la tâche
      </button>
    </form>
  );
} 