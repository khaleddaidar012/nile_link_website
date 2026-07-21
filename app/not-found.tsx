import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-8xl font-bold text-primary-500">404</h1>
        <h2 className="mt-4 text-2xl font-bold text-secondary-900 dark:text-white">
          Page Not Found
        </h2>
        <p className="mt-2 text-secondary-600 dark:text-secondary-400">
          The page you are looking for does not exist.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-xl bg-primary-500 px-6 py-3 text-white transition-colors hover:bg-primary-600"
        >
          Go Home
        </Link>
      </div>
    </div>
  )
}
