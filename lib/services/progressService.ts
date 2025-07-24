import clientPromise from "@/lib/mongodb"
import type { Progress } from "@/types"
import { ObjectId } from "mongodb"

export class ProgressService {
  private static async getCollection() {
    const client = await clientPromise
    return client.db("education_platform").collection<Progress>("progress")
  }

  static async createProgress(progressData: Omit<Progress, "_id" | "createdAt" | "updatedAt">): Promise<Progress> {
    const collection = await this.getCollection()

    const progress: Omit<Progress, "_id"> = {
      ...progressData,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await collection.insertOne(progress)
    return { ...progress, _id: result.insertedId }
  }

  static async getProgressByUserAndCourse(userId: string, courseId: string): Promise<Progress | null> {
    const collection = await this.getCollection()
    return await collection.findOne({
      userId: new ObjectId(userId),
      courseId: new ObjectId(courseId),
    })
  }

  static async getProgressByUser(userId: string): Promise<Progress[]> {
    const collection = await this.getCollection()
    return await collection.find({ userId: new ObjectId(userId) }).toArray()
  }

  static async updateProgress(
    userId: string,
    courseId: string,
    completedLessons: string[],
    progress: number,
  ): Promise<boolean> {
    const collection = await this.getCollection()

    const result = await collection.updateOne(
      {
        userId: new ObjectId(userId),
        courseId: new ObjectId(courseId),
      },
      {
        $set: {
          completedLessons: completedLessons.map((id) => new ObjectId(id)),
          progress,
          lastAccessed: new Date(),
          updatedAt: new Date(),
        },
      },
      { upsert: true },
    )

    return result.acknowledged
  }

  static async toggleLessonComplete(
    userId: string,
    courseId: string,
    lessonId: string,
    totalLessons: number,
  ): Promise<boolean> {
    const collection = await this.getCollection()

    // Get current progress
    const currentProgress = await this.getProgressByUserAndCourse(userId, courseId)

    const completedLessons: ObjectId[] = currentProgress?.completedLessons || []
    const lessonObjectId = new ObjectId(lessonId)

    // Toggle lesson completion
    const lessonIndex = completedLessons.findIndex((id) => id.toString() === lessonId)
    if (lessonIndex > -1) {
      completedLessons.splice(lessonIndex, 1)
    } else {
      completedLessons.push(lessonObjectId)
    }

    // Calculate progress percentage
    const progressPercentage = (completedLessons.length / totalLessons) * 100

    const result = await collection.updateOne(
      {
        userId: new ObjectId(userId),
        courseId: new ObjectId(courseId),
      },
      {
        $set: {
          completedLessons,
          progress: progressPercentage,
          lastAccessed: new Date(),
          updatedAt: new Date(),
        },
      },
      { upsert: true },
    )

    return result.acknowledged
  }
}
