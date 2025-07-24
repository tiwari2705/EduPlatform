import { UserService } from "./services/userService"
import { CourseService } from "./services/courseService"
import { ObjectId } from "mongodb"

export async function seedDatabase() {
  try {
    console.log("Starting database seeding...")

    // Create teacher user
    const teacher = await UserService.createUser({
      name: "Jane Teacher",
      email: "teacher@example.com",
      password: "password123",
      role: "teacher",
      enrolledCourses: [],
    })

    // Create student user
    const student = await UserService.createUser({
      name: "John Student",
      email: "student@example.com",
      password: "password123",
      role: "student",
      enrolledCourses: [],
    })

    // Create admin user
    const admin = await UserService.createUser({
      name: "Admin User",
      email: "admin@example.com",
      password: "password123",
      role: "admin",
      enrolledCourses: [],
    })

    // Create sample courses
    const course1 = await CourseService.createCourse({
      title: "Introduction to React",
      description: "Learn the fundamentals of React including components, props, state, and hooks.",
      thumbnail: "/placeholder.svg?height=200&width=300&text=React+Course",
      category: "Programming",
      teacherId: teacher._id!,
      lessons: [
        {
          _id: new ObjectId(),
          title: "What is React?",
          type: "video",
          content: "Introduction to React framework and its benefits.",
          duration: 15,
          order: 1,
        },
        {
          _id: new ObjectId(),
          title: "Components and JSX",
          type: "reading",
          content: "Understanding React components and JSX syntax.",
          order: 2,
        },
        {
          _id: new ObjectId(),
          title: "Props and State",
          type: "video",
          content: "Learn about props and state management in React.",
          duration: 20,
          order: 3,
        },
      ],
      enrolledStudents: [],
    })

    const course2 = await CourseService.createCourse({
      title: "JavaScript Fundamentals",
      description: "Master the core concepts of JavaScript programming language.",
      thumbnail: "/placeholder.svg?height=200&width=300&text=JavaScript+Course",
      category: "Programming",
      teacherId: teacher._id!,
      lessons: [
        {
          _id: new ObjectId(),
          title: "Variables and Data Types",
          type: "reading",
          content: "Understanding JavaScript variables and data types.",
          order: 1,
        },
        {
          _id: new ObjectId(),
          title: "Functions and Scope",
          type: "video",
          content: "Learn about JavaScript functions and scope.",
          duration: 25,
          order: 2,
        },
      ],
      enrolledStudents: [],
    })

    const course3 = await CourseService.createCourse({
      title: "Web Design Basics",
      description: "Learn the principles of good web design and user experience.",
      thumbnail: "/placeholder.svg?height=200&width=300&text=Web+Design+Course",
      category: "Design",
      teacherId: teacher._id!,
      lessons: [
        {
          _id: new ObjectId(),
          title: "Design Principles",
          type: "reading",
          content: "Understanding basic design principles.",
          order: 1,
        },
      ],
      enrolledStudents: [],
    })

    console.log("Database seeded successfully!")
    console.log("Sample users created:")
    console.log("- Teacher: teacher@example.com / password123")
    console.log("- Student: student@example.com / password123")
    console.log("- Admin: admin@example.com / password123")
  } catch (error) {
    console.error("Error seeding database:", error)
  }
}
