/**
 * Skeleton loading state for /explorar while Firestore data is being fetched.
 */

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

function SkeletonCard() {
  return (
    <div className="rounded-xl border border-sand overflow-hidden animate-pulse">
      <div className="aspect-square bg-sand" />
      <div className="p-3 space-y-2">
        <div className="h-4 bg-sand rounded w-3/4" />
        <div className="h-3 bg-sand rounded w-1/2" />
        <div className="flex justify-between mt-3">
          <div className="h-4 bg-sand rounded w-1/4" />
          <div className="h-3 bg-sand rounded w-1/3" />
        </div>
      </div>
    </div>
  );
}

export default function ExplorarLoading() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Header skeleton */}
        <div className="bg-cream border-b border-sand py-10">
          <div className="max-w-7xl mx-auto px-4 space-y-3">
            <div className="h-10 bg-sand rounded-lg w-72 animate-pulse" />
            <div className="h-4 bg-sand rounded w-80 animate-pulse" />
          </div>
        </div>

        {/* Filters skeleton */}
        <div className="bg-cream border-b border-sand py-4">
          <div className="max-w-7xl mx-auto px-4 flex gap-3 overflow-hidden">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-9 w-32 bg-sand rounded-full flex-shrink-0 animate-pulse" />
            ))}
          </div>
        </div>

        {/* Grid skeleton */}
        <div className="bg-cream py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
