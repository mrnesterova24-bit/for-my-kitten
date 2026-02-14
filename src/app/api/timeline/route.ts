import { NextRequest, NextResponse } from 'next/server';
import { getTimeline, addTimelineEvent, updateTimelineEvent, deleteTimelineEvent } from '@/lib/data';

export async function GET() {
  try {
    const timeline = getTimeline();
    return NextResponse.json(timeline);
  } catch (error) {
    console.error('Error fetching timeline:', error);
    return NextResponse.json({ error: 'Failed to fetch timeline' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, date, imageUrl, order } = body;

    if (!title || !description || !date) {
      return NextResponse.json({ error: 'Title, description, and date are required' }, { status: 400 });
    }

    const newEvent = addTimelineEvent({
      title,
      description,
      date,
      imageUrl,
    });

    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    console.error('Error creating timeline event:', error);
    return NextResponse.json({ error: 'Failed to create timeline event' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'Timeline event ID is required' }, { status: 400 });
    }

    const updatedEvent = updateTimelineEvent(id, {
      ...updateData,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json(updatedEvent);
  } catch (error) {
    console.error('Error updating timeline event:', error);
    return NextResponse.json({ error: 'Failed to update timeline event' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Timeline event ID is required' }, { status: 400 });
    }

    deleteTimelineEvent(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting timeline event:', error);
    return NextResponse.json({ error: 'Failed to delete timeline event' }, { status: 500 });
  }
}