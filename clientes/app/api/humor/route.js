import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cookies } from 'next/headers';

export async function POST(req) {
  const { humor } = await req.json();

  // Pega os cookies do navegador
  const cookieStore = cookies();
  const login = cookieStore.get('login')?.value;
  const senha = cookieStore.get('senha')?.value;

  if (!login || !senha) {
    return NextResponse.json({ error: 'Usuário não autenticado.' }, { status: 401 });
  }

  try {
    // Busca usuário no banco
    const usuario = await db.get(
      'SELECT * FROM usuarios WHERE login = ? AND senha = ?',
      [login, senha]
    );

    if (!usuario) {
      return NextResponse.json({ error: 'Credenciais inválidas.' }, { status: 401 });
    }

    // Verifica se já enviou hoje
    const hoje = new Date().toISOString().slice(0, 10);
    const jaEnviado = await db.get(
      `SELECT * FROM humores WHERE usuario_id = ? AND DATE(criado_em) = ?`,
      [usuario.id, hoje]
    );

    if (jaEnviado) {
      return NextResponse.json({ error: 'Você já registrou seu humor hoje.' }, { status: 400 });
    }

    // Salva o humor
    await db.run(
      'INSERT INTO humores (humor, criado_em, usuario_id) VALUES (?, datetime("now"), ?)',
      [humor, usuario.id]
    );

    return NextResponse.json({ message: 'Humor salvo com sucesso.' });

  } catch (error) {
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}
