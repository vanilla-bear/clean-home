'use client';

import TaskItem from './TaskItem';

interface Task {
  id: string;
  title: string;
  description: string;
  room: string;
  frequency_type: string;
  frequency_value: number;
  created_at: string;
  last_executed_at: string | null;
  next_execution: string;
  completed: boolean;
  execution_history: string;
}

interface TaskListProps {
  tasks: Task[];
  onComplete: (id: string, duration?: number) => void;
  onDelete: (id: string) => void;
}

export default function TaskList({ tasks, onComplete, onDelete }: TaskListProps) {
  const activeTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Tâches à faire ({activeTasks.length})</h2>
        {activeTasks.map(task => (
          <TaskItem
            key={task.id}
            task={task}
            onComplete={onComplete}
            onDelete={onDelete}
          />
        ))}
      </div>

      {completedTasks.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Tâches terminées ({completedTasks.length})</h2>
          {completedTasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onComplete={onComplete}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
} 