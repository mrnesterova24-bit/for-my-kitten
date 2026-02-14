import { NextRequest, NextResponse } from 'next/server';
import { getCrisisSupport, addCrisisSupport, updateCrisisSupport, deleteCrisisSupport } from '@/lib/data';

export async function GET() {
  try {
    const crisisSupport = getCrisisSupport();
    return NextResponse.json(crisisSupport);
  } catch (error) {
    console.error('Error fetching crisis support:', error);
    return NextResponse.json({ error: 'Failed to fetch crisis support' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, severity, order } = body;

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    const newCrisisSupport = addCrisisSupport({
      title,
      content,
      severity: severity || 'mild',
      order: order || 0,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json(newCrisisSupport, { status: 201 });
  } catch (error) {
    console.error('Error creating crisis support:', error);
    return NextResponse.json({ error: 'Failed to create crisis support' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'Crisis support ID is required' }, { status: 400 });
    }

    const updatedCrisisSupport = updateCrisisSupport(id, {
      ...updateData,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json(updatedCrisisSupport);
  } catch (error) {
    console.error('Error updating crisis support:', error);
    return NextResponse.json({ error: 'Failed to update crisis support' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Crisis support ID is required' }, { status: 400 });
    }

    deleteCrisisSupport(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting crisis support:', error);
    return NextResponse.json({ error: 'Failed to delete crisis support' }, { status: 500 });
  }
}