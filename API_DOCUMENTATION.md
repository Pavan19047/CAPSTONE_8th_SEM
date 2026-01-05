# 📡 API Documentation

## Base URL
```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

## Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

## 🔐 **Authentication Endpoints**

### Register User
**POST** `/auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "role": "employee"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "6547a9b2c1234567890abcde",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "employee",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Validation Rules:**
- `name`: Required, 2-50 characters
- `email`: Required, valid email format, unique
- `password`: Required, min 6 characters
- `role`: Optional, enum ['employee', 'agent', 'admin'], defaults to 'employee'

---

### Login
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "6547a9b2c1234567890abcde",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "employee",
    "isActive": true
  }
}
```

**Errors:**
- `400`: Missing email or password
- `401`: Invalid credentials
- `403`: Account deactivated

---

### Get Current User
**GET** `/auth/me`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "_id": "6547a9b2c1234567890abcde",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "employee",
    "department": "IT",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### Update User Details
**PUT** `/auth/updatedetails`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "John Smith",
  "email": "johnsmith@example.com",
  "department": "Engineering"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "_id": "6547a9b2c1234567890abcde",
    "name": "John Smith",
    "email": "johnsmith@example.com",
    "department": "Engineering",
    "role": "employee"
  }
}
```

---

### Update Password
**PUT** `/auth/updatepassword`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "currentPassword": "OldPass123!",
  "newPassword": "NewSecurePass456!"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Password updated successfully"
}
```

**Errors:**
- `401`: Current password incorrect
- `400`: New password too weak

---

## 🎫 **Ticket Endpoints**

### Create Ticket
**POST** `/tickets`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "Cannot access VPN",
  "description": "I'm getting connection timeout when trying to connect to company VPN from home. This started happening this morning.",
  "category": "VPN Issue",
  "priority": "high"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "_id": "6547b1c2d1234567890fghij",
    "ticketNumber": "TKT-000001",
    "title": "Cannot access VPN",
    "description": "I'm getting connection timeout...",
    "category": "VPN Issue",
    "priority": "high",
    "status": "open",
    "assignedTeam": "Network Team",
    "createdBy": {
      "_id": "6547a9b2c1234567890abcde",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "timeline": [
      {
        "action": "created",
        "user": "6547a9b2c1234567890abcde",
        "timestamp": "2024-01-15T14:20:00.000Z",
        "details": "Ticket created"
      }
    ],
    "comments": [],
    "createdAt": "2024-01-15T14:20:00.000Z",
    "updatedAt": "2024-01-15T14:20:00.000Z"
  }
}
```

**Validation:**
- `title`: Required, 5-200 characters
- `description`: Required, 20-2000 characters
- `category`: Optional (auto-detected if omitted)
- `priority`: Optional (auto-detected if omitted)

**Business Logic:**
- Ticket number auto-generated
- NLP classifies category/priority if not provided
- Auto-assigns to team based on category
- Email sent to user confirming creation
- Timeline entry created

---

### Get All Tickets
**GET** `/tickets`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `status` (optional): Filter by status (open, in-progress, resolved, closed)
- `category` (optional): Filter by category
- `priority` (optional): Filter by priority
- `assignedTo` (optional): Filter by assigned agent ID
- `createdBy` (optional): Filter by creator ID
- `search` (optional): Search in title/description
- `page` (optional): Page number (default: 1)
- `limit` (optional): Results per page (default: 10)

**Example:** `/tickets?status=open&priority=high&page=1&limit=20`

**Response:** `200 OK`
```json
{
  "success": true,
  "count": 15,
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 15
  },
  "data": [
    {
      "_id": "6547b1c2d1234567890fghij",
      "ticketNumber": "TKT-000001",
      "title": "Cannot access VPN",
      "status": "open",
      "priority": "high",
      "category": "VPN Issue",
      "createdBy": {
        "_id": "6547a9b2c1234567890abcde",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "assignedTo": null,
      "createdAt": "2024-01-15T14:20:00.000Z"
    }
    // ... more tickets
  ]
}
```

**Access Control:**
- **Employee**: Only own tickets
- **Agent/Admin**: All tickets

---

### Get My Tickets
**GET** `/tickets/mytickets`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:** Same as Get All Tickets

**Response:** Same format as Get All Tickets (filtered to current user)

---

