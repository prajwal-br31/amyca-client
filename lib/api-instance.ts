import { ApiService } from './api-service';

// Create an instance with your API base URL
// For local development, defaults to http://localhost:3000
// For production, use NEXT_PUBLIC_API_BASE_URL environment variable
function getApiBaseUrl() {
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL;
  }
  
  // Auto-detect localhost in browser
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return 'http://localhost:3000';
  }
  
  // Default to production URL
  return 'https://amyca-server.onrender.com';
}

export const api = new ApiService(getApiBaseUrl());

// ✅ Do NOT call api methods here.
// Keep this file focused on exporting the instance only.

// Example usage in your components/pages:
// 
// import { api } from '@/lib/api-instance';
//
// async function loadProfile() {
//   try {
//     const data = await api.get('/users/profile');
//     console.log(data);
//   } catch (error) {
//     console.error('API Error:', error);
//   }
// }