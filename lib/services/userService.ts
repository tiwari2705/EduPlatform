import clientPromise from "@/lib/mongodb"
import type { User } from "@/types"
import { ObjectId } from "mongodb"
import bcrypt from "bcryptjs"

export class UserService {
  private static async getCollection() {
    const client = await clientPromise
    return client.db("education_platform").collection<User>("users")
  }

  static async createUser(userData: Omit<User, "_id" | "createdAt" | "updatedAt">): Promise<User> {
    const collection = await this.getCollection()

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 12)

    const user: Omit<User, "_id"> = {
      ...userData,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await collection.insertOne(user)
    return { ...user, _id: result.insertedId }
  }

  static async findUserByEmail(email: string): Promise<User | null> {
    const collection = await this.getCollection()
    return await collection.findOne({ email })
  }

  static async findUserById(id: string): Promise<User | null> {
    const collection = await this.getCollection()
    return await collection.findOne({ _id: new ObjectId(id) })
  }

  static async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    const collection = await this.getCollection()

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...updates,
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" },
    )

    return result
  }

  static async enrollInCourse(userId: string, courseId: string): Promise<boolean> {
    const collection = await this.getCollection()

    const result = await collection.updateOne(
      { _id: new ObjectId(userId) },
      {
        $addToSet: { enrolledCourses: new ObjectId(courseId) },
        $set: { updatedAt: new Date() },
      },
    )

    return result.modifiedCount > 0
  }

  static async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword)
  }

  static async getAllUsers(): Promise<User[]> {
    const collection = await this.getCollection()
    return await collection.find({}).toArray()
  }
}
