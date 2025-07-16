import Link from "next/link";
import { JSX, SVGProps } from "react";

export default function Forbidden() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] py-12 space-y-4">
      <LockIcon className="h-12 w-12" />
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
          Access Denied
        </h1>
        <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed dark:text-gray-400">
          You do not have permission to view this page. Please contact the site
          administrator.
        </p>
      </div>
      <Link
        href="#"
        className="inline-flex h-10 items-center justify-center rounded-md border border-gray-200 bg-white px-8 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
        prefetch={false}
      >
        Go to Homepage
      </Link>
    </div>
  );
}

function LockIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