### Get Single Ticket
**GET** `/tickets/:id`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "_id": "6547b1c2d1234567890fghij",
    "ticketNumber": "TKT-000001",
    "title": "Cannot access VPN",
    "description": "I'm getting connection timeout...",
    "category": "VPN Issue",
    "priority": "high",
    "status": "in-progress",
    "assignedTeam": "Network Team",
    "createdBy": {
      "_id": "6547a9b2c1234567890abcde",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "assignedTo": {
      "_id": "6547c3d4e1234567890klmno",
      "name": "Agent Smith",
      "email": "agent@example.com"
    },
    "timeline": [
      {
        "action": "created",
        "user": {
          "name": "John Doe"
        },
        "timestamp": "2024-01-15T14:20:00.000Z",
        "details": "Ticket created"
      },
      {
        "action": "assigned",
        "user": {
          "name": "Agent Smith"
        },
        "timestamp": "2024-01-15T14:25:00.000Z",
        "details": "Assigned to Agent Smith"
      },
      {
        "action": "status_changed",
        "user": {
          "name": "Agent Smith"
        },
        "timestamp": "2024-01-15T14:30:00.000Z",
        "details": "Status changed from open to in-progress"
      }
    ],
    "comments": [
      {
        "_id": "6547d5e6f1234567890pqrst",
        "user": {
          "_id": "6547c3d4e1234567890klmno",
          "name": "Agent Smith"
        },
        "text": "Checking VPN server logs now.",
        "createdAt": "2024-01-15T14:35:00.000Z"
      }
    ],
    "createdAt": "2024-01-15T14:20:00.000Z",
    "updatedAt": "2024-01-15T14:35:00.000Z"
  }
}
```

**Access Control:**
- **Employee**: Only own tickets
- **Agent/Admin**: All tickets

---

### Update Ticket Status
**PUT** `/tickets/:id/status`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "status": "in-progress",
  "notes": "Working on this now"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "_id": "6547b1c2d1234567890fghij",
    "ticketNumber": "TKT-000001",
    "status": "in-progress",
    "timeline": [
      // ... previous entries
      {
        "action": "status_changed",
        "user": "6547c3d4e1234567890klmno",
        "timestamp": "2024-01-15T15:00:00.000Z",
        "details": "Status changed from open to in-progress - Working on this now"
      }
    ]
  }
}
```

**Valid Transitions:**
- `open` → `in-progress`, `closed`
- `in-progress` → `resolved`, `open`
- `resolved` → `closed`, `open` (reopen)
- `closed` → `open` (reopen)

**Access:** Agent/Admin only

---

### Assign Ticket
**PUT** `/tickets/:id/assign`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "assignedTo": "6547c3d4e1234567890klmno"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "_id": "6547b1c2d1234567890fghij",
    "assignedTo": {
      "_id": "6547c3d4e1234567890klmno",
      "name": "Agent Smith",
      "email": "agent@example.com"
    },
    "timeline": [
      // ... previous entries
      {
        "action": "assigned",
        "user": "6547c3d4e1234567890klmno",
        "timestamp": "2024-01-15T15:10:00.000Z",
        "details": "Assigned to Agent Smith"
      }
    ]
  }
}
```

**Business Logic:**
- Email sent to assigned agent
- Can assign to self or other agents
- Timeline updated

**Access:** Agent/Admin only

---

### Add Comment
**POST** `/tickets/:id/comments`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "text": "Found the issue - firewall blocking VPN traffic. Will fix shortly."
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "_id": "6547b1c2d1234567890fghij",
    "comments": [
      // ... previous comments
      {
        "_id": "6547e7f8g1234567890uvwxy",
        "user": {
          "_id": "6547c3d4e1234567890klmno",
          "name": "Agent Smith"
        },
        "text": "Found the issue - firewall blocking VPN traffic. Will fix shortly.",
        "createdAt": "2024-01-15T15:20:00.000Z"
      }
    ]
  }
}
```

**Validation:**
- `text`: Required, 1-1000 characters

**Access:** All authenticated users

---

### Delete Ticket
**DELETE** `/tickets/:id`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {},
  "message": "Ticket deleted successfully"
}
```

**Access:** Admin only

---

### Get Ticket Statistics
**GET** `/tickets/stats`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "total": 145,
    "open": 23,
    "inProgress": 45,
    "resolved": 65,
    "closed": 12,
    "byCategory": [
      { "_id": "Password Reset", "count": 35 },
      { "_id": "VPN Issue", "count": 28 },
      { "_id": "Software Access", "count": 22 },
      { "_id": "Hardware Issue", "count": 18 },
      { "_id": "Network Issue", "count": 25 },
      { "_id": "Email Issue", "count": 12 },
      { "_id": "Other", "count": 5 }
    ],
    "byPriority": [
      { "_id": "low", "count": 30 },
      { "_id": "medium", "count": 65 },
      { "_id": "high", "count": 40 },
      { "_id": "urgent", "count": 10 }
    ],
    "avgResolutionTime": 4.5
  }
}
```

**Access:** Agent/Admin only

---

