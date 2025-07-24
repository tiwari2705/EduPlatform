import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getCurrentUser, logout } from "@/lib/auth"
import { BookOpen, User, LogOut } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export async function Navbar() {
  const user = await getCurrentUser()

  return (
    <nav className="border-b bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold">EduPlatform</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost">Dashboard</Button>
                </Link>
                <Link href="/courses">
                  <Button variant="ghost">Courses</Button>
                </Link>
                {user.role === "teacher" && (
                  <Link href="/teacher">
                    <Button variant="ghost">My Courses</Button>
                  </Link>
                )}
                {(user.role === "teacher" || user.role === "admin") && (
                  <Link href="/admin">
                    <Button variant="ghost">{user.role === "admin" ? "Admin Panel" : "Course Manager"}</Button>
                  </Link>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <User className="h-4 w-4 mr-2" />
                      {user.name}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <form action={logout}>
                        <button type="submit" className="flex items-center w-full">
                          <LogOut className="h-4 w-4 mr-2" />
                          Logout
                        </button>
                      </form>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link href="/register">
                  <Button>Register</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
