# Quick Reference Guide - Migrated API Endpoints

## Base URL
```
http://localhost:3000/api
```

---

## Students Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/students` | List all students (pagination, filters) |
| GET | `/students/metrics` | Get student statistics |
| GET | `/students/:id` | Get student by ID |
| GET | `/students/:id/profile-completion` | Get profile completion percentage |
| POST | `/students` | Create new student |
| PUT | `/students/:id` | Update student |
| DELETE | `/students/:id` | Delete student |
| DELETE | `/students/delete/dummy` | Delete all dummy students |

**Query Parameters for GET /students**:
- `page` (default: 1)
- `limit` (default: 10)
- `search` - Search in name, email, student_id
- `status` - Filter by status (active/inactive)
- `risk_level` - Filter by risk level
- `sort` - Sort field (first_name, last_name, email, created_at, student_id)
- `order` - Sort order (asc, desc)

---

## Universities Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/universities` | List all universities (with country info) |
| GET | `/universities/metrics` | Get university statistics |
| GET | `/universities/export/data` | Export all universities |
| GET | `/universities/:id` | Get university by ID |
| POST | `/universities` | Create university |
| POST | `/universities/import` | Bulk import universities |
| PUT | `/universities/:id` | Update university |
| DELETE | `/universities/:id` | Delete university |

---

## Applications Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/applications` | List all applications |
| GET | `/applications/metrics` | Get application statistics |
| GET | `/applications/:id` | Get application by ID |
| POST | `/applications` | Create application |
| PUT | `/applications/:id` | Update application |
| DELETE | `/applications/:id` | Delete application |

---

## Countries Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/countries` | List all countries |
| GET | `/countries/metrics` | Get country statistics |
| GET | `/countries/export/data` | Export all countries |
| GET | `/countries/:id` | Get country by ID |
| POST | `/countries` | Create country |
| POST | `/countries/import` | Bulk import countries |
| PUT | `/countries/:id` | Update country |
| DELETE | `/countries/:id` | Delete country |

---

## Status Tracking Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/status-tracking/all` | Get all status tracking (filtered) |
| GET | `/status-tracking/student/:studentId` | Get status history for student |
| POST | `/status-tracking/update` | Update student status |

---

## Documents Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/documents/:studentDbId` | Get documents for student |
| POST | `/documents` | Upload document |
| PUT | `/documents/:id` | Update document |
| DELETE | `/documents/:id` | Delete document |

---

## Services Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/services/:studentDbId` | Get services for student |
| POST | `/services` | Assign service to student |
| PUT | `/services/:id` | Update service |
| DELETE | `/services/:id` | Delete service |

---

## Payments Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/payments/:studentDbId` | Get payments for student |
| GET | `/payments/:studentDbId/summary` | Get payment summary |
| POST | `/payments` | Create payment |
| PUT | `/payments/:id` | Update payment |
| DELETE | `/payments/:id` | Delete payment |

---

## Notes Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/notes/:studentDbId` | Get notes for student |
| POST | `/notes` | Create note |
| PUT | `/notes/:id` | Update note |
| PUT | `/notes/:id/pin` | Toggle pin status |
| DELETE | `/notes/:id` | Delete note |

---

## Common Request Body Examples

### Create Student
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "dateOfBirth": "2000-01-15",
  "countryCode": "US",
  "phoneNumber": "+1234567890",
  "nationality": "American",
  "currentCountry": "USA",
  "primaryDestination": "Canada",
  "intendedIntake": "Fall 2025",
  "currentStage": "profile-creation",
  "assignedCounselor": "Jane Smith",
  "riskLevel": "low",
  "leadSource": "online",
  "campaign": "summer-2025",
  "countryPreferences": ["Canada", "USA"],
  "notes": "Top performer",
  "accountStatus": true
}
```

### Create Application
```json
{
  "studentDbId": 1,
  "universityName": "University of Toronto",
  "country": "Canada",
  "intake": "Fall 2025",
  "status": "in-progress",
  "counselor": "Jane Smith",
  "submissionDate": "2025-05-15",
  "decisionDate": null,
  "notes": "Waiting for decision"
}
```

### Create Payment
```json
{
  "student_db_id": 1,
  "payment_id": "PAY20250216001",
  "invoice_number": "INV-2025-001",
  "description": "Application fee - University of Toronto",
  "amount": 250.00,
  "currency": "CAD",
  "status": "pending",
  "payment_method": "credit_card",
  "due_date": "2025-03-01",
  "paid_date": null,
  "created_by": "admin",
  "notes": "Payment pending"
}
```

---

## Error Responses

### 404 Not Found
```json
{
  "error": "Student not found"
}
```

### 400 Bad Request
```json
{
  "error": "Input must be an array"
}
```

### 500 Server Error
```json
{
  "error": "Server error"
}
```

---

## Environment Variables Required

```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_DATABASE=student_marketplace
PORT=3000
NODE_ENV=development
```

---

## Development Commands

```bash
# Start development server with auto-reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Run tests
npm test
```

---

**Last Updated**: February 16, 2026
