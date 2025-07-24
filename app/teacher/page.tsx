"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { CourseService } from "@/lib/services/courseService"
import { TeacherCourseForm } from "@/components/teacher-course-form"
import { CourseCard } from "@/components/course-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Course, UserSession } from "@/types"
import { BookOpen, Users, TrendingUp, Plus } from "lucide-react"
import Link from "next/link"

export default function TeacherPage() {
  const [user, setUser] = useState<UserSession | null>(null)
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkUserAndFetchData()
  }, [])

  const checkUserAndFetchData = async () => {
    try {
      const userData = await getCurrentUser()

      if (!userData || userData.role !== "teacher") {
        router.push("/dashboard")
        return
      }

      setUser(userData)
      await fetchCourses(userData.id)
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCourses = async (teacherId: string) => {
    try {
      const coursesData = await CourseService.getCoursesByTeacher(teacherId)
      setCourses(coursesData)
    } catch (error) {
      console.error("Error fetching courses:", error)
    }
  }

  const handleCourseCreated = () => {
    if (user) {
      fetchCourses(user.id)
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  if (!user || user.role !== "teacher") {
    return <div className="text-center py-12">Access denied</div>
  }

  const totalStudents = courses.reduce((acc, course) => acc + course.enrolledStudents.length, 0)
  const totalLessons = courses.reduce((acc, course) => acc + course.lessons.length, 0)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Teacher Dashboard</h1>
        <p className="text-gray-600">Create and manage your courses</p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{courses.length}</div>
            <p className="text-xs text-muted-foreground">Courses you've created</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
            <p className="text-xs text-muted-foreground">Students enrolled in your courses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Lessons</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLessons}</div>
            <p className="text-xs text-muted-foreground">Lessons across all courses</p>
          </CardContent>
        </Card>
      </div>

      {/* Course Creation */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">My Courses</h2>
          <Link href="/admin">
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Advanced Management
            </Button>
          </Link>
        </div>

        {courses.length === 0 ? (
          <TeacherCourseForm teacherId={user.id} onCourseCreated={handleCourseCreated} />
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {courses.map((course) => (
                <CourseCard key={course._id?.toString()} course={course} showEnrollButton={false} />
              ))}
            </div>

            <Card className="border-dashed border-2 border-gray-300">
              <CardContent className="flex items-center justify-center py-8">
                <Button onClick={() => router.push("/admin")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Another Course
                </Button>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Manage your teaching activities</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <Link href="/admin">
            <Button className="w-full bg-transparent" variant="outline">
              <BookOpen className="h-4 w-4 mr-2" />
              Manage All Courses
            </Button>
          </Link>
          <Link href="/courses">
            <Button className="w-full bg-transparent" variant="outline">
              <Users className="h-4 w-4 mr-2" />
              View Student Perspective
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
