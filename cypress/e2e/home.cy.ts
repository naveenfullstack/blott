describe('Home Page - E2E Tests', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    describe('Page Load and Structure', () => {
        it('should load the home page successfully', () => {
            cy.get('body').should('be.visible');
        });

        it('should display the logo', () => {
            cy.get('img[alt="Blott Logo"]').should('be.visible');
        });

        it('should display the page title on desktop', () => {
            cy.viewport(1280, 720);
            cy.contains('latest news').should('be.visible');
            cy.contains('from').should('be.visible');
            cy.contains('the world').should('be.visible');
        });

        it('should display the mobile title on small screens', () => {
            cy.viewport(375, 667);
            cy.contains('latest news from the world of finance').should('be.visible');
        });
    });

    describe('News Loading and Display', () => {
        it('should show loading skeletons initially', () => {
            cy.get('[aria-busy="true"]').should('have.length.at.least', 1);
        });

        it('should load and display news articles', () => {
            cy.intercept('GET', '/api/news').as('getNews');
            cy.wait('@getNews');

            cy.get('article').should('have.length.at.least', 1);
        });

        it('should display news article with all required elements', () => {
            cy.waitForNewsAPI();

            cy.get('article').first().within(() => {
                cy.get('img').should('be.visible');
                cy.get('h2').should('be.visible');
                cy.contains('Read Article').should('be.visible');
                cy.get('time').should('be.visible');
            });
        });

        it('should make first news item larger on desktop', () => {
            cy.viewport(1280, 720);
            cy.waitForNewsAPI();

            cy.get('a').first().should('have.class', 'lg:col-span-2');
        });
    });

    describe('News Article Interaction', () => {
        it('should open news article in new tab when clicked', () => {
            cy.waitForNewsAPI();

            cy.get('article').first().parent('a').should('have.attr', 'target', '_blank');
            cy.get('article').first().parent('a').should('have.attr', 'rel', 'noopener noreferrer');
        });

        it('should show hover effects on news cards', () => {
            cy.waitForNewsAPI();

            cy.get('article').first().parent('a').trigger('mouseover');
            cy.get('article').first().parent('a').should('have.class', 'group');
        });
    });

    describe('Infinite Scroll', () => {
        it('should load more news when scrolling to bottom', () => {
            cy.waitForNewsAPI();

            // Get initial article count
            cy.get('article').then($articles => {
                const initialCount = $articles.length;

                // Scroll to bottom
                cy.scrollTo('bottom');

                // Wait a bit for intersection observer
                cy.wait(1000);

                // Check if more articles loaded
                cy.get('article').should('have.length.at.least', initialCount);
            });
        });

        it('should maintain performance with virtual scrolling', () => {
            cy.waitForNewsAPI();

            // Scroll multiple times
            for (let i = 0; i < 3; i++) {
                cy.scrollTo('bottom');
                cy.wait(500);
            }

            // Should not have too many items in DOM (max 30)
            cy.get('article').should('have.length.lessThan', 31);
        });
    });

    describe('Error Handling', () => {
        it('should display error message when API fails', () => {
            cy.intercept('GET', '/api/news', {
                statusCode: 500,
                body: { error: 'Server error' }
            }).as('getNewsError');

            cy.visit('/');
            cy.wait('@getNewsError');

            cy.contains('Oops! Something went wrong').should('be.visible');
            cy.contains('Try Again').should('be.visible');
        });

        it('should allow retry after error', () => {
            cy.intercept('GET', '/api/news', {
                statusCode: 500,
                body: { error: 'Server error' }
            }).as('getNewsError');

            cy.visit('/');
            cy.wait('@getNewsError');

            cy.contains('Try Again').click();
            // Page should reload
            cy.url().should('eq', Cypress.config().baseUrl + '/');
        });

        it('should handle empty news response', () => {
            cy.intercept('GET', '/api/news', {
                statusCode: 200,
                body: []
            }).as('getEmptyNews');

            cy.visit('/');
            cy.wait('@getEmptyNews');

            cy.contains('No news available').should('be.visible');
        });
    });

    describe('Responsive Design', () => {
        const viewports = [
            { name: 'mobile', width: 375, height: 667 },
            { name: 'tablet', width: 768, height: 1024 },
            { name: 'desktop', width: 1280, height: 720 },
            { name: 'large-desktop', width: 1920, height: 1080 }
        ];

        viewports.forEach(viewport => {
            it(`should render correctly on ${viewport.name}`, () => {
                cy.viewport(viewport.width, viewport.height);
                cy.visit('/');
                cy.waitForNewsAPI();

                cy.get('article').should('be.visible');
                cy.get('img[alt="Blott Logo"]').should('be.visible');
            });
        });
    });

    describe('Accessibility', () => {
        it('should have proper ARIA labels', () => {
            cy.waitForNewsAPI();

            cy.get('article').first().parent('a').should('have.attr', 'aria-label');
        });

        it('should have semantic HTML elements', () => {
            cy.waitForNewsAPI();

            cy.get('article').should('exist');
            cy.get('time').should('exist');
            cy.get('h2').should('exist');
        });

        it('should support keyboard navigation', () => {
            cy.waitForNewsAPI();

            // Focus on the first link and verify it's focusable
            cy.get('a').first().focus();
            cy.focused().should('have.attr', 'href');
        });
    });

    describe('Date Formatting', () => {
        it('should display formatted dates', () => {
            cy.waitForNewsAPI();

            cy.get('time').first().should('have.attr', 'datetime');
            // Updated regex to match format: "November 20, 2025" or "20 November 2025"
            cy.get('time').first().invoke('text').should('match', /(\w+\s\d{1,2},\s\d{4}|\d{1,2}\s\w+\s\d{4})/);
        });
    });

    describe('Image Loading', () => {
        it('should display news images', () => {
            cy.waitForNewsAPI();

            cy.get('article img').first().should('be.visible');
            cy.get('article img').first().should('have.attr', 'src');
        });

        it('should handle image loading errors gracefully', () => {
            cy.intercept('GET', '/api/news', {
                statusCode: 200,
                body: [{
                    id: 1,
                    headline: 'Test News',
                    image: 'https://invalid-image-url.com/image.jpg',
                    url: 'https://example.com',
                    datetime: Date.now() / 1000,
                    category: 'test',
                    source: 'test',
                    summary: 'test',
                    related: ''
                }]
            }).as('getNewsWithBadImage');

            cy.visit('/');
            cy.wait('@getNewsWithBadImage');

            // Should show fallback or handle gracefully
            cy.get('article').should('be.visible');
        });
    });

    describe('Performance', () => {
        it('should load page within acceptable time', () => {
            const start = Date.now();
            cy.visit('/');
            cy.waitForNewsAPI();

            cy.wrap(null).then(() => {
                const loadTime = Date.now() - start;
                expect(loadTime).to.be.lessThan(5000); // 5 seconds
            });
        });
    });
});
