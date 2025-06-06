import { NextResponse } from 'next/server';
import axios from 'axios';
import { validateToken } from '@/lib/ValidateAuth';

export async function GET(request: Request) {
  const token = await validateToken();

  const { searchParams } = new URL(request.url);
  const loanId = searchParams.get('loanId');

  if (!loanId) {
    return NextResponse.json({ success: false, error: 'loanId es requerido' }, { status: 400 });
  }

  try {
    const url = `${process.env.GATEWAY_API}/pdfs/loan-documents/${loanId}`;
    const response = await axios.get(url,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Cookie: `intranet-token=${token}`
        }
      });

    return NextResponse.json({ success: true, data: response.data });
  } catch (error) {
    console.error('Error al obtener documentos del préstamo:', error);
    return NextResponse.json({ success: false, error: 'Error al obtener los documentos' }, { status: 500 });
  }
}
