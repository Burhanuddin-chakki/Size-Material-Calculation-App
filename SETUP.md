# Window Estimation App - Setup Guide

## Prerequisites

Before setting up the application, ensure you have the following installed:

1. **Node.js** (v18 or higher)
   - Download from [nodejs.org](https://nodejs.org/)
   - Verify installation: `node --version`

2. **MongoDB** (Community Edition)
   - Download from [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
   - Verify installation: `mongod --version`

## Installation Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Install tsx (TypeScript execution tool)

```bash
npm install -D tsx
```

### 3. Start MongoDB

Make sure MongoDB is running on your local machine:

**Windows:**

```bash
mongod
```

**macOS/Linux:**

```bash
sudo mongod
```

Or if installed via Homebrew (macOS):

```bash
brew services start mongodb-community
```

By default, MongoDB runs on `mongodb://localhost:27017`

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory (optional):

```env
MONGODB_URI=mongodb://localhost:27017/window-estimation-db
```

If you don't create this file, the app will use the default connection string.

### 5. Run Database Migration

This will create all collections and populate them with initial data:

```bash
npm run db:seed
```

You should see output like:

```
Connecting to MongoDB...
Connected to MongoDB successfully

Clearing existing data...
Existing data cleared

Inserting Window types...
✓ Inserted 2 window types

Inserting Pipe types...
✓ Inserted 3 pipe types

Inserting Materials...
✓ Inserted 20 materials

✅ Database seeded successfully!
```

### 6. Start the Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Verify Installation

1. Open your browser and navigate to `http://localhost:3000`
2. You should see the window estimation interface
3. Try creating a new estimation to verify the database is working

## MongoDB Collections Created

The migration script creates three collections:

1. **windows** - Window types (2-track, 3-track, etc.)
2. **pipetypes** - Pipe colors and rates
3. **materials** - All materials used in estimations

## Troubleshooting

### MongoDB Connection Error

If you see connection errors:

- Verify MongoDB is running: `mongosh` (should connect successfully)
- Check if port 27017 is available
- Ensure no firewall is blocking the connection

### Migration Script Fails

If the seed script fails:

- Make sure MongoDB is running before running `npm run db:seed`
- Check if you have write permissions
- Try running with different MongoDB URI in `.env.local`

### Missing Dependencies

If you get module not found errors:

```bash
npm install
npm install -D tsx
```

## Updating Seed Data

To update the initial data:

1. Edit `scripts/seed-database.ts`
2. Modify the data arrays (`windowData`, `pipeTypeData`, `materialData`)
3. Run the migration again: `npm run db:seed`

**Note:** Re-running the seed script will clear existing data and insert fresh data.

## Production Deployment

For production, update the `MONGODB_URI` environment variable to point to your production MongoDB instance (e.g., MongoDB Atlas):

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/window-estimation-db
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier
- `npm run db:seed` - Run database migration/seeding

## Support

For issues or questions, contact the development team.
