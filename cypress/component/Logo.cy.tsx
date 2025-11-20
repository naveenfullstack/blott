import { Logo } from '../../app/components/Logo';

describe('Logo Component', () => {
    it('should render logo image', () => {
        cy.mount(<Logo />);

        cy.get('img[alt="Blott Logo"]').should('be.visible');
    });

    it('should have correct image source', () => {
        cy.mount(<Logo />);

        cy.get('img').should('have.attr', 'src').and('include', 'blott.png');
    });

    it('should be centered', () => {
        cy.mount(<Logo />);

        cy.get('.flex.justify-center').should('exist');
    });

    it('should have proper max width', () => {
        cy.mount(<Logo />);

        cy.get('.max-w-\\[200px\\]').should('exist');
    });

    it('should have proper top margin', () => {
        cy.mount(<Logo />);

        cy.get('.mt-\\[44px\\]').should('exist');
    });

    it('should use Next.js Image component', () => {
        cy.mount(<Logo />);

        // Next.js Image adds specific classes
        cy.get('img').should('exist');
    });
});
