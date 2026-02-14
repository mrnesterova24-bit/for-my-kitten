import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getSecretRoomPhotos, addSecretRoomPhotos, deleteSecretRoomPhoto } from '@/lib/data';

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
    const photos = getSecretRoomPhotos();
    const withApiUrls = photos.map((p) => ({
      ...p,
      url: p.url.startsWith('/uploads/') ? p.url.replace('/uploads/', '/api/uploads/') : p.url,
    }));
    return NextResponse.json(withApiUrls);
  } catch (error) {
    console.error('Error fetching secret room photos:', error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';
    let urls: string[] = [];

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const files = formData.getAll('files') as File[];
      const single = formData.get('file') as File | null;
      const list: File[] = files?.length ? [...files] : [];
      if (single) list.push(single);

      if (list.length === 0) {
        return NextResponse.json({ error: 'Нет файлов' }, { status: 400 });
      }

      ensureUploadDir();
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
        urls.push(`/uploads/${filename}`);
      }
    } else {
      const body = await request.json();
      const added = body.urls;
      if (Array.isArray(added)) urls = added.filter((u: unknown) => typeof u === 'string');
    }

    if (urls.length === 0) {
      return NextResponse.json({ error: 'Нет фото для добавления' }, { status: 400 });
    }

    addSecretRoomPhotos(urls);
    const photos = getSecretRoomPhotos();
    return NextResponse.json(photos, { status: 201 });
  } catch (error) {
    console.error('Error adding secret room photos:', error);
    return NextResponse.json({ error: 'Ошибка загрузки' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'id required' }, { status: 400 });
    }
    deleteSecretRoomPhoto(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting secret room photo:', error);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
