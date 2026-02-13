# API Routes Documentation

## Authentication Routes

### POST /api/auth/register
Register a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student",
  "department": "Computer Science"
}
```

**Response:**
```json
{
  "message": "User registered successfully"
}
```

### POST /api/auth/login
Authenticate user and return JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "name": "John Doe",
    "role": "student"
  }
}
```

### GET /api/auth/profile
Get authenticated user's profile.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "_id": "user-id",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "student",
  "department": "Computer Science",
  "downloadLimit": 10,
  "downloadsThisMonth": 3,
  "bookmarks": [],
  "readingStreak": 5,
  "achievements": ["First Download"]
}
```

## Resource Routes

### GET /api/resources
Get all resources with optional filters.

**Query Parameters:**
- `search`: Search term for title/author/subject
- `department`: Filter by department
- `year`: Filter by publication year
- `accessType`: Filter by access type (free/subscription)
- `sortBy`: Sort by (relevance/downloads/latest)

**Response:**
```json
[
  {
    "_id": "resource-id",
    "title": "Introduction to Machine Learning",
    "author": "Andrew Ng",
    "subject": "Computer Science",
    "publicationYear": 2020,
    "accessType": "free",
    "downloads": 45,
    "description": "A comprehensive guide..."
  }
]
```

### GET /api/resources/:id
Get a specific resource by ID.

**Response:**
```json
{
  "_id": "resource-id",
  "title": "Introduction to Machine Learning",
  "author": "Andrew Ng",
  "isbn": "978-0-262-03384-8",
  "publicationYear": 2020,
  "impactFactor": 4.5,
  "isOpenAccess": true,
  "isPeerReviewed": true,
  "department": "Computer Science",
  "accessType": "free",
  "downloads": 45,
  "description": "A comprehensive guide...",
  "tags": ["machine learning", "AI"]
}
```

### POST /api/resources/:id/download
Record a download for a resource.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "message": "Download recorded",
  "download": {
    "_id": "download-id",
    "userId": "user-id",
    "resourceId": "resource-id",
    "downloadedAt": "2023-12-01T10:00:00.000Z",
    "watermark": "user-id"
  }
}
```

### POST /api/resources/:id/notes
Add a note to a resource.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request Body:**
```json
{
  "pageNumber": 15,
  "highlightText": "Machine learning is a subset of AI",
  "noteText": "Important distinction between ML and AI"
}
```

**Response:**
```json
{
  "_id": "note-id",
  "userId": "user-id",
  "resourceId": "resource-id",
  "pageNumber": 15,
  "highlightText": "Machine learning is a subset of AI",
  "noteText": "Important distinction between ML and AI",
  "createdAt": "2023-12-02T14:30:00.000Z"
}
```

### GET /api/resources/:id/notes
Get all notes for a resource (user-specific).

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
[
  {
    "_id": "note-id",
    "pageNumber": 15,
    "highlightText": "Machine learning is a subset of AI",
    "noteText": "Important distinction between ML and AI",
    "createdAt": "2023-12-02T14:30:00.000Z"
  }
]
```

### GET /api/resources/recommendations/:type
Get recommendations by type.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Types:** personal, department, trending, faculty

**Response:**
```json
[
  {
    "_id": "recommendation-id",
    "resourceId": {
      "_id": "resource-id",
      "title": "Data Structures and Algorithms",
      "author": "Thomas Cormen"
    },
    "recommendationType": "personal",
    "score": 0.85,
    "reason": "Based on your interest in algorithms"
  }
]
```

### POST /api/resources (Admin only)
Add a new resource.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request Body:**
```json
{
  "title": "New Research Paper",
  "author": "Dr. Smith",
  "subject": "Computer Science",
  "publicationYear": 2023,
  "accessType": "free",
  "description": "Description of the paper"
}
```

### PUT /api/resources/:id (Admin only)
Update a resource.

### DELETE /api/resources/:id (Admin only)
Delete a resource.

## Analytics Routes (Admin only)

### GET /api/analytics/total-resources
Get total number of resources.

**Response:**
```json
{
  "totalResources": 150
}
```

### GET /api/analytics/total-downloads
Get total number of downloads.

**Response:**
```json
{
  "totalDownloads": 1250
}
```

### GET /api/analytics/department-usage
Get download statistics by department.

**Response:**
```json
[
  {
    "_id": "Computer Science",
    "count": 450
  },
  {
    "_id": "Engineering",
    "count": 320
  }
]
```

### GET /api/analytics/most-accessed
Get most accessed resources.

**Response:**
```json
[
  {
    "_id": "resource-id",
    "title": "Introduction to Machine Learning",
    "author": "Andrew Ng",
    "downloads": 78
  }
]
```

### GET /api/analytics/peak-usage
Get peak usage hours.

**Response:**
```json
[
  {
    "_id": 14,
    "count": 85
  },
  {
    "_id": 10,
    "count": 72
  }
]
```

### GET /api/analytics/category-distribution
Get resource distribution by department.

**Response:**
```json
[
  {
    "_id": "Computer Science",
    "count": 75
  },
  {
    "_id": "Business",
    "count": 45
  }
]
```

## Submission Routes

### POST /api/submissions
Submit a research contribution.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request Body:**
```json
{
  "title": "AI in Healthcare",
  "type": "paper",
  "description": "Research on AI applications in healthcare"
}
```

**Response:**
```json
{
  "_id": "submission-id",
  "title": "AI in Healthcare",
  "type": "paper",
  "status": "pending",
  "submittedAt": "2023-12-03T09:00:00.000Z"
}
```

### GET /api/submissions/my
Get user's submissions.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
[
  {
    "_id": "submission-id",
    "title": "AI in Healthcare",
    "type": "paper",
    "status": "pending",
    "submittedAt": "2023-12-03T09:00:00.000Z"
  }
]
```

### GET /api/submissions (Admin only)
Get all submissions.

**Response:**
```json
[
  {
    "_id": "submission-id",
    "userId": {
      "_id": "user-id",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "title": "AI in Healthcare",
    "type": "paper",
    "status": "pending",
    "submittedAt": "2023-12-03T09:00:00.000Z"
  }
]
```

### PUT /api/submissions/:id/review (Admin only)
Review a submission.

**Request Body:**
```json
{
  "status": "approved",
  "reviewComments": "Excellent research work!"
}
```

**Response:**
```json
{
  "_id": "submission-id",
  "status": "approved",
  "reviewComments": "Excellent research work!",
  "reviewedAt": "2023-12-04T10:00:00.000Z"
}
```

## Error Responses

All endpoints may return error responses in the following format:

```json
{
  "error": "Error message description"
}
```

Common HTTP status codes:
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error
