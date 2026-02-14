'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ru">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif', padding: 24, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(to bottom right, #fff5f7, #fff, #f0fff5)' }}>
        <h2 style={{ color: '#b83a5c', marginBottom: 16 }}>Критическая ошибка</h2>
        <p style={{ color: '#4b5563', marginBottom: 24, textAlign: 'center' }}>{error.message}</p>
        <button
          onClick={reset}
          style={{ padding: '12px 24px', background: '#ff6b91', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 600, cursor: 'pointer' }}
        >
          Перезагрузить
        </button>
      </body>
    </html>
  );
}
