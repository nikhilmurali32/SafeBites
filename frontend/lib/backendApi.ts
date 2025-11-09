/**
 * Backend API utility functions
 * Centralized configuration and helpers for backend API calls
 */

const BACKEND_BASE_URL = 'http://127.0.0.1:8000';

/**
 * Check if backend is available by calling root endpoint
 */
export async function checkBackendConnection(): Promise<boolean> {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/`, {
      method: 'GET',
    });
    return response.ok;
  } catch (error) {
    console.error('Backend connection check failed:', error);
    return false;
  }
}

/**
 * Analyze product image
 * @param imageBlob - The image blob to analyze
 * @param userId - Optional user ID to include user preferences in analysis
 */
export async function analyzeProduct(imageBlob: Blob, userId?: string): Promise<any> {
  const formData = new FormData();
  formData.append('image', imageBlob, 'scan.jpg');
  
  // Add user_id as form field if provided
  if (userId) {
    formData.append('user_id', userId);
  }

  const response = await fetch(`${BACKEND_BASE_URL}/api/analyze`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error: ${response.status} - ${errorText}`);
  }

  return await response.json();
}

/**
 * Get recommended alternatives for a product
 */
export async function getRecommendations(productName: string, overallScore: number): Promise<any> {
  // URL encode the product name to handle special characters
  const encodedProductName = encodeURIComponent(productName);
  const response = await fetch(
    `${BACKEND_BASE_URL}/api/reccomendations/${encodedProductName}/${overallScore}`,
    {
      method: 'GET',
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error: ${response.status} - ${errorText}`);
  }

  return await response.json();
}

/**
 * Update user preferences
 * @param userId - User ID to update preferences for
 * @param preferences - Preferences object with allergies, dietGoals, avoidIngredients
 */
export async function updateUserPreferences(userId: string, preferences: any): Promise<any> {
  const response = await fetch(`${BACKEND_BASE_URL}/api/users/${encodeURIComponent(userId)}/preferences`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(preferences),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error: ${response.status} - ${errorText}`);
  }

  return await response.json();
}

/**
 * Get user by ID
 */
export async function getUser(userId: string): Promise<any> {
  const response = await fetch(`${BACKEND_BASE_URL}/api/users/${encodeURIComponent(userId)}`, {
    method: 'GET',
  });

  if (!response.ok) {
    if (response.status === 404) {
      return null; // User not found
    }
    const errorText = await response.text();
    throw new Error(`API Error: ${response.status} - ${errorText}`);
  }

  return await response.json();
}

/**
 * Create or update user
 */
export async function createOrUpdateUser(userData: any): Promise<any> {
  const response = await fetch(`${BACKEND_BASE_URL}/api/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error: ${response.status} - ${errorText}`);
  }

  return await response.json();
}

/**
 * Get user scans
 */
export async function getUserScans(userId: string, limit?: number): Promise<any> {
  const url = new URL(`${BACKEND_BASE_URL}/api/users/${encodeURIComponent(userId)}/scans`);
  if (limit) {
    url.searchParams.append('limit', limit.toString());
  }

  const response = await fetch(url.toString(), {
    method: 'GET',
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error: ${response.status} - ${errorText}`);
  }

  return await response.json();
}

/**
 * Add a scan for a user
 */
export async function addUserScan(userId: string, scanData: any): Promise<any> {
  const response = await fetch(`${BACKEND_BASE_URL}/api/users/${encodeURIComponent(userId)}/scans`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(scanData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error: ${response.status} - ${errorText}`);
  }

  return await response.json();
}

/**
 * Get user statistics
 */
export async function getUserStats(userId: string): Promise<any> {
  const response = await fetch(`${BACKEND_BASE_URL}/api/users/${encodeURIComponent(userId)}/stats`, {
    method: 'GET',
  });

  if (!response.ok) {
    if (response.status === 404) {
      return null; // User not found
    }
    const errorText = await response.text();
    throw new Error(`API Error: ${response.status} - ${errorText}`);
  }

  return await response.json();
}

