# Quiz Builder API Contract

## Overview

This document defines the API contract for the Quiz Builder application backend. The contract is based on the current frontend implementation and defines all necessary endpoints, request/response schemas, and interaction patterns.

## Base URL
```
https://api.quizbuilder.com/v1
```

## Authentication
Currently, no authentication is implemented in the frontend. Future authentication will use JWT tokens in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## Data Models

### Question
```typescript
interface Question {
  id: number;
  title: string;
  content: string;
  category: string;
  type: string;
  answers?: string[]; // For ABCD type questions (A, B, C, D)
  answer?: string;    // For other question types
  createdAt: string;  // ISO 8601 date string
  updatedAt: string;  // ISO 8601 date string
}
```

### Category
```typescript
interface Category {
  key: string;
  label: string;
}
```

### Question Type
```typescript
interface QuestionType {
  key: string;
  label: string;
}
```

### Error Response
```typescript
interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: any;
  }
}
```

## API Endpoints

### Questions

#### 1. Get All Questions
**GET** `/questions`

**Query Parameters:**
- `search` (optional): string - Search term for title/content
- `category` (optional): string - Filter by category ("all" for no filter)
- `type` (optional): string - Filter by question type ("all" for no filter)
- `page` (optional): number - Page number (default: 1)
- `limit` (optional): number - Items per page (default: 50)

**Response:**
```typescript
interface QuestionsResponse {
  data: Question[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  }
}
```

**Example Request:**
```
GET /questions?search=capital&category=Geografija&type=all&page=1&limit=20
```

**Example Response:**
```json
{
  "data": [
    {
      "id": 1,
      "title": "What is the capital of France?",
      "content": "Choose the correct answer.",
      "category": "Geografija",
      "type": "ABCD type",
      "answers": ["Paris", "London", "Berlin", "Madrid"],
      "createdAt": "2025-10-02T10:00:00Z",
      "updatedAt": "2025-10-02T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1,
    "totalPages": 1
  }
}
```

#### 2. Get Single Question
**GET** `/questions/{id}`

**Path Parameters:**
- `id`: number - Question ID

**Response:**
```typescript
interface QuestionResponse {
  data: Question;
}
```

**Example Response:**
```json
{
  "data": {
    "id": 1,
    "title": "What is the capital of France?",
    "content": "Choose the correct answer.",
    "category": "Geografija",
    "type": "ABCD type",
    "answers": ["Paris", "London", "Berlin", "Madrid"],
    "createdAt": "2025-10-02T10:00:00Z",
    "updatedAt": "2025-10-02T10:00:00Z"
  }
}
```

**Error Responses:**
- `404 Not Found` - Question not found

#### 3. Create Question
**POST** `/questions`

**Request Body:**
```typescript
interface CreateQuestionRequest {
  title: string;
  content: string;
  category: string;
  type: string;
  answers?: string[]; // Required if type === 'ABCD type'
  answer?: string;    // Required if type !== 'ABCD type'
}
```

**Validation Rules:**
- `title`: Required, non-empty string, max 500 characters
- `content`: Required, non-empty string, max 2000 characters
- `category`: Required, must be valid category key
- `type`: Required, must be valid question type key
- For ABCD type: `answers` required, must be array of exactly 4 non-empty strings
- For other types: `answer` required, non-empty string

**Response:**
```typescript
interface QuestionResponse {
  data: Question;
}
```

**Example Request:**
```json
{
  "title": "What is the capital of France?",
  "content": "Choose the correct answer.",
  "category": "Geografija",
  "type": "ABCD type",
  "answers": ["Paris", "London", "Berlin", "Madrid"]
}
```

**Example Response:**
```json
{
  "data": {
    "id": 1,
    "title": "What is the capital of France?",
    "content": "Choose the correct answer.",
    "category": "Geografija",
    "type": "ABCD type",
    "answers": ["Paris", "London", "Berlin", "Madrid"],
    "createdAt": "2025-10-02T10:00:00Z",
    "updatedAt": "2025-10-02T10:00:00Z"
  }
}
```

**Error Responses:**
- `400 Bad Request` - Validation errors
- `422 Unprocessable Entity` - Invalid category or type

