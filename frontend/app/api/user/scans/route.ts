import { NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { getUserScans, addScanToUser } from '@/lib/userDatabase';

export async function GET(request: Request) {
  try {
    const session = await getSession();
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    
    const scans = getUserScans(session.user.sub, limit);
    
    return NextResponse.json({ scans });
  } catch (error) {
    console.error('Error fetching scans:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const scanData = await request.json();
    
    // Add timestamp and ID if not provided
    const scan = {
      ...scanData,
      id: scanData.id || `scan_${Date.now()}`,
      timestamp: scanData.timestamp || new Date().toISOString(),
    };
    
    const updatedUser = addScanToUser(session.user.sub, scan);
    
    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, scan });
  } catch (error) {
    console.error('Error saving scan:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

