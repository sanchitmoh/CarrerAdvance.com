export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';
export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8080/api';
export const PUBLIC_URL = process.env.NEXT_PUBLIC_URL || 'http://localhost:8080';
export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';
const MEET_BASE_RAW = process.env.NEXT_PUBLIC_MEET_URL || 'http://localhost:8080/googlecalendar';
export const MEET_BASE_URL = MEET_BASE_RAW.replace(/\/+$/, '');

export const getApiUrl = (endpoint: string): string =>
  `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

export const getBaseUrl = (endpoint: string): string =>
  `${BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

export const getMeetUrl = (endpoint = ''): string =>
  `${MEET_BASE_URL}${endpoint ? (endpoint.startsWith('/') ? endpoint : `/${endpoint}`) : ''}`;

export const getAssetUrl = (path: string): string => {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;
  
  // For uploads, use the base URL without index.php
  return `${PUBLIC_URL}${path.replace(/^\//, '')}`;
}

export const getBackendUrl = (path: string = ''): string => {
  if (!path) return BACKEND_URL;
  if (/^https?:\/\//i.test(path)) return path;
  
  // Ensure path starts with /
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${BACKEND_URL}${cleanPath}`;
}

