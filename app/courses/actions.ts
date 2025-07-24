"use server";

import { CourseService } from "@/lib/services/courseService";

export async function getAllCourses() {
  return await CourseService.getAllCourses();
}
