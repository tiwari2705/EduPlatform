import { getCurrentUser } from "@/lib/auth"
import { CourseService } from "@/lib/services/courseService"
import { ProgressService } from "@/lib/services/progressService"
import { CourseCard } from "@/components/course-card"
import { ProgressBar } from "@/components/progress-bar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Award, Clock, TrendingUp, Plus } from "lucide-react"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  const [enrolledCourses, userProgress] = await Promise.all([
    CourseService.getEnrolledCourses(user.id),
    ProgressService.getProgressByUser(user.id),
  ])

  const totalProgress =
    userProgress.length > 0 ? userProgress.reduce((acc, p) => acc + p.progress, 0) / userProgress.length : 0

  const totalCompletedLessons = userProgress.reduce((acc, p) => acc + p.completedLessons.length, 0)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}!</h1>
        <p className="text-gray-600">Continue your learning journey</p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{enrolledCourses.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Lessons</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCompletedLessons}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Study Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {enrolledCourses.reduce(
                (acc, course) =>
                  acc + course.lessons.reduce((lessonAcc, lesson) => lessonAcc + (lesson.duration || 0), 0),
                0,
              )}
              min
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(totalProgress)}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Teacher Quick Actions */}
      {user.role === "teacher" && (
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Teacher Actions</CardTitle>
              <CardDescription>Manage your courses and content</CardDescription>
            </CardHeader>
            <CardContent className="flex gap-4">
              <Link href="/teacher">
                <Button>
                  <BookOpen className="h-4 w-4 mr-2" />
                  My Courses
                </Button>
              </Link>
              <Link href="/admin">
                <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Course
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Continue Learning */}
      {userProgress.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Continue Learning</h2>
          <div className="space-y-4">
            {userProgress.map((progressItem) => {
              const course = enrolledCourses.find((c) => c._id?.toString() === progressItem.courseId.toString())
              if (!course) return null

              return (
                <Card key={course._id?.toString()}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>{course.title}</CardTitle>
                        <CardDescription>By {course.teacherName}</CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{Math.round(progressItem.progress)}% Complete</div>
                        <div className="text-xs text-gray-500">
                          {progressItem.completedLessons.length} of {course.lessons.length} lessons
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ProgressBar progress={progressItem.progress} />
                    <div className="mt-4">
                      <Link href={`/courses/${course._id}`}>
                        <Button>Continue Learning</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* My Courses */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">My Courses</h2>
          <Link href="/courses">
            <Button variant="outline">Browse More Courses</Button>
          </Link>
        </div>

        {enrolledCourses.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.map((course) => (
              <CourseCard key={course._id?.toString()} course={course} isEnrolled={true} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No courses enrolled yet</h3>
              <p className="text-gray-600 mb-4">Start your learning journey by enrolling in a course</p>
              <Link href="/courses">
                <Button>Browse Courses</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
