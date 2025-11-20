import './commands';

declare global {
    namespace Cypress {
        interface Chainable {
            waitForNewsAPI(): Chainable<void>;
        }
    }
}
