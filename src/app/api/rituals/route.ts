import { NextRequest, NextResponse } from 'next/server';
import { getRituals, addRitual, updateRitual, deleteRitual } from '@/lib/data';

export async function GET() {
  try {
    const rituals = getRituals();
    return NextResponse.json(rituals);
  } catch (error) {
    console.error('Error fetching rituals:', error);
    return NextResponse.json({ error: 'Failed to fetch rituals' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, type } = body;

    if (!title || !description || !type) {
      return NextResponse.json({ error: 'Title, description and type are required' }, { status: 400 });
    }

    const newRitual = addRitual({
      title,
      description,
      type,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json(newRitual, { status: 201 });
  } catch (error) {
    console.error('Error creating ritual:', error);
    return NextResponse.json({ error: 'Failed to create ritual' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'Ritual ID is required' }, { status: 400 });
    }

    const updatedRitual = updateRitual(id, {
      ...updateData,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json(updatedRitual);
  } catch (error) {
    console.error('Error updating ritual:', error);
    return NextResponse.json({ error: 'Failed to update ritual' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Ritual ID is required' }, { status: 400 });
    }

    deleteRitual(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting ritual:', error);
    return NextResponse.json({ error: 'Failed to delete ritual' }, { status: 500 });
  }
}