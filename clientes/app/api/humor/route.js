import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req) {
  const { humor } = await req.json();

  if (!humor) {
    return NextResponse.json({ error: 'Humor não enviado.' }, { status: 400 });
  }

  try {
    await db.run(
      'INSERT INTO humores (humor, criado_em) VALUES (?, datetime("now"))',
      [humor]
    );
    return NextResponse.json({ message: 'Humor salvo com sucesso.' });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao salvar humor.' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const humores = await db.all('SELECT * FROM humores ORDER BY criado_em DESC');
    return NextResponse.json(humores, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar humores.' }, { status: 500 });
  }
}
