import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB per file
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

function ensureUploadDir() {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
}

function safeName(original: string): string {
  const ext = path.extname(original) || '.jpg';
  const base = Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
  return base + ext.toLowerCase();
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[] | null;
    const single = formData.get('file') as File | null;
    const list: File[] = [];
    if (files?.length) list.push(...files);
    if (single) list.push(single);

    if (list.length === 0) {
      return NextResponse.json({ error: 'Нет файлов' }, { status: 400 });
    }

    ensureUploadDir();
    const urls: string[] = [];

    for (const file of list) {
      if (!file?.size || !file?.name) continue;
      if (file.size > MAX_SIZE) {
        return NextResponse.json(
          { error: `Файл ${file.name} слишком большой (макс. 10 МБ)` },
          { status: 400 }
        );
      }
      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: `Недопустимый тип: ${file.name}. Разрешены JPEG, PNG, GIF, WebP` },
          { status: 400 }
        );
      }

      const filename = safeName(file.name);
      const filepath = path.join(UPLOAD_DIR, filename);
      const buffer = Buffer.from(await file.arrayBuffer());
      fs.writeFileSync(filepath, buffer);
      urls.push(`/uploads/${filename}`);
    }

    return NextResponse.json({ urls });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Ошибка загрузки' }, { status: 500 });
  }
}
