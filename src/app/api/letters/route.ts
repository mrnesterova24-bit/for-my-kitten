import { NextRequest, NextResponse } from 'next/server';
import { getLetters, addLetter, updateLetter, deleteLetter } from '@/lib/data';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    let letters = getLetters();
    if (category) {
      letters = letters.filter(l => l.category === category);
    }
    return NextResponse.json(letters);
  } catch (error) {
    console.error('Error fetching letters:', error);
    return NextResponse.json({ error: 'Failed to fetch letters' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { category, title, content } = body;

    if (!category || !title || !content) {
      return NextResponse.json({ error: 'Category, title, and content are required' }, { status: 400 });
    }

    const now = new Date().toISOString();
    const newLetter = addLetter({
      category,
      title,
      content,
      createdAt: now,
      updatedAt: now,
    });

    return NextResponse.json(newLetter, { status: 201 });
  } catch (error) {
    console.error('Error creating letter:', error);
    return NextResponse.json({ error: 'Failed to create letter' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'Letter ID is required' }, { status: 400 });
    }

    const updatedLetter = updateLetter(id, updateData);
    return NextResponse.json(updatedLetter);
  } catch (error) {
    console.error('Error updating letter:', error);
    return NextResponse.json({ error: 'Failed to update letter' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Letter ID is required' }, { status: 400 });
    }

    deleteLetter(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting letter:', error);
    return NextResponse.json({ error: 'Failed to delete letter' }, { status: 500 });
  }
}
