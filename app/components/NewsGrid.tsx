import { NewsItem } from '@/app/types/news';
import { NewsCard } from './NewsCard';
import { SkeletonCard } from './SkeletonCard';
import { ErrorMessage } from './ErrorMessage';
import { CONFIG } from '@/app/constants/config';

interface NewsGridProps {
    news: NewsItem[];
    loading: boolean;
    error: string | null;
    hasMore: boolean;
    lastElementRef: (node: HTMLAnchorElement | null) => void;
    onRetry?: () => void;
}

export const NewsGrid = ({
    news,
    loading,
    error,
    hasMore,
    lastElementRef,
    onRetry,
}: NewsGridProps) => {
    // Show error state
    if (error && news.length === 0) {
        return <ErrorMessage message={error} onRetry={onRetry} />;
    }

    // Show loading skeletons
    if (loading && news.length === 0) {
        return (
            <div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-[60px]"
                aria-busy="true"
            >
                {Array.from({ length: CONFIG.SKELETON_COUNT }).map((_, index) => (
                    <SkeletonCard key={index} index={index} />
                ))}
            </div>
        );
    }

    // Show empty state
    if (news.length === 0) {
        return (
            <div
                className="flex flex-col items-center justify-center min-h-[400px] text-center px-4"
                role="status"
            >
                <p className="text-xl text-gray-400">No news available at the moment.</p>
                <p className="text-sm text-gray-500 mt-2">Please check back later.</p>
            </div>
        );
    }

    // Show news grid
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-[60px]">
            {news.map((item, index) => {
                const isLastElement = hasMore && news.length === index + 1;

                return (
                    <NewsCard
                        key={item.id}
                        item={item}
                        index={index}
                        isLastElement={isLastElement}
                        lastElementRef={isLastElement ? lastElementRef : undefined}
                    />
                );
            })}
        </div>
    );
};
