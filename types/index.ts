import type { ObjectId } from "mongodb"

export interface User {
  _id?: ObjectId
  name: string
  email: string
  password: string
  role: "student" | "teacher" | "admin"
  enrolledCourses: ObjectId[]
  createdAt: Date
  updatedAt: Date
}

export interface Course {
  _id?: ObjectId
  title: string
  description: string
  thumbnail: string
  category: string
  teacherId: ObjectId
  teacherName?: string
  lessons: Lesson[]
  enrolledStudents: ObjectId[]
  createdAt: Date
  updatedAt: Date
}

export interface Lesson {
  _id?: ObjectId
  title: string
  type: "video" | "reading" | "quiz"
  content: string
  duration?: number
  order: number
}

export interface Progress {
  _id?: ObjectId
  userId: ObjectId
  courseId: ObjectId
  completedLessons: ObjectId[]
  progress: number
  lastAccessed: Date
  createdAt: Date
  updatedAt: Date
}

export interface UserSession {
  id: string
  name: string
  email: string
  role: "student" | "teacher" | "admin"
  enrolledCourses?: string[]
}
