# Backend Integration Guide

This document explains how to integrate the frontend with your real Spring Boot backend.

## Current State

The application is currently configured to use **mock API** with 200 fake file records. This allows full development and testing without a backend.

## Switching to Real Backend

### Step 1: Create Environment File

Create a `.env` file in the project root:

```env
VITE_API_MODE=http
VITE_API_BASE_URL=http://localhost:8080
```

### Step 2: Backend API Requirements

Your Spring Boot backend must implement these endpoints:

#### 1. Search Files
```
GET /api/search?q={query}&categories={cat1}&categories={cat2}&sortField={field}&sortDir={dir}&page={page}&size={size}

Response:
{
  "results": [
    {
      "id": "string",
      "title": "string",
      "filename": "string",
      "category": "DOCUMENT|IMAGE|VIDEO|AUDIO|ARCHIVE|CODE|OTHER",
      "uploadedAt": "ISO-8601 datetime",
      "uploadedBy": "string",
      "fileSize": number,
      "metadataText": "string",
      "downloadUrl": "string"
    }
  ],
  "total": number,
  "page": number,
  "size": number
}
```

#### 2. Search Suggestions
```
GET /api/search/suggest?q={query}&categories={cat1}&categories={cat2}

Response:
{
  "suggestions": ["string", "string", ...]
}
```

#### 3. Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "string",
  "password": "string",
  "remember": boolean
}

Response:
{
  "token": "string",
  "user": {
    "id": "string",
    "email": "string",
    "name": "string"
  }
}
```

#### 4. Logout
```
POST /api/auth/logout
Authorization: Bearer {token}

Response: 200 OK
```

#### 5. Get Current User
```
GET /api/auth/me
Authorization: Bearer {token}

Response:
{
  "user": {
    "id": "string",
    "email": "string",
    "name": "string"
  }
}
```

### Step 3: CORS Configuration

Ensure your Spring Boot backend allows CORS from the frontend:

```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:5173")
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
```

### Step 4: Test the Integration

1. Start your Spring Boot backend on port 8080
2. Start the frontend: `npm run dev`
3. Open http://localhost:5173
4. Try searching, filtering, and logging in

## Data Model Notes

The frontend uses a normalized data model via `normalizeFileRecord()` function. This function handles various backend field naming conventions:

- `filename` or `fileName` → `filename`
- `uploadedAt` or `uploaded_at` → `uploadedAt`
- `uploadedBy` or `uploaded_by` → `uploadedBy`
- `fileSize` or `file_size` → `fileSize`
- `metadataText` or `metadata_text` → `metadataText`
- `downloadUrl` or `download_url` → `downloadUrl`

This makes the frontend resilient to different backend naming conventions.

## Category Constants

The frontend uses these category constants (defined in `src/models/fileModels.js`):

- `DOCUMENT`
- `IMAGE`
- `VIDEO`
- `AUDIO`
- `ARCHIVE`
- `CODE`
- `OTHER`

Ensure your backend uses the same category values.

## Authentication Flow

1. User clicks "Login" button
2. Modal opens with email/password form
3. Frontend sends POST to `/api/auth/login`
4. Backend returns JWT token and user object
5. Frontend stores token in localStorage (if remember-me checked)
6. Frontend includes token in Authorization header for subsequent requests
7. On app reload, frontend calls `/api/auth/me` to validate token

## Troubleshooting

### Network Errors
- Check that backend is running on the configured URL
- Verify CORS is properly configured
- Check browser console for detailed error messages

### Authentication Issues
- Verify JWT token is being sent in Authorization header
- Check token expiration on backend
- Ensure `/api/auth/me` endpoint validates tokens correctly

### Search Not Working
- Verify search endpoint returns data in expected format
- Check query parameters are being parsed correctly
- Use browser Network tab to inspect requests/responses

## Reverting to Mock API

To switch back to mock data, update `.env`:

```env
VITE_API_MODE=mock
```

Or simply delete the `.env` file (mock is the default).
