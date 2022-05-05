/// <reference types="Cypress" />

// Plugins enable you to tap into, modify, or extend the internal behavior of Cypress
// For more info, visit https://on.cypress.io/plugins-api
module.exports = (on, config) => {
  const path = require('path');
  const loginProcessHeadless = require(path.resolve(__dirname, './login.js'));

  // This task logs into the portal using a Puppeteer Chrome instance and completes the login process.
  // After authentication, local storage variables are returned to be copied into the Cypress Chrome instance.
  on('task', {
    loginProcessHeadless({
      portalUrl = config.baseUrl,
      username,
      password,
    }) {
      return loginProcessHeadless({
        portalUrl,
        username,
        password,
      });
    },
  });

  return config;
}
