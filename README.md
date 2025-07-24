# Education Platform - MERN Stack

A comprehensive education platform built with Next.js, MongoDB, and TypeScript.

## Features

- **User Authentication**: JWT-based authentication with role-based access control
- **Course Management**: Create, edit, and manage courses with lessons
- **Progress Tracking**: Track student progress through courses and lessons
- **Admin Dashboard**: Teacher and admin panels for content management
- **Responsive Design**: Mobile-friendly interface using Tailwind CSS and shadcn/ui
- **Search & Filter**: Course discovery with search and category filtering
- **Real-time Updates**: Dynamic content updates and progress tracking

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Backend**: Next.js API Routes, Server Actions
- **Database**: MongoDB with native MongoDB driver
- **Authentication**: JWT tokens with bcryptjs
- **UI Components**: shadcn/ui, Tailwind CSS
- **Icons**: Lucide React

## Prerequisites

- Node.js 18+ 
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

## Installation

1. **Clone the repository**
\`\`\`bash
git clone <repository-url>
cd education-platform
\`\`\`

2. **Install dependencies**
\`\`\`bash
npm install
\`\`\`

3. **Set up environment variables**
Create a `.env.local` file in the root directory:
\`\`\`env
MONGODB_URI=mongodb://localhost:27017/education_platform
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
\`\`\`

4. **Start MongoDB**
Make sure MongoDB is running on your system.

5. **Seed the database (optional)**
\`\`\`bash
node scripts/seed.js
\`\`\`

6. **Run the development server**
\`\`\`bash
npm run dev
\`\`\`

7. **Open your browser**
Navigate to `http://localhost:3000`

## Demo Accounts

After seeding the database, you can use these demo accounts:

- **Student**: student@example.com / password123
- **Teacher**: teacher@example.com / password123  
- **Admin**: admin@example.com / password123

## Project Structure

\`\`\`
education-platform/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin dashboard
│   ├── courses/           # Course pages
│   ├── dashboard/         # User dashboard
│   ├── login/             # Authentication pages
│   └── register/
├── components/            # React components
│   ├── auth/             # Authentication components
│   ├── ui/               # shadcn/ui components
│   └── ...
├── lib/                  # Utility libraries
│   ├── services/         # Database services
│   ├── auth.ts           # Authentication logic
│   ├── mongodb.ts        # Database connection
│   └── utils.ts          # Utility functions
├── types/                # TypeScript type definitions
└── scripts/              # Database scripts
\`\`\`

## API Endpoints

The application uses Next.js Server Actions for backend functionality:

- **Authentication**: Login, register, logout
- **Courses**: CRUD operations for courses
- **Users**: User management and enrollment
- **Progress**: Track lesson completion and progress

## Features Overview

### For Students
- Browse and search courses
- Enroll in courses
- Track learning progress
- Complete lessons and mark progress
- View personal dashboard with statistics

### For Teachers
- Create and manage courses
- Add lessons to courses
- View student enrollment statistics
- Upload course materials
- Track student progress

### For Admins
- Full access to all courses
- User management capabilities
- Platform-wide statistics
- Content moderation tools

## Database Schema

### Users Collection
\`\`\`javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String (hashed),
  role: "student" | "teacher" | "admin",
  enrolledCourses: [ObjectId],
  createdAt: Date,
  updatedAt: Date
}
\`\`\`

### Courses Collection
\`\`\`javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  thumbnail: String,
  category: String,
  teacherId: ObjectId,
  lessons: [{
    _id: ObjectId,
    title: String,
    type: "video" | "reading" | "quiz",
    content: String,
    duration: Number,
    order: Number
  }],
  enrolledStudents: [ObjectId],
  createdAt: Date,
  updatedAt: Date
}
\`\`\`

### Progress Collection
\`\`\`javascript
{
  _id: ObjectId,
  userId: ObjectId,
  courseId: ObjectId,
  completedLessons: [ObjectId],
  progress: Number,
  lastAccessed: Date,
  createdAt: Date,
  updatedAt: Date
}
\`\`\`

## Deployment

### Vercel Deployment
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### MongoDB Atlas Setup
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URI` in your environment variables

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email support@eduplatform.com or create an issue in the repository.
