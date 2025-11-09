import { NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { updateUserPreferences } from '@/lib/userDatabase';

export async function POST(request: Request) {
  try {
    const session = await getSession();
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const preferences = await request.json();
    
    const updatedUser = updateUserPreferences(session.user.sub, preferences);
    
    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('Error updating preferences:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

