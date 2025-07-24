import type { Course, User, Progress } from "@/types"

export const mockUsers: User[] = [
  {
    id: "1",
    name: "John Student",
    email: "student@example.com",
    role: "student",
    enrolledCourses: ["1", "2"],
  },
  {
    id: "2",
    name: "Jane Teacher",
    email: "teacher@example.com",
    role: "teacher",
  },
  {
    id: "3",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
  },
]

export const mockCourses: Course[] = [
  {
    id: "1",
    title: "Introduction to React",
    description: "Learn the fundamentals of React including components, props, state, and hooks.",
    thumbnail: "/placeholder.svg?height=200&width=300&text=React+Course",
    category: "Programming",
    teacherId: "2",
    teacherName: "Jane Teacher",
    enrolledStudents: ["1"],
    lessons: [
      {
        id: "1-1",
        title: "What is React?",
        type: "video",
        content: "Introduction to React framework and its benefits.",
        duration: 15,
      },
      {
        id: "1-2",
        title: "Components and JSX",
        type: "reading",
        content: "Understanding React components and JSX syntax.",
      },
      {
        id: "1-3",
        title: "Props and State",
        type: "video",
        content: "Learn about props and state management in React.",
        duration: 20,
      },
    ],
  },
  {
    id: "2",
    title: "JavaScript Fundamentals",
    description: "Master the core concepts of JavaScript programming language.",
    thumbnail: "/placeholder.svg?height=200&width=300&text=JavaScript+Course",
    category: "Programming",
    teacherId: "2",
    teacherName: "Jane Teacher",
    enrolledStudents: ["1"],
    lessons: [
      {
        id: "2-1",
        title: "Variables and Data Types",
        type: "reading",
        content: "Understanding JavaScript variables and data types.",
      },
      {
        id: "2-2",
        title: "Functions and Scope",
        type: "video",
        content: "Learn about JavaScript functions and scope.",
        duration: 25,
      },
    ],
  },
  {
    id: "3",
    title: "Web Design Basics",
    description: "Learn the principles of good web design and user experience.",
    thumbnail: "/placeholder.svg?height=200&width=300&text=Web+Design+Course",
    category: "Design",
    teacherId: "2",
    teacherName: "Jane Teacher",
    enrolledStudents: [],
    lessons: [
      {
        id: "3-1",
        title: "Design Principles",
        type: "reading",
        content: "Understanding basic design principles.",
      },
    ],
  },
]

export const mockProgress: Progress[] = [
  {
    userId: "1",
    courseId: "1",
    completedLessons: ["1-1", "1-2"],
    progress: 67,
  },
  {
    userId: "1",
    courseId: "2",
    completedLessons: ["2-1"],
    progress: 50,
  },
]
