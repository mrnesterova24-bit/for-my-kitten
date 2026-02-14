import { NextRequest, NextResponse } from 'next/server';
import { getPuns, addPun, updatePun, deletePun } from '@/lib/data';

export async function GET() {
  try {
    const puns = getPuns();
    return NextResponse.json(puns);
  } catch (error) {
    console.error('Error fetching puns:', error);
    return NextResponse.json({ error: 'Failed to fetch puns' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, category } = body;
    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }
    const now = new Date().toISOString();
    const pun = addPun({ text, category, createdAt: now });
    return NextResponse.json(pun, { status: 201 });
  } catch (error) {
    console.error('Error creating pun:', error);
    return NextResponse.json({ error: 'Failed to create pun' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...rest } = body;
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
    const pun = updatePun(id, { ...rest, updatedAt: new Date().toISOString() });
    return NextResponse.json(pun);
  } catch (error) {
    console.error('Error updating pun:', error);
    return NextResponse.json({ error: 'Failed to update pun' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = new URL(request.url).searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
    deletePun(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting pun:', error);
    return NextResponse.json({ error: 'Failed to delete pun' }, { status: 500 });
  }
}
