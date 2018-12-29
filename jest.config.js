// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  clearMocks: true,
  coverageDirectory: "./coverage/",
  collectCoverage: true,
  moduleFileExtensions: [
    "js"
  ],
  transform: {
    "^.+\\.js?$": "babel-jest"
  }
};
