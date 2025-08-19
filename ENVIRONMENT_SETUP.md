# Environment Configuration

This project uses environment variables to configure API endpoints and other settings.

## Environment Variables

### Required Variables

Create a `.env.local` file in the root directory with the following variables:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/index.php/api
NEXT_PUBLIC_BASE_URL=http://localhost:8080/index.php
```

### API Configuration

The project includes utility functions in `lib/api-config.ts` to handle API URLs:

- `API_BASE_URL`: The base URL for all API calls (for `/index.php/api/...` endpoints)
- `BASE_URL`: The base URL for non-API calls (for `/index.php/...` endpoints)
- `getApiUrl(endpoint)`: Constructs full API URLs (for API endpoints)
- `getBaseUrl(endpoint)`: Constructs full URLs for non-API endpoints (e.g., jobs, blog)
- `getAssetUrl(path)`: Constructs URLs for static assets

### Usage Examples

```typescript
import { getApiUrl, getBaseUrl, getAssetUrl } from '@/lib/api-config'

// API calls (for endpoints under /index.php/api)
const response = await fetch(getApiUrl('employer/profile/get_profile?employer_id=123'))

// Non-API calls (for endpoints under /index.php)
const jobsResponse = await fetch(getBaseUrl('jobs/api_list?param=value'))

// Asset URLs
const avatarUrl = getAssetUrl('uploads/profile.jpg')
```

### Development vs Production

For different environments, you can create different environment files:

- `.env.local` - Local development (gitignored)
- `.env.development` - Development environment
- `.env.production` - Production environment

### Next.js Environment Variables

- Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser
- Other variables are only available on the server side
- Environment files are loaded automatically by Next.js

### Updating API Endpoints

When updating API endpoints in your components:

1. Import the utility functions: `import { getApiUrl, getBaseUrl } from '@/lib/api-config'`
2. Use `getApiUrl('your/api/endpoint')` for API endpoints
3. Use `getBaseUrl('your/non-api/endpoint')` for non-API endpoints
4. For assets, use: `getAssetUrl('path/to/asset')`

This ensures consistent API configuration across the entire application.