## 📚 **Knowledge Base Endpoints**

### Search Knowledge Base
**GET** `/knowledge/search`

**Query Parameters:**
- `q` (required): Search query
- `category` (optional): Filter by category
- `limit` (optional): Max results (default: 5)

**Example:** `/knowledge/search?q=vpn+connection&limit=5`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "_id": "6547f9g0h1234567890zabcd",
      "title": "How to Connect to Company VPN",
      "category": "VPN Issue",
      "keywords": ["vpn", "connection", "remote access", "tunnel"],
      "problem": "Users cannot connect to company VPN from home or remote locations",
      "solution": "Follow these steps to establish VPN connection",
      "steps": [
        "Open VPN client application",
        "Enter your company email",
        "Enter VPN password (not your regular password)",
        "Click Connect",
        "Wait for green checkmark"
      ],
      "views": 234,
      "helpful": 45,
      "notHelpful": 3,
      "relevance": 0.92
    }
    // ... more articles (up to 5)
  ]
}
```

**Search Algorithm:**
- TF-IDF scoring
- Keyword matching
- Title/problem/solution content search
- Sorted by relevance

---

### Get All Articles
**GET** `/knowledge`

**Query Parameters:**
- `category` (optional): Filter by category
- `isPublished` (optional): Filter by published status (default: true)
- `page` (optional): Page number
- `limit` (optional): Results per page

**Response:** `200 OK`
```json
{
  "success": true,
  "count": 25,
  "data": [
    {
      "_id": "6547f9g0h1234567890zabcd",
      "title": "How to Connect to Company VPN",
      "category": "VPN Issue",
      "keywords": ["vpn", "connection", "remote access"],
      "views": 234,
      "helpful": 45,
      "notHelpful": 3,
      "isPublished": true,
      "createdAt": "2024-01-10T09:00:00.000Z"
    }
    // ... more articles
  ]
}
```

---

### Get Single Article
**GET** `/knowledge/:id`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "_id": "6547f9g0h1234567890zabcd",
    "title": "How to Connect to Company VPN",
    "category": "VPN Issue",
    "keywords": ["vpn", "connection", "remote access", "tunnel"],
    "problem": "Users cannot connect to company VPN from home or remote locations",
    "solution": "Follow these steps to establish VPN connection",
    "steps": [
      "Open VPN client application",
      "Enter your company email",
      "Enter VPN password (not your regular password)",
      "Click Connect",
      "Wait for green checkmark"
    ],
    "relatedArticles": [],
    "views": 235,
    "helpful": 45,
    "notHelpful": 3,
    "isPublished": true,
    "createdAt": "2024-01-10T09:00:00.000Z",
    "updatedAt": "2024-01-15T16:00:00.000Z"
  }
}
```

**Side Effect:** Views counter incremented

---

### Create Article
**POST** `/knowledge`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "Resetting Your Active Directory Password",
  "category": "Password Reset",
  "keywords": ["password", "reset", "active directory", "ad", "locked"],
  "problem": "User forgot password or account is locked",
  "solution": "Use the self-service password reset tool",
  "steps": [
    "Go to password.company.com",
    "Click 'Forgot Password'",
    "Enter your employee ID",
    "Answer security questions",
    "Set new password",
    "Log in with new password"
  ],
  "isPublished": true
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "_id": "65480a1b2c1234567890efghi",
    "title": "Resetting Your Active Directory Password",
    "category": "Password Reset",
    "keywords": ["password", "reset", "active directory", "ad", "locked"],
    "problem": "User forgot password or account is locked",
    "solution": "Use the self-service password reset tool",
    "steps": [
      "Go to password.company.com",
      "Click 'Forgot Password'",
      "Enter your employee ID",
      "Answer security questions",
      "Set new password",
      "Log in with new password"
    ],
    "views": 0,
    "helpful": 0,
    "notHelpful": 0,
    "isPublished": true,
    "createdAt": "2024-01-15T16:10:00.000Z"
  }
}
```

**Validation:**
- `title`: Required, 5-200 characters
- `category`: Required
- `keywords`: Required, array of strings
- `problem`: Required, 10-1000 characters
- `solution`: Required, 10-2000 characters
- `steps`: Optional, array of strings

**Access:** Agent/Admin only

---

### Update Article
**PUT** `/knowledge/:id`

**Headers:** `Authorization: Bearer <token>`

**Request Body:** Same as Create Article

**Response:** `200 OK` (same format as Get Single Article)

**Access:** Agent/Admin only

---

### Article Feedback
**POST** `/knowledge/:id/feedback`

**Headers:** `Authorization: Bearer <token>` (optional)

**Request Body:**
```json
{
  "helpful": true
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "_id": "6547f9g0h1234567890zabcd",
    "helpful": 46,
    "notHelpful": 3
  }
}
```

**Business Logic:**
- If `helpful: true`, increment `helpful` counter
- If `helpful: false`, increment `notHelpful` counter
- Used for article quality tracking

---

## 👥 **User Management Endpoints**

### Get All Users
**GET** `/users`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `role` (optional): Filter by role
- `isActive` (optional): Filter by active status
- `page`, `limit`: Pagination

**Response:** `200 OK`
```json
{
  "success": true,
  "count": 42,
  "data": [
    {
      "_id": "6547a9b2c1234567890abcde",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "employee",
      "department": "IT",
      "isActive": true,
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
    // ... more users
  ]
}
```

**Access:** Agent/Admin only

---

### Get Agents
**GET** `/users/agents`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "_id": "6547c3d4e1234567890klmno",
      "name": "Agent Smith",
      "email": "agent@example.com",
      "department": "IT Support"
    },
    {
      "_id": "65481c2d3e1234567890jklmn",
      "name": "Agent Johnson",
      "email": "johnson@example.com",
      "department": "Network Team"
    }
  ]
}
```

**Access:** All authenticated users (for ticket assignment)

---

### Get Single User
**GET** `/users/:id`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "_id": "6547a9b2c1234567890abcde",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "employee",
    "department": "IT",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Access:** Admin only

---

### Update User
**PUT** `/users/:id`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "John Smith",
  "role": "agent",
  "department": "IT Support",
  "isActive": true
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "_id": "6547a9b2c1234567890abcde",
    "name": "John Smith",
    "email": "john@example.com",
    "role": "agent",
    "department": "IT Support",
    "isActive": true
  }
}
```

**Access:** Admin only

---

### Delete User
**DELETE** `/users/:id`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {},
  "message": "User deleted successfully"
}
```

