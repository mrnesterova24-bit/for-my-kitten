import { NextRequest, NextResponse } from 'next/server';
import { getFinalLetter, addFinalLetter, updateFinalLetter } from '@/lib/data';

export async function GET() {
  try {
    const finalLetter = getFinalLetter();
    return NextResponse.json(finalLetter);
  } catch (error) {
    console.error('Error fetching final letter:', error);
    return NextResponse.json({ error: 'Failed to fetch final letter' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content } = body;

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    const now = new Date().toISOString();
    const newFinalLetter = addFinalLetter({
      content,
      lastUpdated: now,
    });

    return NextResponse.json(newFinalLetter, { status: 201 });
  } catch (error) {
    console.error('Error creating final letter:', error);
    return NextResponse.json({ error: 'Failed to create final letter' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { content } = body;

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    const updatedFinalLetter = updateFinalLetter({
      content,
      lastUpdated: new Date().toISOString(),
    });

    return NextResponse.json(updatedFinalLetter);
  } catch (error) {
    console.error('Error updating final letter:', error);
    return NextResponse.json({ error: 'Failed to update final letter' }, { status: 500 });
  }
}