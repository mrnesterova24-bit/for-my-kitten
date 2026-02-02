import { NextRequest, NextResponse } from 'next/server';
import { getDailyQuotes, addDailyQuote, updateDailyQuote, deleteDailyQuote } from '@/lib/data';

export async function GET() {
  try {
    const quotes = getDailyQuotes();
    return NextResponse.json(quotes);
  } catch (error) {
    console.error('Error fetching daily quotes:', error);
    return NextResponse.json({ error: 'Failed to fetch quotes' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { quote, author } = body;

    if (!quote) {
      return NextResponse.json({ error: 'Quote is required' }, { status: 400 });
    }

    const newQuote = addDailyQuote({
      quote,
      author,
      isActive: true,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json(newQuote, { status: 201 });
  } catch (error) {
    console.error('Error creating daily quote:', error);
    return NextResponse.json({ error: 'Failed to create quote' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'Quote ID is required' }, { status: 400 });
    }

    const updatedQuote = updateDailyQuote(id, {
      ...updateData,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json(updatedQuote);
  } catch (error) {
    console.error('Error updating daily quote:', error);
    return NextResponse.json({ error: 'Failed to update quote' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Quote ID is required' }, { status: 400 });
    }

    deleteDailyQuote(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting daily quote:', error);
    return NextResponse.json({ error: 'Failed to delete quote' }, { status: 500 });
  }
}