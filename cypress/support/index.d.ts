declare namespace Cypress {
    interface Chainable {
        /**
         * Get one or more DOM elements by test id.
         *
         * @param testId The test id
         */
        getByTestId<E extends Node = HTMLElement>(
            testId: string
        ): Cypress.Chainable<JQuery<E>>;

        /**
         * Get and click an element given its test id, then assert for provided expectation. 
         *  
         * @param testId The test id of the element to click
         * @param expectation The value to assert for once element is clicked
         */
        clickAndAssertResponseMessage(testId: string, expectation: string): void
    }
}