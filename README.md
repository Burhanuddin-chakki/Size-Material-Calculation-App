# 🪟 Window Estimation & Material Calculation App

A comprehensive web application for calculating window materials, estimating costs, and optimizing pipe cutting for aluminum window installations. Built for window fabrication businesses to streamline their estimation process and reduce material waste.

## 📋 Description

This application helps window installation professionals calculate precise material requirements, pricing, and optimal pipe cutting patterns for various window configurations. It supports multiple window types (2-track, 3-track, etc.) and provides detailed breakdowns of all materials needed including pipes, glass, hardware, and labor costs.

### Key Features

- **Window Type Support**: 2-track, 3-track, and custom window configurations
- **Material Calculation**: Automatic calculation of all required materials (pipes, glass, screws, locks, bearings, etc.)
- **Pipe Optimization**: Smart algorithm to minimize waste when cutting pipes to size
- **Dynamic Pricing**: Configurable material rates with type-based pricing (e.g., plastic vs aluminum)
- **Cost Estimation**: Real-time calculation of total project costs including labor
- **Material Database**: Pre-configured material types with customizable rates
- **Responsive Design**: Works on desktop and tablet
- **Data Persistence**: MongoDB backend for storing window types, materials, and pricing

## 🛠️ Built With

### Frontend

- **[Next.js 16](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://react.dev/)** - UI library
- **[TypeScript 5](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[React Hook Form 7](https://react-hook-form.com/)** - Form management
- **[Zod 4](https://zod.dev/)** - Schema validation
- **[Bootstrap 5](https://getbootstrap.com/)** - UI components and styling
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first CSS

### Backend

- **[MongoDB](https://www.mongodb.com/)** - NoSQL database
- **[Mongoose 8](https://mongoosejs.com/)** - MongoDB object modeling
- **[Axios](https://axios-http.com/)** - HTTP client

### Development Tools

- **[ESLint 9](https://eslint.org/)** - Code linting
- **[Prettier 3](https://prettier.io/)** - Code formatting
- **[tsx](https://github.com/privatenumber/tsx)** - TypeScript execution

## 🎯 Use Cases

- **Window Fabricators**: Calculate exact material requirements for customer projects
- **Construction Estimators**: Generate accurate quotes for window installation jobs
- **Hardware Suppliers**: Help customers determine material quantities
- **DIY Enthusiasts**: Plan material purchases for home window projects

## 📦 Prerequisites

- **Node.js v18+** ([Download](https://nodejs.org/))
- **MongoDB Community Edition** ([Download](https://www.mongodb.com/try/download/community))
- **npm** (comes with Node.js) or **yarn**

## Quick Setup (5 minutes)

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Start MongoDB** (in a separate terminal):

   ```bash
   mongod
   ```

3. **Run database migration:**

   ```bash
   npm run db:seed
   ```

4. **Start the application:**

   ```bash
   npm run dev
   ```

5. **Open browser:** http://localhost:3000

✅ That's it! The app is ready to use.

## 📖 Detailed Setup

For detailed installation instructions, troubleshooting, and configuration options, see [SETUP.md](./SETUP.md)

## 📁 Project Structure

```
├── app/                          # Next.js App Router
│   ├── (ui)/                     # UI routes
│   │   ├── [id]/                 # Dynamic route for window estimation
│   │   ├── components/           # Reusable components
│   │   └── services/             # Business logic and calculations
│   ├── api/                      # API utilities
│   ├── common/                   # Shared interfaces and types
│   └── layout.tsx                # Root layout
├── database/                     # Database connection
├── models/                       # MongoDB schemas
│   ├── material.model.ts         # Material schema
│   ├── pipe-type.model.ts        # Pipe type schema
│   └── window.model.ts           # Window type schema
├── scripts/                      # Utility scripts
│   └── seed-database.ts          # Database seeding script
└── public/                       # Static assets
```

## 🎨 Features in Detail

### Material Management

- Pre-configured materials with rates
- Material types with variants (e.g., Plastic 9ft, Aluminum 10ft)
- Dynamic pricing based on material selection
- Unit-based calculations (per piece, per kg, per sqft, etc.)

### Window Configuration

- Support for multiple track configurations
- Customizable dimensions (height, width)
- Panel/door count configuration
- Optional features (machar jali, grill jali)

### Calculation Engine

- Optimal pipe cutting algorithm
- Waste minimization
- Square footage calculations
- Weight and amount estimations
- Labor cost calculations

### Form Validation

- Real-time form validation with Zod schemas
- Type-safe form handling with React Hook Form
- Error messages and user feedback

## 🚀 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors automatically
npm run format       # Format code with Prettier
npm run db:seed      # Seed database with initial data
```

## 🗄️ Database Collections

The application uses three main MongoDB collections:

1. **Windows**: Window type configurations
2. **Materials**: Material definitions with pricing
3. **PipeTypes**: Pipe color and rate information
4. **Pipe**: Detail for different type of pipes

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file:

```env
MONGODB_URI=mongodb://localhost:27017/window-estimation-db
```

### Customizing Material Rates

Edit `scripts/seed-database.ts` to update default material rates and types before running `npm run db:seed`.

## 📝 What's Included

- ✅ Complete Next.js application with TypeScript
- ✅ MongoDB database schema and models
- ✅ Automated migration script with sample data
- ✅ Pre-configured material rates and window types
- ✅ Responsive UI with Bootstrap components
- ✅ Form validation and error handling
- ✅ Pipe optimization algorithms
- ✅ Code linting and formatting setup
- ✅ Step-by-step setup documentation

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📄 License

This project is private and proprietary.

## 👤 Author

Built for window fabrication businesses.

## 🆘 Need Help?

Refer to [SETUP.md](./SETUP.md) for:

- Troubleshooting common issues
- Environment configuration
- Updating seed data
- Production deployment

## 🔮 Future Enhancements

- PDF export for estimates
- Invoice generation
- Historical estimation tracking
- Advanced reporting and analytics
