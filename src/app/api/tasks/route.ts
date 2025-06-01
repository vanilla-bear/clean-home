import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const tasks = await prisma.task.findMany({
      where: {
        user_id: session.user.email,
      },
      orderBy: {
        next_execution: 'asc',
      },
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Erreur lors de la récupération des tâches:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const task = await prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        room: data.room,
        frequency_type: data.frequency.type,
        frequency_value: data.frequency.value,
        user_id: session.user.email,
        next_execution: new Date(),
        execution_history: JSON.stringify([]),
      },
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error('Erreur lors de la création de la tâche:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
} 