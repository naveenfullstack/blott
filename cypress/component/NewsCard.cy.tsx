import { NewsCard } from '../../app/components/NewsCard';
import type { NewsItem } from '../../app/types/news';

describe('NewsCard Component', () => {
    const mockNewsItem: NewsItem = {
        id: 1,
        headline: 'Test News Headline',
        image: 'https://via.placeholder.com/800x400',
        url: 'https://example.com/news/1',
        datetime: 1700000000,
        category: 'technology',
        source: 'Test Source',
        summary: 'Test summary',
        related: ''
    };

    it('should render news card with all elements', () => {
        cy.mount(<NewsCard item={mockNewsItem} index={0} />);

        cy.get('article').should('be.visible');
        cy.get('img').should('be.visible');
        cy.get('h2').should('contain', mockNewsItem.headline);
        cy.contains('Read Article').should('be.visible');
        cy.get('time').should('be.visible');
    });

    it('should render first item with larger size class', () => {
        cy.mount(<NewsCard item={mockNewsItem} index={0} />);

        cy.get('a').should('have.class', 'lg:col-span-2');
    });

    it('should render non-first item with regular size class', () => {
        cy.mount(<NewsCard item={mockNewsItem} index={1} />);

        cy.get('a').should('have.class', 'col-span-1');
    });

    it('should have correct link attributes', () => {
        cy.mount(<NewsCard item={mockNewsItem} index={0} />);

        cy.get('a')
            .should('have.attr', 'href', mockNewsItem.url)
            .should('have.attr', 'target', '_blank')
            .should('have.attr', 'rel', 'noopener noreferrer');
    });

    it('should display formatted date', () => {
        cy.mount(<NewsCard item={mockNewsItem} index={0} />);

        cy.get('time').should('have.attr', 'datetime');
        cy.get('time').invoke('text').should('match', /\w+\s\d{1,2},\s\d{4}/);
    });

    it('should show hover effects', () => {
        cy.mount(<NewsCard item={mockNewsItem} index={0} />);

        cy.get('a').trigger('mouseover');
        cy.get('a').should('have.class', 'group');
    });

    it('should handle image load error gracefully', () => {
        const itemWithBadImage = {
            ...mockNewsItem,
            image: 'https://invalid-url.com/bad-image.jpg'
        };

        cy.mount(<NewsCard item={itemWithBadImage} index={0} />);

        // Should still render the card
        cy.get('article').should('be.visible');
    });

    it('should have proper aria labels', () => {
        cy.mount(<NewsCard item={mockNewsItem} index={0} />);

        cy.get('a').should('have.attr', 'aria-label');
    });

    it('should attach ref to last element', () => {
        const mockRef = cy.stub();
        cy.mount(
            <NewsCard
                item={mockNewsItem}
                index={0}
                isLastElement={true}
                lastElementRef={mockRef}
            />
        );

        cy.get('a').should('exist');
    });
});
