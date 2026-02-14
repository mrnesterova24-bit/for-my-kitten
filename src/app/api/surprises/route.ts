import { NextRequest, NextResponse } from 'next/server';
import { getSurprises, addSurprise, updateSurprise, deleteSurprise } from '@/lib/data';

export async function GET() {
  try {
    const surprises = getSurprises();
    return NextResponse.json(surprises);
  } catch (error) {
    console.error('Error fetching surprises:', error);
    return NextResponse.json({ error: 'Failed to fetch surprises' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, imageUrl, videoUrl, unlockDate, isUnlocked, clickCount, clicksToUnlock } = body;

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    const newSurprise = addSurprise({
      title,
      content,
      imageUrl,
      videoUrl,
      unlockDate,
      isUnlocked: isUnlocked || false,
      clickCount: clickCount || 0,
      clicksToUnlock: clicksToUnlock || 0,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json(newSurprise, { status: 201 });
  } catch (error) {
    console.error('Error creating surprise:', error);
    return NextResponse.json({ error: 'Failed to create surprise' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'Surprise ID is required' }, { status: 400 });
    }

    const updatedSurprise = updateSurprise(id, {
      ...updateData,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json(updatedSurprise);
  } catch (error) {
    console.error('Error updating surprise:', error);
    return NextResponse.json({ error: 'Failed to update surprise' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Surprise ID is required' }, { status: 400 });
    }

    deleteSurprise(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting surprise:', error);
    return NextResponse.json({ error: 'Failed to delete surprise' }, { status: 500 });
  }
}