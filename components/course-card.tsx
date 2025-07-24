"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Course } from "@/types"
import { Users, Clock } from "lucide-react"

interface CourseCardProps {
  course: Course & { teacherName?: string }
  isEnrolled?: boolean
  showEnrollButton?: boolean
}

export function CourseCard({ course, isEnrolled = false, showEnrollButton = true }: CourseCardProps) {
  const totalDuration = course.lessons.reduce((acc, lesson) => acc + (lesson.duration || 0), 0)

  return (
    <Card className="h-full flex flex-col">
      <div className="relative">
        <Image
          src={course.thumbnail || "/placeholder.svg?height=200&width=300&text=Course"}
          alt={course.title}
          width={300}
          height={200}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        <Badge className="absolute top-2 right-2">{course.category}</Badge>
      </div>
      <CardHeader className="flex-1">
        <CardTitle className="line-clamp-2">{course.title}</CardTitle>
        <CardDescription className="line-clamp-3">{course.description}</CardDescription>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {course.enrolledStudents.length}
          </div>
          {totalDuration > 0 && (
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {totalDuration}min
            </div>
          )}
        </div>
        <p className="text-sm">By {course.teacherName || "Unknown Teacher"}</p>
      </CardHeader>
      <CardContent className="pt-0">
        {showEnrollButton && (
          <Link href={`/courses/${course._id}`}>
            <Button className="w-full" variant={isEnrolled ? "outline" : "default"}>
              {isEnrolled ? "Continue Learning" : "View Course"}
            </Button>
          </Link>
        )}
      </CardContent>
    </Card>
  )
}
