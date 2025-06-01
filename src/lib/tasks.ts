import { addDays, addWeeks, addMonths } from 'date-fns';
import { prisma } from './prisma';
import { Prisma } from '@prisma/client';
import { PrismaClient } from '@prisma/client';

export type FrequencyType = 'daily' | 'weekly' | 'monthly';
export type Room = 'salon' | 'cuisine' | 'entree' | 'toilettes' | 'salle_de_bain' | 'chambre_principale' | 'chambre_secondaire';

type TaskCreateInput = {
  title: string;
  description: string;
  room: Room;
  frequency: {
    type: FrequencyType;
    value: number;
  };
  user_id: string;
};

type Execution = {
  executed_at: string;
  duration_minutes?: number;
};

export type Task = {
  id: string;
  title: string;
  description: string;
  room: Room;
  frequency_type: FrequencyType;
  frequency_value: number;
  created_at: string;
  last_executed_at: string | null;
  next_execution: string;
  completed: boolean;
  execution_history: string;
  user_id: string;
};

export async function createTask(task: TaskCreateInput): Promise<Task> {
  const response = await fetch('/api/tasks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(task),
  });

  if (!response.ok) {
    throw new Error('Erreur lors de la création de la tâche');
  }

  return response.json();
}

export async function getUserTasks(userId: string): Promise<Task[]> {
  const response = await fetch('/api/tasks');

  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des tâches');
  }

  return response.json();
}

export async function completeTask(taskId: string, duration?: number): Promise<Task> {
  const response = await fetch(`/api/tasks/${taskId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ duration }),
  });

  if (!response.ok) {
    throw new Error('Erreur lors de la mise à jour de la tâche');
  }

  return response.json();
}

export async function deleteTask(taskId: string): Promise<void> {
  const response = await fetch(`/api/tasks/${taskId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Erreur lors de la suppression de la tâche');
  }
}

export async function exportTasksAnalytics(userId: string) {
  const tasks = await getUserTasks(userId);
  
  return tasks.map(task => {
    const executions = JSON.parse(task.execution_history) as Execution[];
    const avgDuration = executions.length > 0
      ? Math.round(executions.reduce((acc: number, exec: Execution) => 
          acc + (exec.duration_minutes || 0), 0) / executions.length)
      : 0;

    return {
      title: task.title,
      room: task.room,
      frequency: {
        type: task.frequency_type,
        value: task.frequency_value,
      },
      created_at: task.created_at,
      total_executions: executions.length,
      average_duration: Math.round(avgDuration),
      last_executed: task.last_executed_at,
      completion_rate: calculateCompletionRate(
        new Date(task.created_at),
        task.frequency_type,
        task.frequency_value,
        executions.length
      ),
    };
  });
}

function calculateCompletionRate(
  createdAt: Date,
  frequencyType: FrequencyType,
  frequencyValue: number,
  executionsCount: number
): number {
  const now = new Date();
  const daysSinceCreation = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));

  let expectedExecutions = 0;
  switch (frequencyType) {
    case 'daily':
      expectedExecutions = Math.floor(daysSinceCreation / frequencyValue);
      break;
    case 'weekly':
      expectedExecutions = Math.floor(daysSinceCreation / (7 * frequencyValue));
      break;
    case 'monthly':
      expectedExecutions = Math.floor(daysSinceCreation / (30 * frequencyValue));
      break;
  }

  return expectedExecutions > 0 ? (executionsCount / expectedExecutions) * 100 : 100;
}

export function calculateNextExecution(
  baseDate: Date,
  frequencyType: FrequencyType,
  frequencyValue: number
): Date {
  switch (frequencyType) {
    case 'daily':
      return addDays(baseDate, frequencyValue);
    case 'weekly':
      return addWeeks(baseDate, frequencyValue);
    case 'monthly':
      return addMonths(baseDate, frequencyValue);
    default:
      throw new Error('Type de fréquence invalide');
  }
}

export async function updateTask(taskId: string, data: {
  title: string;
  description: string;
  room: Room;
  frequency: {
    type: 'daily' | 'weekly' | 'monthly';
    value: number;
  };
}) {
  const response = await fetch(`/api/tasks/${taskId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Erreur lors de la mise à jour de la tâche');
  }

  return response.json();
} 