import { NextRequest, NextResponse } from 'next/server';
import { getFeelings, addFeeling, updateFeeling, deleteFeeling } from '@/lib/data';

export async function GET() {
  try {
    const feelings = getFeelings();
    return NextResponse.json(feelings);
  } catch (error) {
    console.error('Error fetching feelings:', error);
    return NextResponse.json({ error: 'Failed to fetch feelings' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, emotionType } = body;

    if (!title || !content || !emotionType) {
      return NextResponse.json({ error: 'Title, content, and emotionType are required' }, { status: 400 });
    }

    const newFeeling = addFeeling({
      title,
      content,
      emotionType,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json(newFeeling, { status: 201 });
  } catch (error) {
    console.error('Error creating feeling:', error);
    return NextResponse.json({ error: 'Failed to create feeling' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'Feeling ID is required' }, { status: 400 });
    }

    const updatedFeeling = updateFeeling(id, {
      ...updateData,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json(updatedFeeling);
  } catch (error) {
    console.error('Error updating feeling:', error);
    return NextResponse.json({ error: 'Failed to update feeling' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Feeling ID is required' }, { status: 400 });
    }

    deleteFeeling(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting feeling:', error);
    return NextResponse.json({ error: 'Failed to delete feeling' }, { status: 500 });
  }
}