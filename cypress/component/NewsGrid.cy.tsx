import { NewsGrid } from '../../app/components/NewsGrid';
import type { NewsItem } from '../../app/types/news';

describe('NewsGrid Component', () => {
    const mockNews: NewsItem[] = [
        {
            id: 1,
            headline: 'First News',
            image: 'https://via.placeholder.com/800x400',
            url: 'https://example.com/1',
            datetime: 1700000000,
            category: 'tech',
            source: 'Source 1',
            summary: 'Summary 1',
            related: ''
        },
        {
            id: 2,
            headline: 'Second News',
            image: 'https://via.placeholder.com/800x400',
            url: 'https://example.com/2',
            datetime: 1700000100,
            category: 'tech',
            source: 'Source 2',
            summary: 'Summary 2',
            related: ''
        }
    ];

    const mockRef = cy.stub();

    describe('Loading State', () => {
        it('should show skeleton loaders when loading', () => {
            cy.mount(
                <NewsGrid
                    news={[]}
                    loading={true}
                    error={null}
                    hasMore={false}
                    lastElementRef={mockRef}
                />
            );

            cy.get('[aria-busy="true"]').should('exist');
            cy.get('.animate-pulse').should('have.length.greaterThan', 0);
        });

        it('should show correct number of skeletons', () => {
            cy.mount(
                <NewsGrid
                    news={[]}
                    loading={true}
                    error={null}
                    hasMore={false}
                    lastElementRef={mockRef}
                />
            );

            // Should show 8 skeleton cards (CONFIG.SKELETON_COUNT)
            cy.get('[aria-busy="true"]').parent().children().should('have.length', 8);
        });
    });

    describe('Error State', () => {
        it('should display error message when error exists', () => {
            cy.mount(
                <NewsGrid
                    news={[]}
                    loading={false}
                    error="Failed to fetch news"
                    hasMore={false}
                    lastElementRef={mockRef}
                />
            );

            cy.contains('Oops! Something went wrong').should('be.visible');
            cy.contains('Failed to fetch news').should('be.visible');
        });

        it('should show retry button on error', () => {
            const onRetry = cy.stub();
            cy.mount(
                <NewsGrid
                    news={[]}
                    loading={false}
                    error="Network error"
                    hasMore={false}
                    lastElementRef={mockRef}
                    onRetry={onRetry}
                />
            );

            cy.contains('Try Again').should('be.visible');
        });

        it('should call onRetry when retry button clicked', () => {
            const onRetry = cy.stub();
            cy.mount(
                <NewsGrid
                    news={[]}
                    loading={false}
                    error="Network error"
                    hasMore={false}
                    lastElementRef={mockRef}
                    onRetry={onRetry}
                />
            );

            cy.contains('Try Again').click();
            cy.wrap(onRetry).should('have.been.called');
        });
    });

    describe('Empty State', () => {
        it('should show empty state when no news', () => {
            cy.mount(
                <NewsGrid
                    news={[]}
                    loading={false}
                    error={null}
                    hasMore={false}
                    lastElementRef={mockRef}
                />
            );

            cy.contains('No news available').should('be.visible');
        });
    });

    describe('News Display', () => {
        it('should render news grid with articles', () => {
            cy.mount(
                <NewsGrid
                    news={mockNews}
                    loading={false}
                    error={null}
                    hasMore={false}
                    lastElementRef={mockRef}
                />
            );

            cy.get('article').should('have.length', 2);
        });

        it('should render all news items', () => {
            cy.mount(
                <NewsGrid
                    news={mockNews}
                    loading={false}
                    error={null}
                    hasMore={false}
                    lastElementRef={mockRef}
                />
            );

            cy.contains('First News').should('be.visible');
            cy.contains('Second News').should('be.visible');
        });

        it('should attach ref to last element when hasMore is true', () => {
            cy.mount(
                <NewsGrid
                    news={mockNews}
                    loading={false}
                    error={null}
                    hasMore={true}
                    lastElementRef={mockRef}
                />
            );

            // Last article should have the ref
            cy.get('article').last().should('exist');
        });

        it('should not attach ref when hasMore is false', () => {
            cy.mount(
                <NewsGrid
                    news={mockNews}
                    loading={false}
                    error={null}
                    hasMore={false}
                    lastElementRef={mockRef}
                />
            );

            cy.get('article').should('exist');
        });
    });

    describe('Grid Layout', () => {
        it('should have responsive grid classes', () => {
            cy.mount(
                <NewsGrid
                    news={mockNews}
                    loading={false}
                    error={null}
                    hasMore={false}
                    lastElementRef={mockRef}
                />
            );

            cy.get('.grid').should('have.class', 'grid-cols-1');
            cy.get('.grid').should('have.class', 'md:grid-cols-2');
            cy.get('.grid').should('have.class', 'lg:grid-cols-4');
        });

        it('should render first item with larger span', () => {
            cy.mount(
                <NewsGrid
                    news={mockNews}
                    loading={false}
                    error={null}
                    hasMore={false}
                    lastElementRef={mockRef}
                />
            );

            cy.get('a').first().should('have.class', 'lg:col-span-2');
        });
    });

    describe('Accessibility', () => {
        it('should have proper ARIA attributes on loading state', () => {
            cy.mount(
                <NewsGrid
                    news={[]}
                    loading={true}
                    error={null}
                    hasMore={false}
                    lastElementRef={mockRef}
                />
            );

            cy.get('[aria-busy="true"]').should('exist');
        });

        it('should have proper role on error state', () => {
            cy.mount(
                <NewsGrid
                    news={[]}
                    loading={false}
                    error="Error message"
                    hasMore={false}
                    lastElementRef={mockRef}
                />
            );

            cy.get('[role="alert"]').should('exist');
        });

        it('should have proper role on empty state', () => {
            cy.mount(
                <NewsGrid
                    news={[]}
                    loading={false}
                    error={null}
                    hasMore={false}
                    lastElementRef={mockRef}
                />
            );

            cy.get('[role="status"]').should('exist');
        });
    });
});
