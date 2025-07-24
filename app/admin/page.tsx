"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CourseService } from "@/lib/services/courseService"
import { getCurrentUser } from "@/lib/auth"
import type { Course, UserSession, Lesson } from "@/types"
import { Plus, Edit, Upload, BookOpen, Users, TrendingUp } from "lucide-react"
import { ObjectId } from "mongodb"

export default function AdminPage() {
  const [user, setUser] = useState<UserSession | null>(null)
  const [courses, setCourses] = useState<Course[]>([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showLessonForm, setShowLessonForm] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    category: "",
    thumbnail: "",
  })

  const [newLesson, setNewLesson] = useState({
    title: "",
    type: "video" as "video" | "reading" | "quiz",
    content: "",
    duration: 0,
  })

  useEffect(() => {
    checkUserAndFetchData()
  }, [])

  const checkUserAndFetchData = async () => {
    try {
      const userData = await getCurrentUser()

      if (!userData || (userData.role !== "teacher" && userData.role !== "admin")) {
        router.push("/dashboard")
        return
      }

      setUser(userData)

      // Teachers can only see their own courses, admins see all courses
      const coursesData =
        userData.role === "admin"
          ? await CourseService.getAllCourses()
          : await CourseService.getCoursesByTeacher(userData.id)

      setCourses(coursesData)
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    try {
      await CourseService.createCourse({
        title: newCourse.title,
        description: newCourse.description,
        category: newCourse.category,
        thumbnail: newCourse.thumbnail || "/placeholder.svg?height=200&width=300&text=Course",
        teacherId: new ObjectId(user.id),
        lessons: [],
        enrolledStudents: [],
      })

      setShowCreateForm(false)
      setNewCourse({ title: "", description: "", category: "", thumbnail: "" })
      checkUserAndFetchData() // Refresh courses
    } catch (error) {
      console.error("Error creating course:", error)
    }
  }

  const handleAddLesson = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCourse) return

    try {
      const lesson: Omit<Lesson, "_id"> = {
        title: newLesson.title,
        type: newLesson.type,
        content: newLesson.content,
        duration: newLesson.duration || undefined,
        order: selectedCourse.lessons.length + 1,
      }

      await CourseService.addLesson(selectedCourse._id!.toString(), lesson)

      setShowLessonForm(false)
      setSelectedCourse(null)
      setNewLesson({ title: "", type: "video", content: "", duration: 0 })
      checkUserAndFetchData() // Refresh courses
    } catch (error) {
      console.error("Error adding lesson:", error)
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  if (!user || (user.role !== "teacher" && user.role !== "admin")) {
    return <div className="text-center py-12">Access denied</div>
  }

  const totalStudents = courses.reduce((acc, course) => acc + course.enrolledStudents.length, 0)
  const totalLessons = courses.reduce((acc, course) => acc + course.lessons.length, 0)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">{user.role === "admin" ? "Admin Dashboard" : "Teacher Dashboard"}</h1>
          <p className="text-gray-600">
            {user.role === "admin" ? "Manage all courses and users" : "Manage your courses and content"}
          </p>
        </div>
        <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Course
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Course</DialogTitle>
              <DialogDescription>Add a new course to the platform</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateCourse} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Course Title</Label>
                  <Input
                    id="title"
                    value={newCourse.title}
                    onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={newCourse.category}
                    onValueChange={(value) => setNewCourse({ ...newCourse, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Programming">Programming</SelectItem>
                      <SelectItem value="Design">Design</SelectItem>
                      <SelectItem value="Business">Business</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Data Science">Data Science</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newCourse.description}
                  onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                  rows={3}
                  required
                />
              </div>

              <div>
                <Label htmlFor="thumbnail">Thumbnail URL</Label>
                <Input
                  id="thumbnail"
                  value={newCourse.thumbnail}
                  onChange={(e) => setNewCourse({ ...newCourse, thumbnail: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit">Create Course</Button>
                <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{courses.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Lessons</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLessons}</div>
          </CardContent>
        </Card>
      </div>

      {/* Course Management */}
      <Card>
        <CardHeader>
          <CardTitle>Manage Courses</CardTitle>
          <CardDescription>View and edit existing courses</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Lessons</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course._id?.toString()}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{course.title}</div>
                      <div className="text-sm text-gray-500">By {course.teacherName}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{course.category}</Badge>
                  </TableCell>
                  <TableCell>{course.enrolledStudents.length}</TableCell>
                  <TableCell>{course.lessons.length}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedCourse(course)
                          setShowLessonForm(true)
                        }}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Upload className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Lesson Dialog */}
      <Dialog open={showLessonForm} onOpenChange={setShowLessonForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Lesson</DialogTitle>
            <DialogDescription>Add a new lesson to {selectedCourse?.title}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddLesson} className="space-y-4">
            <div>
              <Label htmlFor="lessonTitle">Lesson Title</Label>
              <Input
                id="lessonTitle"
                value={newLesson.title}
                onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="lessonType">Content Type</Label>
              <Select
                value={newLesson.type}
                onValueChange={(value: "video" | "reading" | "quiz") => setNewLesson({ ...newLesson, type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="reading">Reading</SelectItem>
                  <SelectItem value="quiz">Quiz</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="lessonContent">Content</Label>
              <Textarea
                id="lessonContent"
                value={newLesson.content}
                onChange={(e) => setNewLesson({ ...newLesson, content: e.target.value })}
                rows={4}
                required
              />
            </div>

            <div>
              <Label htmlFor="lessonDuration">Duration (minutes)</Label>
              <Input
                id="lessonDuration"
                type="number"
                value={newLesson.duration}
                onChange={(e) => setNewLesson({ ...newLesson, duration: Number.parseInt(e.target.value) || 0 })}
                min="0"
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit">Add Lesson</Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowLessonForm(false)
                  setSelectedCourse(null)
                  setNewLesson({ title: "", type: "video", content: "", duration: 0 })
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
