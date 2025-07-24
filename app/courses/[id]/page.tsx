"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ProgressBar } from "@/components/progress-bar"
import { CourseService } from "@/lib/services/courseService"
import { UserService } from "@/lib/services/userService"
import { ProgressService } from "@/lib/services/progressService"
import { getCurrentUser } from "@/lib/auth"
import type { Course, UserSession, Progress } from "@/types"
import { Play, FileText, CheckCircle, Clock, Users } from "lucide-react"

export default function CoursePage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.id as string

  const [course, setCourse] = useState<Course | null>(null)
  const [user, setUser] = useState<UserSession | null>(null)
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [progress, setProgress] = useState<Progress | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [courseId])

  const fetchData = async () => {
    try {
      const [courseData, userData] = await Promise.all([CourseService.getCourseById(courseId), getCurrentUser()])

      setCourse(courseData)
      setUser(userData)

      if (userData && courseData) {
        const enrolled = userData.enrolledCourses?.includes(courseId) || false
        setIsEnrolled(enrolled)

        if (enrolled) {
          const progressData = await ProgressService.getProgressByUserAndCourse(userData.id, courseId)
          setProgress(progressData)
        }
      }
    } catch (error) {
      console.error("Error fetching course data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleEnroll = async () => {
    if (!user) {
      router.push("/login")
      return
    }

    try {
      await Promise.all([CourseService.enrollStudent(courseId, user.id), UserService.enrollInCourse(user.id, courseId)])

      setIsEnrolled(true)
      // Refresh user data
      const updatedUser = await getCurrentUser()
      setUser(updatedUser)
    } catch (error) {
      console.error("Error enrolling in course:", error)
    }
  }

  const toggleLessonComplete = async (lessonId: string) => {
    if (!user || !course) return

    try {
      await ProgressService.toggleLessonComplete(user.id, courseId, lessonId, course.lessons.length)

      // Refresh progress
      const updatedProgress = await ProgressService.getProgressByUserAndCourse(user.id, courseId)
      setProgress(updatedProgress)
    } catch (error) {
      console.error("Error updating lesson progress:", error)
    }
  }

  const isLessonCompleted = (lessonId: string) => {
    return progress?.completedLessons.some((id) => id.toString() === lessonId) || false
  }

  if (loading) {
    return <div className="text-center py-12">Loading course...</div>
  }

  if (!course) {
    return <div className="text-center py-12">Course not found</div>
  }

  const progressPercentage = progress?.progress || 0

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="mb-6">
            <Image
              src={course.thumbnail || "/placeholder.svg?height=400&width=600&text=Course"}
              alt={course.title}
              width={800}
              height={400}
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Badge>{course.category}</Badge>
            </div>
            <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
            <p className="text-gray-600 mb-4">{course.description}</p>

            <div className="flex items-center gap-6 text-sm text-gray-500 mb-6">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {course.enrolledStudents.length} students
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {course.lessons.reduce((acc, lesson) => acc + (lesson.duration || 0), 0)} minutes
              </div>
            </div>

            <p className="text-sm text-gray-600">Instructor: {course.teacherName}</p>
          </div>

          {/* Course Content */}
          {isEnrolled && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold">Course Content</h2>
                <div className="text-sm text-gray-600">
                  {progress?.completedLessons.length || 0} of {course.lessons.length} lessons completed
                </div>
              </div>

              <ProgressBar progress={progressPercentage} className="mb-6" />

              <div className="space-y-4">
                {course.lessons.map((lesson) => {
                  const isCompleted = isLessonCompleted(lesson._id?.toString() || "")

                  return (
                    <Card key={lesson._id?.toString()} className={isCompleted ? "bg-green-50 border-green-200" : ""}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {lesson.type === "video" ? (
                              <Play className="h-5 w-5 text-blue-600" />
                            ) : (
                              <FileText className="h-5 w-5 text-gray-600" />
                            )}
                            <div>
                              <CardTitle className="text-lg">{lesson.title}</CardTitle>
                              <CardDescription>{lesson.content}</CardDescription>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {lesson.duration && <span className="text-sm text-gray-500">{lesson.duration}min</span>}
                            <Button
                              variant={isCompleted ? "default" : "outline"}
                              size="sm"
                              onClick={() => toggleLessonComplete(lesson._id?.toString() || "")}
                            >
                              {isCompleted ? (
                                <>
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Completed
                                </>
                              ) : (
                                "Mark Complete"
                              )}
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Course Access</CardTitle>
            </CardHeader>
            <CardContent>
              {!isEnrolled ? (
                <Button onClick={handleEnroll} className="w-full" size="lg">
                  Enroll Now
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 mb-1">{Math.round(progressPercentage)}%</div>
                    <div className="text-sm text-gray-600">Complete</div>
                  </div>
                  <ProgressBar progress={progressPercentage} />
                  <div className="text-sm text-gray-600 text-center">
                    {progress?.completedLessons.length || 0} of {course.lessons.length} lessons completed
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
