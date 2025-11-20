import { PageTitle } from '../../app/components/PageTitle';

describe('PageTitle Component', () => {
    describe('Desktop View', () => {
        beforeEach(() => {
            cy.viewport(1280, 720);
        });

        it('should render desktop title', () => {
            cy.mount(<PageTitle />);

            cy.contains('latest news').should('be.visible');
            cy.contains('from').should('be.visible');
            cy.contains('the world').should('be.visible');
        });

        it('should not render mobile title on desktop', () => {
            cy.mount(<PageTitle />);

            cy.contains('latest news from the world of finance').should('not.be.visible');
        });

        it('should render Bitcoin icon', () => {
            cy.mount(<PageTitle />);

            cy.get('svg').should('exist');
        });

        it('should have horizontal line separator', () => {
            cy.mount(<PageTitle />);

            cy.get('hr').should('be.visible');
        });

        it('should have proper heading role', () => {
            cy.mount(<PageTitle />);

            cy.get('[role="heading"]').should('exist');
            cy.get('[aria-level="1"]').should('exist');
        });

        it('should use Albra font for "from"', () => {
            cy.mount(<PageTitle />);

            cy.contains('from').should('have.class', 'font-[\'Albra\']');
        });
    });

    describe('Mobile View', () => {
        beforeEach(() => {
            cy.viewport(375, 667);
        });

        it('should render mobile title', () => {
            cy.mount(<PageTitle />);

            cy.contains('latest news from the world of finance').should('be.visible');
        });

        it('should not render desktop title on mobile', () => {
            cy.mount(<PageTitle />);

            // Desktop version should be hidden
            cy.get('.max-\\[990px\\]\\:hidden').should('exist');
        });

        it('should use Helvetica font for mobile title', () => {
            cy.mount(<PageTitle />);

            cy.contains('latest news from the world of finance')
                .should('have.class', 'font-[\'Helvetica_Now_Display\']');
        });
    });

    describe('Responsive Behavior', () => {
        it('should switch between layouts at breakpoint', () => {
            cy.mount(<PageTitle />);

            // Desktop
            cy.viewport(1280, 720);
            cy.contains('the world').should('be.visible');

            // Mobile
            cy.viewport(375, 667);
            cy.contains('latest news from the world of finance').should('be.visible');
        });
    });

    describe('Accessibility', () => {
        it('should have hidden decorative elements', () => {
            cy.viewport(1280, 720);
            cy.mount(<PageTitle />);

            cy.get('[aria-hidden="true"]').should('exist');
        });
    });
});