**Access:** Admin only

---

## ⚠️ **Error Responses**

### Error Format
All errors follow this structure:
```json
{
  "success": false,
  "error": "Error message here"
}
```

### HTTP Status Codes

**400 Bad Request**
```json
{
  "success": false,
  "error": "Please provide email and password"
}
```

**401 Unauthorized**
```json
{
  "success": false,
  "error": "Not authorized to access this route"
}
```

**403 Forbidden**
```json
{
  "success": false,
  "error": "User role 'employee' is not authorized to access this route"
}
```

**404 Not Found**
```json
{
  "success": false,
  "error": "Ticket not found with id of 6547b1c2d1234567890fghij"
}
```

**500 Internal Server Error**
```json
{
  "success": false,
  "error": "Server Error"
}
```

### Validation Errors
```json
{
  "success": false,
  "error": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email"
    },
    {
      "field": "password",
      "message": "Password must be at least 6 characters"
    }
  ]
}
```

---

## 📊 **Rate Limiting**

### Current Limits
- **Authentication**: 5 requests per 15 minutes per IP
- **Ticket Creation**: 10 per hour per user
- **All Other**: 100 per 15 minutes per IP

### Rate Limit Headers
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1705330800
```

### Rate Limit Exceeded Response
```json
{
  "success": false,
  "error": "Too many requests, please try again later"
}
```

---

## 🔍 **Pagination**

### Query Parameters
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)

### Response Format
```json
{
  "success": true,
  "count": 25,
  "pagination": {
    "page": 2,
    "limit": 10,
    "total": 145,
    "pages": 15,
    "prev": 1,
    "next": 3
  },
  "data": [ /* ... */ ]
}
```

---

## 🧪 **Testing with cURL**

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@test.com",
    "password": "test123",
    "role": "employee"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "employee@test.com",
    "password": "password123"
  }'
```

### Create Ticket (with token)
```bash
curl -X POST http://localhost:5000/api/tickets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "VPN Connection Issue",
    "description": "Cannot connect to VPN from home office. Getting timeout error."
  }'
```

### Search Knowledge Base
```bash
curl "http://localhost:5000/api/knowledge/search?q=vpn+connection"
```

---

## 📱 **Webhook Events** (Future)

### Event Types
- `ticket.created`
- `ticket.assigned`
- `ticket.status_changed`
- `ticket.comment_added`
- `ticket.resolved`

### Webhook Payload Example
```json
{
  "event": "ticket.created",
  "timestamp": "2024-01-15T16:30:00.000Z",
  "data": {
    "ticketId": "6547b1c2d1234567890fghij",
    "ticketNumber": "TKT-000001",
    "title": "Cannot access VPN",
    "createdBy": {
      "id": "6547a9b2c1234567890abcde",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

---

**API Version:** 1.0.0  
**Last Updated:** January 2024
