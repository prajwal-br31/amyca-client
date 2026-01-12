import { ApiService } from './api-service';

// Create an instance with your API base URL
export const api = new ApiService(
  process.env.NEXT_PUBLIC_API_BASE_URL || 'https://amyca-server.onrender.com'
);

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