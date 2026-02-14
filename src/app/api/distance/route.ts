import { NextRequest, NextResponse } from 'next/server';
import { getDistanceMessages, addDistanceMessage, updateDistanceMessage, deleteDistanceMessage } from '@/lib/data';

export async function GET() {
  try {
    const messages = getDistanceMessages();
    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching distance messages:', error);
    return NextResponse.json({ error: 'Failed to fetch distance messages' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, order } = body;

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    const newMessage = addDistanceMessage({
      title,
      content,
      order: order || 0,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    console.error('Error creating distance message:', error);
    return NextResponse.json({ error: 'Failed to create distance message' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'Distance message ID is required' }, { status: 400 });
    }

    const updatedMessage = updateDistanceMessage(id, {
      ...updateData,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json(updatedMessage);
  } catch (error) {
    console.error('Error updating distance message:', error);
    return NextResponse.json({ error: 'Failed to update distance message' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Distance message ID is required' }, { status: 400 });
    }

    deleteDistanceMessage(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting distance message:', error);
    return NextResponse.json({ error: 'Failed to delete distance message' }, { status: 500 });
  }
}