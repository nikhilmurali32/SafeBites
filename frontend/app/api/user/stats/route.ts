import { NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { getUserStats } from '@/lib/userDatabase';

export async function GET() {
  try {
    const session = await getSession();
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const stats = getUserStats(session.user.sub);
    
    if (!stats) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    return NextResponse.json({ stats });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

