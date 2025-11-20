"use client";

import { Logo } from './components/Logo';
import { PageTitle } from './components/PageTitle';
import { NewsGrid } from './components/NewsGrid';
import { useNews } from './hooks/useNews';
import { useIntersectionObserver } from './hooks/useIntersectionObserver';

export default function Home() {
  const { displayedNews, loading, error, hasMore, loadMore } = useNews();

  const { lastElementRef } = useIntersectionObserver({
    onIntersect: loadMore,
    enabled: !loading && hasMore,
  });

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-[1246px] max-[1246px]:px-4 pb-20">
        <Logo />
        <PageTitle />
        <NewsGrid
          news={displayedNews}
          loading={loading}
          error={error}
          hasMore={hasMore}
          lastElementRef={lastElementRef}
          onRetry={() => window.location.reload()}
        />
      </div>
    </div>
  );
}
