'use client';

import { useState } from 'react';
import { Room } from '@/lib/tasks';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';

interface TaskFiltersProps {
  rooms: Room[];
  onFilterChange: (filters: {
    search: string;
    room: Room | 'all';
    sortBy: 'name' | 'next_execution';
  }) => void;
}

export default function TaskFilters({ rooms, onFilterChange }: TaskFiltersProps) {
  const [search, setSearch] = useState('');
  const [selectedRoom, setSelectedRoom] = useState<Room | 'all'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'next_execution'>('next_execution');

  const handleSearchChange = (value: string) => {
    setSearch(value);
    onFilterChange({ search: value, room: selectedRoom, sortBy });
  };

  const handleRoomChange = (value: Room | 'all') => {
    setSelectedRoom(value);
    onFilterChange({ search, room: value, sortBy });
  };

  const handleSortChange = (value: 'name' | 'next_execution') => {
    setSortBy(value);
    onFilterChange({ search, room: selectedRoom, sortBy: value });
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="space-y-4">
        {/* Barre de recherche */}
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Rechercher une tâche
          </label>
          <div className="relative">
            <input
              type="text"
              id="search"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Rechercher par nom..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
          {/* Filtre par pièce */}
          <div className="flex-1">
            <label htmlFor="room" className="block text-sm font-medium text-gray-700 mb-1">
              Filtrer par pièce
            </label>
            <div className="relative">
              <select
                id="room"
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                value={selectedRoom}
                onChange={(e) => handleRoomChange(e.target.value as Room | 'all')}
              >
                <option value="all">Toutes les pièces</option>
                {rooms.map((room) => (
                  <option key={room} value={room}>
                    {room}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <FunnelIcon className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Tri */}
          <div className="flex-1">
            <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">
              Trier par
            </label>
            <select
              id="sort"
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value as 'name' | 'next_execution')}
            >
              <option value="next_execution">Prochaine exécution</option>
              <option value="name">Nom</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
} 