import { useState, useEffect, useCallback } from 'react';
import { NewsItem } from '@/app/types/news';
import { CONFIG, ROUTES } from '@/app/constants/config';

interface UseNewsReturn {
    displayedNews: NewsItem[];
    loading: boolean;
    error: string | null;
    hasMore: boolean;
    loadMore: () => void;
}

export const useNews = (): UseNewsReturn => {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [displayedNews, setDisplayedNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    // Fetch news from API
    useEffect(() => {
        const fetchNews = async () => {
            try {
                setLoading(true);
                setError(null);

                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

                const response = await fetch(ROUTES.API_NEWS, {
                    signal: controller.signal,
                });

                clearTimeout(timeoutId);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();

                if (!Array.isArray(data)) {
                    throw new Error('Invalid data format received from API');
                }

                setNews(data);
                setDisplayedNews(data.slice(0, CONFIG.ITEMS_PER_PAGE));
                setHasMore(data.length > CONFIG.ITEMS_PER_PAGE);
            } catch (err) {
                if (err instanceof Error) {
                    if (err.name === 'AbortError') {
                        setError('Request timeout. Please try again.');
                    } else {
                        setError(err.message || 'Failed to fetch news. Please try again later.');
                    }
                } else {
                    setError('An unexpected error occurred. Please try again later.');
                }
                console.error('Error fetching news:', err);
                setNews([]);
                setDisplayedNews([]);
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    // Load more news on scroll
    useEffect(() => {
        if (page > 1 && news.length > 0) {
            const startIndex = (page - 1) * CONFIG.ITEMS_PER_PAGE;
            const endIndex = page * CONFIG.ITEMS_PER_PAGE;
            const newItems = news.slice(startIndex, endIndex);

            setDisplayedNews((prev) => {
                const combined = [...prev, ...newItems];
                // Keep only the most recent items to maintain performance
                if (combined.length > CONFIG.MAX_ITEMS_IN_DOM) {
                    return combined.slice(-CONFIG.MAX_ITEMS_IN_DOM);
                }
                return combined;
            });

            setHasMore(endIndex < news.length);
        }
    }, [page, news]);

    const loadMore = useCallback(() => {
        if (!loading && hasMore) {
            setPage((prev) => prev + 1);
        }
    }, [loading, hasMore]);

    return {
        displayedNews,
        loading,
        error,
        hasMore,
        loadMore,
    };
};
