# Database Utility Scripts

This directory contains utility scripts for managing the database.

## Available Scripts

### 1. Health Check
Verify that the API is running and responding correctly.

```bash
npm run health
```

**What it does:**
- Tests `/api/health` endpoint
- Fetches student, country, and university data
- Retrieves metrics
- Validates API connectivity

### 2. Seed Data
Populate the database with sample data for testing.

```bash
npm run db:seed
```

**What it seeds:**
- 4 sample countries (Canada, USA, UK, Australia)
- 2 sample students with different profiles
- Sample data for testing CRUD operations

### 3. Clear Database
Remove all data from tables while keeping the table structure intact.

```bash
npm run db:clear
```

**⚠️ WARNING:** This will delete ALL data in the following tables:
- student_notes
- payments
- student_services
- documents
- status_history
- applications
- students
- universities
- countries

**Use case:** When you want to reset data but keep table definitions.

### 4. Drop Tables
Completely drop all tables and reset the database schema.

```bash
npm run db:drop
```

**⚠️ WARNING:** This will:
- Delete ALL tables and data
- Remove Knex migration tracking tables
- Require running `npm run dev` to reinitialize tables

**Use case:** Complete database reset and reinitialization.

---

## Typical Workflow

### Fresh Start
```bash
# 1. Initialize tables (happens automatically on server start)
npm run dev

# 2. In another terminal, seed test data
npm run db:seed

# 3. Check if everything is working
npm run health
```

### Reset for Testing
```bash
# 1. Clear all data but keep structure
npm run db:clear

# 2. Reseed with fresh test data
npm run db:seed

# 3. Verify
npm run health
```

### Complete Reset
```bash
# 1. Stop the server (Ctrl+C)

# 2. Drop all tables
npm run db:drop

# 3. Restart server (tables recreate automatically)
npm run dev

# 4. Reseed data
npm run db:seed
```

---

## Script Details

### health-check.ts
- Makes HTTP requests to test endpoints
- Validates JSON response format
- Tests pagination data
- Safe to run anytime (read-only)

### seed-data.ts
- Creates 4 countries with different characteristics
- Creates 2 test students
- Uses ON CONFLICT to prevent duplicates
- Generates unique student IDs

### clear-db.ts
- Truncates tables with CASCADE
- Resets identity sequences
- Preserves table schema
- Logs each cleared table

### drop-tables.ts
- Drops tables in dependency order
- Safe (uses DROP TABLE IF EXISTS)
- Handles foreign key constraints

---

## Requirements

- Database must be running and accessible
- Environment variables configured (.env file)
- Server can be running or stopped (except for health check)

## Example .env
```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_DATABASE=student_marketplace
```

---

## Troubleshooting

**"Connection refused"**
- Ensure PostgreSQL is running
- Check DB_HOST and DB_PORT in .env
- Verify database name exists

**"Table does not exist"**
- Run `npm run dev` to initialize tables
- Tables are auto-created on server start

**"Permission denied"**
- Check database user permissions
- Ensure user can create/drop tables

---

## Adding New Scripts

To add a new utility script:

1. Create TypeScript file in `src/scripts/`
2. Import DB and logger
3. Add npm script to `package.json`
4. Document in this README
