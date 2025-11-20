import { SkeletonCard } from '../../app/components/SkeletonCard';

describe('SkeletonCard Component', () => {
    it('should render skeleton card', () => {
        cy.mount(<SkeletonCard index={0} />);

        cy.get('[aria-busy="true"]').should('be.visible');
    });

    it('should have animation class', () => {
        cy.mount(<SkeletonCard index={0} />);

        cy.get('.animate-pulse').should('exist');
    });

    it('should render first skeleton with larger size', () => {
        cy.mount(<SkeletonCard index={0} />);

        cy.get('.lg\\:col-span-2').should('exist');
    });

    it('should render non-first skeleton with regular size', () => {
        cy.mount(<SkeletonCard index={1} />);

        cy.get('.lg\\:col-span-2').should('not.exist');
    });

    it('should have proper aria label', () => {
        cy.mount(<SkeletonCard index={0} />);

        cy.get('[aria-label="Loading news article"]').should('exist');
    });

    it('should have gradient background', () => {
        cy.mount(<SkeletonCard index={0} />);

        cy.get('.bg-gradient-to-br').should('exist');
    });

    it('should render skeleton elements', () => {
        cy.mount(<SkeletonCard index={0} />);

        // Should have multiple skeleton bars
        cy.get('.bg-gray-700\\/50').should('have.length.greaterThan', 0);
    });
});
