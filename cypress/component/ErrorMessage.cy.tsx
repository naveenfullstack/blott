import { ErrorMessage } from '../../app/components/ErrorMessage';

describe('ErrorMessage Component', () => {
    it('should render error message', () => {
        cy.mount(<ErrorMessage message="Test error message" />);

        cy.contains('Oops! Something went wrong').should('be.visible');
        cy.contains('Test error message').should('be.visible');
    });

    it('should display error icon', () => {
        cy.mount(<ErrorMessage message="Error occurred" />);

        cy.get('svg').should('be.visible');
    });

    it('should show retry button when onRetry provided', () => {
        const onRetry = cy.stub();
        cy.mount(<ErrorMessage message="Error" onRetry={onRetry} />);

        cy.contains('Try Again').should('be.visible');
    });

    it('should not show retry button when onRetry not provided', () => {
        cy.mount(<ErrorMessage message="Error" />);

        cy.contains('Try Again').should('not.exist');
    });

    it('should call onRetry when button clicked', () => {
        const onRetry = cy.stub();
        cy.mount(<ErrorMessage message="Error" onRetry={onRetry} />);

        cy.contains('Try Again').click();
        cy.wrap(onRetry).should('have.been.called');
    });

    it('should have proper ARIA attributes', () => {
        cy.mount(<ErrorMessage message="Error" />);

        cy.get('[role="alert"]').should('exist');
        cy.get('[aria-live="assertive"]').should('exist');
    });

    it('should have accessible button', () => {
        const onRetry = cy.stub();
        cy.mount(<ErrorMessage message="Error" onRetry={onRetry} />);

        cy.get('button').should('have.attr', 'aria-label', 'Retry loading news');
    });
});
