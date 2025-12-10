# API Reference

## Base URL
```
http://localhost:3000/api
```

## Authentication
All authenticated endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <token>
```

## Endpoints Overview

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/logout` - Logout user

### Categories
- `GET /categories` - Get all user categories
- `POST /categories` - Create new category
- `GET /categories/:id` - Get category details
- `PUT /categories/:id` - Update category
- `DELETE /categories/:id` - Delete category
- `GET /categories/:id/children` - Get child categories (with pagination)

### Notes
- `GET /notes/category/:categoryId` - Get notes for category
- `POST /notes` - Create new note
- `PUT /notes/:id` - Update note
- `DELETE /notes/:id` - Delete note

### Comparison Views
- `GET /comparison` - Get comparison data for multiple categories
- `GET /comparison/tree/:ids` - Get tree visualization data
- `GET /comparison/tunnel/:ids` - Get tunnel visualization data

### Metrics & Analytics
- `GET /metrics/category/:categoryId` - Get category metrics
- `GET /metrics/report` - Generate analytics report

### Export & Import
- `POST /export/csv` - Export data as CSV
- `POST /export/excel` - Export data as Excel
- `POST /import` - Import data from file

### Collaboration
- `POST /collaboration/invite` - Send friend invitation
- `GET /collaboration/friends` - Get friend list
- `GET /collaboration/friends/:id/categories` - Get friend's shared categories
- `POST /collaboration/share` - Share category with friend

### Backups
- `GET /backups` - Get backup history
- `POST /backups` - Trigger manual backup
- `GET /backups/:id/restore` - Restore from backup

### Versions
- `GET /versions/:categoryId` - Get version history for category
- `POST /versions/:id/restore` - Restore to specific version

---

## Detailed Endpoints

### Authentication

#### POST /auth/register
Register a new user account.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  },
  "token": "jwt_token"
}
```

#### POST /auth/login
Login user and get authentication token.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  },
  "token": "jwt_token"
}
```

---

### Categories

#### GET /categories
Get all user's categories.

**Query Parameters:**
- `depth` (optional): Max nesting depth to return (default: 10)
- `sort` (optional): Sort by 'created_at', 'modified_at', 'name' (default: 'name')

**Response:**
```json
{
  "categories": [
    {
      "id": "uuid",
      "name": "Work",
      "description": "Work-related notes",
      "created_at": "2025-01-01T00:00:00Z",
      "modified_at": "2025-01-01T00:00:00Z",
      "manual_size_factor": 1.0,
      "color": "#3498db",
      "children": []
    }
  ]
}
```

#### POST /categories
Create new category.

**Request:**
```json
{
  "name": "New Category",
  "description": "Optional description",
  "parent_id": "uuid or null for root",
  "color": "#3498db"
}
```

**Response:**
```json
{
  "category": {
    "id": "uuid",
    "name": "New Category",
    "description": "Optional description",
    "created_at": "2025-01-01T00:00:00Z"
  }
}
```

#### GET /categories/:id
Get specific category and its direct children.

**Response:**
```json
{
  "category": {
    "id": "uuid",
    "name": "Category Name",
    "parent_id": "parent_uuid or null",
    "created_at": "2025-01-01T00:00:00Z",
    "modified_at": "2025-01-01T00:00:00Z",
    "children": []
  }
}
```

#### PUT /categories/:id
Update category.

**Request:**
```json
{
  "name": "Updated Name",
  "description": "Updated description",
  "manual_size_factor": 1.5,
  "color": "#e74c3c"
}
```

**Response:**
```json
{
  "category": {
    "id": "uuid",
    "name": "Updated Name",
    "modified_at": "2025-01-01T00:00:00Z"
  }
}
```

#### DELETE /categories/:id
Delete category (cascades to child categories and notes).

**Response:**
```json
{
  "success": true,
  "message": "Category deleted"
}
```

#### GET /categories/:id/children
Get child categories with pagination (for lazy loading beyond depth 10).

**Query Parameters:**
- `limit` (optional): Number of results (default: 50, max: 100)
- `offset` (optional): Pagination offset (default: 0)

**Response:**
```json
{
  "children": [
    {
      "id": "uuid",
      "name": "Child Category",
      "parent_id": "parent_uuid"
    }
  ],
  "total": 75,
  "limit": 50,
  "offset": 0
}
```

---

### Notes

#### GET /notes/category/:categoryId
Get all notes in a category.

**Query Parameters:**
- `limit` (optional): Results per page
- `offset` (optional): Pagination offset

**Response:**
```json
{
  "notes": [
    {
      "id": "uuid",
      "category_id": "uuid",
      "title": "Note Title",
      "content": "Note content...",
      "source": "source reference",
      "created_at": "2025-01-01T00:00:00Z"
    }
  ]
}
```

#### POST /notes
Create new note.

**Request:**
```json
{
  "category_id": "uuid",
  "title": "Note Title",
  "content": "Note content",
  "source": "reference source"
}
```

#### PUT /notes/:id
Update note.

**Request:**
```json
{
  "title": "Updated Title",
  "content": "Updated content",
  "source": "Updated source"
}
```

#### DELETE /notes/:id
Delete note.

---

### Comparison Views

#### GET /comparison/tree/:ids
Get tree visualization data for comparison.

**Path Parameters:**
- `ids`: Comma-separated category IDs (max 7)

