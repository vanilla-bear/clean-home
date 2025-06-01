import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { addDays, addWeeks, addMonths } from 'date-fns';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const { duration } = await request.json();
    const task = await prisma.task.findUnique({
      where: { id: params.id },
    });

    if (!task) {
      return NextResponse.json({ error: 'Tâche non trouvée' }, { status: 404 });
    }

    if (task.user_id !== session.user.email) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    const now = new Date();
    let nextExecution = new Date();

    switch (task.frequency_type) {
      case 'daily':
        nextExecution = addDays(nextExecution, task.frequency_value);
        break;
      case 'weekly':
        nextExecution = addWeeks(nextExecution, task.frequency_value);
        break;
      case 'monthly':
        nextExecution = addMonths(nextExecution, task.frequency_value);
        break;
    }

    const execution = {
      executed_at: now.toISOString(),
      duration_minutes: duration,
    };

    const history = JSON.parse(task.execution_history as string);

    const updatedTask = await prisma.task.update({
      where: { id: params.id },
      data: {
        last_executed_at: now,
        next_execution: nextExecution,
        execution_history: JSON.stringify([...history, execution]),
      },
    });

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la tâche:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const task = await prisma.task.findUnique({
      where: { id: params.id },
    });

    if (!task) {
      return NextResponse.json({ error: 'Tâche non trouvée' }, { status: 404 });
    }

    if (task.user_id !== session.user.email) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    await prisma.task.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de la suppression de la tâche:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
} 