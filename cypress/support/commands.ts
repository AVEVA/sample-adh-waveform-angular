// ***********************************************
// This example namespace declaration will help
// with Intellisense and code completion in your
// IDE or Text Editor.
// ***********************************************
// declare namespace Cypress {
//   interface Chainable<Subject = any> {
//     customCommand(param: any): typeof customCommand;
//   }
// }
//
// function customCommand(param: any): void {
//   console.warn(param);
// }
//
// NOTE: You can use it like so:
// Cypress.Commands.add('customCommand', customCommand);
//
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

/** @inheritdoc */
Cypress.Commands.add(
    'getByTestId',
    (testId: string) =>
        cy.get(`[data-testid="${testId}"]`)
);

/** @inheritdoc */
Cypress.Commands.add(
    'clickAndAssert',
    (testId: string, expectation: string) =>
        cy.getByTestId(testId).should('be.visible').click().then(() => {
            cy.getByTestId(testId + 'Message').should('contain.text', expectation)
        })
);

/** @inheritdoc */
Cypress.Commands.add(
    'loginProcessHeadless', 
    (username: string, password: string) => 
        cy.task(
            'loginProcessHeadless',
            {
                username: username,
                password: password,
            },
            { timeout: 300000 },
        ).then((webStorageData: { localStorageData: Object }) => {
            console.log(
                'Copying local storage data with authenticated session information from puppeteer browser, into cypress browser instance'
            )
            Object.keys(webStorageData.localStorageData).forEach((key) => {
                window.localStorage[key] = webStorageData.localStorageData[key];
            });
        }));

