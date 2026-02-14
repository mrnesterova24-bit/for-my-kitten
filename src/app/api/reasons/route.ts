import { NextRequest, NextResponse } from 'next/server';
import { getReasons, addReason, updateReason, deleteReason } from '@/lib/data';

export async function GET() {
  try {
    const reasons = getReasons();
    return NextResponse.json(reasons);
  } catch (error) {
    console.error('Error fetching reasons:', error);
    return NextResponse.json({ error: 'Failed to fetch reasons' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, order, imageUrl } = body;

    if (!title || !description) {
      return NextResponse.json({ error: 'Title and description are required' }, { status: 400 });
    }

    const newReason = addReason({
      title,
      description,
      order: order ?? 0,
      imageUrl,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json(newReason, { status: 201 });
  } catch (error) {
    console.error('Error creating reason:', error);
    return NextResponse.json({ error: 'Failed to create reason' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'Reason ID is required' }, { status: 400 });
    }

    const updatedReason = updateReason(id, {
      ...updateData,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json(updatedReason);
  } catch (error) {
    console.error('Error updating reason:', error);
    return NextResponse.json({ error: 'Failed to update reason' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Reason ID is required' }, { status: 400 });
    }

    deleteReason(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting reason:', error);
    return NextResponse.json({ error: 'Failed to delete reason' }, { status: 500 });
  }
}
