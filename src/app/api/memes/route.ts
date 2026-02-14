import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getMemes, addMeme, updateMeme, deleteMeme } from '@/lib/data';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

function ensureUploadDir() {
  if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

function safeName(original: string): string {
  const ext = path.extname(original) || '.jpg';
  const base = Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
  return base + ext.toLowerCase();
}

export async function GET() {
  try {
    const memes = getMemes();
    return NextResponse.json(memes);
  } catch (error) {
    console.error('Error fetching memes:', error);
    return NextResponse.json({ error: 'Failed to fetch memes' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';
    const now = new Date().toISOString();

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const files = formData.getAll('files') as File[];
      const single = formData.get('file') as File | null;
      const list: File[] = files?.length ? [...files] : [];
      if (single) list.push(single);
      const title = (formData.get('title') as string)?.trim() || undefined;

      if (list.length === 0) {
        return NextResponse.json({ error: 'Нет файлов' }, { status: 400 });
      }

      ensureUploadDir();
      const added: ReturnType<typeof addMeme>[] = [];
      for (const file of list) {
        if (!file?.size || !file?.name) continue;
        if (file.size > MAX_SIZE) {
          return NextResponse.json({ error: `Файл ${file.name} слишком большой (макс. 10 МБ)` }, { status: 400 });
        }
        if (!ALLOWED_TYPES.includes(file.type)) {
          return NextResponse.json({ error: `Недопустимый тип: ${file.name}` }, { status: 400 });
        }
        const filename = safeName(file.name);
        const filepath = path.join(UPLOAD_DIR, filename);
        fs.writeFileSync(filepath, Buffer.from(await file.arrayBuffer()));
        const imageUrl = `/uploads/${filename}`;
        const meme = addMeme({ type: 'image', imageUrl, title, createdAt: now });
        added.push(meme);
      }
      return NextResponse.json(added.length === 1 ? added[0] : added, { status: 201 });
    }

    const body = await request.json();
    const { type, title, caption, imageUrl, reelUrl } = body;

    if (type === 'reel') {
      const url = (reelUrl || body.url || '').trim();
      if (!url) return NextResponse.json({ error: 'reelUrl обязателен для рилса' }, { status: 400 });
      const meme = addMeme({ type: 'reel', reelUrl: url, title: title?.trim() || undefined, createdAt: now });
      return NextResponse.json(meme, { status: 201 });
    }

    // image (or legacy: no type but imageUrl)
    const img = (imageUrl || '').trim();
    if (!img) return NextResponse.json({ error: 'imageUrl обязателен для мема-картинки' }, { status: 400 });
    const meme = addMeme({
      type: 'image',
      imageUrl: img,
      title: title?.trim() || undefined,
      caption: caption?.trim() || undefined,
      createdAt: now,
    });
    return NextResponse.json(meme, { status: 201 });
  } catch (error) {
    console.error('Error creating meme:', error);
    return NextResponse.json({ error: 'Failed to create meme' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...rest } = body;
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
    const meme = updateMeme(id, { ...rest, updatedAt: new Date().toISOString() });
    return NextResponse.json(meme);
  } catch (error) {
    console.error('Error updating meme:', error);
    return NextResponse.json({ error: 'Failed to update meme' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = new URL(request.url).searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
    deleteMeme(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting meme:', error);
    return NextResponse.json({ error: 'Failed to delete meme' }, { status: 500 });
  }
}
