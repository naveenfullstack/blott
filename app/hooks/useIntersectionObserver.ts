import { useEffect, useRef, useCallback } from 'react';

interface UseIntersectionObserverProps {
    onIntersect: () => void;
    enabled: boolean;
    rootMargin?: string;
    threshold?: number;
}

export const useIntersectionObserver = ({
    onIntersect,
    enabled,
    rootMargin = '100px',
    threshold = 0.1,
}: UseIntersectionObserverProps) => {
    const observer = useRef<IntersectionObserver | null>(null);

    const lastElementRef = useCallback(
        (node: HTMLElement | null) => {
            if (!enabled) return;

            if (observer.current) {
                observer.current.disconnect();
            }

            observer.current = new IntersectionObserver(
                (entries) => {
                    if (entries[0].isIntersecting) {
                        onIntersect();
                    }
                },
                { rootMargin, threshold }
            );

            if (node) {
                observer.current.observe(node);
            }
        },
        [enabled, onIntersect, rootMargin, threshold]
    );

    useEffect(() => {
        return () => {
            if (observer.current) {
                observer.current.disconnect();
            }
        };
    }, []);

    return { lastElementRef };
};