**Response:**
```json
{
  "comparisons": [
    {
      "id": "uuid",
      "name": "Category",
      "children": [],
      "metrics": {
        "noteCount": 10,
        "size": 0.5
      }
    }
  ]
}
```

#### GET /comparison/tunnel/:ids
Get tunnel (radial perspective) visualization data.

**Path Parameters:**
- `ids`: Comma-separated category IDs (max 7)

**Response:**
```json
{
  "comparisons": [
    {
      "id": "uuid",
      "name": "Category",
      "angle": 0,
      "radius": 100,
      "children": []
    }
  ]
}
```

---

### Metrics

#### GET /metrics/category/:categoryId
Get metrics for a category.

**Response:**
```json
{
  "metrics": {
    "category_id": "uuid",
    "edit_count": 42,
    "content_volume": 15000,
    "last_modified": "2025-01-01T00:00:00Z"
  }
}
```

#### GET /metrics/report
Generate comprehensive analytics report.

**Query Parameters:**
- `format` (optional): 'json' or 'csv' (default: 'json')
- `period` (optional): 'week', 'month', 'year' (default: 'all')

**Response:**
```json
{
  "report": {
    "generated_at": "2025-01-01T00:00:00Z",
    "period": "all",
    "total_categories": 10,
    "total_notes": 150,
    "most_active_categories": [],
    "growth_trend": []
  }
}
```

---

### Export & Import

#### POST /export/csv
Export all user data as CSV.

**Request Body:** (optional)
```json
{
  "include_notes": true,
  "include_metrics": true
}
```

**Response:**
CSV file download

#### POST /export/excel
Export all user data as Excel workbook.

**Response:**
Excel file download with sheets: Categories, Notes, Metrics

#### POST /import
Import data from exported file.

**Request:** (multipart/form-data)
- `file`: The exported file (CSV or Excel)
- `merge` (optional): Boolean to merge with existing data (default: false)

**Response:**
```json
{
  "success": true,
  "imported": {
    "categories": 10,
    "notes": 150,
    "metrics": 10
  }
}
```

---

### Collaboration

#### POST /collaboration/invite
Send friend invitation.

**Request:**
```json
{
  "email": "friend@example.com"
}
```

**Response:**
```json
{
  "invitation": {
    "id": "uuid",
    "sent_to": "friend@example.com",
    "created_at": "2025-01-01T00:00:00Z"
  }
}
```

#### GET /collaboration/friends
Get list of friends.

**Response:**
```json
{
  "friends": [
    {
      "id": "uuid",
      "username": "friendname",
      "email": "friend@example.com",
      "last_active": "2025-01-01T00:00:00Z"
    }
  ]
}
```

#### POST /collaboration/share
Share a category with a friend.

**Request:**
```json
{
  "category_id": "uuid",
  "friend_id": "uuid",
  "permission_level": "view"
}
```

**Response:**
```json
{
  "share": {
    "id": "uuid",
    "category_id": "uuid",
    "shared_with_id": "uuid",
    "permission_level": "view"
  }
}
```

---

### Backups

#### GET /backups
Get backup history.

**Response:**
```json
{
  "backups": [
    {
      "id": "uuid",
      "backup_date": "2025-01-01T00:00:00Z",
      "file_size": 102400,
      "status": "completed"
    }
  ]
}
```

#### POST /backups
Trigger manual backup.

**Response:**
```json
{
  "backup": {
    "id": "uuid",
    "backup_date": "2025-01-01T00:00:00Z",
    "status": "in_progress"
  }
}
```

#### GET /backups/:id/restore
Restore from specific backup.

**Response:**
```json
{
  "success": true,
  "message": "Restoration in progress",
  "backup_id": "uuid"
}
```

---

### Versions

#### GET /versions/:categoryId
Get version history for a category.

**Response:**
```json
{
  "versions": [
    {
      "id": "uuid",
      "version_number": 1,
      "created_at": "2025-01-01T00:00:00Z",
      "created_by": "uuid"
    }
  ]
}
```

#### POST /versions/:id/restore
Restore category to specific version.

**Response:**
```json
{
  "success": true,
  "restored_version": 1,
  "category_id": "uuid"
}
```

---

## Error Responses

All error responses follow this format:

```json
{
  "error": "Error description",
  "status": 400,
  "timestamp": "2025-01-01T00:00:00Z"
}
```

### HTTP Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized (missing or invalid token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `409`: Conflict (e.g., duplicate entry)
- `500`: Internal Server Error

---

## Rate Limiting

Default rate limits (can be configured):
- 100 requests per minute for authenticated endpoints
- 10 requests per minute for public endpoints

---

## Pagination

Large result sets use pagination:

**Query Parameters:**
- `limit`: Number of results (default: 50, max: 100)
- `offset`: Starting position (default: 0)

**Response:**
```json
{
  "data": [],
  "pagination": {
    "total": 100,
    "limit": 50,
    "offset": 0
  }
}
```

---

## Implementation Status

- [ ] Authentication endpoints
- [ ] Category CRUD endpoints
- [ ] Hierarchical lazy-loading
- [ ] Note management
- [ ] Comparison view data aggregation
- [ ] Metrics calculation
- [ ] Export functionality
- [ ] Import parser
- [ ] Collaboration endpoints
- [ ] Backup and restore
- [ ] Version history

## Next Steps

1. Implement database migrations
2. Build authentication service
3. Create category management endpoints
4. Implement sizing algorithm calculation
5. Build comparison view data aggregation
