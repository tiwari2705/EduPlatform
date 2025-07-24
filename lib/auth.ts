"use server"

import { UserService } from "@/lib/services/userService"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import type { UserSession } from "@/types"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function login(email: string, password: string) {
  try {
    const user = await UserService.findUserByEmail(email)

    if (!user) {
      return { success: false, error: "User not found" }
    }

    const isValidPassword = await UserService.verifyPassword(password, user.password)

    if (!isValidPassword) {
      return { success: false, error: "Invalid password" }
    }

    // Create JWT token
    const token = jwt.sign({ userId: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "7d" })

    const cookieStore = await cookies()
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    })

    return {
      success: true,
      user: {
        id: user._id?.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    }
  } catch (error) {
    console.error("Login error:", error)
    return { success: false, error: "Login failed" }
  }
}

export async function register(name: string, email: string, password: string, role: "student" | "teacher") {
  try {
    // Check if user already exists
    const existingUser = await UserService.findUserByEmail(email)
    if (existingUser) {
      return { success: false, error: "User already exists" }
    }

    // Create new user
    const newUser = await UserService.createUser({
      name,
      email,
      password,
      role,
      enrolledCourses: [],
    })

    // Create JWT token
    const token = jwt.sign({ userId: newUser._id, email: newUser.email, role: newUser.role }, JWT_SECRET, {
      expiresIn: "7d",
    })

    const cookieStore = await cookies()
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
    })

    return {
      success: true,
      user: {
        id: newUser._id?.toString(),
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    }
  } catch (error) {
    console.error("Registration error:", error)
    return { success: false, error: "Registration failed" }
  }
}

export async function getCurrentUser(): Promise<UserSession | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")

    if (!token) {
      return null
    }

    const decoded = jwt.verify(token.value, JWT_SECRET) as any
    const user = await UserService.findUserById(decoded.userId)

    if (!user) {
      return null
    }

    return {
      id: user._id?.toString() || "",
      name: user.name,
      email: user.email,
      role: user.role,
      enrolledCourses: user.enrolledCourses?.map((id) => id.toString()) || [],
    }
  } catch (error) {
    console.error("Get current user error:", error)
    return null
  }
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete("token")
}
