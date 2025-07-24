"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CourseService } from "@/lib/services/courseService"
import { ObjectId } from "mongodb"
import { Plus, BookOpen } from "lucide-react"

interface TeacherCourseFormProps {
  teacherId: string
  onCourseCreated: () => void
}

export function TeacherCourseForm({ teacherId, onCourseCreated }: TeacherCourseFormProps) {
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    category: "",
    thumbnail: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await CourseService.createCourse({
        title: newCourse.title,
        description: newCourse.description,
        category: newCourse.category,
        thumbnail: newCourse.thumbnail || "/placeholder.svg?height=200&width=300&text=Course",
        teacherId: new ObjectId(teacherId),
        lessons: [],
        enrolledStudents: [],
      })

      setShowForm(false)
      setNewCourse({ title: "", description: "", category: "", thumbnail: "" })
      onCourseCreated()
    } catch (error) {
      console.error("Error creating course:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!showForm) {
    return (
      <Card className="border-dashed border-2 border-gray-300 hover:border-blue-400 transition-colors">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <BookOpen className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">Create Your First Course</h3>
          <p className="text-gray-600 text-center mb-4">
            Share your knowledge with students by creating engaging courses
          </p>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create New Course
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Course</CardTitle>
        <CardDescription>Create a course that will be visible to all students on the platform</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Course Title *</Label>
              <Input
                id="title"
                value={newCourse.title}
                onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                placeholder="e.g., Introduction to Web Development"
                required
              />
            </div>
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select
                value={newCourse.category}
                onValueChange={(value) => setNewCourse({ ...newCourse, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Programming">Programming</SelectItem>
                  <SelectItem value="Design">Design</SelectItem>
                  <SelectItem value="Business">Business</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Data Science">Data Science</SelectItem>
                  <SelectItem value="Mathematics">Mathematics</SelectItem>
                  <SelectItem value="Science">Science</SelectItem>
                  <SelectItem value="Language">Language</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Course Description *</Label>
            <Textarea
              id="description"
              value={newCourse.description}
              onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
              placeholder="Describe what students will learn in this course..."
              rows={4}
              required
            />
          </div>

          <div>
            <Label htmlFor="thumbnail">Course Thumbnail URL (Optional)</Label>
            <Input
              id="thumbnail"
              value={newCourse.thumbnail}
              onChange={(e) => setNewCourse({ ...newCourse, thumbnail: e.target.value })}
              placeholder="https://example.com/course-image.jpg"
            />
            <p className="text-sm text-gray-500 mt-1">Leave empty to use a default placeholder image</p>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Course"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowForm(false)
                setNewCourse({ title: "", description: "", category: "", thumbnail: "" })
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
