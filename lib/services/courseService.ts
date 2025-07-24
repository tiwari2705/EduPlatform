import clientPromise from "@/lib/mongodb"
import type { Course, Lesson } from "@/types"
import { ObjectId } from "mongodb"

export class CourseService {
  private static async getCollection() {
    const client = await clientPromise
    return client.db("education_platform").collection<Course>("courses")
  }

  static async createCourse(courseData: Omit<Course, "_id" | "createdAt" | "updatedAt">): Promise<Course> {
    const collection = await this.getCollection()

    const course: Omit<Course, "_id"> = {
      ...courseData,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await collection.insertOne(course)
    return { ...course, _id: result.insertedId }
  }

  static async getAllCourses(): Promise<Course[]> {
    const collection = await this.getCollection()
    // Get all courses regardless of who created them
    const courses = await collection.find({}).sort({ createdAt: -1 }).toArray()

    // Get teacher names for all courses
    const client = await clientPromise
    const usersCollection = client.db("education_platform").collection("users")

    const coursesWithTeachers = await Promise.all(
      courses.map(async (course) => {
        const teacher = await usersCollection.findOne({ _id: course.teacherId })
        return {
          ...course,
          teacherName: teacher?.name || "Unknown Teacher",
        }
      }),
    )

    return coursesWithTeachers
  }

  static async getCourseById(id: string): Promise<Course | null> {
    const collection = await this.getCollection()
    const course = await collection.findOne({ _id: new ObjectId(id) })

    if (!course) return null

    // Get teacher name
    const client = await clientPromise
    const usersCollection = client.db("education_platform").collection("users")
    const teacher = await usersCollection.findOne({ _id: course.teacherId })

    return {
      ...course,
      teacherName: teacher?.name || "Unknown Teacher",
    }
  }

  static async getCoursesByTeacher(teacherId: string): Promise<Course[]> {
    const collection = await this.getCollection()
    const courses = await collection.find({ teacherId: new ObjectId(teacherId) }).toArray()

    // Get teacher name
    const client = await clientPromise
    const usersCollection = client.db("education_platform").collection("users")
    const teacher = await usersCollection.findOne({ _id: new ObjectId(teacherId) })

    return courses.map((course) => ({
      ...course,
      teacherName: teacher?.name || "Unknown Teacher",
    }))
  }

  static async enrollStudent(courseId: string, studentId: string): Promise<boolean> {
    const collection = await this.getCollection()

    const result = await collection.updateOne(
      { _id: new ObjectId(courseId) },
      {
        $addToSet: { enrolledStudents: new ObjectId(studentId) },
        $set: { updatedAt: new Date() },
      },
    )

    return result.modifiedCount > 0
  }

  static async addLesson(courseId: string, lesson: Omit<Lesson, "_id">): Promise<boolean> {
    const collection = await this.getCollection()

    const lessonWithId = {
      ...lesson,
      _id: new ObjectId(),
    }

    const result = await collection.updateOne(
      { _id: new ObjectId(courseId) },
      {
        $push: { lessons: lessonWithId },
        $set: { updatedAt: new Date() },
      },
    )

    return result.modifiedCount > 0
  }

  static async searchCourses(query: string, category?: string): Promise<Course[]> {
    const collection = await this.getCollection()

    const filter: any = {}

    if (query) {
      filter.$or = [{ title: { $regex: query, $options: "i" } }, { description: { $regex: query, $options: "i" } }]
    }

    if (category && category !== "all") {
      filter.category = category
    }

    const courses = await collection.find(filter).toArray()

    // Get teacher names
    const client = await clientPromise
    const usersCollection = client.db("education_platform").collection("users")

    const coursesWithTeachers = await Promise.all(
      courses.map(async (course) => {
        const teacher = await usersCollection.findOne({ _id: course.teacherId })
        return {
          ...course,
          teacherName: teacher?.name || "Unknown Teacher",
        }
      }),
    )

    return coursesWithTeachers
  }

  static async getEnrolledCourses(userId: string): Promise<Course[]> {
    const client = await clientPromise
    const usersCollection = client.db("education_platform").collection("users")
    const coursesCollection = client.db("education_platform").collection<Course>("courses")

    const user = await usersCollection.findOne({ _id: new ObjectId(userId) })
    if (!user || !user.enrolledCourses) return []

    const courses = await coursesCollection
      .find({
        _id: { $in: user.enrolledCourses },
      })
      .toArray()

    // Get teacher names
    const coursesWithTeachers = await Promise.all(
      courses.map(async (course) => {
        const teacher = await usersCollection.findOne({ _id: course.teacherId })
        return {
          ...course,
          teacherName: teacher?.name || "Unknown Teacher",
        }
      }),
    )

    return coursesWithTeachers
  }
}
