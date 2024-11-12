// src/__mocks__/api.js
export default {
  get: jest.fn(() => Promise.resolve({ data: [] })), // Mocked response for GET requests
  post: jest.fn(() => Promise.resolve({ data: {} })), // Mocked response for POST requests
};
