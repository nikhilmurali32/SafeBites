import { NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { updateUserPreferences } from '@/lib/userDatabase';
import { updateUserPreferences as updateBackendPreferences, createOrUpdateUser } from '@/lib/backendApi';

export async function POST(request: Request) {
  try {
    const session = await getSession();
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const preferences = await request.json();
    const userId = session.user.sub;
    
    // Update local database
    const updatedUser = updateUserPreferences(userId, preferences);
    
    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Ensure user exists in backend first
    try {
      await createOrUpdateUser({
        id: userId,
        email: session.user.email || '',
        name: session.user.name || 'User',
        picture: session.user.picture,
        allergies: preferences.allergies,
        dietGoals: preferences.dietGoals,
        avoidIngredients: preferences.avoidIngredients,
      });
      console.log('User created/updated in backend');
    } catch (backendError) {
      console.error('Failed to create/update user in backend:', backendError);
    }
    
    // Update backend preferences
    try {
      await updateBackendPreferences(userId, preferences);
      console.log('Backend preferences updated successfully');
    } catch (backendError) {
      console.error('Failed to update backend preferences:', backendError);
      // Continue even if backend update fails - local update succeeded
    }
    
    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('Error updating preferences:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

