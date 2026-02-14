import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import crypto from 'crypto';

const DEPLOY_SECRET = process.env.DEPLOY_SECRET;
const PM2_APP_NAME = process.env.DEPLOY_PM2_NAME || 'for-my-kitten';

export async function POST(request: NextRequest) {
  if (!DEPLOY_SECRET) {
    return NextResponse.json({ error: 'Deploy not configured' }, { status: 501 });
  }

  const headerSecret = request.headers.get('x-deploy-secret');
  const querySecret = request.nextUrl.searchParams.get('secret');
  if (headerSecret === DEPLOY_SECRET || querySecret === DEPLOY_SECRET) {
    // Прямая передача секрета (ручной вызов или свой скрипт)
  } else {
    const sig = request.headers.get('x-hub-signature-256');
    if (sig) {
      const body = await request.text();
      const expected = 'sha256=' + crypto.createHmac('sha256', DEPLOY_SECRET).update(body).digest('hex');
      if (sig !== expected) {
        return NextResponse.json({ error: 'Invalid secret' }, { status: 403 });
      }
    } else {
      return NextResponse.json({ error: 'Invalid secret' }, { status: 403 });
    }
  }

  const cwd = process.cwd();
  const cmd = `git pull && npm install --production && npm run build && pm2 restart ${PM2_APP_NAME}`;
  const child = spawn('sh', ['-c', cmd], {
    cwd,
    detached: true,
    stdio: 'ignore',
  });
  child.unref();

  return NextResponse.json({ ok: true, message: 'Deploy started' }, { status: 202 });
}