#### 4. Update Question
**PUT** `/questions/{id}`

**Path Parameters:**
- `id`: number - Question ID

**Request Body:** Same as Create Question

**Response:** Same as Create Question

**Error Responses:**
- `404 Not Found` - Question not found
- `400 Bad Request` - Validation errors
- `422 Unprocessable Entity` - Invalid category or type

#### 5. Delete Question
**DELETE** `/questions/{id}`

**Path Parameters:**
- `id`: number - Question ID

**Response:**
```typescript
interface DeleteResponse {
  success: true;
  message: string;
}
```

**Example Response:**
```json
{
  "success": true,
  "message": "Question deleted successfully"
}
```

**Error Responses:**
- `404 Not Found` - Question not found

### Categories

#### 6. Get All Categories
**GET** `/categories`

**Response:**
```typescript
interface CategoriesResponse {
  data: Category[];
}
```

**Example Response:**
```json
{
  "data": [
    { "key": "Povijest", "label": "Povijest" },
    { "key": "Geografija", "label": "Geografija" },
    { "key": "Matematika", "label": "Matematika" },
    { "key": "Priroda", "label": "Priroda" },
    { "key": "Sport", "label": "Sport" },
    { "key": "Zabava", "label": "Zabava" },
    { "key": "Umjetnost", "label": "Umjetnost" },
    { "key": "Glazba", "label": "Glazba" },
    { "key": "Znanost", "label": "Znanost" },
    { "key": "Tehnologija", "label": "Tehnologija" },
    { "key": "Literatura", "label": "Literatura" },
    { "key": "Film", "label": "Film" }
  ]
}
```

### Question Types

#### 7. Get All Question Types
**GET** `/question-types`

**Response:**
```typescript
interface QuestionTypesResponse {
  data: QuestionType[];
}
```

**Example Response:**
```json
{
  "data": [
    { "key": "ABCD type", "label": "ABCD type" },
    { "key": "asocijacija", "label": "asocijacija" },
    { "key": "slikovna", "label": "slikovna" },
    { "key": "pitanje otvorenog odgovora", "label": "pitanje otvorenog odgovora" }
  ]
}
```

## Error Handling

### HTTP Status Codes
- `200 OK` - Success
- `201 Created` - Resource created
- `400 Bad Request` - Invalid request data
- `404 Not Found` - Resource not found
- `422 Unprocessable Entity` - Validation failed
- `500 Internal Server Error` - Server error

### Error Response Format
All errors follow the same format:
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "One or more validation errors occurred",
    "details": {
      "title": ["Title is required"],
      "answers": ["Exactly 4 answers required for ABCD type"]
    }
  }
}
```

### Common Error Codes
- `VALIDATION_ERROR` - Input validation failed
- `NOT_FOUND` - Resource not found
- `INVALID_CATEGORY` - Category doesn't exist
- `INVALID_QUESTION_TYPE` - Question type doesn't exist
- `DUPLICATE_RESOURCE` - Resource already exists
- `SERVER_ERROR` - Internal server error

## Frontend Integration Notes

### State Management
The frontend currently uses local state. Backend integration will require:
1. Replacing local state with API calls
2. Implementing loading states
3. Error handling for API failures
4. Optimistic updates for better UX

### Search and Filtering
- Search is performed on `title` and `content` fields (case-insensitive)
- Filtering supports multiple categories and types
- Pagination is implemented for large datasets

### Form Validation
Frontend validation should mirror backend validation rules to provide immediate feedback.

## Future Considerations

### Authentication
When authentication is added:
- Add user ownership to questions
- Implement role-based access (admin, editor, viewer)
- Add audit logs for question changes

### Advanced Features
- Bulk operations (create/update multiple questions)
- Question statistics and analytics
- Export/import functionality
- Question versioning

### Performance
- Implement caching for categories and question types
- Add database indexes for search and filtering
- Consider pagination limits and rate limiting

## Version History

- **v1.0** - Initial API contract based on current frontend functionality
  - Basic CRUD operations for questions
  - Category and question type management
  - Search and filtering capabilities
  - Comprehensive validation rules</content>
<parameter name="filePath">API_CONTRACT.md