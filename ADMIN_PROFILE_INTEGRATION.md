# Admin Profile Integration

This document explains the admin profile integration that connects the frontend to the backend `ew_admin` table.

## Overview

The admin profile page now fetches real data from the `ew_admin` table in the database through a REST API.

## Files Modified

### Frontend Files
1. **`app/admin/(dashboard)/profile/page.tsx`** - Main admin profile page
2. **`components/admin-profile-card.tsx`** - Updated to fetch and display real admin data
3. **`app/api/admin/profile/get_profile/route.ts`** - New API endpoint for fetching admin profile

### Backend Files
1. **`application/controllers/admin/Profile.php`** - Added `get_profile()` method
2. **`application/models/admin/Admin_model.php`** - Added `get_user_by_id()` method

## API Endpoints

### GET `/api/admin/profile/get_profile`

Fetches admin profile data from the `ew_admin` table.

**Authentication:** Requires admin authentication (admin_id cookie or admin_jwt cookie)

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "admin",
    "firstname": "John",
    "lastname": "Doe",
    "email": "admin@example.com",
    "mobile_no": "1234567890",
    "address": "123 Main St",
    "role": 1,
    "is_active": 1,
    "is_verify": 1,
    "is_admin": 1,
    "last_ip": "192.168.1.1",
    "created_at": "2024-01-01 00:00:00",
    "updated_at": "2024-01-01 00:00:00"
  }
}
```

## Database Schema

The integration uses the `ew_admin` table with the following columns:
- `id` (int, AI, PK)
- `username` (varchar(50))
- `firstname` (varchar(30))
- `lastname` (varchar(30))
- `email` (varchar(50))
- `mobile_no` (varchar(30))
- `address` (varchar(255))
- `role` (tinyint)
- `is_active` (tinyint)
- `is_verify` (tinyint)
- `is_admin` (tinyint)
- `last_ip` (varchar(30))
- `created_at` (datetime)
- `updated_at` (datetime)

## Security Features

- Sensitive data (password, auth codes, tokens) are excluded from the API response
- Authentication is required to access profile data
- XSS protection through CodeIgniter's security features

## Usage

1. Admin must be logged in (authenticated)
2. Navigate to `/admin/profile` page
3. The page will automatically fetch and display the admin's profile information
4. Loading states and error handling are included

## Error Handling

The component includes:
- Loading spinner while fetching data
- Error messages for failed requests
- Fallback display for missing data
- Proper TypeScript interfaces for type safety



