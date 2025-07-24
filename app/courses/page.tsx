import { getAllCourses } from "./actions";
import CoursesList from "./CoursesList";

export default async function CoursesPage() {
  const courses = await getAllCourses();
  return <CoursesList initialCourses={courses} />;
}
