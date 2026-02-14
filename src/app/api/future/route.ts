import { NextRequest, NextResponse } from 'next/server';
import { getFutureDreams, addFutureDream, updateFutureDream, deleteFutureDream } from '@/lib/data';

export async function GET() {
  try {
    const futureDreams = getFutureDreams();
    return NextResponse.json(futureDreams);
  } catch (error) {
    console.error('Error fetching future dreams:', error);
    return NextResponse.json({ error: 'Failed to fetch future dreams' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, category, imageUrl, order } = body;

    if (!title || !description || !category) {
      return NextResponse.json({ error: 'Title, description, and category are required' }, { status: 400 });
    }

    const newDream = addFutureDream({
      title,
      description,
      category,
      imageUrl,
      order: order || 0,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json(newDream, { status: 201 });
  } catch (error) {
    console.error('Error creating future dream:', error);
    return NextResponse.json({ error: 'Failed to create future dream' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'Future dream ID is required' }, { status: 400 });
    }

    const updatedDream = updateFutureDream(id, {
      ...updateData,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json(updatedDream);
  } catch (error) {
    console.error('Error updating future dream:', error);
    return NextResponse.json({ error: 'Failed to update future dream' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Future dream ID is required' }, { status: 400 });
    }

    deleteFutureDream(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting future dream:', error);
    return NextResponse.json({ error: 'Failed to delete future dream' }, { status: 500 });
  }
}