import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-green-50 font-sans text-gray-900">
      {/* Navigation Bar */}
      <nav className="w-full bg-white shadow-sm border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-green-700 tracking-tight">
                Team Shiksha
              </span>
            </div>

            {/* Nav Links */}
            <div className="flex items-center space-x-6">
              <Link
                href="/auth/signin"
                className="text-gray-600 hover:text-green-700 font-medium transition-colors"
              >
                Login
              </Link>
              <Link
                href="/auth/signin"
                className="text-gray-600 hover:text-green-700 font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="px-5 py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors shadow-sm"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-grow flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <div className="mb-8 flex justify-center">
            <span className="px-4 py-1.5 rounded-full bg-green-100 text-green-800 text-sm font-semibold tracking-wide uppercase">
              Secure Authentication System
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 mb-6">
            Welcome to <span className="text-green-600">Team Shiksha</span>
          </h1>

          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 mb-10">
            A robust full-stack platform designed for seamless profile
            management. Experience secure login, real-time validation, and a
            user-friendly dashboard.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/auth/signup"
              className="w-full sm:w-auto px-8 py-4 bg-green-600 text-white text-lg font-bold rounded-xl hover:bg-green-700 transition-all transform hover:-translate-y-1 shadow-lg hover:shadow-green-200"
            >
              Get Started
            </Link>

            <Link
              href="/auth/signin"
              className="w-full sm:w-auto px-8 py-4 bg-white text-green-700 border-2 border-green-600 text-lg font-bold rounded-xl hover:bg-green-50 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="bg-white border-t border-green-100 py-8">
        <div className="text-center text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} Team Shiksha. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
