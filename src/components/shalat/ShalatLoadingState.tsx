export default function ShalatLoadingState() {
  return (
    <div className="space-y-3">
      {/* Table header skeleton */}
      <div className="hidden sm:grid grid-cols-11 gap-2 mb-4">
        {[...Array(11)].map((_, i) => (
          <div
            key={i}
            className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
          />
        ))}
      </div>

      {/* Table rows skeleton */}
      {[...Array(8)].map((_, rowIdx) => (
        <div
          key={rowIdx}
          className="grid grid-cols-2 sm:grid-cols-11 gap-2 p-3 bg-gray-100 dark:bg-gray-800 rounded animate-pulse"
        >
          {[...Array(11)].map((_, colIdx) => (
            <div
              key={colIdx}
              className="h-6 bg-gray-300 dark:bg-gray-700 rounded"
            />
          ))}
        </div>
      ))}
    </div>
  );
}
