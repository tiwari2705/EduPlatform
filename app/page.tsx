import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookOpen, Users, Award, Play } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Learn Without Limits</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Access thousands of courses, learn from expert instructors, and advance your career with our comprehensive
            education platform.
          </p>
          <div className="space-x-4">
            <Link href="/courses">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                Browse Courses
              </Button>
            </Link>
            <Link href="/register">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
              >
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose EduPlatform?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We provide everything you need to succeed in your learning journey
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Content</h3>
              <p className="text-gray-600">
                Access high-quality courses created by industry experts and experienced educators.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Community Learning</h3>
              <p className="text-gray-600">
                Join a community of learners and collaborate with peers from around the world.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
              <p className="text-gray-600">
                Monitor your learning progress and earn certificates upon course completion.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="text-xl text-gray-600 mb-8">Join thousands of students already learning on our platform</p>
          <Link href="/register">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Play className="h-5 w-5 mr-2" />
              Start Learning Today
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
