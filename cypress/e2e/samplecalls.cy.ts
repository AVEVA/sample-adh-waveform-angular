describe('Tests for all home page functions', () => {
  before(() => {
    cy.fixture('cred').then((cred) => {

      cy.visit('/')
      cy.contains('Login').click()

      const credentials = { username: cred.login, password: cred.pass }

      cy.origin(
        'https://signin.connect.aveva.com/', { args: credentials }, ({ username, password }) => {
          cy.get('input[id="email"]')
            .invoke('attr', 'type', 'password')
            .type(username)
          cy.get('input[id="password"]')
            .invoke('attr', 'type', 'password')
            .type(password)
          cy.get('[id="submit"]').click()
        }
      )

      cy.wait(10000).contains('Login').click()
      cy.clickAndAssertResponseMessage('cleanup', '')
    })
  })

  it('Executes the full sample successfully', () => {
    cy.clickAndAssertResponseMessage('createType', '201')
    cy.clickAndAssertResponseMessage('createStream', '201')
    cy.clickAndAssertResponseMessage('writeWaveDataEvents', '204')
    cy.clickAndAssertResponseMessage('retrieveWaveDataEvents', '10 events')
    cy.clickAndAssertResponseMessage('retrieveWaveDataEventsHeaders', '200')
    cy.clickAndAssertResponseMessage('updateWaveDataEvents', '204')
    cy.clickAndAssertResponseMessage('replaceWaveDataEvents', '204')
    cy.clickAndAssertResponseMessage('retrieveInterpolatedValues', '200')
    cy.clickAndAssertResponseMessage('retrieveFilteredValues', '200')
    cy.clickAndAssertResponseMessage('retrieveSampledValues', '200')
    cy.clickAndAssertResponseMessage('createPropertyOverrideAndUpdateStream', '204')
    cy.clickAndAssertResponseMessage('createAutoStreamViewTargetType', '201')
    cy.clickAndAssertResponseMessage('createAutoStreamView', '201')
    cy.clickAndAssertResponseMessage('retrieveWaveDataEventsAutoStreamView', '5 events')
    cy.clickAndAssertResponseMessage('createSdsStreamViewPropertiesAndManualType', '201')
    cy.clickAndAssertResponseMessage('retrieveWaveDataEventsManualStreamView', '5 events')
    cy.clickAndAssertResponseMessage('getSdsStreamViewMap', 'SdsStreamViewMap')
    cy.clickAndAssertResponseMessage('updateStreamType', '204')
    cy.clickAndAssertResponseMessage('queryTypes', '200')
    cy.clickAndAssertResponseMessage('createTagsAndMetadata', '200')
    cy.clickAndAssertResponseMessage('getAndPrintTags', '')
    cy.clickAndAssertResponseMessage('getAndPrintMetadata', '')
    cy.clickAndAssertResponseMessage('patchMetadata', '200')
    cy.clickAndAssertResponseMessage('getAndPrintMetadata2', '')
    cy.clickAndAssertResponseMessage('getTenantRoles', '200')
    cy.clickAndAssertResponseMessage('shareCommunityStream', '204')
    cy.clickAndAssertResponseMessage('searchCommunity', '200')
    cy.clickAndAssertResponseMessage('getCommunityLast', '200')
    cy.clickAndAssertResponseMessage('deleteAllValues', '204')
    cy.clickAndAssertResponseMessage('secondaryCreate', '201')
    cy.clickAndAssertResponseMessage('secondaryUpdate', '204')
    cy.clickAndAssertResponseMessage('secondaryDelete', '204')
    cy.clickAndAssertResponseMessage('createCompoundTypeandStream', '201')
    cy.clickAndAssertResponseMessage('createAndRetrieveCompoundData', '200')
    cy.clickAndAssertResponseMessage('cleanup', '')
  })
})
