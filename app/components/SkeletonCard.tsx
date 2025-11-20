interface SkeletonCardProps {
  index: number;
}

export const SkeletonCard = ({ index }: SkeletonCardProps) => {
  return (
    <div
      className={`relative overflow-hidden rounded-lg bg-gray-800/50 ${
        index === 0 ? 'lg:col-span-2' : ''
      }`}
      aria-busy="true"
      aria-label="Loading news article"
    >
      <div className="relative w-full h-full min-h-[300px] animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-700/50 to-gray-800/50" />

        <div className="p-6 space-y-3">
          <div className="h-6 bg-gray-700/50 rounded w-3/4" />
          <div className="h-6 bg-gray-700/50 rounded w-1/2" />

          <div className="flex items-center justify-between pt-2">
            <div className="h-4 w-24 bg-gray-700/50 rounded" />
            <div className="h-4 w-20 bg-gray-700/50 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
};
