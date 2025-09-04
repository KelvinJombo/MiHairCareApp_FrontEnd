// src/api/client.js
import axios from 'axios';
const baseURL =   
  process.env.REACT_APP_API_BASE_URL || // CRA
  '';

export const client = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

// GET /api/users/hairstylists/{hairStyleId}
export async function getStylistsByHairStyle(hairStyleId) {
  const { data } = await client.get(`/api/users/hairstylists/${hairStyleId}`);
  // Expecting your ApiResponse envelope: { success, message, data }
  if (!data?.success) {
    throw new Error(data?.message || 'Failed to load stylists');
  }
  return data.data || [];
}
