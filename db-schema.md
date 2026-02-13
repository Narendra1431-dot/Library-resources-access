# Database Schema Documentation

## Overview
The Library E-Resources Access Website uses MongoDB with Mongoose for data modeling. Below are the schemas for all collections.

## Collections

### 1. Users
- **Purpose**: Store user information, roles, and limits.
- **Schema**:
  - `name`: String (required)
  - `email`: String (required, unique)
  - `password`: String (required, hashed)
  - `role`: String (enum: 'student', 'faculty', 'admin', default: 'student')
  - `department`: String
  - `downloadLimit`: Number (default: 10)
  - `downloadsThisMonth`: Number (default: 0)
  - `bookmarks`: Array of ObjectIds (ref: 'Resource')
  - `readingStreak`: Number (default: 0)
  - `achievements`: Array of Strings
  - `createdAt`: Date (default: now)
  - `updatedAt`: Date (default: now)

### 2. Resources
- **Purpose**: Store information about e-books, journals, etc.
- **Schema**:
  - `title`: String (required)
  - `author`: String (required)
  - `subject`: String
  - `isbn`: String
  - `publicationYear`: Number
  - `impactFactor`: Number
  - `isOpenAccess`: Boolean (default: false)
  - `isPeerReviewed`: Boolean (default: true)
  - `department`: String
  - `accessType`: String (enum: 'free', 'subscription', default: 'free')
  - `downloadLimit`: Number (default: 100)
  - `downloads`: Number (default: 0)
  - `fileUrl`: String
  - `description`: String
  - `tags`: Array of Strings
  - `createdAt`: Date (default: now)
  - `updatedAt`: Date (default: now)

### 3. Downloads
- **Purpose**: Track downloads with expiry and watermarking.
- **Schema**:
  - `userId`: ObjectId (ref: 'User', required)
  - `resourceId`: ObjectId (ref: 'Resource', required)
  - `downloadedAt`: Date (default: now)
  - `expiryDate`: Date
  - `watermark`: String

### 4. Notes
- **Purpose**: Store user notes and highlights on resources.
- **Schema**:
  - `userId`: ObjectId (ref: 'User', required)
  - `resourceId`: ObjectId (ref: 'Resource', required)
  - `pageNumber`: Number
  - `highlightText`: String
  - `noteText`: String
  - `createdAt`: Date (default: now)
  - `updatedAt`: Date (default: now)

### 5. Recommendations
- **Purpose**: Store AI-generated recommendations.
- **Schema**:
  - `userId`: ObjectId (ref: 'User', required)
  - `resourceId`: ObjectId (ref: 'Resource', required)
  - `recommendationType`: String (enum: 'personal', 'department', 'trending', 'faculty', default: 'personal')
  - `score`: Number (default: 0)
  - `reason`: String
  - `createdAt`: Date (default: now)

### 6. Submissions
- **Purpose**: Handle student research contributions.
- **Schema**:
  - `userId`: ObjectId (ref: 'User', required)
  - `title`: String (required)
  - `type`: String (enum: 'paper', 'project', 'blog', required)
  - `description`: String
  - `fileUrl`: String
  - `status`: String (enum: 'pending', 'approved', 'rejected', default: 'pending')
  - `reviewedBy`: ObjectId (ref: 'User')
  - `reviewComments`: String
  - `submittedAt`: Date (default: now)
  - `reviewedAt`: Date

### 7. AnalyticsLogs
- **Purpose**: Log user actions for analytics.
- **Schema**:
  - `userId`: ObjectId (ref: 'User')
  - `action`: String (required, e.g., 'download', 'search', 'view')
  - `resourceId`: ObjectId (ref: 'Resource')
  - `searchQuery`: String
  - `department`: String
  - `timestamp`: Date (default: now)
  - `ipAddress`: String
  - `userAgent`: String

## Relationships
- Users can have many Downloads, Notes, Recommendations, Submissions.
- Resources can have many Downloads, Notes, Recommendations.
- AnalyticsLogs reference Users and Resources.
