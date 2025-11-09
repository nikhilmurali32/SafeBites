import { NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { getUserById, getUserByEmail, upsertUser } from '@/lib/userDatabase';

export async function GET() {
  try {
    const session = await getSession();
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const auth0User = session.user;
    
    // Try to get user by Auth0 ID first
    let user = getUserById(auth0User.sub);
    
    // If not found, try by email
    if (!user && auth0User.email) {
      user = getUserByEmail(auth0User.email);
    }
    
    // If still not found, create new user
    if (!user) {
      user = upsertUser({
        id: auth0User.sub,
        email: auth0User.email,
        name: auth0User.name || 'User',
        picture: auth0User.picture,
      });
    }
    
    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

